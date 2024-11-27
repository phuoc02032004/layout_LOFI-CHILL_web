import React, { useState } from 'react';
import './ForgotPasswordModal.css';

const ForgotPasswordModal = ({ onClose }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);


  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setError(''); 
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError('Please enter your email address.');
      return;
    }

    try {
      const response = await fetch('http://localhost:3002/api/v1/auth/forgetPassword', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.message || 'Failed to send password reset email.');
      } else {
        setSubmitted(true);
        setError('');
      }
    } catch (err) {
      setError('An error occurred. Please try again later.');
      console.error(err);
    }
  };

  return (
    <div className="modal-overlay-forgot">
      <div className="modal-content-forgot">
        <div className="modal-close-forgot" onClick={onClose}>
          ×
        </div>
        {submitted ? (
          <p>A password reset email has been sent. Please check your inbox.</p>
        ) : (
          <>
            <div>
              {error && <p className="error-forgot">{error}</p>}
              <input
                className='input-modal'
                type='text'
                placeholder='Email'
                required
                value={email}
                onChange={handleEmailChange}
              />
              <button onClick={handleForgotPassword}>Forgot Password</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordModal;