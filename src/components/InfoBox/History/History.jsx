import React from 'react';
import './History.css';
import song1 from '../../assets/images/imgChill.jpg';
import song2 from '../../assets/images/imgBeach.jpg';
import song3 from '../../assets/images/imgBedroom.jpg';
import { useState } from 'react';

function History() {
  const [currentPage, setCurrentPage] = useState(0);
  const songsPerPage = 20; // Hiển thị 2 bài hát trên mỗi trang

  const songHistory = [
    {
      title: "Bài hát 1",
      artist: "Tác giả 1",
      imageUrl: song1,
    },
    {
      title: "Bài hát 2",
      artist: "Tác giả 2",
      imageUrl: song2,
    },
    {
      title: "Bài hát 3",
      artist: "Tác giả 3",
      imageUrl: song3,
    },
  ];

  const indexOfLastSong = (currentPage + 1) * songsPerPage;
  const indexOfFirstSong = indexOfLastSong - songsPerPage;
  const currentSongs = songHistory.slice(indexOfFirstSong, indexOfLastSong);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="history-container">
      <div className="history-list">
        {currentSongs.map((song, index) => (
          <div key={index} className="history-item">
            <div className="history-song-image-container"> {/* Thêm container cho ảnh */}
              <img src={song.imageUrl} alt={song.title} className="song-image" />
            </div>
            <div className="history-song-details">
              <h4 className="history-song-name">{song.title}</h4>
              <p className="history-song-artist">Tác giả: {song.artist}</p>
            </div>
          </div>
        ))}
      </div>
      
    </div>
  );
}

export default History;