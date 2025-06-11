import React, { useState } from 'react';
import '../style/FeedbackForm.css';

const API_URL = 'http://localhost:4000/api';
const ADMIN_CREDENTIALS = { username: 'admin', password: 'admin123' };

const AdminLogin = () => {
  const [form, setForm] = useState({ username: '', password: '' });
  const [loggedIn, setLoggedIn] = useState(false);
  const [feedbacks, setFeedbacks] = useState([]);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (
      form.username === ADMIN_CREDENTIALS.username &&
      form.password === ADMIN_CREDENTIALS.password
    ) {
      setLoggedIn(true);
      setError('');
      // Fetch feedbacks
      const res = await fetch(`${API_URL}/feedbacks`);
      const data = await res.json();
      setFeedbacks(data);
    } else {
      setError('Invalid credentials');
    }
  };

  if (!loggedIn) {
    return (
      <form className="feedback-form" onSubmit={handleLogin} style={{ maxWidth: 350 }}>
        <h2>Admin Login</h2>
        <label>
          Username:
          <input
            type="text"
            name="username"
            value={form.username}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Password:
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
          />
        </label>
        <button type="submit">Login</button>
        {error && <p className="error-message">{error}</p>}
      </form>
    );
  }

  return (
    <div style={{ marginTop: '2rem' }}>
      <h3>All Feedback Responses</h3>
      {feedbacks.length === 0 ? (
        <p>No feedbacks yet.</p>
      ) : (
        <div className="feedback-table-wrapper">
          <table className="feedback-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Message</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {feedbacks.map((fb, idx) => (
                <tr key={idx}>
                  <td>{fb.name}</td>
                  <td>{fb.email}</td>
                  <td>{fb.message}</td>
                  <td>{new Date(fb.date).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminLogin; 