from flask import Flask, request, jsonify, render_template
from transformers import AutoModelForSeq2SeqLM, AutoTokenizer
import torch

app = Flask(__name__, template_folder='templates', static_folder='static')

# Load the pre-trained model
model_path = torch.load('model.pt')
model = AutoModelForSeq2SeqLM.from_pretrained(model_path)

# Load the tokenizer
tokenizer = AutoTokenizer.from_pretrained(model_path)

def encode(text):
    # Tokenize the input text
    inputs = tokenizer(text, return_tensors="pt")

    return inputs

def decode(outputs):
    # Decode the output tokens into text
    translation = tokenizer.decode(outputs[0], skip_special_tokens=True)

    return translation

def translate(text, source_lang, target_lang):
    # Encode the input text
    inputs = encode(text)

    # Translate the text using the model
    outputs = model.generate(
        inputs["input_ids"],
        attention_mask=inputs["attention_mask"],
        source_language_code=source_lang,
        target_language_code=target_lang,
    )

    # Decode the output tokens into text
    translation = decode(outputs)

    return translation

# Define a route for the index page
@app.route('/')
def index():
    return render_template('index.html')

# Define a route for translation requests
@app.route("/translate", methods=["POST"])
def handle_translation_request():
    # Get the request data
    data = request.get_json()

    # Extract the text, source language, and target language from the request data
    text = data["text"]
    source_lang = data["source_lang"]
    target_lang = data["target_lang"]

    # Translate the text
    translation = translate(text, source_lang, target_lang)

    # Return the translation result to the user
    return jsonify({"translation": translation})

# Run the Flask app
if __name__ == "__main__":
    app.run()
