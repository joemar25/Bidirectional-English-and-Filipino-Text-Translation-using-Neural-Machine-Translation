from application import app
from flask import render_template, url_for


@app.route('/')
@app.route('/index')
def index():
     name = "joemar"
     return render_template('index.html', name=name)

