import React, { useState, useRef, useEffect } from 'react';
import { GrNext, GrPrevious } from "react-icons/gr";
import "./ArtistCarousel.css";
import { Link } from 'react-router-dom'; 

function ArtistCarousel({ artists }) {
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
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        carouselRef.current.classList.add('show');
      }
    }, { rootMargin: '10px' }); 

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
    <div className="artist-carousel" ref={carouselRef}>
      <button className="carousel-button prev" onClick={handlePrev}>
        <GrPrevious />
      </button>
      <div className="artist-track-container">
        <div className="artist-track" ref={trackRef}>
          {artists.map((artist) => (
           <Link 
           to={`/ArtistPage/${artist.id}`} 
           key={artist.id} 
           className="artist-item" 
           style={{ cursor: 'pointer' }}
           state={{ artist: artist }} // Truyền dữ liệu artist vào state
         >
              <img src={artist.image} alt={artist.title} />
              <div className="artist-title">{artist.title}</div>
            </Link>
          ))}
        </div>
      </div>
      <button className="carousel-button next" onClick={handleNext}>
        <GrNext />
      </button>
      <div className="see-all-button">
        <Link to="/ArtistPage"> 
          <button>SEE ALL</button> 
        </Link>
      </div>
    </div>
  );
}

export default ArtistCarousel;