import React, { useState } from 'react';
import "./LoginForm.css";
import { FaUser } from "react-icons/fa";
import { FaLock } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../../services/auth';
import ForgotPasswordModal from '../forgotpass/ForgotPasswordModal';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [showForgotModal, setShowForgotModal] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    try {
      const response = await loginUser(
        email,
        password
      )

      navigate('/homepage');
    } catch (error) {
      console.error('Login failed:', error);

      if (error.response && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError('Có lỗi xảy ra, vui lòng thử lại!');
      }
    }
  };

  return (
    <div className='wrapper'>
      <form onSubmit={handleSubmit}>
        <h1>Login</h1>
        {error && <div className="error-message">{error}</div>}
        <div className="input-box">
          <input
            type='text'
            placeholder='Email'
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div className="icon-container">
            <FaUser className='icon' />
          </div>
        </div>
        <div className="input-box">
          <input
            type='password'
            placeholder='Password'
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="icon-container">
            <FaLock className='icon' />
          </div>
        </div>

        <div className="remember-forgot">
        <label htmlFor="">
          <input type="checkbox" /> Remember me
        </label>
        <a href="#" onClick={(e) => {
          e.preventDefault(); 
          setShowForgotModal(true);
        }}>Forgot Password?</a>
      </div>
      {showForgotModal && (
        <ForgotPasswordModal onClose={() => setShowForgotModal(false)} />
      )}
        <button type='submit'>Login</button>

        <div className="register-link">
          <p>Don't have an account?
            <a onClick={() => navigate('/register')}> Register</a>
          </p>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;