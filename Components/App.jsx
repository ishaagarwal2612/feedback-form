import React, { useState } from 'react';
import FeedbackForm from './FeedbackForm';
import AdminLogin from './AdminLogin';

const App = () => {
  const [adminMode, setAdminMode] = useState(false);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', flexDirection: 'column' }}>
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
    </div>
  );
};

export default App; 