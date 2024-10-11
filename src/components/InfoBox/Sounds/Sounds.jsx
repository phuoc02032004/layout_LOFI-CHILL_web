import React, { useEffect, useState } from 'react';
import './Sounds.css';
import { getAllSound } from '../../../services/sound';

let audioPlayers = {};
let soundsCache = null;

const Sounds = () => {
  const [soundsData, setSoundsData] = useState([]);
  const [soundVolumes, setSoundVolumes] = useState({});

  const fetchSoundsData = async () => {
    if (soundsCache) {
      setSoundsData(soundsCache);
      return;
    }

    try {
      const response = await getAllSound();
      setSoundsData(response);
      soundsCache = response; 

      response.forEach(sound => {
        if (!audioPlayers[sound.id]) {
          const audio = new Audio(sound.url);
          audioPlayers[sound.id] = audio;

          audio.addEventListener('ended', () => {
            audio.currentTime = 0;
            audio.play(); 
          });
        }
      });
    } catch (error) {
      console.error('Failed to fetch sounds data:', error);
    }
  };

  useEffect(() => {
    fetchSoundsData();

    const savedVolumes = JSON.parse(localStorage.getItem('soundVolumes')) || {};
    setSoundVolumes(savedVolumes);
  }, []);

  const handleVolumeChange = (id, event) => {
    const volume = parseFloat(event.target.value);

    setSoundVolumes(prevVolumes => {
      const updatedVolumes = { ...prevVolumes, [id]: volume };

      localStorage.setItem('soundVolumes', JSON.stringify(updatedVolumes));
      return updatedVolumes;
    });

    if (audioPlayers[id]) {
      audioPlayers[id].volume = volume;

      if (audioPlayers[id].paused) {
        audioPlayers[id].play();
      }
    }
  };

  return (
    <div className="sounds-container">
      {soundsData.map(sound => (
        <div key={sound.id} className="sound-item-s">
          <span className="sound-name">{sound.title}</span>
          <div className="slider-container">
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={soundVolumes[sound.id] || 0}
              onChange={(e) => handleVolumeChange(sound.id, e)}
              className="volume-slider"
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default Sounds;
