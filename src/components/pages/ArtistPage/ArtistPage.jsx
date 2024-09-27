import React, { useState, useEffect, useRef } from 'react';
import './ArtistPage.css'
import Navbar from '../../Navbar/Navbar'
import Loading from '../../Loading/Loading';

function ArtistPage() {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      const delay = Math.random() * 2000 ;
      setTimeout(() => {
        setIsLoading(false);
      }, delay);
    }, []);
  
  return (
    <div>
    {isLoading && <Loading />}
      <Navbar />
    </div>
  )
}

export default ArtistPage
