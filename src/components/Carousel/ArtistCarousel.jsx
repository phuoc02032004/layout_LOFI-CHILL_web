import React, { useState, useRef, useEffect } from 'react';
import { GrNext } from "react-icons/gr";
import { GrPrevious } from "react-icons/gr";
import "./ArtistCarousel.css";
import { useNavigate } from 'react-router-dom';

function ArtistCarousel({ artists }) {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const trackRef = useRef(null);
  const carouselRef = useRef(null);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + artists.length) % artists.length);
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % artists.length);
  };

  useEffect(() => {
    if (trackRef.current) {
      trackRef.current.style.transform = `translateX(-${currentIndex * 25}%)`;
    }
  }, [currentIndex]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        carouselRef.current.classList.add('show');
      }
    }, { rootMargin: '10px' }); 

    const observedElement = carouselRef.current;

    if (observedElement) {
      observer.observe(observedElement);
    }

    return () => {
      if (observedElement) {
        observer.unobserve(observedElement);
      }
    };
  }, []);

  const handleArtPageClick = () => {
    navigate('/ArtistPage');
  };

  return (
    <div className="artist-carousel" ref={carouselRef}>
      <button className="carousel-button prev" onClick={handlePrev}>
        <GrPrevious />
      </button>
      <div className="artist-track-container">
        <div className="artist-track" ref={trackRef}>
          {artists.map((artist, index) => (
            <div className="artist-item" key={index}>
              <img src={artist.image} alt={artist.title} />
              <div className="artist-title">{artist.title}</div>
            </div>
          ))}
        </div>
      </div>
      <button className="carousel-button next" onClick={handleNext}>
        <GrNext />
      </button>
      <div className="see-all-button">
        <button onClick={handleArtPageClick}>SEE ALL</button>
      </div>
    </div>
  );
}

export default ArtistCarousel;