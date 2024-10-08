import React, { useState, useEffect } from 'react';
import "./admin.css";
import Loading from '../Loading/Loading';
import NavbarAD from './NavbarAdmin/Navbar';

const Admin = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isChangeModalOpen, setIsChangeModalOpen] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false); 
    }, 2000); 
  }, []);

  const handleChangeClick = () => {
    setIsChangeModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsChangeModalOpen(false);
  };


  return (
    <div>
    <NavbarAD />
      {isLoading && <Loading />} 
      {isLoading ? (
        <p>Đang tải dữ liệu...</p> 
      ) : (
        <div>
          <div className="introduce3">
        <p>
          {' '}
          Welcome to<br /> LOFI - CHILL{' '}
        </p>
        <div>
        Do you want to change the image base of the whole local?
        </div>
        <button className="btn-start3" onClick={handleChangeClick}>
          {' '}
          JUST CHANGE{' '}
        </button>
        {isChangeModalOpen && (
        <div className="change-modal"> 
          <div className="change-content">
            <span className="close-change" onClick={handleCloseModal}>×</span>
            <h2>CHANGE  B.G</h2>
            <form className='form-box'> 
              <label htmlFor="songName">Song name:</label>
              <input type="text" id="songName" name="songName" />

              <label htmlFor="Describe">Description:</label>
              <input type="text" id="Describe" name="Describe" />

              <button type="submit">Save</button>
            </form>
          </div>
        </div>
      )}
      </div>
        </div>        
      )}
    </div>
  );
};

export default Admin; 