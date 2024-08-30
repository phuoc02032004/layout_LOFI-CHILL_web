import React, { useState } from 'react';
import './Sounds.css';

const soundsData = [
  { id: 1, name: 'Campfire' },
  { id: 2, name: 'Cicadas' },
  { id: 3, name: 'City Noise' },
  { id: 4, name: 'Cosy Cafe' },
  { id: 5, name: 'Keyboard' },
  { id: 6, name: 'Page Turning' },
  { id: 7, name: 'Rain' },
  // ... thêm dữ liệu atmosphere
];

const Sounds = () => {
  const [soundVolumes, setSoundVolumes] = useState({}); 

  const handleVolumeChange = (id, event) => {
    setSoundVolumes(prevVolumes => ({
      ...prevVolumes, 
      [id]: parseFloat(event.target.value) // Lưu trữ âm lượng dưới dạng số thập phân 
    }));
  };

  return (
    <div className="sounds-container">
      {soundsData.map(sound => (
        <div key={sound.id} className="sound-item">
          <span className="sound-name">{sound.name}</span>
          <div className="slider-container">
            <input
              type="range"
              min="0"
              max="1" 
              step="0.01" // Điều chỉnh bước thay đổi âm lượng
              value={soundVolumes[sound.id] || 0} // Giá trị âm lượng hiện tại (0 đến 1)
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