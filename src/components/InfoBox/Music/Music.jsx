import React, { useEffect, useState } from 'react';
import './Music.css';
import { getAllPlaylists } from '../../../services/playlist';
import { playMusic } from '../../../services/music';

const Music = () => {
  const [stationsData, setStations] = useState([]);
  const [playlistsState, setPlaylistsState] = useState({}); // Lưu trạng thái của các playlist đã phát
  const [currentPlaylist, setCurrentPlaylist] = useState([]);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [currentSongUrl, setCurrentSongUrl] = useState('');
  const [currentPlaylistId, setCurrentPlaylistId] = useState(null);
  const [currentTime, setCurrentTime] = useState(0); // Lưu vị trí hiện tại của bài hát
  const audioRef = React.useRef(null);

  useEffect(() => {
    const cachedPlaylists = localStorage.getItem('playlists');
    if (cachedPlaylists) {
      setStations(JSON.parse(cachedPlaylists));
    } else {
      fetchPlaylists();
    }
  }, []);

  const fetchPlaylists = async () => {
    try {
      const data = await getAllPlaylists();
      setStations(data);
      localStorage.setItem('playlists', JSON.stringify(data));
    } catch (error) {
      console.error('Error fetching Playlist:', error);
    }
  };

  const handlePlaylistClick = async (playlistId) => {
    if (playlistsState[playlistId]) {
      // Nếu playlist đã từng được phát, phát từ bài hát và vị trí đã lưu
      const { songs, currentSongIndex, currentTime } = playlistsState[playlistId];
      setCurrentPlaylistId(playlistId);
      setCurrentPlaylist(songs);
      setCurrentSongIndex(currentSongIndex);
      setCurrentSongUrl(songs[currentSongIndex].url);
      setCurrentTime(currentTime);
    } else {
      try {
        const songs = await playMusic(playlistId);
        if (songs.length > 0) {
          setPlaylistsState(prevState => ({
            ...prevState,
            [playlistId]: { songs, currentSongIndex: 0, currentTime: 0 }
          }));
          setCurrentPlaylistId(playlistId);
          setCurrentPlaylist(songs);
          setCurrentSongIndex(0);
          setCurrentSongUrl(songs[0].url);
          setCurrentTime(0);
        }
      } catch (error) {
        console.error('Error playing playlist:', error);
      }
    }
  };

  const handleSongEnd = async () => {
    if (currentSongIndex < currentPlaylist.length - 1) {
      const nextIndex = currentSongIndex + 1;
      setCurrentSongIndex(nextIndex);
      setCurrentSongUrl(currentPlaylist[nextIndex].url);
      setPlaylistsState(prevState => ({
        ...prevState,
        [currentPlaylistId]: {
          songs: currentPlaylist,
          currentSongIndex: nextIndex,
          currentTime: 0
        }
      }));
    }
  };

  const handleTimeUpdate = () => {
    const time = audioRef.current.currentTime;
    setPlaylistsState(prevState => ({
      ...prevState,
      [currentPlaylistId]: {
        ...prevState[currentPlaylistId],
        currentTime: time // Cập nhật vị trí bài hát
      }
    }));
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.currentTime = currentTime; // Phát từ vị trí đã lưu
    }
  }, [currentSongUrl, currentTime]);

  return (
    <div className="stations-container">
      <div className="stations-list">
        {stationsData.map(station => (
          <div
            key={station.id}
            className="station-item"
            onClick={() => handlePlaylistClick(station.id)}
          >
            <div className="station-details">
              <h4 className="station-name">{station.name}</h4>
              <p className="station-description">{station.description}</p>
            </div>
          </div>
        ))}
      </div>

      {currentSongUrl && (
        <div className="music-player">
          <audio
            ref={audioRef}
            controls
            autoPlay
            src={currentSongUrl}
            onTimeUpdate={handleTimeUpdate} // Cập nhật thời gian phát
            onEnded={handleSongEnd}
          >
            Your browser does not support the audio element.
          </audio>
        </div>
      )}
    </div>
  );
};

export default Music;
