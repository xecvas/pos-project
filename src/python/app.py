import os
from flask import Flask, request, jsonify, send_from_directory, render_template, redirect, session, url_for, send_file
from io import BytesIO

# Initialize Flask app
app = Flask(__name__, template_folder="src")
app.secret_key = os.urandom(24)  # Secure secret key for session management

# Display the main page
@app.route("/")
@app.route("/main")
def main_page():
    return render_template("index.html")

if __name__ == "__main__":
    app.run(debug=True)