import React, { useState, useEffect } from 'react';
import "./admin.css";
import Loading from '../Loading/Loading';
import NavbarAD from './NavbarAdmin/Navbar';

const Admin = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false); 
    }, 2000); 
  }, []);

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
        <button className="btn-start3">
          {' '}
          JUST CHANGE{' '}
        </button>
      </div>
        </div>        
      )}
    </div>
  );
};

export default Admin; 