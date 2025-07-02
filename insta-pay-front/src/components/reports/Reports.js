import React, { useState, useEffect } from 'react';
import { ReportingAPI } from '../../utils/axios';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Reports = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [transactionReport, setTransactionReport] = useState(null);
  const [balanceReport, setBalanceReport] = useState(null);
  const [summaryReport, setSummaryReport] = useState(null);

  useEffect(() => {
    const fetchReports = async () => {
      if (!user?._id) return;

      try {
        setLoading(true);
        
        // Fetch all reports in parallel
        const [transactions, balance, summary] = await Promise.all([
          ReportingAPI.getTransactionReport(user._id),
          ReportingAPI.getBalanceReport(user._id),
          ReportingAPI.getSummaryReport(user._id)
        ]);

        console.log('Raw Balance Report Response:', balance); // Debug log
        setTransactionReport(transactions);
        setBalanceReport(balance);
        setSummaryReport(summary);
      } catch (error) {
        // console.error('Error fetching reports:', error);
        // toast.error('Failed to load reports');
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
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
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Transaction Reports</h2>
        <button 
          className="btn btn-primary"
          onClick={() => navigate('/dashboard')}
        >
          <i className="bi bi-arrow-left me-2"></i>
          Back to Dashboard
        </button>
      </div>
      
      {/* Summary Report */}
      {summaryReport ? (
        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <h3 className="card-title text-primary mb-4">Summary</h3>
            <div className="row">
              <div className="col-md-4">
                <div className="p-3 border rounded">
                  <p className="mb-1 text-muted">Total Transactions</p>
                  <h4 className="text-primary">{summaryReport.total_transactions}</h4>
                </div>
              </div>
              <div className="col-md-4">
                <div className="p-3 border rounded">
                  <p className="mb-1 text-muted">Total Sent</p>
                  <h4 className="text-danger">${summaryReport.total_amount_sent?.toFixed(2) || '0.00'}</h4>
                </div>
              </div>
              <div className="col-md-4">
                <div className="p-3 border rounded">
                  <p className="mb-1 text-muted">Total Received</p>
                  <h4 className="text-success">${summaryReport.total_amount_received?.toFixed(2) || '0.00'}</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="alert alert-warning">Summary report not available</div>
      )}

      {/* Balance Report */}
      {balanceReport ? (
        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <h3 className="card-title text-primary mb-4">Balance History</h3>
            <div className="row mb-4">
              <div className="col-md-6">
                <div className="p-3 border rounded">
                  <p className="mb-1 text-muted">Current Balance</p>
                  <h4 className="text-primary">${balanceReport.current_balance?.toFixed(2) || '0.00'}</h4>
                </div>
              </div>
            </div>
            <div className="table-responsive">
              <table className="table table-hover">
                <thead className="table-light">
                  <tr>
                    <th>Date</th>
                    <th>Balance</th>
                    <th>Transaction ID</th>
                  </tr>
                </thead>
                <tbody>
                  {balanceReport.balance_history?.map((entry, index) => (
                    <tr key={entry.transaction_id}>
                      <td>{new Date(entry.timestamp).toLocaleString()}</td>
                      <td className="text-primary">${entry.balance?.toFixed(2) || '0.00'}</td>
                      <td className="text-muted small">{entry.transaction_id}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="alert alert-warning">Balance history not available</div>
      )}

      {/* Transaction Report */}
      {transactionReport ? (
        <div className="card shadow-sm">
          <div className="card-body">
            <h3 className="card-title text-primary mb-4">Recent Transactions</h3>
            <div className="table-responsive">
              <table className="table table-hover">
                <thead className="table-light">
                  <tr>
                    <th>Date</th>
                    <th>Type</th>
                    <th>Amount</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  {transactionReport.transactions?.map((transaction) => (
                    <tr key={transaction._id}>
                      <td>{new Date(transaction.timestamp).toLocaleDateString()}</td>
                      <td>{transaction.sender_id === user._id ? 'Sent' : 'Received'}</td>
                      <td className={transaction.sender_id === user._id ? 'text-danger' : 'text-success'}>
                        {transaction.sender_id === user._id ? '-' : '+'}${transaction.amount?.toFixed(2) || '0.00'}
                      </td>
                      <td>{transaction.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="alert alert-warning">Transaction history not available</div>
      )}
    </div>
  );
};

export default Reports; 