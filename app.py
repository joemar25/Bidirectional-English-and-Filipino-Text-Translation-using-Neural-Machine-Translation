from fastapi import FastAPI, Request, Form, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from transformers import AutoModelForSeq2SeqLM, AutoTokenizer
from io import BytesIO
import torch
import numpy as np
from flask import render_template


app = FastAPI()

languages = {
    "en": "English",
    "fil": "Filipino", 
}

#Load the pre-trained model
model_state = torch.load("nllb.pt",map_location=torch.device('cpu'))
tokenizer = AutoTokenizer.from_pretrained('facebook/nllb-200-distilled-600M')
model = AutoModelForSeq2SeqLM.from_pretrained('facebook/nllb-200-distilled-600M')

   

def translate(text, source_lang, target_lang):
    # Validate language codes
    if source_lang not in languages or target_lang not in languages:
        raise HTTPException(status_code=400, detail="Invalid language code")

    # Tokenize the input text
    inputs = tokenizer(text, return_tensors="pt")

    # Translate the text using the model
    outputs = model.generate(
        inputs["input_ids"],
        attention_mask=inputs["attention_mask"],
        source_language_code=source_lang,
        target_language_code=target_lang,
    )
    translation = tokenizer.decode(outputs[0], skip_special_tokens=True)

    return translation

#need
def encode_input_str(text, target_lang, tokenizer, seq_len,
                     lang_token_map=languages):
  target_lang_token = lang_token_map[target_lang]

  # Tokenize and add special tokens
  input_ids = tokenizer.encode(
      text = target_lang_token + text,
      return_tensors = 'pt',
      padding = 'max_length',
      truncation = True,
      max_length = seq_len)

  return input_ids[0]

def encode_target_str(text, tokenizer, seq_len,
                      lang_token_map=languages):
  token_ids = tokenizer.encode(
      text = text,
      return_tensors = 'pt',
      padding = 'max_length',
      truncation = True,
      max_length = seq_len)
  
  return token_ids[0]

def format_translation_data(translations, lang_token_map,
                            tokenizer, seq_len=128):
  # Choose a random 2 languages for in i/o
  langs = list(lang_token_map.keys())
  input_lang, target_lang = np.random.choice(langs, size=2, replace=False)

  # Get the translations for the batch
  input_text = translations[input_lang]
  target_text = translations[target_lang]

  if input_text is None or target_text is None:
    return None

  input_token_ids = encode_input_str(
      input_text, target_lang, tokenizer, seq_len, lang_token_map)
  
  target_token_ids = encode_target_str(
      target_text, tokenizer, seq_len, lang_token_map)

  return input_token_ids, target_token_ids

def transform_batch(batch, lang_token_map, tokenizer):
  inputs = []
  targets = []
  for translation_set in batch['translation']:
    formatted_data = format_translation_data(
        translation_set, lang_token_map, tokenizer, max_seq_len = 128)
    
    if formatted_data is None:
      continue
    
    input_ids, target_ids = formatted_data
    inputs.append(input_ids.unsqueeze(0))
    targets.append(target_ids.unsqueeze(0))
    
  batch_input_ids = torch.cat(inputs).cuda()
  batch_target_ids = torch.cat(targets).cuda()

  return batch_input_ids, batch_target_ids

def get_data_generator(dataset, lang_token_map, tokenizer, batch_size=32):
  dataset = dataset.shuffle()
  for i in range(0, len(dataset), batch_size):
    raw_batch = dataset[i:i+batch_size]
    yield transform_batch(raw_batch, lang_token_map, tokenizer)

def generate_text(input_text,output_language):
    input_ids = encode_input_str(
        text = input_text,
        target_lang = output_language,
        tokenizer = tokenizer,
        seq_len = model.config.max_length,
        lang_token_map = languages)
    input_ids = input_ids.unsqueeze(0).cpu()

    output_tokens = model.generate(input_ids, num_beams=20, length_penalty=0.2)
    print(tokenizer.decode(output_tokens[0], skip_special_tokens=True)) 

special_tokens_dict = {'additional_special_tokens': list(languages.values())}
tokenizer.add_special_tokens(special_tokens_dict)
model.resize_token_embeddings(len(tokenizer))
    
@app.post("/translate/") 
def read_item(input_text: str, output_language: str): 
    return {"output_text": generate_text(input_text, output_language)}

@app.route("/")
@app.route("/index", methods=["POST"])
def index():
   return render_template("Index.html")


# Run the FastAPI app
if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="127.0.0.1", port=8080)
