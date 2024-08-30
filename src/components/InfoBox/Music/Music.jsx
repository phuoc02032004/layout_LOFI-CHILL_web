import React from 'react';
import './Music.css';
import { FaCoffee } from "react-icons/fa";
import { BsBuilding } from "react-icons/bs";
import { HiMoon } from "react-icons/hi";
import { FaHeadphones } from "react-icons/fa";
import { FaRadio } from "react-icons/fa6";
import { FaCloudShowersHeavy } from "react-icons/fa6";
import { PiSunHorizonFill } from "react-icons/pi";

const stationsData = [
  {
    id: 1,
    name: 'Endless Sunday',
    icon: <FaCoffee />, 
    description: 'A selection of smooth jazzy beats'
  },
  {
    id: 2,
    name: 'Headbop Beats',
    icon: <BsBuilding />, 
    description: 'Beats to bop your head to'
  },
  {
    id: 3,
    name: 'Late Night Vibes',
    icon: <HiMoon />,
    description: 'Calmer tracks to help you relax or sleep'
  },
  {
    id: 4,
    name: 'lofi hip hop beats',
    icon: <FaHeadphones />, 
    description: 'Relaxing beats to help you focus' 
  },
  {
    id: 5,
    name: 'Chillhop Radio',
    icon: <FaRadio />, 
    description: 'A wide variety of the best tracks from our label' 
  },
  {
    id: 6,
    name: 'Melancholic Mood',
    icon: <FaCloudShowersHeavy />, 
    description: 'Moody and sad beats' 
  },
  {
    id: 7,
    name: 'Sunshine Beat',
    icon: <PiSunHorizonFill />, 
    description: 'Uplifting beats to keep you active' 
  },
];

const Music = () => {
  return (
    <div className="stations-container">
      {stationsData.map(station => (
        <div key={station.id} className="station-item">
          <div className="station-icon">{station.icon}</div> 
          <div className="station-details">
            <h4 className="station-name">{station.name}</h4>
            <p className="station-description">{station.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Music;