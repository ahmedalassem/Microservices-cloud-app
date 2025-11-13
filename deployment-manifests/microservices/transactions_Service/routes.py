from flask import Blueprint, request, jsonify
from models import Transaction

transaction_bp = Blueprint('transaction', __name__)

@transaction_bp.route('/api/transactions/', methods=['POST'])
def create_transaction():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No data provided"}), 400

        sender_id = data.get('sender_id')
        receiver_id = data.get('receiver_id')
        amount = data.get('amount')
        description = data.get('description', '')

        if not all([sender_id, receiver_id, amount]):
            return jsonify({"error": "Missing required fields"}), 400

        try:
            amount = float(amount)
            if amount <= 0:
                return jsonify({"error": "Amount must be positive"}), 400
        except ValueError:
            return jsonify({"error": "Invalid amount format"}), 400

        return Transaction().create_transaction(sender_id, receiver_id, amount, description)
    except Exception as e:
        return jsonify({"error": "Internal server error", "details": str(e)}), 500

@transaction_bp.route('/api/transactions/<user_id>/', methods=['GET'])
def get_user_transactions(user_id):
    try:
        return Transaction().get_user_transactions(user_id)
    except Exception as e:
        return jsonify({"error": "Internal server error", "details": str(e)}), 500

@transaction_bp.route('/api/transaction/<transaction_id>', methods=['GET'])
def get_transaction(transaction_id):
    try:
        return Transaction().get_transaction_by_id(transaction_id)
    except Exception as e:
        return jsonify({"error": "Internal server error", "details": str(e)}), 500 