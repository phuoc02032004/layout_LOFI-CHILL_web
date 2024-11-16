import React, { useState, useEffect } from "react";
import "./Tracklist.css";

const TrackList = ({ tracks }) => {
  const [currentAudio, setCurrentAudio] = useState(null); // Lưu trữ đối tượng Audio hiện tại
  const [playingTrackId, setPlayingTrackId] = useState(null); // Lưu ID bài hát đang phát

  const handlePlayPause = (track) => {
    console.log(track.url); 

    if (currentAudio) {
      currentAudio.pause(); 
      if (playingTrackId === track.id) {
        setPlayingTrackId(null);
        setCurrentAudio(null);
        return;
      }
    }

    
    const newAudio = new Audio(track.url);
    newAudio
      .play()
      .then(() => {
        setCurrentAudio(newAudio); // Lưu nhạc đang phát
        setPlayingTrackId(track.id); // Lưu ID bài hát đang phát
      })
      .catch((error) => {
        console.error("Error playing audio:", error);
      });
  };

  // Dừng nhạc khi component bị unmount
  useEffect(() => {
    return () => {
      if (currentAudio) {
        currentAudio.pause();
        setCurrentAudio(null);
      }
    };
  }, [currentAudio]);

  return (
    <div className="track-list">
      {tracks.map((track) => (
        <div key={track.id} className="track-item">
          <div className="track-left">
            <img
              src={track.albumCover}
              alt={track.title}
              className="track-image"
            />
            <div className="track-info">
              <span className="track-title">{track.title}</span>
              <span className="track-artist">{track.artist}</span>
            </div>
          </div>
          <div className="track-right">
            <span className="track-duration">{track.duration}</span>
            <div className="track-controls">
              
              <button onClick={() => handlePlayPause(track)}>
                {playingTrackId === track.id ? "⏸️" : "▶️"}
              </button>
              <button>❤</button> 
              <button>➕</button> 
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TrackList;
