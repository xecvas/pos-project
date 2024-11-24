from datetime import timedelta
from functools import wraps
import os
from flask import Flask, flash, request, jsonify, send_from_directory, render_template, redirect, session, url_for, send_file
from io import BytesIO
import pandas as pd
from sqlalchemy import String, cast
from sqlalchemy.orm import sessionmaker
from database import menu
from database import customer, SessionLocal

# Define the base directory to ensure Flask can find templates and assets correctly
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
TEMPLATE_DIR = os.path.join(BASE_DIR, '../docs')
CSS_DIR = os.path.join(BASE_DIR, '../css')
JS_DIR = os.path.join(BASE_DIR, '../js')
ICONS_DIR = os.path.join(BASE_DIR, '../assets/icons')
IMAGES_DIR = os.path.join(BASE_DIR, '../assets/images')

# Create the Flask app with custom template folder
app = Flask(__name__, template_folder=TEMPLATE_DIR)
app.secret_key = os.urandom(24)  # Secure secret key for session management

# Serve CSS, JavaScript, icons, and images
@app.route('/css/<path:filename>')
def css(filename):
    return send_from_directory(CSS_DIR, filename)

@app.route('/js/<path:filename>')
def js(filename):
    return send_from_directory(JS_DIR, filename)

@app.route('/icons/<path:filename>')
def icons(filename):
    return send_from_directory(ICONS_DIR, filename)

@app.route('/images/<path:filename>')
def images(filename):
    return send_from_directory(IMAGES_DIR, filename)

# Set session lifetime
app.permanent_session_lifetime = timedelta(days=7)  # Adjust as needed

def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_email' not in session:
            # Redirect ke login jika belum login
            return redirect(url_for('login'))
        return f(*args, **kwargs)
    return decorated_function

# Login route
@app.route('/', methods=['GET', 'POST'])
@app.route('/login', methods=['GET', 'POST'])
def login():
    if 'user_email' in session:
        return redirect(url_for('index'))  # If already logged in, redirect to index

    if request.method == 'POST':
        # Check if the request is from the login form
        if 'login_email' in request.form and 'login_password' in request.form:
            username = request.form.get('login_email')
            password = request.form.get('login_password')

            if username == 'user@gmail.com' and password == '123':
                session.permanent = True
                session['user_email'] = username
                return redirect(url_for('index'))
            else:
                flash("Invalid credentials. Please try again.")
                return redirect(url_for('login'))

        # Handle forgot password logic here if needed
        elif 'forgot_email' in request.form:
            # Here you would add logic to handle the forgot password request
            # For example, send an email with a reset link
            # After processing, you can redirect to the login page without setting a flash message
            return redirect(url_for('login'))

    return render_template('login.html')

# Login required decorator
def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_email' not in session:
            # Redirect to login page if user is not logged in
            return redirect(url_for('login'))
        return f(*args, **kwargs)
    return decorated_function

# Protected index route
@app.route('/index')
def index():
    if 'user_email' not in session:
        return redirect(url_for('login'))  # Jika belum login, arahkan ke halaman login
    menu_stats = get_menu_stats()
    customer_stats = get_customer_stats()
    return render_template('index.html', **menu_stats, **customer_stats)

# Logout route
@app.route('/logout')
def logout():
    session.pop('user_email', None)
    return redirect(url_for('login'))

@app.route('/reports')
@login_required
def reports():
    return render_template('reports.html')

@app.route('/list-menu')
@login_required
def list_menu():
    return render_template('list-menu.html')

@app.route('/customers')
@login_required
def customers():
    return render_template('customers.html')

@app.route('/release-note')
@login_required
def release_note():
    return render_template('release-note.html')

@app.route('/settings')
@login_required
def settings():
    return render_template('settings.html')

@app.route('/tester')
def tester():
    return render_template('tester.html')

