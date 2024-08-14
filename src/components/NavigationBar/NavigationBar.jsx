import React from 'react';
import './NavigationBar.css';
import albumCover from '../assets/images/test.jpg';
import { FaRegCirclePause } from "react-icons/fa6";
import { FaRegHeart } from "react-icons/fa";
import { AiOutlineSpotify } from "react-icons/ai";
import { LuVolume2 } from "react-icons/lu";
import { FiSliders } from "react-icons/fi";
import { FaRadio } from "react-icons/fa6";
import { AiFillPicture } from "react-icons/ai";
import { GiSoundWaves } from "react-icons/gi";
import { RiPlayListFill } from "react-icons/ri";
import { IoChatboxEllipses } from "react-icons/io5";


const NavigationBar = () => {
    return (
        <div className="navigation-bar">
            <div className="song-info">
                <img className="album-cover" src={albumCover} alt="Album Cover" />
                <div className="song-details">
                    <div className="song-title">BRAVO</div>
                    <div className="artist-name">Moose Dawa</div>
                </div>
            </div>
            <div className="controls">
                <button className="control-button"><FaRegCirclePause /></button>
                <button className="control-button"><FaRegHeart /></button>
                <button className="control-button"><AiOutlineSpotify /></button>
                <button className="control-button"><LuVolume2 /></button>
            </div>
            <div className="navigation-items">
                <button className="nav-item"> <FiSliders />  Presets </button>
                <button className="nav-item">  <FaRadio /> Music</button>
                <button className="nav-item"> <AiFillPicture />  Visuals</button>
                <button className="nav-item"> <GiSoundWaves />  Sounds</button>
                <button className="nav-item"> <RiPlayListFill/> History</button>
                <button className="nav-item"> <IoChatboxEllipses />  Chat</button>
            </div>
        </div>
    );
};

export default NavigationBar;
