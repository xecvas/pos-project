from datetime import datetime, timedelta
from functools import wraps
from werkzeug.utils import secure_filename
from werkzeug.security import check_password_hash
import os
from io import BytesIO

import pandas as pd
from flask import (
    Flask,
    flash,
    request,
    jsonify,
    render_template,
    redirect,
    session,
    url_for,
    send_file,
    send_from_directory,
    g
)
from sqlalchemy import String, cast
from sqlalchemy.sql import func
from sqlalchemy.orm import sessionmaker
from database import (
    CashierOpening,
    User,
    menu,
    customer,
    SessionLocal,
)

# Define directories for templates and static files
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
TEMPLATE_DIR = os.path.join(BASE_DIR, "../docs")
STATIC_DIRS = {
    "css": os.path.join(BASE_DIR, "../css"),
    "js": os.path.join(BASE_DIR, "../js"),
    "icons": os.path.join(BASE_DIR, "../assets/icons"),
    "images": os.path.join(BASE_DIR, "../assets/images"),
}

# Initialize Flask app
app = Flask(__name__, template_folder=TEMPLATE_DIR)
UPLOAD_FOLDER = "../assets/images"
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.secret_key = os.urandom(24)  # Secure random secret key
app.permanent_session_lifetime = timedelta(days=7)


# Static file routes
@app.route("/css/<path:filename>", endpoint="css")
@app.route("/js/<path:filename>", endpoint="js")
@app.route("/icons/<path:filename>", endpoint="icons")
@app.route("/images/<path:filename>", endpoint="images")

def serve_static(filename):
    """Serve static files such as CSS, JS, icons, and images."""
    directory = STATIC_DIRS[
        request.endpoint
    ]  # Use the endpoint name to get the correct directory
    return send_from_directory(directory, filename)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.context_processor
def inject_user_role():
    return {'user_role': session.get('user_role', None)}

def get_session():
    """Provide a new session and ensure closure."""
    session = SessionLocal()
    try:
        yield session
    finally:
        session.close()

@app.before_request
def before_request():
    set_sidebar()

# Login-required decorator
def login_required(f):
    """Ensure user is logged in before accessing a route."""

    @wraps(f)
    def decorated_function(*args, **kwargs):
        if "user_email" not in session:
            return redirect(url_for("login"))
        return f(*args, **kwargs)

    return decorated_function

def admin_required(func):
    def wrapper(*args, **kwargs):
        if session.get('user_role') != 'admin':
            return "Access denied", 403
        return func(*args, **kwargs)
    wrapper.__name__ = func.__name__
    return wrapper

def cashier_required(func):
    def wrapper(*args, **kwargs):
        if session.get('user_role') != 'cashier':
            return "Access denied", 403
        return func(*args, **kwargs)
    wrapper.__name__ = func.__name__
    return wrapper

def admin_or_cashier_required(func):
    def wrapper(*args, **kwargs):
        user_role = session.get("user_role")
        if user_role not in ["admin", "cashier"]:
            print("Invalid role, redirecting to login.")
            return redirect(url_for("login"))
        print("User role valid:", user_role)
        return func(*args, **kwargs)
    wrapper.__name__ = func.__name__
    return wrapper

def set_sidebar():
    # Ambil role dari session
    role = session.get('user_role')

    # Definisikan elemen sidebar untuk admin dan cashier
    admin_sidebar = [
        {'title': 'Dashboard', 'icon': 'fas fa-chart-line', 'url': url_for('index')},
        {'title': 'Reports', 'icon': 'fas fa-chart-bar', 'url': url_for('reports')},
        {'title': 'Menu', 'icon': 'fas fa-utensils', 'url': url_for('list_menu')},
        {'title': 'Customers', 'icon': 'fas fa-users', 'url': url_for('customers')},
        {'title': 'Release Notes', 'icon': 'fas fa-book', 'url': url_for('release_note')},
        {'title': 'Cashier', 'icon': 'fas fa-cash-register', 'url': url_for('cashier')},
        {'title': 'Settings', 'icon': 'fas fa-cog', 'url': url_for('settings')},
    ]
    cashier_sidebar = [
        {'title': 'Cashier', 'icon': 'fas fa-cash-register', 'url': url_for('cashier')},
        {'title': 'Reports', 'icon': 'fas fa-chart-bar', 'url': url_for('reports')},
        {'title': 'Settings', 'icon': 'fas fa-cog', 'url': url_for('settings')},
    ]

    # Tentukan sidebar berdasarkan role
    g.sidebar_items = admin_sidebar if role == 'admin' else cashier_sidebar