# Get data from the database with pagination
@app.route('/menu', methods=['GET'])
def get_data():
    session = SessionLocal()
    try:
        draw = int(request.args.get('draw', 1))  # Draw counter for synchronization
        start = int(request.args.get('start', 0))  # Offset
        length = int(request.args.get('length', 10))  # Limit
        search_value = request.args.get('search[value]', '')  # Search input
        order_column = request.args.get('order[0][column]', '3')  # Default to 'Category'
        order_dir = request.args.get('order[0][dir]', 'asc')  # Sorting direction

        # Map DataTables column index to database fields
        column_map = {
            "0": "id",
            "1": "nama_menu",
            "2": "kode",
            "3": "kategori",  # 'Category' column
            "4": "sub_kategori",
            "5": "harga",
            "6": "status",
        }

        # Get the column name for sorting
        order_column_name = column_map.get(order_column, "kategori")  # Default to 'Category'

        # Build the base query
        query = session.query(menu)

        # Apply search filter if a search value is provided
        if search_value:
            search_value = f"%{search_value}%"
            query = query.filter(
                menu.nama_menu.ilike(search_value) |
                menu.kode.ilike(search_value) |
                menu.kategori.ilike(search_value)
            )

        # Apply sorting
        if order_dir == "asc":
            query = query.order_by(getattr(menu, order_column_name).asc())
        else:
            query = query.order_by(getattr(menu, order_column_name).desc())

        # Total records before filtering
        total_records = session.query(menu).count()

        # Filtered records count
        filtered_records = query.count()

        # Apply pagination
        data_query = query.offset(start).limit(length).all()

        # Convert data to dictionary format
        data = [menu.to_dict() for menu in data_query]

        # Construct the response
        response = {
            "draw": draw,
            "recordsTotal": total_records,
            "recordsFiltered": filtered_records,
            "data": data,
        }
        return jsonify(response)
    finally:
        session.close()

def get_menu_stats():
    session = SessionLocal()
    try:
        total_menu = session.query(menu).count()
        total_makanan = session.query(menu).filter(menu.kategori == 'Makanan').count()
        total_minuman = session.query(menu).filter(menu.kategori == 'Minuman').count()
        total_snack = session.query(menu).filter(menu.kategori == 'Snack').count()
        total_nasi = session.query(menu).filter(menu.sub_kategori == 'Nasi').count()
        total_mie = session.query(menu).filter(menu.sub_kategori == 'Mie').count()
        total_lainnya = session.query(menu).filter(menu.sub_kategori == 'Lainnya').count()
        total_goreng = session.query(menu).filter(menu.sub_kategori == 'Goreng').count()
        total_rebus = session.query(menu).filter(menu.sub_kategori == 'Rebus').count()
        total_kukus = session.query(menu).filter(menu.sub_kategori == 'Kukus').count()
        total_panas = session.query(menu).filter(menu.sub_kategori == 'Panas').count()
        total_dingin = session.query(menu).filter(menu.sub_kategori == 'Dingin').count()
        total_aktif = session.query(menu).filter(menu.status == 'Aktif').count()
        total_nonaktif = session.query(menu).filter(menu.status == 'Tidak Aktif').count()
        
        return {
            "total_menu": total_menu,
            "total_makanan": total_makanan,
            "total_minuman": total_minuman,
            "total_snack": total_snack,
            "total_nasi": total_nasi,
            "total_mie": total_mie,
            "total_lainnya": total_lainnya,
            "total_goreng": total_goreng,
            "total_rebus": total_rebus,
            "total_kukus": total_kukus,
            "total_panas": total_panas,
            "total_dingin": total_dingin,
            "total_aktif": total_aktif,
            "total_nonaktif": total_nonaktif
        }
    finally:
        session.close()

