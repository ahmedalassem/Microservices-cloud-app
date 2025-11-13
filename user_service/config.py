from dotenv import load_dotenv
import os

env_file = os.getenv('ENV_FILE', '.env')

if os.path.exists(env_file):
    load_dotenv(env_file)

class Config:
    MONGODB_URI = os.getenv('MONGODB_URI')
    MONGODB_DB = os.getenv('MONGODB_DB')
    FLASK_APP = os.getenv('FLASK_APP')
    FLASK_ENV = os.getenv('FLASK_ENV')
    FLASK_DEBUG = os.getenv('FLASK_DEBUG')
    FLASK_HOST = os.getenv('FLASK_HOST')
    FLASK_PORT = os.getenv('FLASK_PORT')
    SECRET_KEY = os.getenv('SECRET_KEY')
