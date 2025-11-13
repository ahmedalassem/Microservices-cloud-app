from pymongo import MongoClient
from config import Config

# Setup MongoDB
client = MongoClient(Config.MONGODB_URI)
db = client[Config.MONGODB_DB]