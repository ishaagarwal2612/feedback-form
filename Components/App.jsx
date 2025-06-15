import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { supabase } from '../config/supabaseClient';
import FeedbackForm from './FeedbackForm';
import AdminLogin from './AdminLogin';
import Login from './pages/login';
import Signup from './pages/signup';

// Protected Route component to check authentication
const ProtectedRoute = ({ children }) => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const App = () => {
  const [adminMode, setAdminMode] = useState(false);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <Router>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', flexDirection: 'column' }}>
        {/* Check session instead of token */}
        {supabase.auth.getSession() && (
          <nav style={{ 
            position: 'absolute', 
            top: '20px', 
            right: '20px'
          }}>
            <button 
              onClick={handleLogout}
              style={{
                background: 'none',
                border: 'none',
                color: '#4299e1',
                cursor: 'pointer',
                fontSize: '16px',
                padding: '8px',
                textDecoration: 'underline'
              }}
            >
              Logout
            </button>
          </nav>
        )}

        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={
            <ProtectedRoute>
              {adminMode ? (
                <>
                  <AdminLogin />
                  <button style={{ marginTop: 20 }} onClick={() => setAdminMode(false)}>
                    Back to Feedback Form
                  </button>
                </>
              ) : (
                <>
                  <FeedbackForm />
                  <button style={{ marginTop: 20 }} onClick={() => setAdminMode(true)}>
                    Admin Login
                  </button>
                </>
              )}
            </ProtectedRoute>
          } />
        </Routes>
      </div>
    </Router>
  );
};

export default App;