import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../Navbar/Navbar';
import "./HomePage.css";
import { useNavigate } from 'react-router-dom';
import videoCover from '../assets/videos/bk.mp4';
import Loading from './../Loading/Loading';
import SongCarousel from '../Carousel/SongCarousel';
import Footer from '../footer/Footer'; 
import { GrNext } from "react-icons/gr";
import { GrPrevious } from "react-icons/gr";

import chillhopRadio from '../assets/images/chillhopradio.jpg';
import lateNightVibes from '../assets/images/latenight.jpg';
import chillStudyBeats from '../assets/images/chillstudy.jpg';
import sunnyDay from '../assets/images/sunnyday.jpg';
import essentials from '../assets/images/essentials.jpg';

import winter from '../assets/images/winter.jpg'
import slinky from '../assets/images/slinky.jpg'
import night from '../assets/images/night.jpg'
import meadow from '../assets/images/Meadow.jpg'
import morning from '../assets/images/goodmorning.jpg'

export default function HomePage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  const images = [
    { src: chillhopRadio, title: 'CHILLHOP RADIO' },
    { src: lateNightVibes, title: 'LATE NIGHT VIBES' },
    { src: chillStudyBeats, title: 'CHILL STUDY BEATS' },
    { src: sunnyDay, title: 'SUNNY DAY' },
    { src: essentials, title: 'CHILL HOP ESSENTIALS' },
    { src: chillhopRadio, title: 'CHILLHOP RADIO' }, 
    { src: lateNightVibes, title: 'LATE NIGHT VIBES' }, 
  ];

  const songs = [
    { title: 'Winter Chill', image: winter },
    { title: 'Slinky Groove', image: slinky },
    { title: 'Night Vibes', image: night },
    { title: 'Meadow Peace', image: meadow },
    { title: 'Good Morning', image: morning },
    { title: 'Winter Chill', image: winter },
    { title: 'Slinky Groove', image: slinky },
    { title: 'Night Vibes', image: night },
    { title: 'Meadow Peace', image: meadow },
  ];

  const imageWidth = 25; 

  const handleChillClick = () => {
    navigate('/chillpage');
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const introduceRef = useRef(null);
  const carouselRef = useRef(null);

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

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        carouselRef.current.classList.add('show');
        introduceRef.current.classList.add('slide-out');
      }
    });

    if (carouselRef.current) {
      observer.observe(carouselRef.current);
    }

    return () => {
      if (carouselRef.current) {
        observer.unobserve(carouselRef.current);
      }
    };
  }, []);

  return (
    <div>
      {isLoading && <Loading />}
      <Navbar />
      <div className="introduce" ref={introduceRef}>
        <p>
          {' '}
          Welcome to<br /> LOFI - CHILL{' '}
        </p>
        <div>
          Choose your preferred station, visual, and sound effects to match
          your mood, and save your settings for easy access anytime you need to
          get back in the zone.
        </div>
        <button onClick={handleChillClick} className="btn-start">
          {' '}
          START LISTENING{' '}
        </button>
      </div>
      <div className="name">New Preset</div>
      <div className="image-carousel" ref={carouselRef}>
        <button className="carousel-button prev" onClick={handlePrev}>
          <GrPrevious />
        </button>
        <div className="image-container">
          <div 
            className="image-track"
            style={{ transform: `translateX(-${currentIndex * imageWidth}%)` }}
          >
            {images.map((image, index) => (
              <div className="image-item" key={index}>
                <img src={image.src} alt={image.title} />
                <div className="image-title">{image.title}</div>
              </div>
            ))}
          </div>
        </div>
        <button className="carousel-button next" onClick={handleNext}>
          <GrNext />
        </button>
      </div>
      <div className="name">New Song</div>
      <SongCarousel songs={songs} />
      
      <Footer /> 
      
      <video src={videoCover} autoPlay muted loop></video>
    </div>
  );
}