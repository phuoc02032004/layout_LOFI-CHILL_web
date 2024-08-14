import React, { useState } from 'react';
import "./RegisterForm.css";
import { FaUser, FaLock } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const RegisterForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [verificationCode, setVerificationCode] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3002/users/register', formData);
      setMessage(response.data.message);
      setIsRegistered(true);
    } catch (err) {
      setMessage(err.response.data.error);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3002/users/verify', {
        email: formData.email,
        code: verificationCode
      });
      setMessage(response.data.message);
      if (response.data.message === 'Email verified successfully!') {
        navigate('/login');
      }
    } catch (err) {
      setMessage(err.response.data.error);
    }
  };

  const handleLoginClick = () => {
    navigate('/');
  };

  return (
    <div className='wrapper'>
      <form onSubmit={isRegistered ? handleVerify : handleRegister}>
        <h1>{isRegistered ? 'Verify Email' : 'Register'}</h1>
        {message && <p>{message}</p>}
        {!isRegistered ? (
          <>
            <div className="input-box">
              <input
                type='text'
                name='username'
                placeholder='Username'
                required
                value={formData.username}
                onChange={handleChange}
              />
              <div className="icon-container">
                <FaUser className='icon' />
              </div>
            </div>
            <div className="input-box">
              <input
                type='email'
                name='email'
                placeholder='Email'
                required
                value={formData.email}
                onChange={handleChange}
              />
              <div className="icon-container">
                <MdEmail className='icon' />
              </div>
            </div>
            <div className="input-box">
              <input
                type='password'
                name='password'
                placeholder='Password'
                required
                value={formData.password}
                onChange={handleChange}
              />
              <div className="icon-container">
                <FaLock className='icon' />
              </div>
            </div>
            <div className="input-box">
              <input
                type='password'
                name='confirmPassword'
                placeholder='Confirm Password'
                required
                value={formData.confirmPassword}
                onChange={handleChange}
              />
              <div className="icon-container">
                <RiLockPasswordFill className='icon' />
              </div>
            </div>
            <button type='submit'>Register</button>
          </>
        ) : (
          <>
            <div className="input-box">
              <input
                type='text'
                name='verificationCode'
                placeholder='Enter verification code'
                required
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
              />
            </div>
            <button type='submit'>Verify</button>
          </>
        )}
        <div className="login-link">
          <p>Already have an account? <a href="/" onClick={handleLoginClick}>Login</a></p>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;
