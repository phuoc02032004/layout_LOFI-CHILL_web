import React, { useEffect, useState, useContext } from 'react';
import './Presets.css';
import { AiOutlineCamera } from "react-icons/ai";
import { GiSoundWaves } from "react-icons/gi";
import { getAllPreset } from '../../../services/presets';
import { playSong } from '../../../services/song';
import { MusicPlayerContext } from "../../Context/MusicPlayerContext";

const Presets = ({ onBackgroundChange }) => { 
  const [presetsData, setPresetsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { playSong: playMusic, setPlaylist } = useContext(MusicPlayerContext);

  const fetchPresets = async () => {
    setIsLoading(true);
    try {
      const presets = await getAllPreset();
      setPresetsData(presets);
    } catch (error) {
      console.error('Error fetching presets:', error.message);
      alert('Failed to fetch presets. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePresetClick = async (preset) => {
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
            } else {
                console.warn('Playlist is empty for this preset.');
            }
        } catch (error) {
            console.error('Error playing preset playlist:', error);
        }
    } else {
        console.warn('This preset does not have a valid playlistId.');
    }

    if (preset.visualVideoUrl) {
        onBackgroundChange(preset.visualVideoUrl); 
    } else if (preset.visualImgUrl) {
        console.warn('Only video visuals are supported for the background.');
    }
};


  useEffect(() => {
    fetchPresets();
  }, []);

  return (
    <div className="presets-container">
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        presetsData.map((preset) => (
          <div
            key={preset.id}
            className="preset-item"
            onClick={() => handlePresetClick(preset)}
          >
            <img
              src={preset.visualImgUrl || 'https://example.com/default-image.jpg'}
              alt={preset.name}
              className="preset-image"
            />
            <div className="preset-details">
              <h4 className="preset-name">{preset.name}</h4>
              <div className="preset-info">
                <AiOutlineCamera className="icon" />
                {preset.name || 'No Visuals Available'}
              </div>
              {preset.sounds && preset.sounds.length > 0 && (
                <div className="preset-info">
                  <GiSoundWaves className="icon" />
                  {preset.sounds.map((sound) => sound.soundTitle).join(', ')}
                </div>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Presets;
