import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { transactionService } from '../../utils/axios';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const Transactions = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!user?._id) return;

      try {
        setLoading(true);
        const response = await transactionService.get(`/api/transactions/${user._id}/`);
        setTransactions(response.data);
      } catch (error) {
        console.error('Error fetching transactions:', error);
        toast.error('Failed to load transactions');
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
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
    <div className="container mt-4" style={{ maxWidth: '1200px' }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 style={{ 
          color: '#6f42c1',
          fontWeight: '600',
          fontSize: '1.75rem',
          margin: 0
        }}>
          Transaction History
        </h2>
        <button 
          style={{ 
            backgroundColor: '#6f42c1',
            color: 'white',
            border: 'none',
            borderRadius: '50px',
            padding: '0.5rem 1.5rem',
            transition: 'all 0.3s ease',
            fontWeight: '500',
            display: 'flex',
            alignItems: 'center'
          }}
          onClick={() => navigate('/dashboard')}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = '#5a32a3';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = '#6f42c1';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <i className="bi bi-arrow-left me-2"></i>
          Back to Dashboard
        </button>
      </div>

      <div style={{ 
        backgroundColor: 'white',
        borderRadius: '15px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
        overflow: 'hidden'
      }}>
        <div className="table-responsive">
          <table className="table mb-0">
            <thead style={{ 
              backgroundColor: '#f8f9fa',
              borderBottom: '2px solid #e9ecef'
            }}>
              <tr>
                <th style={{ 
                  color: '#6c757d',
                  fontWeight: '500',
                  textTransform: 'uppercase',
                  fontSize: '0.85rem',
                  letterSpacing: '0.5px',
                  padding: '1rem',
                  border: 'none'
                }}>Date</th>
                <th style={{ 
                  color: '#6c757d',
                  fontWeight: '500',
                  textTransform: 'uppercase',
                  fontSize: '0.85rem',
                  letterSpacing: '0.5px',
                  padding: '1rem',
                  border: 'none'
                }}>Type</th>
                <th style={{ 
                  color: '#6c757d',
                  fontWeight: '500',
                  textTransform: 'uppercase',
                  fontSize: '0.85rem',
                  letterSpacing: '0.5px',
                  padding: '1rem',
                  border: 'none'
                }}>Amount</th>
                <th style={{ 
                  color: '#6c757d',
                  fontWeight: '500',
                  textTransform: 'uppercase',
                  fontSize: '0.85rem',
                  letterSpacing: '0.5px',
                  padding: '1rem',
                  border: 'none'
                }}>Description</th>
                <th style={{ 
                  color: '#6c757d',
                  fontWeight: '500',
                  textTransform: 'uppercase',
                  fontSize: '0.85rem',
                  letterSpacing: '0.5px',
                  padding: '1rem',
                  border: 'none'
                }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length > 0 ? (
                transactions.map((transaction) => (
                  <tr key={transaction._id} style={{ 
                    transition: 'all 0.2s ease',
                    borderBottom: '1px solid #f8f9fa'
                  }}>
                    <td style={{ padding: '1rem', border: 'none' }}>
                      {new Date(transaction.timestamp).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '1rem', border: 'none' }}>
                      <span style={{ 
                        padding: '0.5rem 1rem',
                        borderRadius: '50px',
                        fontWeight: '500',
                        backgroundColor: transaction.sender_id === user._id ? '#dc3545' : '#198754',
                        color: 'white'
                      }}>
                        {transaction.sender_id === user._id ? 'Sent' : 'Received'}
                      </span>
                    </td>
                    <td style={{ 
                      padding: '1rem',
                      border: 'none',
                      fontWeight: '600',
                      color: transaction.sender_id === user._id ? '#dc3545' : '#198754'
                    }}>
                      {transaction.sender_id === user._id ? '-' : '+'}${transaction.amount?.toFixed(2) || '0.00'}
                    </td>
                    <td style={{ padding: '1rem', border: 'none' }}>
                      {transaction.description}
                    </td>
                    <td style={{ padding: '1rem', border: 'none' }}>
                      <span style={{ 
                        padding: '0.5rem 1rem',
                        borderRadius: '50px',
                        fontWeight: '500',
                        backgroundColor: transaction.status === 'completed' ? '#198754' : '#ffc107',
                        color: 'white'
                      }}>
                        {transaction.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={{ 
                    textAlign: 'center',
                    padding: '3rem 0',
                    border: 'none'
                  }}>
                    <div>
                      <i className="bi bi-inbox" style={{ 
                        fontSize: '3rem',
                        color: '#6f42c1',
                        marginBottom: '1rem'
                      }}></i>
                      <p style={{ 
                        color: '#6c757d',
                        fontSize: '1.1rem',
                        margin: 0
                      }}>No transactions found</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Transactions;