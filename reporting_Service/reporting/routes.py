from flask import Blueprint, jsonify, request
from reporting.models import Reporting

reporting_bp = Blueprint('reporting', __name__)

@reporting_bp.route('/api/reports/transactions/<user_id>', methods=['GET'])
def get_transaction_report(user_id):
    """Get transaction summary for a user"""
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')
    return Reporting().get_transaction_report(user_id, start_date, end_date)

@reporting_bp.route('/api/reports/balance/<user_id>', methods=['GET'])
def get_balance_report(user_id):
    """Get balance history for a user"""
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')
    return Reporting().get_balance_report(user_id, start_date, end_date)

@reporting_bp.route('/api/reports/summary/<user_id>', methods=['GET'])
def get_user_summary(user_id):
    """Get comprehensive user summary"""
    return Reporting().get_user_summary(user_id) 