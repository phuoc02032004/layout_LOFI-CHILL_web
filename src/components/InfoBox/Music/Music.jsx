import React, { useEffect, useState, useContext } from 'react';
import './Music.css';
import { getAllPlaylists } from '../../../services/playlist';
import { playSong } from '../../../services/song';
import { MusicPlayerContext } from '../../Context/MusicPlayerContext';

import { CgCoffee } from "react-icons/cg";
import { PiBuildingsBold } from "react-icons/pi";
import { PiMoonStarsBold } from "react-icons/pi";
import { PiHeadphonesBold } from "react-icons/pi";
import { PiRadio } from "react-icons/pi";
import { PiCloudRainBold } from "react-icons/pi";
import { PiSunHorizonBold } from "react-icons/pi";
import { PiPawPrintBold } from "react-icons/pi";
import { PiBookOpenTextBold } from "react-icons/pi";

const iconMap = {
  CgCoffee: <CgCoffee />,
  PiBuildingsBold: <PiBuildingsBold />,
  PiMoonStarsBold: <PiMoonStarsBold />,
  PiHeadphonesBold: <PiHeadphonesBold />,
  PiRadio: <PiRadio />,
  PiCloudRainBold: <PiCloudRainBold />,
  PiSunHorizonBold: <PiSunHorizonBold />,
  PiPawPrintBold: <PiPawPrintBold />,
  PiBookOpenTextBold: <PiBookOpenTextBold />,
};

const Music = () => {
  const [stationsData, setStations] = useState([]);
  const [playlistsState, setPlaylistsState] = useState({});
  const { playSong: playFromContext, currentSongUrl, currentTime } = useContext(MusicPlayerContext);

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
      console.error('Error fetching playlists:', error);
    }
  };

  const handlePlaylistClick = async (playlistId) => {
    if (playlistsState[playlistId]) {
      const { songs, currentSongIndex, currentTime } = playlistsState[playlistId];
      const songToPlay = songs[currentSongIndex];
      playFromContext(songToPlay.url, currentTime); // Phát bài đã lưu trạng thái
    } else {
      try {
        const songs = await playSong(playlistId);
        if (songs.length > 0) {
          setPlaylistsState((prevState) => ({
            ...prevState,
            [playlistId]: { songs, currentSongIndex: 0, currentTime: 0 },
          }));
          playFromContext(songs[0].url, songs[0].title, songs[0].artist, songs[0].img, 0); // Phát bài hát đầu tiên
        }
      } catch (error) {
        console.error('Error playing playlist:', error);
      }
    }
  };

  const handleTimeUpdate = (playlistId, currentTime) => {
    setPlaylistsState((prevState) => ({
      ...prevState,
      [playlistId]: {
        ...prevState[playlistId],
        currentTime,
      },
    }));
  };

  const handleSongEnd = (playlistId) => {
    const playlist = playlistsState[playlistId];
    if (playlist && playlist.currentSongIndex < playlist.songs.length - 1) {
      const nextIndex = playlist.currentSongIndex + 1;
      const nextSong = playlist.songs[nextIndex];
      setPlaylistsState((prevState) => ({
        ...prevState,
        [playlistId]: {
          ...prevState[playlistId],
          currentSongIndex: nextIndex,
          currentTime: 0,
        },
      }));
      playFromContext(nextSong.url, 0); // Phát bài hát tiếp theo
    }
  };

  const findPlaylistIdBySongUrl = (url) => {
    for (const playlistId in playlistsState) {
      if (playlistsState[playlistId]?.songs?.some((song) => song.url === url)) {
        return playlistId;
      }
    }
    return null;
  };

  useEffect(() => {
    if (currentSongUrl) {
      const playlistId = findPlaylistIdBySongUrl(currentSongUrl);
      if (playlistId) {
        handleTimeUpdate(playlistId, currentTime);
      }
    }
  }, [currentSongUrl, currentTime]);

  return (
    <div className="stations-container">
      <div className="stations-list">
        {stationsData.map((station) => (
          <div
            key={station.id}
            className="station-item"
            onClick={() => handlePlaylistClick(station.id)}
          >
            <div className="station-icon">
              {iconMap[station.icon] || "No icon available"}
            </div>
            <div className="station-details">
              <h4 className="station-name">{station.name}</h4>
              <p className="station-description">{station.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Music;
