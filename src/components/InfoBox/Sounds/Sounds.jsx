import React, { useEffect, useState } from 'react';
import './Sounds.css';
import { getAllSound } from '../../../services/sound';
import { MusicPlayerContext } from '../../Context/MusicPlayerContext';


let audioPlayers = {};
let soundsCache = null;

const Sounds = () => {
  const [soundsData, setSoundsData] = useState([]);
  const [soundVolumes, setSoundVolumes] = useState({});

  // Lấy dữ liệu âm thanh
  const fetchSoundsData = async () => {
    if (soundsCache) {
      setSoundsData(soundsCache);
      return;
    }

    try {
      const response = await getAllSound();
      setSoundsData(response);
      soundsCache = response;

      // Tạo audio player cho từng âm thanh và thiết lập sự kiện lặp lại
      response.forEach((sound) => {
        if (!audioPlayers[sound.id]) {
          const audio = new Audio(sound.url);
          audioPlayers[sound.id] = audio;

          audio.addEventListener('ended', () => {
            audio.currentTime = 0;
            audio.play(); // Lặp lại
          });

          // Khôi phục âm lượng từ localStorage
          const savedVolumes = JSON.parse(localStorage.getItem('soundVolumes')) || {};
          const savedVolume = savedVolumes[sound.id] || 0;
          audio.volume = savedVolume;
        }
      });
    } catch (error) {
      console.error('Failed to fetch sounds data:', error);
    }
  };

  useEffect(() => {
    fetchSoundsData();

    // Khôi phục âm lượng từ localStorage
    const savedVolumes = JSON.parse(localStorage.getItem('soundVolumes')) || {};
    setSoundVolumes(savedVolumes);
  }, []);

  // Thay đổi âm lượng và lưu lại
  const handleVolumeChange = (id, event) => {
    const volume = parseFloat(event.target.value);

    setSoundVolumes((prevVolumes) => {
      const updatedVolumes = { ...prevVolumes, [id]: volume };

      // Lưu vào localStorage
      localStorage.setItem('soundVolumes', JSON.stringify(updatedVolumes));
      return updatedVolumes;
    });

    if (audioPlayers[id]) {
      audioPlayers[id].volume = volume;

      // Bắt đầu phát âm thanh nếu chưa phát
      if (audioPlayers[id].paused) {
        audioPlayers[id].play();
      }
    }
  };

  return (
    <div className="soundsInfo-container">
      {soundsData.map((sound) => (
        <div key={sound.id} className="soundInfo-item">
          <span className="soundInfo-name">{sound.title}</span>
          <div className="sliderInfo-container">
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={soundVolumes[sound.id] || 0}
              onChange={(e) => handleVolumeChange(sound.id, e)}
              className="volumeInfo-slider"
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default Sounds;
