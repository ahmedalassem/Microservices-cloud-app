import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, isAuthenticated } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Don't show navbar on root path or when not authenticated
  if (location.pathname === '/' || !isAuthenticated) {
    return null;
  }

  return (
    <nav className="navbar navbar-expand-lg" style={{ 
      backgroundColor: '#6f42c1',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <div className="container">
        <span className="navbar-brand text-white fw-bold" style={{ 
          fontSize: '1.5rem',
          letterSpacing: '0.5px'
        }}>
          Insta-Pay
        </span>
        <div className="d-flex align-items-center">
          <button 
            className="btn btn-outline-light rounded-pill px-4" 
            onClick={handleLogout}
            style={{ 
              borderWidth: '2px',
              transition: 'all 0.3s ease',
              fontWeight: '500'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = 'white';
              e.currentTarget.style.color = '#6f42c1';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = 'white';
            }}
          >
            <i className="bi bi-box-arrow-right me-2"></i>
                    Logout
                  </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 