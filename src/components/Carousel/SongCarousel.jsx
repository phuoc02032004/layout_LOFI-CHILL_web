import React, { useState, useRef, useEffect } from 'react';
import { GrNext } from "react-icons/gr";
import { GrPrevious } from "react-icons/gr";
import "./SongCarousel.css";
import { useNavigate, Link } from 'react-router-dom';

function SongCarousel({ songs }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const trackRef = useRef(null);
  const carouselRef = useRef(null);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + songs.length) % songs.length);
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % songs.length);
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


  return (
    <div className="song-carousel" ref={carouselRef}>
      <button className="carousel-button prev" onClick={handlePrev}>
        <GrPrevious />
      </button>
      <div className="song-track-container">
        <div className="song-track" ref={trackRef}>
          {songs.map((song) => (
               <Link
               to = {`/SongPage/${song.id}`}
               key = {song.id}
               className='song-item' 
               style={{ cursor: 'pointer'}}
               state={{ song: song}}
               >
              <img src={song.image} alt={song.title} />
              <div className="song-title">{song.title}</div>
          </Link>
          ))}
        </div>
      </div>
      <button className="carousel-button next" onClick={handleNext}>
        <GrNext />
      </button>
      <div className="see-all-button">
        <Link to= "/SongPage">
        <button>SEE ALL</button>
        </Link>
      </div>
    </div>
  );
}

export default SongCarousel;