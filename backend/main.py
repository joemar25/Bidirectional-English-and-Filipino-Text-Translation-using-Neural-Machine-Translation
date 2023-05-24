import os
from flask import Flask
from dotenv import load_dotenv as env_load

# Load environment variables
env_load()

# Disable AVX and AVX2 instructions
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'

# Initialize Flask app
app = Flask(__name__, template_folder='templates', static_folder='static')

# Get Secret key
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')
