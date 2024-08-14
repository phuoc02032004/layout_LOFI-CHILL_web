import React, { useState, useEffect } from 'react';
import Navbar from '../Navbar/Navbar';
import NavigationBar from '../NavigationBar/NavigationBar';
import './ChillPage.css';
import videoCover from '../assets/videos/bk.mp4';
import Loading from './../Loading/Loading'; 

export default function ChillPage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const video = document.createElement('video');
    video.src = videoCover;
    video.preload = 'auto';

    video.oncanplaythrough = () => {
      setIsLoading(false);
    };

    return () => {
      video.removeEventListener('canplaythrough', () => {});
    };
  }, []);

  return (
    <div>
      {isLoading && <Loading />} 
      <Navbar />
      <NavigationBar />
      <video src={videoCover} autoPlay muted loop></video>
    </div>
  );
}