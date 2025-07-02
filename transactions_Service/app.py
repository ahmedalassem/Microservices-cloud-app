from flask import Flask
from flask_cors import CORS
from routes import transaction_bp
from config import Config

# Create Flask app
app = Flask(__name__)
# Configure CORS
CORS(app, 
     resources={r"/*": {"origins": ["http://localhost:3000", "http://localhost:80", "http://localhost"]}},
     supports_credentials=True,
     allow_headers=["Content-Type", "Authorization"],
     methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"])

# Register blueprint
app.secret_key = Config.SECRET_KEY
app.register_blueprint(transaction_bp)

if __name__ == '__main__':
    app.run(
        host=Config.FLASK_HOST,
        port=int(Config.FLASK_PORT),
        debug=Config.FLASK_DEBUG == '1'
    ) 