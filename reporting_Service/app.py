from flask import Flask
from flask_cors import CORS
from reporting import reporting_bp
from config import Config

app = Flask(__name__)
CORS(app, 
     resources={r"/*": {"origins": "http://localhost:3000"}},
     supports_credentials=True,
     allow_headers=["Content-Type", "Authorization"],
     methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"])
app.secret_key = Config.SECRET_KEY

app.register_blueprint(reporting_bp)

if __name__ == '__main__':
    app.run(
        host=Config.FLASK_HOST,
        port=int(Config.FLASK_PORT),
        debug=Config.FLASK_DEBUG == '1'
    ) 