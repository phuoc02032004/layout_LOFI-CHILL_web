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
          <h1 className='ta'>Trang ADMIN</h1>
        </div>
      )}
    </div>
  );
};

export default Admin; 