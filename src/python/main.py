from flask import Flask, flash, render_template, request, redirect, session, url_for, send_from_directory
from functools import wraps
from datetime import timedelta
import os

# Define the base directory to ensure Flask can find templates and assets correctly
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
TEMPLATE_DIR = os.path.join(BASE_DIR, '../../docs')
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
    return render_template('index.html')

@app.route('/release-note')
def release_note():
    return render_template('release-note.html')

if __name__ == '__main__':
    app.run(debug=True)
