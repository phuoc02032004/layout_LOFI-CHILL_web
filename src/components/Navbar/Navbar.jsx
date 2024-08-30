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

  const handleChillClick = () => {
    navigate('/chillpage');
  };

  return (
    <header className={`header ${!showNavbar ? 'hidden-navbar' : ''}`}> 
      <a href="/" className='logo'> LOGO </a>

      <nav className='navbar'>
        <a onClick={handleHomeClick}>HOME</a>
        <a onClick={handleChillClick}>CHILL</a>
      </nav>

      <div 
        className="account-container" 
        onMouseEnter={handleMouseEnter} 
        onMouseLeave={handleMouseLeave}
      >
        <a className='acc'><FaUser className='icon' /></a>
        {showMenu && (
          <div className="dropdown-menu">
            <a className="dropdown-item">Đổi mật khẩu</a>
            <a className="dropdown-item">Đăng xuất</a>
          </div>
        )}
      </div>
    </header>
  )
}