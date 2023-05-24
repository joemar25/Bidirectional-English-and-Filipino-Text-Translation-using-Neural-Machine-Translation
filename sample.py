import transformers
import pickle

# Load the Google MT5-Base model
model_name = "google/mt5-base"
model = transformers.AutoModelForSeq2SeqLM.from_pretrained(model_name)

# Save the model to a pickle file
with open("mt5-base.pkl", "wb") as f:
    pickle.dump(model, f)
