from flask import jsonify
from datetime import datetime
import uuid
import requests
from db import db
from config import Config

class Transaction:
    def __init__(self):
        self.user_service_url = Config.USER_SERVICE_URL

    def create_transaction(self, sender_id, receiver_id, amount, description=""):
        try:
            # Get sender details
            sender_response = requests.get(f"{self.user_service_url}/api/user/{sender_id}/")
            if sender_response.status_code != 200:
                return jsonify({"error": "Sender not found"}), 404
            
            # Get receiver details
            receiver_response = requests.get(f"{self.user_service_url}/api/user/{receiver_id}/")
            if receiver_response.status_code != 200:
                return jsonify({"error": "Receiver not found"}), 404
            
            # Check sender's balance
            sender_data = sender_response.json()
            if float(sender_data.get('balance', 0)) < float(amount):
                return jsonify({"error": "Insufficient balance"}), 400
            
            # Create transaction
            transaction = {
                "_id": uuid.uuid4().hex,
                "sender_id": sender_id,
                "receiver_id": receiver_id,
                "amount": float(amount),
                "description": description,
                "timestamp": datetime.utcnow().isoformat(),
                "status": "pending"
            }
            
            # Update sender's balance
            update_sender = requests.patch(
                f"{self.user_service_url}/api/user/{sender_id}/balance",
                json={"amount": -float(amount)}
            )
            
            if update_sender.status_code != 200:
                transaction["status"] = "failed"
                db.transactions.insert_one(transaction)
                return jsonify({"error": "Failed to update sender's balance"}), 500
            
            # Update receiver's balance
            update_receiver = requests.patch(
                f"{self.user_service_url}/api/user/{receiver_id}/balance",
                json={"amount": float(amount)}
            )
            
            if update_receiver.status_code != 200:
                # Rollback sender's balance
                requests.patch(
                    f"{self.user_service_url}/api/user/{sender_id}/balance",
                    json={"amount": float(amount)}
                )
                transaction["status"] = "failed"
                db.transactions.insert_one(transaction)
                return jsonify({"error": "Failed to update receiver's balance"}), 500
            
            transaction["status"] = "completed"
            db.transactions.insert_one(transaction)
            return jsonify(transaction), 201
            
        except Exception as e:
            return jsonify({"error": str(e)}), 500

    def get_user_transactions(self, user_id):
        try:
            # Get user details to verify user exists
            user_response = requests.get(f"{self.user_service_url}/api/user/{user_id}/")
            if user_response.status_code != 200:
                return jsonify({"error": "User not found"}), 404
            
            # Get all transactions where user is either sender or receiver
            transactions = list(db.transactions.find({
                "$or": [
                    {"sender_id": user_id},
                    {"receiver_id": user_id}
                ]
            }))
            
            # Convert ObjectId to string for JSON serialization
            for transaction in transactions:
                transaction["_id"] = str(transaction["_id"])
            
            return jsonify(transactions)
            
        except Exception as e:
            return jsonify({"error": str(e)}), 500

    def get_transaction_by_id(self, transaction_id):
        try:
            transaction = db.transactions.find_one({"_id": transaction_id})
            if transaction:
                transaction["_id"] = str(transaction["_id"])
                # Handle both string and datetime timestamps
                if isinstance(transaction["timestamp"], datetime):
                    transaction["timestamp"] = transaction["timestamp"].isoformat()
                return jsonify(transaction), 200
            return jsonify({"error": "Transaction not found"}), 404
        except Exception as e:
            return jsonify({"error": "Failed to fetch transaction", "details": str(e)}), 500 