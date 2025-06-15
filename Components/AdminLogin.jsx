import React, { useState, useEffect } from 'react';
import { supabase } from '../config/supabaseClient';
import '../style/AdminPanel.css';

const AdminLogin = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    checkUser();
    fetchFeedbacks();
  }, []);

  const checkUser = async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;
      setCurrentUser(user);
    } catch (error) {
      console.error('Error checking user:', error);
    }
  };

  const fetchFeedbacks = async () => {
    try {
      // First verify if user is authenticated
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError) {
        throw new Error('Authentication error. Please log in again.');
      }

      if (!user) {
        throw new Error('No authenticated user found.');
      }

      console.log('Fetching feedbacks as user:', user.email); // Debug log

      const { data, error } = await supabase
        .from('feedbacks')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase error:', error); // Debug log
        throw error;
      }

      console.log('Fetched feedbacks:', data); // Debug log
      setFeedbacks(data || []);
    } catch (error) {
      const errorMessage = error.message || 'Error fetching feedbacks. Please try again later.';
      setError(errorMessage);
      console.error('Detailed error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-panel">
        <div className="empty-state">
          <p>Loading feedbacks...</p>
        </div>
      </div>
    );
  }

  // Show current user info in error state for debugging
  if (error) {
    return (
      <div className="admin-panel">
        <div className="error-message">
          <p>{error}</p>
          {currentUser && (
            <p>Logged in as: {currentUser.email}</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="admin-panel">
      <h2>Admin Panel - Feedback Responses</h2>
      {currentUser && (
        <p className="admin-info">Logged in as: {currentUser.email}</p>
      )}
      {feedbacks.length === 0 ? (
        <div className="empty-state">
          <p>No feedback submissions yet.</p>
        </div>
      ) : (
        <div className="feedback-list">
          {feedbacks.map((feedback) => (
            <div key={feedback.id} className="feedback-item">
              <h3>{feedback.name}</h3>
              <p><strong>Email:</strong> {feedback.email}</p>
              <p><strong>Message:</strong> {feedback.message}</p>
              <div className="feedback-meta">
                <span>Submitted {new Date(feedback.created_at).toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminLogin;