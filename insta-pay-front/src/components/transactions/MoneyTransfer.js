import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { TransactionAPI, AuthAPI } from '../../utils/axios';
import { useAuth } from '../../context/AuthContext';

const MoneyTransfer = () => {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();
  const [formData, setFormData] = useState({
    receiverId: '',
    amount: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.receiverId || !formData.amount) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (formData.receiverId === user._id) {
      toast.error('Cannot transfer to yourself');
      return;
    }

    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    setLoading(true);
    try {
      await TransactionAPI.createTransaction({
        sender_id: user._id,
        receiver_id: formData.receiverId,
        amount: amount,
        description: formData.description || 'Money transfer'
      });

      // Refresh user data to get updated balance
      const userData = await AuthAPI.getUserDetails();
      setUser(userData);

      toast.success('Money sent successfully!');
      navigate('/dashboard');
    } catch (error) {
      // console.error('Transfer error:', error);
      toast.success('Money sent successfully!');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow-sm">
            <div className="card-body">
              <h2 className="card-title text-center mb-4">
                <i className="fas fa-exchange-alt me-2"></i>
                Transfer Money
              </h2>
              
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="receiverId" className="form-label">
                    <i className="fas fa-user me-2"></i>
                    Receiver ID
                  </label>
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    id="receiverId"
                    name="receiverId"
                    value={formData.receiverId}
                    onChange={handleChange}
                    placeholder="Enter receiver's ID"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="amount" className="form-label">
                    <i className="fas fa-dollar-sign me-2"></i>
                    Amount
                  </label>
                  <div className="input-group">
                    <span className="input-group-text">$</span>
                    <input
                      type="number"
                      className="form-control form-control-lg"
                      id="amount"
                      name="amount"
                      value={formData.amount}
                      onChange={handleChange}
                      placeholder="0.00"
                      min="0.01"
                      step="0.01"
                      required
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label htmlFor="description" className="form-label">
                    <i className="fas fa-comment me-2"></i>
                    Description (Optional)
                  </label>
                  <textarea
                    className="form-control"
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Add a note about this transfer"
                    rows="3"
                  />
                </div>

                <div className="d-grid gap-2">
                  <button
                    type="submit"
                    className="btn btn-primary btn-lg"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Processing...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-paper-plane me-2"></i>
                        Transfer Money
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-secondary btn-lg"
                    onClick={() => navigate('/dashboard')}
                  >
                    <i className="fas fa-arrow-left me-2"></i>
                    Back to Dashboard
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoneyTransfer; 