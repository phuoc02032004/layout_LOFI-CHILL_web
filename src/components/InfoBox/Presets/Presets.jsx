import React, { useEffect, useState } from 'react';
import './Presets.css';
import { AiOutlineCamera } from "react-icons/ai";
import { GiSoundWaves } from "react-icons/gi";
import axios from 'axios';

const Presets = () => {
  const [presetsData, setPresetsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const getAllPreset = async () => {
    try {
      const response = await axios.get('http://localhost:3002/api/v1/presets/getAllPresets');

      if (response.data && response.data.err === 0) {
        const formattedPresets = response.data.presets.map(preset => ({
          id: preset.id || '',
          name: preset.Title || 'Unknown Title',
          description: preset.Description || 'No Description',
          visuals: (preset.urls && preset.urls.visualUrlVideo) || 'No Visuals Available',
          sounds: (preset.urls && preset.urls.soundDetails)
            ? preset.urls.soundDetails.map(sound => sound.soundTitle).join(', ')
            : 'No Sounds Available',
          image: (preset.urls && preset.urls.visualUrlImg) || 'default-image-url.jpg',
          isDefault: preset.isDefault || false,
        }));
        setPresetsData(formattedPresets);
      } else {
        console.error('Failed to fetch presets:', response.data.mes);
      }
    } catch (error) {
      console.error('Error fetching presets:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getAllPreset();
  }, []);

  return (
    <div className="presets-container">
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        presetsData.map(preset => (
          <div key={preset.id} className="preset-item">
            <img
              src={preset.image}
              alt={preset.name}
              className="preset-image"
            />
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
                <span>...</span> 
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Presets;
