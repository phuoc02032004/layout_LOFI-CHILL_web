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
];

const Sounds = () => {
  const [soundVolumes, setSoundVolumes] = useState({}); 

  const handleVolumeChange = (id, event) => {
    setSoundVolumes(prevVolumes => ({
      ...prevVolumes, 
      [id]: parseFloat(event.target.value)
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