import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { signup } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      setLoading(false);
      return;
    }
    
    try {
      const { confirmPassword, ...userData } = formData;
      console.log('Attempting signup with data:', userData);
      const result = await signup(userData);
      console.log('Signup result:', result);
      
      if (result.success) {
        toast.success('Account created successfully!');
        navigate('/dashboard');
      } else {
        toast.error(result.error || 'Signup failed. Please try again.');
      }
    } catch (error) {
      console.error('Signup error:', error);
      if (error.code === 'ECONNABORTED') {
        toast.error('Request timed out. Please try again.');
      } else if (error.code === 'ERR_NETWORK') {
        toast.error('Cannot connect to the server. Please check your internet connection.');
      } else {
        toast.error(error.response?.data?.error || 'An error occurred during signup');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4">
          <div className="card shadow">
            <div className="card-body p-4">
              <h2 className="text-center mb-4">Sign Up</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">Name</label>
          <input
            type="text"
                    className="form-control"
                    id="name"
                    placeholder="Enter your name"
            name="name"
                    value={formData.name}
                    onChange={handleChange}
            required
            disabled={loading}
          />
        </div>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email</label>
          <input
            type="email"
                    className="form-control"
                    id="email"
                    placeholder="Enter your email"
            name="email"
                    value={formData.email}
                    onChange={handleChange}
            required
            disabled={loading}
          />
        </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">Password</label>
          <input
            type="password"
                    className="form-control"
                    id="password"
                    placeholder="Enter your password"
            name="password"
                    value={formData.password}
                    onChange={handleChange}
            required
            disabled={loading}
          />
        </div>
                <div className="mb-4">
                  <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
          <input
            type="password"
                    className="form-control"
                    id="confirmPassword"
                    placeholder="Confirm your password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
            required
            disabled={loading}
          />
        </div>
                <div className="d-grid">
        <button 
          type="submit" 
                    className="btn btn-primary btn-lg"
          disabled={loading}
        >
                    {loading ? (
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    ) : null}
                    {loading ? 'Creating account...' : 'Sign Up'}
        </button>
                </div>
      </form>
              <div className="text-center mt-4">
                <p className="mb-0">
                  Already have an account?{' '}
                  <a href="/login" className="text-decoration-none">Login</a>
      </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup; 