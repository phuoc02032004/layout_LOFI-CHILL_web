import React, { useState, useEffect, useRef } from 'react';
import './SongPage.css';
import Navbar from '../../Navbar/Navbar';
import Loading from '../../Loading/Loading';

function SongPage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const delay = Math.random() * 2000 ;
    setTimeout(() => {
      setIsLoading(false);
    }, delay);
  }, []);

  return (
    <div className="song-page">
      {isLoading && <Loading />}
      <Navbar />
      <div className="song-content">
        <h2>Trang bài hát</h2>
        <p>Nội dung bài hát...</p>
      </div>
    </div>
  );
}

export default SongPage;