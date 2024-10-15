import React from 'react';
import './Tracklist.css';
  
const TrackList = ({ tracks }) => {
  return (
    <div className="track-list">
      {tracks.map(track => (
        <div key={track.id} className="track-item">
          <div className="track-left">
            <img src={track.albumCover} alt={track.title} className="track-image" />
            <div className="track-info">
              <span className="track-title">{track.title}</span>
              <span className="track-artist">{track.artist}</span>
            </div>
          </div>
          <div className="track-right">
            <span className="track-duration">{track.duration}</span>
            <div className="track-controls">
              <button>▶</button> {/* Nút play */}
              <button>❤</button> {/* Nút like */}
              <button>➕</button> {/* Nút thêm */}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TrackList;
