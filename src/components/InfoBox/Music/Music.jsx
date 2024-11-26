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
import { RiVipCrownFill } from "react-icons/ri";
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';

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
  const [isVip, setIsVip] = useState(false);

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
          playFromContext(songs[0].url, songs[0].title, songs[0].artist, songs[0].img, 0, songs, 0); // Phát bài hát đầu tiên
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

  const handleSongEnd = () => {
    const playlistId = findPlaylistIdBySongUrl(currentSongUrl);
    if (!playlistId) return;

    const { songs, currentSongIndex } = playlistsState[playlistId];

    // Nếu còn bài hát tiếp theo
    if (currentSongIndex < songs.length - 1) {
      const nextIndex = currentSongIndex + 1;
      const nextSong = songs[nextIndex];

      // Cập nhật state
      setPlaylistsState((prevState) => ({
        ...prevState,
        [playlistId]: {
          ...prevState[playlistId],
          currentSongIndex: nextIndex,
          currentTime: 0,
        },
      }));

      // Phát bài hát tiếp theo
      playFromContext(nextSong.url, nextSong.title, nextSong.artist, nextSong.img, 0);
    } else {
      console.log("Playlist đã kết thúc.");
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

  useEffect(() => {
    const accessToken = Cookies.get('accessToken');
    if (accessToken) {
      const decodedToken = jwtDecode(accessToken);
      setIsVip(decodedToken.isVip);
    }
  }, []);

  return (
    <div className="stations-container">
      <div className="stations-list">
        {stationsData.map((station) => (
          <div
            key={station.id}
            className={`station-item ${station.vip ? 'station-vip' : ''}`}
            onClick={() => {
              if (!station.vip || isVip) {
                handlePlaylistClick(station.id)
              } else {
                alert('Playlist này chỉ dành cho người dùng VIP!');
              }
            }}
          >
            <div className="station-icon">
              {iconMap[station.icon] || "No icon available"}
            </div>
            <div className="station-details">
              <h4 className="station-name">{station.name}</h4>
              <p className="station-description">{station.description}</p>
            </div>
            {station.vip && (
              <RiVipCrownFill className="vip-icon" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Music;
