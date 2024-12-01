import React, { useState, useEffect } from 'react';
import './VIP.css';
import { useNavigate } from 'react-router-dom';
import imageVip from '../../assets/images/imgCampfire.jpg';
import Loading from '../../Loading/Loading';
import { createPayment } from '../../../services/zalopay';

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
      const response = await createPayment();
      if (response && response.data && response.data.order_url) {
        window.location.href = response.data.order_url;
      } else {
        setError('Failed to retrieve payment URL.');
      }
    } catch (error) {
      setError('An unexpected error occurred.');
      console.error('Registration error:', error);
    }
  };

  return (
    <div className='vip-container'>
      {isLoading && <Loading />}
      <button className='vip-back-button' onClick={handleBackHome}>Back</button>
      <div className='vip-all-content'>
        <div className='vip-main-content'>
          <div className='vip-package-name'>VIP MEMBER</div>
          <div className='vip-package-price'>100.000VNĐ</div>
          <div className='vip-package-description'>
            <ul>
              <li>Unlock Full Preset</li>
              <li>Unlock Full Visual</li>
              <li>Unlock Full Playlist</li>
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