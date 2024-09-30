import React, { useState } from 'react';
import './ArtistPage_ad.css';
import Navbar from '../NavbarAdmin/Navbar';
import Aso from '../../assets/images/Aso.jpg';
import CYGN from '../../assets/images/CYGN.jpg';
import ivention_ from '../../assets/images/ivention_.jpg';
import Kupla from '../../assets/images/Kupla.jpg';
import Leavv from '../../assets/images/Leavv.jpg';
import Makzo from '../../assets/images/Makzo.png';
import MamaAiuto from '../../assets/images/Mama Aiuto.jpg';
import Misha from '../../assets/images/Misha.jpg';
import mommy from '../../assets/images/mommy.jpg';
import PsalmTrees from '../../assets/images/Psalm Trees.jpg';
import Sadtoi from '../../assets/images/Sadtoi.jpg';
import SleepyFish from '../../assets/images/Sleepy  Fish.jpg';

const ArtistPage_ad = () => {
  const [artists, setArtists] = useState([
    { title: 'Aso', image: Aso, description: 'Description 1' },
    { title: 'CYGN', image: CYGN, description: 'Description 2' },
    { title: 'ivention_', image: ivention_, description: 'Description 3' },
    { title: 'Kupla', image: Kupla, description: 'Description 4' },
    { title: 'Leavv', image: Leavv, description: 'Description 5' },
    { title: 'Makzo', image: Makzo, description: 'Description 6' },
    { title: 'Mama Aiuto', image: MamaAiuto, description: 'Description 7' },
    { title: 'Misha', image: Misha, description: 'Description 8' },
    { title: 'mommy', image: mommy, description: 'Description 9' },
    { title: 'Psalm Trees', image: PsalmTrees, description: 'Description 10' },
    { title: 'Sadtoi', image: Sadtoi, description: 'Description 11' },
    { title: 'Sleepy Fish', image: SleepyFish, description: 'Description 12' },
    { title: 'Aso', image: Aso, description: 'Description 1' },
    { title: 'CYGN', image: CYGN, description: 'Description 2' },
    { title: 'ivention_', image: ivention_, description: 'Description 3' },
    { title: 'Kupla', image: Kupla, description: 'Description 4' },
    { title: 'Leavv', image: Leavv, description: 'Description 5' },
    { title: 'Makzo', image: Makzo, description: 'Description 6' },
    { title: 'Mama Aiuto', image: MamaAiuto, description: 'Description 7' },
    { title: 'Misha', image: Misha, description: 'Description 8' },
    { title: 'mommy', image: mommy, description: 'Description 9' },
    { title: 'Psalm Trees', image: PsalmTrees, description: 'Description 10' },
    { title: 'Sadtoi', image: Sadtoi, description: 'Description 11' },
    { title: 'Sleepy Fish', image: SleepyFish, description: 'Description 12' },
  ]);

  const [currentPage, setCurrentPage] = useState(1);
  const [artistsPerPage] = useState(10);

  const handleEdit = (artist) => {
    console.log('Edit button clicked for:', artist.title);
  };

  const handleDelete = (artist) => {
    console.log('Delete button clicked for:', artist.title);
  };

  const indexOfLastArtist = currentPage * artistsPerPage;
  const indexOfFirstArtist = indexOfLastArtist - artistsPerPage;
  const currentArtists = artists.slice(indexOfFirstArtist, indexOfLastArtist);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(artists.length / artistsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <div>
      <Navbar />
      <div className="artist-container">
        <div className="artist-row">
          {currentArtists.slice(0, 5).map((artist, index) => (
            <div key={index} className="artist-card">
              <img src={artist.image} alt={artist.title} />
              <div className="artist-info">
                <h3>{artist.title}</h3>
                <div className="button-group">
                  <button className='btn-edit' onClick={() => handleEdit(artist)}>EDIT</button>
                  <button className='btn-dele' onClick={() => handleDelete(artist)}>DELETE</button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="artist-row">
          {currentArtists.slice(5, 10).map((artist, index) => (
            <div key={index} className="artist-card">
              <img src={artist.image} alt={artist.title} />
              <div className="artist-info">
                <h3>{artist.title}</h3>
                <div className="button-group">
                  <button className='btn-edit' onClick={() => handleEdit(artist)}>EDIT</button>
                  <button className='btn-dele' onClick={() => handleDelete(artist)}>DELETE</button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="pagination">
          {pageNumbers.map((number) => (
            <button
              key={number}
              onClick={() => paginate(number)}
              className={currentPage === number ? 'active' : ''}
            >
              {number}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ArtistPage_ad;