def export_to_excel(query_result, filename, sheet_name):
    """Export query results to an Excel file."""
    df = pd.DataFrame([item.to_dict() for item in query_result])
    output = BytesIO()
    with pd.ExcelWriter(output, engine="openpyxl") as writer:
        df.to_excel(writer, index=False, sheet_name=sheet_name)
    output.seek(0)
    return send_file(
        output,
        as_attachment=True,
        download_name=f"{filename}.xlsx",
        mimetype="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    )

def get_menu_stats():
    session = SessionLocal()
    try:
        total_menu = session.query(menu).count()
        total_makanan = session.query(menu).filter(menu.kategori == "Makanan").count()
        total_minuman = session.query(menu).filter(menu.kategori == "Minuman").count()
        total_snack = session.query(menu).filter(menu.kategori == "Snack").count()
        total_nasi = session.query(menu).filter(menu.sub_kategori == "Nasi").count()
        total_mie = session.query(menu).filter(menu.sub_kategori == "Mie").count()
        total_lainnya = (
            session.query(menu).filter(menu.sub_kategori == "Lainnya").count()
        )
        total_goreng = session.query(menu).filter(menu.sub_kategori == "Goreng").count()
        total_rebus = session.query(menu).filter(menu.sub_kategori == "Rebus").count()
        total_kukus = session.query(menu).filter(menu.sub_kategori == "Kukus").count()
        total_panas = session.query(menu).filter(menu.sub_kategori == "Panas").count()
        total_dingin = session.query(menu).filter(menu.sub_kategori == "Dingin").count()
        total_aktif = session.query(menu).filter(menu.status == "Aktif").count()
        total_nonaktif = (
            session.query(menu).filter(menu.status == "Tidak Aktif").count()
        )

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
            "total_nonaktif": total_nonaktif,
        }
    finally:
        session.close()

def get_customer_stats():
    session = SessionLocal()
    try:
        total_customer = session.query(customer).count()
        total_basic = (
            session.query(customer)
            .filter(customer.royalty_point >= 0, customer.royalty_point < 100)
            .count()
        )
        total_silver = (
            session.query(customer)
            .filter(customer.royalty_point >= 100, customer.royalty_point < 200)
            .count()
        )
        total_gold = (
            session.query(customer)
            .filter(customer.royalty_point >= 200, customer.royalty_point < 300)
            .count()
        )
        total_platinum = (
            session.query(customer)
            .filter(customer.royalty_point >= 300, customer.royalty_point < 400)
            .count()
        )
        total_corporate = (
            session.query(customer).filter(customer.royalty_point >= 400).count()
        )

        return {
            "total_customer": total_customer,
            "total_basic": total_basic,
            "total_silver": total_silver,
            "total_gold": total_gold,
            "total_platinum": total_platinum,
            "total_corporate": total_corporate,
        }
    finally:
        session.close()

# Static file routes
@app.route("/<file_type>/<path:filename>")
def serve_static(file_type, filename):
    """Serve static files such as CSS, JS, icons, and images."""
    directory = STATIC_DIRS.get(file_type)
    if not directory:
        return "File type not supported", 404
    return send_from_directory(directory, filename)

