from flask import jsonify
import requests
from datetime import datetime
from dateutil import parser
from db import db
from config import Config

class Reporting:
    def __init__(self):
        self.transaction_service_url = Config.TRANSACTION_SERVICE_URL
        self.user_service_url = Config.USER_SERVICE_URL

    def get_transaction_report(self, user_id, start_date=None, end_date=None):
        """Generate transaction report for a user"""
        try:
            # Get user details
            user_response = requests.get(f"{self.user_service_url}/api/user/{user_id}/")
            if user_response.status_code != 200:
                return jsonify({"error": "User not found"}), 404
            
            # Get transactions
            transactions_response = requests.get(f"{self.transaction_service_url}/api/transactions/{user_id}/")
            if transactions_response.status_code != 200:
                return jsonify({"error": "Failed to fetch transactions"}), 500
            
            transactions = transactions_response.json()
            
            # Filter by date if provided
            if start_date and end_date:
                start = parser.parse(start_date).replace(tzinfo=None)
                end = parser.parse(end_date).replace(tzinfo=None)
                transactions = [
                    t for t in transactions
                    if start <= parser.parse(t['timestamp']).replace(tzinfo=None) <= end
                ]
            
            # Calculate summary
            total_transactions = len(transactions)
            total_amount = sum(float(t['amount']) for t in transactions)
            avg_transaction = total_amount / total_transactions if total_transactions > 0 else 0
            
            return jsonify({
                "user_id": user_id,
                "total_transactions": total_transactions,
                "total_amount": total_amount,
                "average_transaction": avg_transaction,
                "transactions": transactions
            })
            
        except Exception as e:
            return jsonify({"error": str(e)}), 500

    def get_balance_report(self, user_id, start_date=None, end_date=None):
        """Generate balance history report for a user"""
        try:
            # Get user details
            user_response = requests.get(f"{self.user_service_url}/api/user/{user_id}/")
            if user_response.status_code != 200:
                return jsonify({"error": "User not found"}), 404
            
            user_data = user_response.json()
            current_balance = float(user_data.get('balance', 0))
            
            # Get transactions
            transactions_response = requests.get(f"{self.transaction_service_url}/api/transactions/{user_id}/")
            if transactions_response.status_code != 200:
                return jsonify({"error": "Failed to fetch transactions"}), 500
            
            transactions = transactions_response.json()
            
            # Filter by date if provided
            if start_date and end_date:
                start = parser.parse(start_date).replace(tzinfo=None)
                end = parser.parse(end_date).replace(tzinfo=None)
                transactions = [
                    t for t in transactions
                    if start <= parser.parse(t['timestamp']).replace(tzinfo=None) <= end
                ]
            
            # Sort transactions by timestamp
            transactions.sort(key=lambda x: parser.parse(x['timestamp']).replace(tzinfo=None))
            
            # Calculate balance history
            balance_history = []
            running_balance = current_balance
            
            for t in reversed(transactions):
                if t['sender_id'] == user_id:
                    running_balance += float(t['amount'])
                else:
                    running_balance -= float(t['amount'])
                balance_history.append({
                    "timestamp": t['timestamp'],
                    "balance": running_balance,
                    "transaction_id": t['_id']
                })
            
            return jsonify({
                "user_id": user_id,
                "current_balance": current_balance,
                "balance_history": balance_history
            })
            
        except Exception as e:
            return jsonify({"error": str(e)}), 500

    def get_user_summary(self, user_id):
        """Generate comprehensive user summary"""
        try:
            # Get user details
            user_response = requests.get(f"{self.user_service_url}/api/user/{user_id}/")
            if user_response.status_code != 200:
                return jsonify({"error": "User not found"}), 404
            
            user_data = user_response.json()
            
            # Get transactions
            transactions_response = requests.get(f"{self.transaction_service_url}/api/transactions/{user_id}/")
            if transactions_response.status_code != 200:
                return jsonify({"error": "Failed to fetch transactions"}), 500
            
            transactions = transactions_response.json()
            
            # Calculate statistics
            total_transactions = len(transactions)
            total_sent = sum(float(t['amount']) for t in transactions if t['sender_id'] == user_id)
            total_received = sum(float(t['amount']) for t in transactions if t['receiver_id'] == user_id)
            
            return jsonify({
                "user_id": user_id,
                "name": user_data.get('name'),
                "email": user_data.get('email'),
                "current_balance": float(user_data.get('balance', 0)),
                "total_transactions": total_transactions,
                "total_amount_sent": total_sent,
                "total_amount_received": total_received,
                "net_balance_change": total_received - total_sent
            })
            
        except Exception as e:
            return jsonify({"error": str(e)}), 500 