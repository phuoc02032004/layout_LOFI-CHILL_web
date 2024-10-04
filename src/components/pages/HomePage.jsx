import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../Navbar/Navbar';
import "./HomePage.css";
import { useNavigate } from 'react-router-dom';
import videoCover from '../assets/videos/bk.mp4';
import Loading from './../Loading/Loading';
import SongCarousel from '../Carousel/SongCarousel';
import ArtistCarousel from '../Carousel/ArtistCarousel';
import Footer from '../footer/Footer';
import { GrNext } from "react-icons/gr";
import { GrPrevious } from "react-icons/gr";
import { getNewMusic } from '../../services/music.js';

import chillhopRadio from '../assets/images/chillhopradio.jpg';
import lateNightVibes from '../assets/images/latenight.jpg';
import chillStudyBeats from '../assets/images/chillstudy.jpg';
import sunnyDay from '../assets/images/sunnyday.jpg';
import essentials from '../assets/images/essentials.jpg';

// import winter from '../assets/images/winter.jpg'
// import slinky from '../assets/images/slinky.jpg'
// import night from '../assets/images/night.jpg'
// import meadow from '../assets/images/Meadow.jpg'
// import morning from '../assets/images/goodmorning.jpg'

import Aso from '../assets/images/Aso.jpg'
import CYGN from '../assets/images/CYGN.jpg'
import ivention_ from '../assets/images/ivention_.jpg'
import Kupla from '../assets/images/Kupla.jpg'
import Leavv from '../assets/images/Leavv.jpg'
import Makzo from '../assets/images/Makzo.png'
import MamaAiuto from '../assets/images/Mama Aiuto.jpg'
import Misha from '../assets/images/Misha.jpg'
import mommy from '../assets/images/mommy.jpg'
import PsalmTrees from '../assets/images/Psalm Trees.jpg'
import Sadtoi from '../assets/images/Sadtoi.jpg'
import SleepyFish from '../assets/images/Sleepy  Fish.jpg'

export default function HomePage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [songs, setSongs] = useState([]);
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

  // const songs = [
  //   { title: 'Winter Chill', image: winter },
  //   { title: 'Slinky Groove', image: slinky },
  //   { title: 'Night Vibes', image: night },
  //   { title: 'Meadow Peace', image: meadow },
  //   { title: 'Good Morning', image: morning },
  //   { title: 'Winter Chill', image: winter },
  //   { title: 'Slinky Groove', image: slinky },
  //   { title: 'Night Vibes', image: night },
  //   { title: 'Meadow Peace', image: meadow },
  // ];

  const [artists, setArtists] = useState([
    { title: 'Aso', image: Aso, description: 'Description 1' },
    { title: 'CYGN', image: CYGN, description: 'Description 2' },
    { title: 'ivention_', image: ivention_, description: 'Description 3' },
    { title: 'Kupla', image: Kupla, description: 'Description 4' },
    { title: 'Leavv', image: Leavv, description: 'Description 5' },
    { title: 'Makzo', image: Makzo, description: 'Description 6' },
    { title: 'Mama Aiuto', image: MamaAiuto, description: 'Description 7' },
    { title: 'Misha', image: Misha, description: 'Description 8' },
    { title: 'mommy', image: mommy, description: 'Description 9' },
    { title: 'Psalm Trees', image: PsalmTrees, description: 'Description 10' },
    { title: 'Sadtoi', image: Sadtoi, description: 'Description 11' },
    { title: 'Sleepy Fish', image: SleepyFish, description: 'Description 12' },
  ]);

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
      video.removeEventListener('canplaythrough', () => { });
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

  useEffect(() => {
    const fetchMusic = async () => {
      try {
        const musicData = await getNewMusic();
        setSongs(musicData); // Cập nhật danh sách bài hát
      } catch (error) {
        console.error('Error fetching music:', error);
      }
    };

    fetchMusic();
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
      <div className="name_a">New Song</div>
      <SongCarousel songs={songs} />

      <div className="name_a">Artist</div>
      <ArtistCarousel artists={artists} />

      <Footer />

      <video src={videoCover} autoPlay muted loop></video>
    </div>
  );
}