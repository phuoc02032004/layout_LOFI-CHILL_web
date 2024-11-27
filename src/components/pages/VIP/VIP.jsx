import React, { useState, useEffect } from 'react';
import './VIP.css';
import { useNavigate } from 'react-router-dom';
import imageVip from '../../assets/images/imgCampfire.jpg';
import Loading from '../../Loading/Loading';

function VIP() {
  const navigate = useNavigate();
  const [isRegistered, setIsRegistered] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false); 
    }, 2000); 
  }, []);

  const handleBackHome = () => {
    navigate('/homepage');
  };

  const handleRegistration = async () => {
    setError('');

    try {
      const response = await simulateRegistration(); 
      if (response.success) {
        setIsRegistered(true);
      } else {
        setError(response.message || 'Registration failed.');
      }
    } catch (error) {
      setError('An unexpected error occurred.');
      console.error('Registration error:', error);
    }
  };

  const simulateRegistration = async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    // return { success: true, message: 'Registration successful!' };
    return navigate('/payment')
  };


  return (
    <div className='vip-container'>
    {isLoading && <Loading />}
      <button className='vip-back-button' onClick={handleBackHome}>Back</button>
      <div className='vip-all-content'>
      <div className='vip-main-content'>
        <div className='vip-package-name'>Name of VIP Package</div>
        <div className='vip-package-price'>Price of VIP Package</div>
        <div className='vip-package-description'>
          <ul>
            <li>Unlock key full function 1</li>
            <li>Unlock key full function 2</li>
            <li>Unlock key full function 3</li>
          </ul>
        </div>
        {isRegistered ? (
          <div className='vip-registration-success'>Registration successful!</div>
        ) : (
          <>
            <button className='vip-register-button' onClick={handleRegistration}>Đăng ký</button>
            {error && <div className='vip-error-message'>{error}</div>}
          </>
        )}
      </div>
      <div className='vip-main-content'>
        <div className='vip-package-name'>Name of VIP Package</div>
        <div className='vip-package-price'>Price of VIP Package</div>
        <div className='vip-package-description'>
          <ul>
            <li>Unlock key full function 1</li>
            <li>Unlock key full function 2</li>
            <li>Unlock key full function 3</li>
          </ul>
        </div>
        {isRegistered ? (
          <div className='vip-registration-success'>Registration successful!</div>
        ) : (
          <>
            <button className='vip-register-button' onClick={handleRegistration}>Đăng ký</button>
            {error && <div className='vip-error-message'>{error}</div>}
          </>
        )}
      </div>
      </div>
    </div>
  );
}

export default VIP;