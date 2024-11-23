import React, { useState, useEffect } from "react";
import "./Tracklist.css";
import volumeIcon from "../assets/images/volume-icon.png";

const TrackList = ({ tracks }) => {
  const [currentAudio, setCurrentAudio] = useState(null); 
  const [playingTrackId, setPlayingTrackId] = useState(null); 
  const [isPlaying, setIsPlaying] = useState(false); 
  const [volume, setVolume] = useState(1); 

  const handlePlayPause = (track) => {
    if (currentAudio) {
      if (playingTrackId === track.id) {
        if (!currentAudio.paused) {
          currentAudio.pause();
          setIsPlaying(false); 
        } else {
          currentAudio.play();
          setIsPlaying(true); 
        }
        return;
      } else {
        
        currentAudio.pause();
      }
    }

    
    const newAudio = new Audio(track.url);
    newAudio.volume = volume; 
    newAudio
      .play()
      .then(() => {
        setCurrentAudio(newAudio); 
        setPlayingTrackId(track.id); 
        setIsPlaying(true); 
      })
      .catch((error) => {
        console.error("Error playing audio:", error);
      });
  };

  const handleVolumeChange = (e, trackId) => {
    const newVolume = parseFloat(e.target.value);
    if (playingTrackId === trackId && currentAudio) {
      currentAudio.volume = newVolume; 
    }
    setVolume(newVolume); 
  };

  useEffect(() => {
    return () => {
      if (currentAudio) {
        currentAudio.pause();
        setCurrentAudio(null);
        setIsPlaying(false);
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
              <button
                onClick={() => handlePlayPause(track)}
                className={`play-button ${
                  playingTrackId === track.id && isPlaying ? "playing" : "paused"
                }`}
              >
                {playingTrackId === track.id && isPlaying ? "⏸️" : "▶️"}
              </button>
              <button>❤</button>
              <button>➕</button>
              <div className="volume-container">
                <img
                  src={volumeIcon}
                  alt="Volume"
                  className="volume-icon"
                />
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={playingTrackId === track.id ? volume : 1}
                  onChange={(e) => handleVolumeChange(e, track.id)}
                  className="volume-slider"
                />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TrackList;