# Login route
@app.route("/", methods=["GET", "POST"])
@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form.get('email')
        password = request.form.get('password')

        session_sqlalchemy = SessionLocal()
        try:
            user = session_sqlalchemy.query(User).filter_by(email=email).first()

            if user and user.password == password:
                session.clear()
                session['user_email'] = user.email
                session['user_role'] = user.role

                if user.role == 'admin':
                    return redirect(url_for('index'))
                elif user.role == 'cashier':
                    return redirect(url_for('cashier'))
            else:
                # Jika user tidak ditemukan atau password salah
                flash("Invalid email or password. Please try again.")
                return redirect(url_for('login'))  # Redirect ke halaman login lagi

        except Exception as e:
            return f"An error occurred: {e}", 500
        finally:
            session_sqlalchemy.close()
    else:
        return render_template('login.html')  # Tampilkan halaman login

@app.route("/index")
@admin_required
def index():
    """Display the dashboard."""
    return render_template("index.html", **get_menu_stats(), **get_customer_stats())

# Logout route
@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('login'))

@app.route("/reports")
@admin_required
def reports():
    return render_template("reports.html")

@app.route("/list-menu")
@admin_required
def list_menu():
    return render_template("list-menu.html")

@app.route("/customers")
@admin_required
def customers():
    return render_template("customers.html")

@app.route("/release-note")
@admin_or_cashier_required
def release_note():
    return render_template("release-note.html")

@app.route("/settings")
@admin_required
def settings():
    return render_template("settings.html")

@app.route("/tester")
def tester():
    return render_template("tester.html")

@app.route('/cashier')
@admin_or_cashier_required
def cashier():
    user_role = session.get("user_role")  # Ambil role pengguna
    setup_completed = session.get("setup_completed", False)
    outlet = session.get("outlet", "Unknown Outlet")
    cashier_name = session.get("cashier_name", "Unknown Cashier")
    print("Rendering cashier page with:", {"user_role": user_role, "setup_completed": setup_completed})
    # Definisikan elemen sidebar
    
    return render_template('cashier.html', user_role=user_role, setup_completed=setup_completed, outlet=outlet, cashier_name=cashier_name)

@app.route('/cashier/setup', methods=['POST'])
def cashier_setup():
    data = request.json
    outlet = data.get("outlet")
    cashier_name = data.get("cashierName")
    opening_cash = data.get("openingCash")

    # Validasi data
    if not all([outlet, cashier_name, opening_cash]):
        return jsonify({"error": "All fields are required"}), 400

    # Simpan outlet dan nama kasir di sesi
    session["outlet"] = outlet
    session["cashier_name"] = cashier_name
    session["setup_completed"] = True  # Tambahkan flag setup selesai

    # Simpan modal awal di database
    session_db = SessionLocal()
    try:
        new_entry = CashierOpening(
            cashier_name=cashier_name,
            outlet=outlet,
            opening_cash=opening_cash,
            date=datetime.utcnow(),
        )
        session_db.add(new_entry)
        session_db.commit()
        return jsonify({"message": "Cashier setup completed successfully"}), 200
    except Exception as e:
        session_db.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        session_db.close()

