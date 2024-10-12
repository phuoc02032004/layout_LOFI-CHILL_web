import React, { useRef, useEffect, useState, useCallback } from 'react';
import { getAllVisual } from '../../../services/visual';
import './Visuals.css';

const Visuals = ({ onBackgroundChange }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [visualsData, setVisualsData] = useState(() => {
    // Khởi tạo từ cache nếu có trong localStorage
    const cachedVisuals = localStorage.getItem('visualsData');
    return cachedVisuals ? JSON.parse(cachedVisuals) : [];
  });

  // Gọi API chỉ khi không có dữ liệu trong localStorage
  useEffect(() => {
    const fetchVisuals = async () => {
      try {
        const data = await getAllVisual();
        setVisualsData(data);
        localStorage.setItem('visualsData', JSON.stringify(data));  // Lưu vào localStorage
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
          className="background-item"
          onClick={() => handleBackgroundChange(background.urlVideo)}
        >
          <img src={background.urlImg} alt={background.title} className="background-image" />
          <span className="background-name">{background.title}</span>
        </div>
      ))}
    </div>
  );
};

export default Visuals;
