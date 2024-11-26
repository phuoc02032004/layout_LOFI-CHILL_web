import React, { useRef, useEffect, useState, useCallback } from 'react';
import { getAllVisual } from '../../../services/visual';
import './Visuals.css';
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';

const Visuals = ({ onBackgroundChange }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [visualsData, setVisualsData] = useState(() => {
    const cachedVisuals = localStorage.getItem('visualsData');
    return cachedVisuals ? JSON.parse(cachedVisuals) : [];
  });

  const [isVip, setIsVip] = useState(false);

  useEffect(() => {
    const fetchVisuals = async () => {
      try {
        const data = await getAllVisual();
        setVisualsData(data);
        localStorage.setItem('visualsData', JSON.stringify(data));
      } catch (error) {
        console.error('Error loading visuals:', error);
      }
    };

    if (visualsData.length === 0) {
      fetchVisuals();
    }
  }, [visualsData]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    const updateBackground = () => {
      if (selectedVideo && videoRef.current) {
        context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        document.body.style.backgroundImage = `url(${canvas.toDataURL()})`;
      }

      requestAnimationFrame(updateBackground);
    };

    updateBackground();

    return () => {
      cancelAnimationFrame(updateBackground);
    };
  }, [selectedVideo]);

  useEffect(() => {
    const accessToken = Cookies.get('accessToken');
    if (accessToken) {
      const decodedToken = jwtDecode(accessToken);
      setIsVip(decodedToken.isVip);
    }
  }, []);

  const handleBackgroundChange = useCallback((videoSrc) => {
    setSelectedVideo(videoSrc);
    onBackgroundChange(videoSrc);
  }, [onBackgroundChange]);

  return (
    <div className="backgrounds-container">
      <video ref={videoRef} src={selectedVideo} loop muted autoPlay crossOrigin="anonymous" style={{ display: 'none' }} />
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {visualsData.map((background) => (
        <div
          key={background.id}
          className={`background-item ${background.vip ? 'background-vip' : ''}`}
          onClick={() => {
            if (!background.vip || isVip) {
              handleBackgroundChange(background.urlVideo);
            } else {
              alert('Visual này chỉ dành cho người dùng VIP!');
            }
          }}
        >
          <img src={background.urlImg} alt={background.title} className="background-image" />
          <div className="vip-label">{background.vip ? 'VIP' : ''}</div>
          <span className="background-name">{background.title}</span>
        </div>
      ))}
    </div>
  );
};

export default Visuals;
