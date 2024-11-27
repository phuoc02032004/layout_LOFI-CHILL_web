import React, { useState, useEffect } from 'react';
import "./Navbar.css";
import { FaUser } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { logOut } from '../../services/auth';
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';

export default function Navbar() {
  const [showMenu, setShowMenu] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const [showLofiMenu, setShowLofiMenu] = useState(false);
  const navigate = useNavigate();
  const [isVip, setIsVip] = useState(false);
  const [role, setRole] = useState(0);

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

  const handleLofiMouseEnter = () => {
    setShowLofiMenu(true);
  };

  const handleLofiMouseLeave = () => {
    setShowLofiMenu(false);
  };

  const handleHomeClick = () => {
    navigate('/homepage');
  };

  const handleChillClick = () => {
    navigate('/chillpage');
  };

  const handleAdminClick = () => {
    navigate('/admin')
  }

  const handleSongPageClick = () => {
    navigate('/SongPage');
  };

  const handleArtistPageClick = () => {
    navigate('/ArtistPage')
  };

  const handleVippageClick = () => {
    navigate('/VIP')
  }

  const handleLogOutClick = async () => {
    try {
      await logOut();

      document.cookie.split(';').forEach(cookie => {
        const eqPos = cookie.indexOf('=');
        const name = eqPos > -1 ? cookie.substring(0, eqPos) : cookie;
        document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT';
      });
      localStorage.clear();
      sessionStorage.clear();
      navigate('/')
    } catch (error) {

    }
  };

  const handleResetPasswordClick = async () => {
    navigate('/ResetPassword')
  }

  useEffect(() => {
    const accessToken = Cookies.get('accessToken');
    if (accessToken) {
      const decodedToken = jwtDecode(accessToken);
      setIsVip(decodedToken.isVip);
      setRole(decodedToken.role);
    }
  }, []);

  return (
    <header className={`header ${!showNavbar ? 'hidden-navbar' : ''}`} style={{ background: 'linear-gradient(to top, rgba(28, 39, 48, 0), rgba(28, 39, 48, 0.8))' }}>
      <a href="/" className='logo'> LOGO </a>

      <nav className='navbar'>
        <a onClick={handleHomeClick}>HOME</a>
        <div
          className="account-container"
          onMouseEnter={handleLofiMouseEnter}
          onMouseLeave={handleLofiMouseLeave}
        >
          <a className='lofi-link'>LOFI</a>
          {showLofiMenu && (
            <div className="lofi-dropdown-menu">
              <div className="dropdown-item-lofi" onClick={handleSongPageClick}>SONGS</div>
              <div className="dropdown-item-lofi" onClick={handleArtistPageClick}>ARTIST</div>
            </div>
          )}
        </div>
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
            <a className="dropdown-item" onClick={handleResetPasswordClick}>Đổi mật khẩu</a>
            {role === 1 && (
              <a className="dropdown-item" onClick={handleAdminClick}>Admin</a>
            )}
            {!isVip && (
              <a className="dropdown-item" onClick={handleVippageClick}>Đăng Ký Tài Khoản Vip</a>
            )}
            <a className="dropdown-item" onClick={handleLogOutClick}>Đăng xuất</a>
          </div>
        )}
      </div>
    </header>
  )
}