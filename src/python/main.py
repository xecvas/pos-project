from datetime import timedelta
from functools import wraps
import os
from flask import Flask, flash, request, jsonify, send_from_directory, render_template, redirect, session, url_for, send_file
from io import BytesIO
import pandas as pd
from sqlalchemy.orm import sessionmaker
from database import menu, SessionLocal

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

# Login route
@app.route('/', methods=['GET', 'POST'])
@app.route('/login', methods=['GET', 'POST'])
def login():
    if 'user_email' in session:
        return redirect(url_for('index'))  # Jika sudah login, langsung ke index

    if request.method == 'POST':
        username = request.form.get('email')
        password = request.form.get('password')

        if username == 'user@gmail.com' and password == '123':
            session.permanent = True
            session['user_email'] = username
            return redirect(url_for('index'))
        else:
            flash("Invalid credentials. Please try again.")
            return redirect(url_for('login'))

    return render_template('login.html')

# Logout route
@app.route('/logout')
def logout():
    session.pop('user_email', None)
    return redirect(url_for('login'))

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
    stats = get_menu_stats()
    return render_template('index.html', **stats)

@app.route('/release-note')
def release_note():
    return render_template('release-note.html')

@app.route('/dashboard')
def dashboard():
    return render_template('tester.html')

# Get data from the database with pagination
@app.route('/data', methods=['GET'])
def get_data():
    session = SessionLocal()
    try:
        page = int(request.args.get('page', 1))
        per_page = int(request.args.get('per_page', 10))
        offset = (page - 1) * per_page
        search_value = request.args.get('search[value]', '')  # Get the search value

        # Base query
        query = session.query(menu)

        # If there's a search value, filter the query
        if search_value:
            search_value = f"%{search_value}%"
            query = query.filter(
                menu.nama_menu.ilike(search_value) |  # Search in 'nama_pengguna'
                menu.kode.ilike(search_value)            # Search in 'kode'
            )

        # Paginate and count rows
        total_rows = query.count()
        daftar_menu_query = query.limit(per_page).offset(offset)

        data = [menu.to_dict() for menu in daftar_menu_query]

        response = {
            'data': data,
            'recordsTotal': total_rows,
            'recordsFiltered': total_rows,  # Adjust if using filters
            'page': page
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
            "total_dingin": total_dingin
        }
    finally:
        session.close()

if __name__ == '__main__':
    app.run(debug=True)
