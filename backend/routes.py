from flask import render_template, redirect, url_for, jsonify, request
from backend.main import app
from translate import Translator

@app.route("/")
@app.route("/index")
def index():
    return redirect(url_for("main"))

@app.route("/main", methods=['GET', 'POST'])
def main():
    return render_template("main.html")

@app.route('/translate', methods=['POST'])
def translate_text():
    # Get the request data
    request_data = request.get_json()
    from_language = request_data['fromLanguage']
    to_language = request_data['toLanguage']
    text_to_translate = request_data['textToTranslate']

    # Translate the text
    translator = Translator(from_lang=from_language, to_lang=to_language)
    translated_text = translator.translate(text_to_translate)

    # Return the translated text
    return jsonify({'translatedText': translated_text})

@app.errorhandler(404)
def page_not_found(e):
    return render_template('404.html'), 404