# Get data from the database with pagination
@app.route("/menu", methods=["GET"])
def get_data():
    session = SessionLocal()
    try:
        draw = int(request.args.get("draw", 1))  # Draw counter for synchronization
        start = int(request.args.get("start", 0))  # Offset
        length = int(request.args.get("length", 10))  # Limit
        search_value = request.args.get("search[value]", "")  # Search input
        order_column = request.args.get("order[0][column]", "0")  # Default to 'ID'
        order_dir = request.args.get("order[0][dir]", "asc")  # Sorting direction

        # Map DataTables column index to database fields
        column_map = {
            "0": "id",
            "1": "nama_menu",
            "2": "kode",
            "3": "kategori",
            "4": "sub_kategori",
            "5": "harga",
            "6": "status",
        }

        # Get the column name for sorting
        order_column = request.args.get("order[0][column]", "0")
        order_column_name = column_map.get(order_column, "id")

        # Build the base query
        query = session.query(menu)

        # Apply search filter if a search value is provided
        if search_value:
            search_value = f"%{search_value}%"
            query = query.filter(
                menu.nama_menu.ilike(search_value)
                | menu.kode.ilike(search_value)
                | menu.kategori.ilike(search_value)
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


@app.route("/data-customers", methods=["GET"])
def get_customer_data():
    session = SessionLocal()
    try:
        draw = int(request.args.get("draw", 1))
        start = int(request.args.get("start", 0))
        length = int(request.args.get("length", 10))
        search_value = request.args.get("search[value]", "")
        order_column = request.args.get("order[0][column]", "0")
        order_dir = request.args.get("order[0][dir]", "asc")

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
            "10": "computed_roles_type",
            "11": "royalty_point",
        }

        order_column_name = column_map.get(order_column, "id")
        order_column = getattr(customer, order_column_name)

        # Define calculated age column
        age_column = func.date_part(
            "year", func.age(func.to_date(customer.birthday, "DD-MM-YYYY"))
        ).label("age")

        # Build query
        query = session.query(customer, age_column)

        if search_value:
            search_value = f"%{search_value}%"
            query = query.filter(
                customer.name.ilike(search_value)
                | customer.birthday.ilike(search_value)
                | customer.email.ilike(search_value)
            )

        if order_column_name == "age":
            if order_dir == "asc":
                query = query.order_by(age_column.asc())
            else:
                query = query.order_by(age_column.desc())
        else:
            query = query.order_by(
                order_column.asc() if order_dir == "asc" else order_column.desc()
            )

        total_records = session.query(customer).count()
        filtered_records = query.count()
        data_query = query.offset(start).limit(length).all()

        # Process results
        data = [{**cust.customer.to_dict(), "age": cust.age} for cust in data_query]

        response = {
            "draw": draw,
            "recordsTotal": total_records,
            "recordsFiltered": filtered_records,
            "data": data,
        }
        return jsonify(response)
    finally:
        session.close()


# route to delete menu
@app.route("/delete_menu/<int:id>", methods=["POST"])
def delete_menu(id):
    """Delete a product by ID."""
    session = SessionLocal()
    try:
        # Query the product from the menu table
        product = session.query(menu).get(id)
        if product is None:
            return "Product not found", 404

        # Delete the product from the database
        session.delete(product)
        session.commit()

        # Redirect to the desired route (e.g., list-menu) after deletion
        return redirect(url_for("list_menu"))
    except Exception as e:
        # Rollback in case of an error
        session.rollback()
        return f"An error occurred: {e}", 500
    finally:
        # Close the session
        session.close()


# route to delete customers
@app.route("/delete_customer/<int:id>", methods=["POST"])
def delete_customer(id):
    """Delete a customer by ID."""
    session = SessionLocal()
    try:
        # Query the customer by ID
        customer_to_delete = session.query(customer).get(id)
        if customer_to_delete is None:
            return "Customer not found", 404

        # Delete the customer from the database
        session.delete(customer_to_delete)
        session.commit()

        # Redirect to the customers page after deletion
        return redirect(url_for("customers"))
    except Exception as e:
        # Rollback in case of an error
        session.rollback()
        return f"An error occurred: {e}", 500
    finally:
        # Close the session
        session.close()


# Export menu database to excel file
@app.route("/export_menu", methods=["GET"])
def export_menu():
    """Export menu data to Excel."""
    session = SessionLocal()
    try:
        query_result = session.query(menu).all()
        return export_to_excel(query_result, "menu_export", "Menu")
    finally:
        session.close()


@app.route("/export_customers", methods=["GET"])
def export_customers():
    """Export customer data to Excel."""
    session = SessionLocal()
    try:
        query_result = session.query(customer).all()
        return export_to_excel(query_result, "customers_export", "Customers")
    finally:
        session.close()


