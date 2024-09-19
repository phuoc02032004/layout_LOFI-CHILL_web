import React from 'react';
import './Presets.css';
import { AiOutlineCamera } from "react-icons/ai";
import { GiSoundWaves } from "react-icons/gi";
import chillhopRadio from '../../assets/images/chillhopradio.jpg';
import lateNightVibes from '../../assets/images/latenight.jpg';
import chillStudyBeats from '../../assets/images/chillstudy.jpg';
import sunnyDay from '../../assets/images/sunnyday.jpg';
import essentials from '../../assets/images/essentials.jpg';

const presetsData = [
  {
    id: 1,
    name: 'Chillhop Radio',
    image: chillhopRadio, 
    visuals: 'Chillhop Radio',
    sounds: 'Summer Birds, City Noise',
    isDefault: true
  },
  {
    id: 2,
    name: 'Late Night Vibes',
    image: lateNightVibes, 
    visuals: 'Late Night Vibes',
    sounds: 'Rain, City Noise',
    isDefault: true
  },
  {
    id: 3,
    name: 'Chill Study Beats',
    image: chillStudyBeats, 
    visuals: 'Chill Study Beats',
    sounds: 'Page Turning, Cosy Cafe', 
    isDefault: true
  },
  {
    id: 4,
    name: 'Sunny day',
    image: sunnyDay, 
    visuals: 'Sunshine Beats',
    sounds: 'Stream', 
    isDefault: true
  },
  {
    id: 5,
    name: 'Chillhop Essentials',
    image: essentials, 
    visuals: 'Sunshine Beats',
    sounds: 'Summer Birds', 
    isDefault: true
  },

];

const Presets = () => {
  return (
    <div className="presets-container">
      {presetsData.map(preset => (
        <div key={preset.id} className="preset-item">
          <img src={preset.image} alt={preset.name} className="preset-image" />
          <div className="preset-details">
            <h4 className="preset-name">{preset.name}</h4>
            <div className="preset-info">
              <AiOutlineCamera className="icon" /> {preset.visuals}
            </div>
            {preset.sounds && ( 
              <div className="preset-info">
                <GiSoundWaves className="icon" /> {preset.sounds}
              </div>
            )}
          </div>
          <div className="preset-actions">
            {preset.isDefault ? (
              <button className="default-button">DEFAULT</button>
            ) : (
              <button className="save-button">SAVE</button>
            )}
            <div className="options-button">
              {/* ... Icon ba chấm ... */}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Presets;