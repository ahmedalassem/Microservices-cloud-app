import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8 text-center">
          <h1 className="display-4 mb-4">Welcome to InstaPay</h1>
          <p className="lead mb-5">
            Your trusted platform for instant money transfers and secure transactions.
          </p>
          
          <div className="d-flex justify-content-center gap-4">
            <button
              className="btn btn-primary btn-lg px-4"
              onClick={() => navigate('/login')}
            >
              <i className="bi bi-box-arrow-in-right me-2"></i>
              Login
            </button>
            <button
              className="btn btn-outline-primary btn-lg px-4"
              onClick={() => navigate('/signup')}
            >
              <i className="bi bi-person-plus me-2"></i>
              Sign Up
            </button>
          </div>

          <div className="mt-5">
            <h2 className="h4 mb-4">Why Choose InstaPay?</h2>
            <div className="row g-4">
              <div className="col-md-4">
                <div className="p-3">
                  <i className="bi bi-lightning-charge-fill text-primary display-4"></i>
                  <h3 className="h5 mt-3">Instant Transfers</h3>
                  <p className="text-muted">Send money instantly to anyone, anywhere</p>
                </div>
              </div>
              <div className="col-md-4">
                <div className="p-3">
                  <i className="bi bi-shield-check text-primary display-4"></i>
                  <h3 className="h5 mt-3">Secure</h3>
                  <p className="text-muted">Bank-grade security for all transactions</p>
                </div>
              </div>
              <div className="col-md-4">
                <div className="p-3">
                  <i className="bi bi-graph-up text-primary display-4"></i>
                  <h3 className="h5 mt-3">Track Everything</h3>
                  <p className="text-muted">Detailed reports and transaction history</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home; 