@app.route("/add_menu", methods=["POST"])
def add_menu():
    nama_menu = request.form.get("nama_menu")
    kode = request.form.get("kode")
    kategori = request.form.get("kategori")
    sub_kategori = request.form.get("sub_kategori")
    harga = request.form.get("harga", type=int)
    status = request.form.get("status")
    deskripsi = request.form.get("deskripsi")
    tags = request.form.get("tags")
    menu_images = request.files.get("menu_images")

    # Validasi field wajib
    if not all([nama_menu, kode, kategori, sub_kategori, harga, status]):
        return jsonify({"error": "All fields except image are required"}), 400

    # Tangani file gambar jika diunggah
    file_path = None
    if menu_images and menu_images.filename:  # Pastikan ada file yang diunggah
        if allowed_file(menu_images.filename):
            filename = secure_filename(menu_images.filename)
            file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            menu_images.save(file_path)
        else:
            return jsonify({"error": "Invalid file format"}), 400

    # Tambahkan ke database
    new_menu = menu(
        nama_menu=nama_menu,
        kode=kode,
        kategori=kategori,
        sub_kategori=sub_kategori,
        harga=harga,
        status=status,
        deskripsi=deskripsi,
        tags=tags,
        menu_images=file_path,  # Tetap None jika tidak ada file
    )

    session = SessionLocal()
    try:
        session.add(new_menu)
        session.commit()
        return jsonify({"message": "Menu added successfully"}), 200
    except Exception as e:
        session.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        session.close()

@app.route("/add_customer", methods=["POST"])
def add_customer():
    session = SessionLocal()
    try:
        # Ambil data dari form
        name = request.form.get("nama_customers")
        dob = request.form.get("dob")
        if dob:
            try:
                dob = datetime.strptime(dob, "%d-%m-%Y").strftime("%d-%m-%Y")
            except ValueError:
                return jsonify({"error": "Invalid date format. Use DD-MM-YYYY"}), 400

        gender = request.form.get("gender")
        email = request.form.get("email")
        phone = request.form.get("phone", type=int)
        address = request.form.get("address")
        city = request.form.get("city")
        country = request.form.get("country")
        royalty_point = request.form.get("loyalty_points", type=int) or 0  # Default ke 0 jika kosong

        # Validasi field wajib
        if not all([name, email, phone]):
            return jsonify({"error": "Name, email, and phone are required"}), 400

        # Validasi email dan phone unik
        if session.query(customer).filter_by(email=email).first():
            return jsonify({"error": f"Email '{email}' already exists"}), 400
        if session.query(customer).filter_by(phone=phone).first():
            return jsonify({"error": f"Phone number '{phone}' already exists"}), 400

        # Tambahkan customer ke database
        new_customer = customer(
            name=name,
            birthday=dob,
            gender=gender,
            email=email,
            phone=phone,
            address=address,
            city=city,
            country=country,
            royalty_point=royalty_point,
        )
        # Otomatis set membership berdasarkan royalty_point
        new_customer.set_roles_type()

        session.add(new_customer)
        session.commit()

        return jsonify({"message": "Customer added successfully"}), 200
    except Exception as e:
        session.rollback()
        print("Error:", str(e))  # Log error untuk debugging
        return jsonify({"error": f"Failed to add customer: {str(e)}"}), 500
    finally:
        session.close()

@app.route('/get_customer/<int:id>', methods=['GET'])
def get_customer(id):
    """Retrieve customer data by ID."""
    session = SessionLocal()
    try:
        customer_data = session.query(customer).get(id)
        if not customer_data:
            return jsonify({"error": "Customer not found"}), 404

        # Siapkan data untuk dikirim ke modal
        response_data = customer_data.to_dict()
        # Format date of birth untuk HTML input date
        if customer_data.birthday:
            birth_date = datetime.strptime(customer_data.birthday, "%d-%m-%Y")
            response_data["birthday"] = birth_date.strftime("%d-%m-%Y")
        else:
            response_data["birthday"] = None

        # Hitung umur jika tidak tersedia
        if response_data.get("age") is None:
            if response_data["birthday"]:
                today = datetime.today()
                birth_date = datetime.strptime(response_data["birthday"], "%Y-%m-%d")
                response_data["age"] = (
                    today.year - birth_date.year - ((today.month, today.day) < (birth_date.month, birth_date.day))
                )
            else:
                response_data["age"] = None

        return jsonify(response_data), 200
    finally:
        session.close()

