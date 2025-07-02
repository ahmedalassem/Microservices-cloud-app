import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AuthAPI, TransactionAPI } from '../utils/axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchBalance = async () => {
    try {
      const response = await AuthAPI.getUserBalance(user._id);
      setBalance(response.balance);
    } catch (error) {
      console.error('Error fetching balance:', error);
    }
  };

  const fetchDashboardData = async () => {
    if (!user?._id) {
      console.error('User ID is not available');
      setLoading(false);
      return;
    }

    try {
      // Fetch recent transactions
      const transactions = await TransactionAPI.getTransactions(user._id);
      setRecentTransactions(transactions);

      // Fetch current balance
      await fetchBalance();
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    
    // Set up periodic balance refresh every 30 seconds
    const balanceInterval = setInterval(fetchBalance, 30000);
    
    // Cleanup interval on component unmount
    return () => clearInterval(balanceInterval);
  }, [user?._id]);

  if (loading) {
    return (
      <div className="container mt-5">
        <div className="d-flex justify-content-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-4">
          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <h2 className="card-title">Current Balance</h2>
              <p className="display-4">${balance.toFixed(2)}</p>
            </div>
          </div>
        </div>
        <div className="col-md-8">
          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <h2 className="card-title">Recent Transactions</h2>
              {recentTransactions.length > 0 ? (
                <div className="table-responsive">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Type</th>
                        <th>Amount</th>
                        <th>Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentTransactions.slice(0, 5).map((transaction) => (
                        <tr key={transaction._id}>
                          <td>{new Date(transaction.timestamp).toLocaleDateString()}</td>
                          <td>{transaction.sender_id === user._id ? 'Sent' : 'Received'}</td>
                          <td className={transaction.sender_id === user._id ? 'text-danger' : 'text-success'}>
                            {transaction.sender_id === user._id ? '-' : '+'}${transaction.amount}
                          </td>
                          <td>{transaction.description}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p>No recent transactions</p>
              )}
              <Link to="/transactions" className="btn btn-primary">
                View All Transactions
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-md-12">
          <div className="card shadow-sm">
            <div className="card-body">
              <h2 className="card-title">Quick Actions</h2>
              <div className="d-flex gap-3">
                <Link to="/transfer" className="btn btn-primary">
                  Transfer Money
                </Link>
                <Link to="/reports" className="btn btn-info">
                  <i className="fas fa-chart-bar me-2"></i>
                  View Reports
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 