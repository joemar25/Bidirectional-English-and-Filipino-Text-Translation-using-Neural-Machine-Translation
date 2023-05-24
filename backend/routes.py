from flask import render_template, redirect, url_for
from backend.main import app

@app.route("/")
@app.route("/index")
def index():
    return redirect(url_for("main"))

@app.route("/main", methods=['GET', 'POST'])
def main():
    return render_template("main.html")
