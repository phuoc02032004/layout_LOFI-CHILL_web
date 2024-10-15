import React from 'react';
import './Tracklist.css';
import winter from '../assets/images/winter.jpg';
import slinky from '../assets/images/slinky.jpg';
import night from '../assets/images/night.jpg';
import meadow from '../assets/images/Meadow.jpg';
import morning from '../assets/images/goodmorning.jpg';

const tracks = [
    {
      id: 1,
      title: 'Meadows',
      artist: 'Psalm Trees',
      duration: '02:30',
      albumCover: winter,
    },
    {
      id: 2,
      title: 'Babyyy',
      artist: 'Psalm Trees',
      duration: '02:06',
      albumCover: slinky,
    },
    {
      id: 3,
      title: 'Wherever You Are',
      artist: 'Psalm Trees',
      duration: '02:06',
      albumCover: night,
    },
    {
      id: 4,
      title: 'Prayer',
      artist: 'Psalm Trees',
      duration: '02:31',
      albumCover: meadow,
    },
    {
      id: 5,
      title: 'Smooth Wit\' Any Groove',
      artist: 'FloFilz',
      duration: '02:41',
      albumCover: morning,
    },
    {
      id: 6,
      title: 'Clocks Forward',
      artist: 'Psalm Trees',
      duration: '02:21',
      albumCover: winter,
    },
    {
      id: 7,
      title: 'Lazy French Beagles',
      artist: 'Psalm Trees',
      duration: '02:48',
      albumCover: slinky,
    },
    {
      id: 8,
      title: 'Rain',
      artist: 'Psalm Trees',
      duration: '02:31',
      albumCover: night,
    },
    {
      id: 9,
      title: 'Make You Hers',
      artist: 'Psalm Trees',
      duration: '02:02',
      albumCover: meadow,
    },
    {
      id: 10,
      title: 'Céleste',
      artist: 'Psalm Trees',
      duration: '02:24',
      albumCover: morning,
    },
  ];

  
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
