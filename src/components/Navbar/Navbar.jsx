import React, { useState } from 'react';
import "./Navbar.css";
import { FaUser } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();

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
    <header className='header'>
      <a href="/" className='logo'>Logo</a>

      <nav className='navbar'>
        <a onClick={handleHomeClick}>HOME</a>
        <a onClick={handleChillClick}>CHILL</a>
      </nav>

      <div className="account-container" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}> 
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