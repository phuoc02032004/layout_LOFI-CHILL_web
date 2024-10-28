import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../Navbar/Navbar';
import "./HomePage.css";
import { useNavigate } from 'react-router-dom';
import videoCover from '../assets/videos/bk.mp4';
import Loading from './../Loading/Loading';
import SongCarousel from '../Carousel/SongCarousel';
import ArtistCarousel from '../Carousel/ArtistCarousel';
import { getNewMusic } from '../../services/song';
import Footer from '../footer/Footer';
import { GrNext } from "react-icons/gr";
import { GrPrevious } from "react-icons/gr";
import { getAllArtist } from '../../services/artist'; // Import API getAllArtist


import chillhopRadio from '../assets/images/chillhopradio.jpg';
import lateNightVibes from '../assets/images/latenight.jpg';
import chillStudyBeats from '../assets/images/chillstudy.jpg';
import sunnyDay from '../assets/images/sunnyday.jpg';
import essentials from '../assets/images/essentials.jpg';


export default function HomePage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [songs, setSongs] = useState([]);
  const [artists, setArtists] = useState([]); // Khởi tạo state rỗng để lưu danh sách nghệ sĩ từ API
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

  // Gọi API getAllArtist để lấy danh sách nghệ sĩ
  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const artistData = await getAllArtist();
        setArtists(artistData); // Cập nhật danh sách nghệ sĩ
      } catch (error) {
        console.error('Error fetching artists:', error);
      }
    };

    fetchArtists();
  }, []);

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
    const carouselElement = carouselRef.current; // Lưu giá trị của carouselRef.current vào một biến cục bộ
    
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        carouselElement.classList.add('show');
        introduceRef.current.classList.add('slide-out');
      }
    });
  
    if (carouselElement) {
      observer.observe(carouselElement);
    }
  
    return () => {
      if (carouselElement) {
        observer.unobserve(carouselElement); // Dùng biến cục bộ thay vì carouselRef.current
      }
    };
  }, []);
  

  useEffect(() => {
    const fetchMusic = async () => {
      try {
        const accessToken = Cookies.get('accessToken'); // Không cần await
        if (!accessToken) {
          console.error('No access token found in cookie!');
          return;
        }
        const musicData = await getNewMusic(accessToken);
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
      {/* Hiển thị danh sách nghệ sĩ từ API */}
      <ArtistCarousel artists={artists} />

      <Footer />

      <video src={videoCover} autoPlay muted loop></video>
    </div>
  );
}

