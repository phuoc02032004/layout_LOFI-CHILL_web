import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../Navbar/Navbar';
import NavigationBar from '../NavigationBar/NavigationBar';
import './ChillPage.css';
import videoCover from '../assets/videos/bk.mp4';
import Loading from './../Loading/Loading';

export default function ChillPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [showNavigationBar, setShowNavigationBar] = useState(false);
  const [backgroundVideo, setBackgroundVideo] = useState(videoCover);
  const videoRef = useRef(null);

  useEffect(() => {
    const video = document.createElement('video');
    video.src = videoCover;
    video.preload = 'auto';

    video.oncanplaythrough = () => {
      setIsLoading(false);
      setTimeout(() => {
        setShowNavigationBar(true);
      }, 100);
    };

    return () => {
      video.removeEventListener('canplaythrough', () => {});
    };
  }, []);

  useEffect(() => {
    let timeoutId;
    const handleMouseMove = () => {
      clearTimeout(timeoutId);
      setShowNavigationBar(true);
      timeoutId = setTimeout(() => {
        setShowNavigationBar(false);
      }, 6000);
    };

    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(timeoutId);
    };
  }, [showNavigationBar]);

  const handleBackgroundChange = (videoSrc) => {
    setBackgroundVideo(videoSrc);
  };

  return (
    <div>
      {isLoading && <Loading />}
      <Navbar />
      <NavigationBar 
        showInitially={showNavigationBar} 
        onBackgroundChange={handleBackgroundChange} 
      />
      <video  className="background-video" ref={videoRef} src={backgroundVideo} autoPlay muted loop></video>
    </div>
  );
}