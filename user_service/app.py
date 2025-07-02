from flask import Flask, render_template, session, redirect
from functools import wraps
from flask_cors import CORS
from config import Config

# Create Flask app
app = Flask(__name__)
app.secret_key = Config.SECRET_KEY

# Configure CORS to allow all origins
CORS(app, origins="*", supports_credentials=True)

# CORS(app, 
#      resources={r"/api/*": {
#          "origins": "*",
#          "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
#          "allow_headers": ["Content-Type", "Authorization", "X-Requested-With"],
#          "expose_headers": ["Content-Length", "Authorization"],
#          "max_age": 3600
#      }})

# Decorators
def login_required(f):
    @wraps(f)
    def wrap(*args, **kwargs):
        if 'logged_in' in session:
            return f(*args, **kwargs)
        else:
            return redirect('/')
    return wrap

# Routes
@app.route('/')
def home():
    return "Welcome to home page"

@app.route('/dashboard/')
@login_required
def dashboard():
    return "Welcome to dashboard"

# Register blueprints
from user.routes import user_bp

app.register_blueprint(user_bp)

if __name__ == '__main__':
    app.run(
        host=Config.FLASK_HOST,
        port=int(Config.FLASK_PORT),
        debug=Config.FLASK_DEBUG == '1'
    )