import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import { AuthProvider, useAuth } from './context/AuthContext';

// Components
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import Dashboard from './components/Dashboard';
import Navbar from './components/layout/Navbar';
import PrivateRoute from './components/auth/PrivateRoute';
import Home from './pages/Home';
import Transactions from './pages/Transactions';
import MoneyTransfer from './components/transactions/MoneyTransfer';
import Reports from './components/reports/Reports';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" />;
  }
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/transactions"
              element={
                <ProtectedRoute>
                  <Transactions />
                </ProtectedRoute>
              }
            />
            <Route
              path="/transfer"
              element={
                <ProtectedRoute>
                  <MoneyTransfer />
                </ProtectedRoute>
              }
            />
            <Route
              path="/reports"
              element={
                <ProtectedRoute>
                  <Reports />
                </ProtectedRoute>
              }
            />
          </Routes>
          <ToastContainer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
