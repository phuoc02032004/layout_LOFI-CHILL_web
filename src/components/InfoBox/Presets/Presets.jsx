import React, { useEffect, useState, useContext } from "react";
import "./Presets.css";
import { AiOutlineCamera } from "react-icons/ai";
import { GiSoundWaves } from "react-icons/gi";
import { getAllPreset } from "../../../services/presets";
import { playSong } from "../../../services/song";
import { MusicPlayerContext } from "../../Context/MusicPlayerContext";
import { RiVipCrownFill } from "react-icons/ri";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import { addHistory } from "../../../services/history"; 

const Presets = ({ onBackgroundChange }) => {
  const [presetsData, setPresetsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { playSong: playMusic, setPlaylist } = useContext(MusicPlayerContext);
  const [isVip, setIsVip] = useState(false);

  const fetchPresets = async () => {
    setIsLoading(true);
    try {
      const presets = await getAllPreset();
      setPresetsData(presets);
    } catch (error) {
      console.error("Error fetching presets:", error.message);
      alert("Failed to fetch presets. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePresetClick = async (preset) => {
    const userId = localStorage.getItem("userId"); 
    if (!userId) {
      console.error("User is not logged in");
      return; 
    }
    const accessToken = Cookies.get("accessToken");
    if (!accessToken) {
      alert("Please log in to continue");
      return;
    }


    if (preset.playlistId) {
      try {
        const songs = await playSong(preset.playlistId);
        setPlaylist(songs);

        if (songs.length > 0) {
          const firstSong = songs[0];
          playMusic(
            firstSong.url,
            firstSong.title,
            firstSong.artist,
            firstSong.img,
            0,
            songs,
            0
          );

          console.log("Sending to API addHistory:", {
            userId,
            playlistId: preset.playlistId,
            songId: firstSong.id,
          });

          await addHistory(userId, preset.playlistId, firstSong.id); 
        } else {
          console.warn("Playlist is empty for this preset.");
        }
      } catch (error) {
        console.error("Error playing preset playlist:", error);
      }
    } else {
      console.warn("This preset does not have a valid playlistId.");
    }

    if (preset.visualVideoUrl) {
      onBackgroundChange(preset.visualVideoUrl);
    } else if (preset.visualImgUrl) {
      console.warn("Only video visuals are supported for the background.");
    }
  };

  useEffect(() => {
    fetchPresets();
  }, []);

  useEffect(() => {
    const accessToken = Cookies.get("accessToken");
    if (accessToken) {
      const decodedToken = jwtDecode(accessToken);
      setIsVip(decodedToken.isVip);
    }
  }, []);

  return (
    <div className="presets-container">
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        presetsData.map((preset) => (
          <div
            key={preset.id}
            className={`preset-item ${preset.vip ? "preset-vip" : ""}`}
            onClick={() => {
              if (!preset.vip || isVip) {
                handlePresetClick(preset);
              } else {
                alert("Preset này chỉ dành cho người dùng VIP!");
              }
            }}
          >
            <img
              src={
                preset.visualImgUrl || "https://example.com/default-image.jpg"
              }
              alt={preset.name}
              className="preset-image"
            />
            <div className="preset-details">
              <h4 className="preset-name">{preset.name}</h4>
              <div className="preset-info">
                <AiOutlineCamera className="icon" />
                {preset.name || "No Visuals Available"}
              </div>
              {preset.sounds && preset.sounds.length > 0 && (
                <div className="preset-info">
                  <GiSoundWaves className="icon" />
                  {preset.sounds.map((sound) => sound.soundTitle).join(", ")}
                </div>
              )}
              {preset.vip && <RiVipCrownFill className="vip-icon" />}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Presets;