@app.route('/data-customers', methods=['GET'])
def get_customer_data():
    session = SessionLocal()
    try:
        draw = int(request.args.get('draw', 1))  # Draw counter for synchronization
        start = int(request.args.get('start', 0))  # Offset
        length = int(request.args.get('length', 10))  # Limit
        search_value = request.args.get('search[value]', '')  # Search input
        order_column = request.args.get('order[0][column]', '0')  # Default to 'ID'
        order_dir = request.args.get('order[0][dir]', 'asc')  # Sorting direction

        # Map DataTables column index to database fields
        column_map = {
            "0": "id",
            "1": "name",
            "2": "birthday",
            "3": "age",
            "4": "gender",
            "5": "email",
            "6": "phone",
            "7": "address",
            "8": "city",
            "9": "country",
            "10": "roles_type",
            "11": "royalty_point"
        }

        # Get the column name for sorting
        order_column_name = column_map.get(order_column, "id")

        # Build the base query
        query = session.query(customer)

        # Apply search filter if a search value is provided
        if search_value:
            search_value = f"%{search_value}%"
            query = query.filter(
                customer.name.ilike(search_value) |
                customer.birthday.ilike(search_value) |
                customer.email.ilike(search_value) |
                cast(customer.phone, String).ilike(search_value) |
                customer.address.ilike(search_value) |
                customer.city.ilike(search_value) |
                customer.country.ilike(search_value)
            )

        # Apply sorting
        if order_column_name == "roles_type":
            if order_dir == "asc":
                query = query.order_by(customer.roles_type.asc())
            else:
                query = query.order_by(customer.roles_type.desc())
        else:
                if order_dir == "asc":
                    query = query.order_by(getattr(customer, order_column_name).asc())
                else:
                    query = query.order_by(getattr(customer, order_column_name).desc())

        # Total records before filtering
        total_records = session.query(customer).count()

        # Filtered records count
        filtered_records = query.count()

        # Apply pagination
        data_query = query.offset(start).limit(length).all()

        # Convert data to dictionary format
        data = [cust.to_dict() for cust in data_query]

        # Construct the response
        response = {
            "draw": draw,
            "recordsTotal": total_records,
            "recordsFiltered": filtered_records,
            "data": data,
        }
        return jsonify(response)
    finally:
        session.close()
        
def get_customer_stats():
    session = SessionLocal()
    try:
        total_customer = session.query(customer).count()
        total_basic = session.query(customer).filter(customer.royalty_point >= 0, customer.royalty_point < 100).count()
        total_silver = session.query(customer).filter(customer.royalty_point >= 100, customer.royalty_point < 200).count()
        total_gold = session.query(customer).filter(customer.royalty_point >= 200, customer.royalty_point < 300).count()
        total_platinum = session.query(customer).filter(customer.royalty_point >= 300, customer.royalty_point < 400).count()
        total_corporate = session.query(customer).filter(customer.royalty_point >= 400).count()

        return {
            "total_customer": total_customer,
            "total_basic": total_basic,
            "total_silver": total_silver,
            "total_gold": total_gold,
            "total_platinum": total_platinum,
            "total_corporate": total_corporate
            }
    finally:
        session.close()

# Export database to excel file 
@app.route('/export_excel')
def export_excel():
    # Create a new session to query the database
    session = SessionLocal()
    try:
        # Query the data from the database
        records = session.query(
            menu.id,
            menu.nama_menu,
            menu.kode,
            menu.kategori,
            menu.sub_kategori,
            menu.harga,
            menu.status
        ).all()

        # Convert the SQLAlchemy query result to a list of dictionaries
        data = [
            {
                'ID': record.id,
                'Nama Pengguna': record.nama_menu,
                'Kode': record.kode,
                'Quantity': record.kategori,
                'Berat': record.sub_kategori,
                'Harga': record.harga,
                'Shipping Status': record.status,
            }
            for record in records
        ]

        # Use pandas to create a DataFrame
        df = pd.DataFrame(data)

        # Create an in-memory Excel file
        output = BytesIO()
        with pd.ExcelWriter(output, engine='openpyxl') as writer:
            df.to_excel(writer, index=False, sheet_name='Data')

        output.seek(0)  # Move to the beginning of the stream

        # Send the Excel file as a response
        return send_file(
            output,
            as_attachment=True,
            download_name='data_export.xlsx',
            mimetype='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        )
    finally:
        # Close the session
        session.close()



if __name__ == '__main__':
    app.run(debug=True)
