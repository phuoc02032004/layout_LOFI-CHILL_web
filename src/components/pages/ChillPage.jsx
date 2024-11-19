import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../Navbar/Navbar';
import NavigationBar from '../NavigationBar/NavigationBar';
import './ChillPage.css';
import videoCover from '../assets/videos/bk.mp4';
import Loading from './../Loading/Loading';
import TutorialUser from '../tutorial/TutorialUser';
import { MusicPlayerProvider } from '../Context/MusicPlayerContext';

const ChillPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [showNavigationBar, setShowNavigationBar] = useState(false);
  const [backgroundVideo, setBackgroundVideo] = useState(videoCover);
  const [showTutorial, setShowTutorial] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    const video = document.createElement('video');
    video.src = videoCover;
    video.preload = 'auto';

    video.oncanplaythrough = () => {
      setIsLoading(false);
      setTimeout(() => setShowNavigationBar(true), 100);
      setTimeout(() => setShowTutorial(true), 500);
    };

    return () => video.removeEventListener('canplaythrough', () => { });
  }, []);

  useEffect(() => {
    let timeoutId;
    const handleMouseMove = () => {
      clearTimeout(timeoutId);
      setShowNavigationBar(true);
      timeoutId = setTimeout(() => setShowNavigationBar(false), 6000);
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

  const handleCloseTutorial = () => {
    setShowTutorial(false);
  };

  return (
    <div>
      {isLoading && <Loading />}
      <Navbar />
      <MusicPlayerProvider>
        <NavigationBar showInitially={showNavigationBar} onBackgroundChange={handleBackgroundChange} />
        <video className="background-video" ref={videoRef} src={backgroundVideo} autoPlay muted loop />
        {!isLoading && showTutorial && <TutorialUser onClose={handleCloseTutorial} />}
      </MusicPlayerProvider>
    </div>
  );
};

export default ChillPage;
