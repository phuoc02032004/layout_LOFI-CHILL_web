import React, { useState, useEffect } from 'react';
import './SongPage.css';
import Navbar from '../../Navbar/Navbar';
import Loading from '../../Loading/Loading';
import Footer from '../../footer/Footer';

import winter from '../../assets/images/winter.jpg';
import slinky from '../../assets/images/slinky.jpg';
import night from '../../assets/images/night.jpg';
import meadow from '../../assets/images/Meadow.jpg';
import morning from '../../assets/images/goodmorning.jpg';

function SongPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const songsPerPage = 6;

  const songs = [
    { 
      title: 'Winter Chill', 
      image: winter,
      description: "A calming and atmospheric track that evokes the tranquility of a snowy landscape. Featuring delicate piano melodies, soft strings, and ambient textures, perfect for relaxation or setting a peaceful mood."
    },
    { 
      title: 'Slinky Groove', 
      image: slinky,
      description: "A funky and upbeat groove with a catchy melody and a driving beat. Featuring groovy bass lines, funky guitar riffs, and a touch of brass, perfect for dancing or adding some energy to your day." 
    },
    { 
      title: 'Night Vibes', 
      image: night,
      description: "A smooth and sultry track with a laid-back vibe. Featuring mellow keys, smooth saxophone melodies, and a steady beat, perfect for late-night drives, romantic evenings, or simply unwinding after a long day." 
    },
    { 
      title: 'Meadow Peace', 
      image: meadow,
      description: "A serene and uplifting track inspired by the beauty of nature. Featuring acoustic guitar melodies, gentle flute melodies, and nature sounds, perfect for meditation, yoga, or finding inner peace." 
    },
    { 
      title: 'Good Morning', 
      image: morning,
      description: "A bright and cheerful track to start your day off right. Featuring cheerful ukulele melodies, playful bells, and sunny vibes, perfect for waking up, getting ready, or simply lifting your spirits." 
    },
    { 
      title: 'Winter Chill', 
      image: winter,
      description: "A calming and atmospheric track that evokes the tranquility of a snowy landscape. Featuring delicate piano melodies, soft strings, and ambient textures, perfect for relaxation or setting a peaceful mood."
    },
    { 
      title: 'Slinky Groove', 
      image: slinky,
      description: "A funky and upbeat groove with a catchy melody and a driving beat. Featuring groovy bass lines, funky guitar riffs, and a touch of brass, perfect for dancing or adding some energy to your day." 
    },
    { 
      title: 'Night Vibes', 
      image: night,
      description: "A smooth and sultry track with a laid-back vibe. Featuring mellow keys, smooth saxophone melodies, and a steady beat, perfect for late-night drives, romantic evenings, or simply unwinding after a long day." 
    },
    { 
      title: 'Meadow Peace', 
      image: meadow,
      description: "A serene and uplifting track inspired by the beauty of nature. Featuring acoustic guitar melodies, gentle flute melodies, and nature sounds, perfect for meditation, yoga, or finding inner peace." 
    },
  ];

  useEffect(() => {
    const delay = Math.random() * 2000;
    setTimeout(() => {
      setIsLoading(false);
    }, delay);

    document.body.classList.add('song-page-bg');
    return () => {
      document.body.classList.remove('song-page-bg');
    };
  }, []);

  const indexOfLastSong = currentPage * songsPerPage;
  const indexOfFirstSong = indexOfLastSong - songsPerPage;
  const currentSongs = songs.slice(indexOfFirstSong, indexOfLastSong);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(songs.length / songsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="songs-container">
      {isLoading && <Loading />}
      <Navbar />
      <div className="songs-grid">
        <h1 className="title">SONGS</h1>
        <div className="grid">
          {currentSongs.map((song, index) => (
            <div key={index} className="song-card-pa">
              <img src={song.image} alt={song.title} className="song-image" />
              <div className="song-title-p">{song.title}</div>
            </div>
          ))}
        </div>
        <div className="pagination">
          {pageNumbers.map((number) => (
            <button
              key={number}
              onClick={() => paginate(number)}
              className={currentPage === number ? 'active' : ''}
            >
              {number}
            </button>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default SongPage;