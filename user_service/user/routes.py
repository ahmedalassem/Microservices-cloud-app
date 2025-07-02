from flask import Blueprint, request, jsonify, session, redirect
from user.models import User
from passlib.hash import pbkdf2_sha256
from db import db
import uuid

user_bp = Blueprint('user', __name__)

@user_bp.route('/api/signup/', methods=['POST'])
def signup():
    return User().signup()

@user_bp.route('/api/signout/')
def signout():
    return User().signout()

@user_bp.route('/api/login/', methods=['POST', 'OPTIONS'])
def login():
    if request.method == 'OPTIONS':
        return '', 200
    return User().login()

@user_bp.route("/api/user/", methods=["GET"])
def get_users():
    return User().get_users()

@user_bp.route("/api/user/<user_id>/", methods=["GET"])
def get_user_id(user_id):
    return User().get_user_id(user_id)

@user_bp.route("/api/user/me", methods=["GET"])
def get_current_user():
    token = request.headers.get('Authorization')
    if not token or not token.startswith('Bearer '):
        return jsonify({"error": "Unauthorized"}), 401
    
    token = token.split(' ')[1]
    user = db.users.find_one({"token": token})
    if not user:
        return jsonify({"error": "User not found"}), 404
    
    # Convert ObjectId to string and remove sensitive data
    user["_id"] = str(user["_id"])
    if "password" in user:
        del user["password"]
    if "token" in user:
        del user["token"]
    
    return jsonify(user)

@user_bp.route("/api/user/<user_id>/balance", methods=["GET"])
def get_user_balance(user_id):
    user = db.users.find_one({"_id": user_id})
    if not user:
        return jsonify({"error": "User not found"}), 404
    
    return jsonify({
        "user_id": user_id,
        "balance": float(user.get("balance", 0))
    })

@user_bp.route("/api/user/<user_id>/balance", methods=["PATCH"])
def update_balance(user_id):
    data = request.get_json()
    amount = data.get('amount')
    if amount is None:
        return jsonify({"error": "Amount is required"}), 400
    return User().update_balance(user_id, amount)