@app.route('/update_customer/<int:id>', methods=['POST'])
def update_customer(id):
    """Update customer data by ID."""
    session = SessionLocal()
    try:
        # Ambil data customer berdasarkan ID
        customer_to_update = session.query(customer).get(id)
        if not customer_to_update:
            return jsonify({"error": "Customer not found"}), 404

        # Validasi gender
        gender = request.form.get('gender')
        if gender not in ["Male", "Female", "Other"]:
            return jsonify({"error": "Invalid gender value"}), 400
        customer_to_update.gender = gender

        # Validasi email unik
        email = request.form.get('email')
        if email:
            existing_email = session.query(customer).filter(
                customer.email == email, customer.id != id
            ).first()
            if existing_email:
                return jsonify({"error": "Email already exists"}), 400

        # Validasi nomor telepon unik
        phone = request.form.get('phone', type=int)
        if phone:
            existing_phone = session.query(customer).filter(
                customer.phone == phone, customer.id != id
            ).first()
            if existing_phone:
                return jsonify({"error": "Phone number already exists"}), 400

        # Update fields
        customer_to_update.name = request.form.get('nama_customers')
        dob = request.form.get('dob')
        if dob:
            try:
                dob = datetime.strptime(dob, "%d-%m-%Y").strftime("%d-%m-%Y")
            except ValueError:
                return jsonify({"error": "Invalid date format. Use DD-MM-YYYY"}), 400
        customer_to_update.birthday = dob
        customer_to_update.gender = request.form.get('gender')
        customer_to_update.email = email
        customer_to_update.phone = phone
        customer_to_update.address = request.form.get('address')
        customer_to_update.city = request.form.get('city')
        customer_to_update.country = request.form.get('country')
        customer_to_update.royalty_point = request.form.get('loyalty_points', type=int)

        # Simpan perubahan
        session.commit()
        return jsonify({"message": "Customer updated successfully"}), 200

    except Exception as e:
        session.rollback()
        return jsonify({"error": f"Failed to update customer: {str(e)}"}), 500
    finally:
        session.close()

@app.route('/get_menu/<int:id>', methods=['GET'])
def get_menu(id):
    session = SessionLocal()
    try:
        menu_item = session.query(menu).get(id)
        if not menu_item:
            return jsonify({"error": "Menu not found"}), 404

        return jsonify(menu_item.to_dict()), 200
    finally:
        session.close()

@app.route('/update_menu/<int:id>', methods=['POST'])
def update_menu(id):
    session = SessionLocal()
    try:
        # Ambil menu dari database
        menu_item = session.query(menu).get(id)
        if not menu_item:
            return jsonify({"error": "Menu not found"}), 404

        # Update data dari form
        menu_item.nama_menu = request.form.get('nama_menu')
        menu_item.kode = request.form.get('kode')
        menu_item.kategori = request.form.get('kategori')
        menu_item.sub_kategori = request.form.get('sub_kategori')
        menu_item.harga = request.form.get('harga', type=int)
        menu_item.status = request.form.get('status')
        menu_item.deskripsi = request.form.get('deskripsi')  # Tambahkan ini
        menu_item.tags = request.form.get('tags')  # Tambahkan ini

        # Tangani file gambar baru jika diunggah
        menu_images = request.files.get("menu_images")
        if menu_images and menu_images.filename:  # Pastikan file ada
            if allowed_file(menu_images.filename):  # Validasi format file
                # Hapus gambar lama jika ada
                if menu_item.menu_images:
                    try:
                        os.remove(menu_item.menu_images)
                    except OSError:
                        pass  # Abaikan jika file tidak ditemukan

                # Simpan gambar baru
                filename = secure_filename(menu_images.filename)
                file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
                menu_images.save(file_path)
                menu_item.menu_images = file_path
            else:
                return jsonify({"error": "Invalid file format"}), 400

        # Simpan perubahan ke database
        session.commit()
        return jsonify({"message": "Menu updated successfully"}), 200
    except Exception as e:
        session.rollback()
        return jsonify({"error": f"Failed to update menu: {str(e)}"}), 500
    finally:
        session.close()

if __name__ == "__main__":
    app.run(debug=True)
