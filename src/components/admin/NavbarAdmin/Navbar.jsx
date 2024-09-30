import React, { useState, useEffect } from 'react';
import "./Navbar.css";
import { FaUser } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const [showMenu, setShowMenu] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true); 
  const navigate = useNavigate();

  useEffect(() => {
    let timeoutId;

    const handleMouseMove = () => {
      clearTimeout(timeoutId);
      if (!showNavbar) {
        setShowNavbar(true);
      }
      timeoutId = setTimeout(() => {
        setShowNavbar(false);
      }, 6000); 
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(timeoutId); 
    };
  }, [showNavbar]);

  const handleMouseEnter = () => {
    setShowMenu(true);
  };

  const handleMouseLeave = () => {
    setShowMenu(false);
  };

  const handleHomeClick = () => {
    navigate('/homepage');
  };


  const handleAdminClick = () => {
    navigate('/admin')
  }
  
  const handleSongPageClick = () => {
    navigate('/SongPage_ad')
  }
  
  const handleBGPageClick = () => {
    navigate('/BGPage')
  }

  const handleSoundPageClick = () => {
    navigate('/SoundPage')
  }

  const handlePresetPageClick = () => {
    navigate('/PresetPage')
  }

  const handleArtistPageClick = () => {
    navigate('/ArtistPage_ad')
  }
  
  return (
    <header className={`header ${!showNavbar ? 'hidden-navbar' : ''}`}> 
      <a href="/" className='logo'> LOGO </a>

      <nav className='navbar'>
        <a onClick={handleAdminClick}>HOME</a>
        <a onClick={handleSongPageClick}>SONG</a>
        <a onClick={handleArtistPageClick}>ARTIST</a>
        <a onClick={handleSoundPageClick}>SOUND</a>
        <a onClick={handleBGPageClick}>B . G</a>
        <a onClick={handlePresetPageClick}>PRESET</a>
      </nav>

      <div 
        className="account-container" 
        onMouseEnter={handleMouseEnter} 
        onMouseLeave={handleMouseLeave}
      >
        <a className='acc'><FaUser className='icon' /></a>
        {showMenu && (
          <div className="dropdown-menu">
            <a className="dropdown-item" onClick={handleHomeClick}>Trở về</a>
          </div>
        )}
      </div>
    </header>
  )
}