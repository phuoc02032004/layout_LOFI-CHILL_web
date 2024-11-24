import React, { useState, useContext } from "react";
import "./NavigationBar.css";
import InfoBox from "./../InfoBox/InfoBox";
import Presets from "../InfoBox/Presets/Presets";
import Music from "../InfoBox/Music/Music";
import Visuals from "../InfoBox/Visuals/Visuals";
import Sounds from "../InfoBox/Sounds/Sounds";

import albumCover from "../assets/images/test.jpg";
import { FaRegCirclePause, FaRegCirclePlay } from "react-icons/fa6";
import { FaRegHeart } from "react-icons/fa";
import { AiOutlineSpotify } from "react-icons/ai";
import { LuVolume2 } from "react-icons/lu";
import { FiSliders } from "react-icons/fi";
import { FaRadio } from "react-icons/fa6";
import { AiFillPicture } from "react-icons/ai";
import { GiSoundWaves } from "react-icons/gi";
import { RiPlayListFill } from "react-icons/ri";
import { IoChatboxEllipses } from "react-icons/io5";
import { FaHeart } from "react-icons/fa";
import History from "../InfoBox/History/History";
import { MusicPlayerContext } from "../Context/MusicPlayerContext";

const NavigationBar = ({ showInitially, onBackgroundChange }) => {
  const [activeButton, setActiveButton] = useState(null);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [isHeart, setIsHeart] = useState(false);
  const {
    isPlaying,
    resumeSong,
    pauseSong,
    volume,
    adjustVolume,
    currentSongTitle,
    currentSongArtist,
    currentImgSong,
  } = useContext(MusicPlayerContext);

  const handleClick = (buttonName) => {
    setActiveButton(buttonName);
  };

  const handleClose = () => {
    setActiveButton(null);
  };

  const handleVolumeClick = () => {
    setShowVolumeSlider(!showVolumeSlider);
  };

  const handleVolumeChange = (event) => {
    adjustVolume(event.target.value);
  };

  const handleVolumeMute = (event) => {
    setShowVolumeSlider(false);
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      pauseSong();
    } else {
      resumeSong();
    }
  };

  const handleHeartClick = () => {
    setIsHeart(!isHeart);
  };

  return (
    <div className={`navigation-bar ${showInitially ? "show" : ""}`}>
      <div className="song-info">
        <img
          className="album-cover"
          src={currentImgSong || albumCover}
          alt="Album Cover"
        />
        <div className="song-details">
          <div className="song-title">{currentSongTitle || "Nhom4Lofi"}</div>
          <div className="artist-name">{currentSongArtist || ""}</div>
        </div>
      </div>
      <div className="controls">
        <button className="control-button" onClick={handlePlayPause}>
          {isPlaying ? <FaRegCirclePause /> : <FaRegCirclePlay />}
        </button>
        <button className="control-button" onClick={handleHeartClick}>
          {isHeart ? <FaRegHeart /> : <FaHeart />}
        </button>
        <button className="control-button">
          <AiOutlineSpotify />
        </button>
        <button className="control-button" onClick={handleVolumeClick}>
          {showVolumeSlider ? (
            <span className="volume-icon-muted" onClick={handleVolumeMute}>
              <LuVolume2 />
            </span>
          ) : (
            <LuVolume2 />
          )}
        </button>
        {showVolumeSlider && (
          <div className="volume-slider-ic">
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={handleVolumeChange}
            />
          </div>
        )}
      </div>

      <div className="navigation-items">
        <div className="nav-item" onClick={() => handleClick("Presets")}>
          <FiSliders /> Presets
        </div>
        {activeButton === "Presets" && (
          <InfoBox
            title="Presets"
            content={
              <div>
                <p>Pre-curated music, visuals & atmospheres</p>
                <Presets onBackgroundChange={onBackgroundChange} />{" "}
              </div>
            }
            onClose={handleClose}
          />
        )}

        <button className="nav-item" onClick={() => handleClick("Music")}>
          <FaRadio /> Music
          {activeButton === "Music" && (
            <InfoBox
              title="Stations"
              content={
                <div>
                  <p>Select from our curated stations.</p>
                  <Music />
                </div>
              }
              onClose={handleClose}
            />
          )}
        </button>

        <button className="nav-item" onClick={() => handleClick("Visuals")}>
          <AiFillPicture /> Visuals
          {activeButton === "Visuals" && (
            <InfoBox
              title="Backgrounds"
              content={
                <div>
                  <p>Select from our backgrounds.</p>
                  <Visuals onBackgroundChange={onBackgroundChange} />
                </div>
              }
              onClose={handleClose}
            />
          )}
        </button>

        <button className="nav-item" onClick={() => handleClick("Sounds")}>
          <GiSoundWaves /> Sounds
          {activeButton === "Sounds" && (
            <InfoBox
              title="Atmospheres"
              content={
                <div>
                  <p>Select any atmosphere to make it more cozy.</p>
                  <Sounds />
                </div>
              }
              onClose={handleClose}
            />
          )}
        </button>

        <button className="nav-item" onClick={() => handleClick("History")}>
          <RiPlayListFill /> History
          {activeButton === "History" && (
            <InfoBox
              title="History"
              content={
                <div>
                  <p>Select any atmosphere to make it more cozy.</p>
                  <History />
                </div>
              }
              onClose={handleClose}
            />
          )}
        </button>
        <button className="nav-item" onClick={() => handleClick("Chat")}>
          <IoChatboxEllipses /> Chat
          {activeButton === "Chat" && (
            <InfoBox
              title="Chat"
              content="Kết nối với bạn bè"
              onClose={handleClose}
            />
          )}
        </button>
      </div>
    </div>
  );
};

export default NavigationBar;
