import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './SongPage.css';
import Navbar from '../../Navbar/Navbar';
import Loading from '../../Loading/Loading';
import Footer from '../../footer/Footer';
import { Link } from 'react-router-dom';

import winter from '../../assets/images/winter.jpg';
import slinky from '../../assets/images/slinky.jpg';
import night from '../../assets/images/night.jpg';
import meadow from '../../assets/images/Meadow.jpg';
import morning from '../../assets/images/goodmorning.jpg';

import Aso from '../../assets/images/Aso.jpg';
import CYGN from '../../assets/images/CYGN.jpg';
import ivention_ from '../../assets/images/ivention_.jpg';
import Kupla from '../../assets/images/Kupla.jpg';
import Leavv from '../../assets/images/Leavv.jpg';
import Makzo from '../../assets/images/Makzo.png';
import MamaAiuto from '../../assets/images/Mama Aiuto.jpg';
import Misha from '../../assets/images/Misha.jpg';
import mommy from '../../assets/images/mommy.jpg';
import PsalmTrees from '../../assets/images/Psalm Trees.jpg';
import Sadtoi from '../../assets/images/Sadtoi.jpg';
import SleepyFish from '../../assets/images/Sleepy  Fish.jpg';

function SongPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const songsPerPage = 6;

  const songs = [
    {
      id: 1,
      title: 'Winter Chill',
      image: winter,
      artist: 'Psalm Trees',
      description: "A calming and atmospheric track that evokes the tranquility of a snowy landscape. Featuring delicate piano melodies, soft strings, and ambient textures, perfect for relaxation or setting a peaceful mood."
    },
    {
      id: 2,
      title: 'Slinky Groove',
      image: slinky,
      artist: 'Makzo',
      description: "A funky and upbeat groove with a catchy melody and a driving beat. Featuring groovy bass lines, funky guitar riffs, and a touch of brass, perfect for dancing or adding some energy to your day."
    },
    {
      id: 3,
      title: 'Night Vibes',
      image: night,
      artist: 'Leavv',
      description: "A smooth and sultry track with a laid-back vibe. Featuring mellow keys, smooth saxophone melodies, and a steady beat, perfect for late-night drives, romantic evenings, or simply unwinding after a long day."
    },
    {
      id: 4,
      title: 'Meadow Peace',
      image: meadow,
      artist: 'mommy',
      description: "A serene and uplifting track inspired by the beauty of nature. Featuring acoustic guitar melodies, gentle flute melodies, and nature sounds, perfect for meditation, yoga, or finding inner peace."
    },
    {
      id: 5,
      title: 'Good Morning',
      image: morning,
      artist: 'FloFilz',
      description: "A bright and cheerful track to start your day off right. Featuring cheerful ukulele melodies, playful bells, and sunny vibes, perfect for waking up, getting ready, or simply lifting your spirits."
    },
    {
      id: 6,
      title: 'Winter Chill',
      image: winter,
      artist: 'Psalm Trees',
      description: "A calming and atmospheric track that evokes the tranquility of a snowy landscape. Featuring delicate piano melodies, soft strings, and ambient textures, perfect for relaxation or setting a peaceful mood."
    },
    {
      id: 7,
      title: 'Slinky Groove',
      image: slinky,
      artist: 'Makzo',
      description: "A funky and upbeat groove with a catchy melody and a driving beat. Featuring groovy bass lines, funky guitar riffs, and a touch of brass, perfect for dancing or adding some energy to your day."
    },
    {
      id: 8,
      title: 'Night Vibes',
      image: night,
      artist: 'Misha',
      description: "A smooth and sultry track with a laid-back vibe. Featuring mellow keys, smooth saxophone melodies, and a steady beat, perfect for late-night drives, romantic evenings, or simply unwinding after a long day."
    },
    {
      id: 9,
      title: 'Meadow Peace',
      image: meadow,
      artist: 'Kupla',
      description: "A serene and uplifting track inspired by the beauty of nature. Featuring acoustic guitar melodies, gentle flute melodies, and nature sounds, perfect for meditation, yoga, or finding inner peace."
    },
  ];

     
  const [artists] = useState([
    { id: 1, title: 'Aso', image: Aso, description: 'Nghệ sĩ tài năng với phong cách âm nhạc độc đáo...' },
    { id: 2, title: 'CYGN', image: CYGN, description: 'Nổi tiếng với giai điệu electronic sôi động...' },
    { id: 3, title: 'ivention_', image: ivention_, description: 'Mang đến âm hưởng experimental đầy mới lạ...' },
    { id: 4, title: 'Kupla', image: Kupla, description: 'Âm nhạc là sự kết hợp tinh tế giữa...' },
    { id: 5, title: 'Leavv', image: Leavv, description: 'Leavv mang đến âm nhạc đầy cảm xúc...' },
    { id: 6, title: 'Makzo', image: Makzo, description: 'Makzo với phong cách âm nhạc độc đáo...' },
    { id: 7, title: 'Mama Aiuto', image: MamaAiuto, description: 'Mama Aiuto nổi tiếng với...' },
    { id: 8, title: 'Misha', image: Misha, description: 'Misha mang đến âm nhạc đầy nội lực...' },
    { id: 9, title: 'mommy', image: mommy, description: 'mommy với phong cách âm nhạc đặc biệt...' },
    { id: 10, title: 'Psalm Trees', image: PsalmTrees, description: 'Psalm Trees là một nghệ sĩ...' },
    { id: 11, title: 'Sadtoi', image: Sadtoi, description: 'Sadtoi với âm nhạc đầy cảm xúc...' },
    { id: 12, title: 'Sleepy Fish', image: SleepyFish, description: 'Sleepy Fish mang đến không gian âm nhạc thư giãn...' },
]);
  
  

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

  songs.forEach(song => {
    const artist = artists.find(artist => artist.title === song.artist);
    if (artist) {
        song.artistData = artist;
    }
});

  useEffect(() => {
    window.scrollTo(0, 0); 
  }, []); 

  return (
    <div className="songs-container">
      {isLoading && <Loading />}
      <Navbar />
      <div className="songs-grid">
        <h1 className="title">SONGS</h1>
        <div className="grid">
          {currentSongs.map((song) => (
           <Link
              to={`/SongPage/${song.id}`}
              key={song.id}
              className='song-card-pa'
              state={{song}}
              >
              <img src={song.image} alt={song.title} className="song-image" />
              <div className="song-title-p">{song.title}</div>
            </Link>
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