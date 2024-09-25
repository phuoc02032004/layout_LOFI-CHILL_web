import React, { useState } from 'react';
import './SongPage.css';
import NavbarAD from '../NavbarAdmin/Navbar';
import Footer from '../../footer/Footer';
import SongCarousel from '../../Carousel/SongCarousel';
import After_hours from '../../assets/images/After-hours.jpg';
import Friends from '../../assets/images/Friends.jpg';
import High_Beams from '../../assets/images/High-Beams.jpg';
import Stay from '../../assets/images/Stay.jpg';
import Tomorrow from '../../assets/images/Tomorrow.jpg';

import winter from '../../assets/images/winter.jpg';
import slinky from '../../assets/images/slinky.jpg';
import night from '../../assets/images/night.jpg';
import meadow from '../../assets/images/Meadow.jpg';
import morning from '../../assets/images/goodmorning.jpg';

function SongPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const images = [
    { src: After_hours, name: 'After Hours' },
    { src: Friends, name: 'Friends' },
    { src: High_Beams, name: 'High Beams' },
    { src: Stay, name: 'Stay' },
    { src: Tomorrow, name: 'Tomorrow' },
  ];

  const songs = [
    { title: 'Winter Chill', image: winter },
    { title: 'Slinky Groove', image: slinky },
    { title: 'Night Vibes', image: night },
    { title: 'Meadow Peace', image: meadow },
    { title: 'Good Morning', image: morning },
    { title: 'After Hours', image: After_hours },
    { title: 'Friends', image: Friends },
    { title: 'High Beams', image: High_Beams },
    { title: 'Stay', image: Stay },
    { title: 'Tomorrow', image: Tomorrow },
  ];

  const handleAddClick = () => {
    setIsAddModalOpen(true);
  };

  const handleEditClick = () => {
    setIsAddModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsAddModalOpen(false);
  };

  const handleDeleteClick = () => {
    setIsAddModalOpen(true)
  }

  return (
    <div>
      <NavbarAD />
      <button className='btn-add' onClick={handleAddClick}>ADD</button>
      {isAddModalOpen && (
        <div className="add-modal"> 
          <div className="modal-content">
            <span className="close-modal" onClick={handleCloseModal}>×</span>
            <h2>Thêm Bài Hát</h2>
            <form className='form-box'> 
              <label htmlFor="songName">Song name:</label>
              <input type="text" id="songName" name="songName" />

              <label htmlFor="artist">Artist:</label>
              <input type="text" id="artist" name="artist" />

              <label htmlFor="songImage">Song image:</label>
              <input type="file" id="songImage" name="songImage" />

              <label htmlFor="songFile">Song file:</label>
              <input type="file" id="songFile" name="songFile" />

              <label htmlFor="Describe">Description:</label>
              <input type="text" id="Describe" name="Describe" />

              <button type="submit">Save</button>
            </form>
          </div>
        </div>
      )}

      <div className='wrapper-all'>
        <div className="header-row">
          <div className="thumbnail-header">THUMBNAIL</div>
          <div className="name-song-header">NAME SONG</div>
          <div className="button-header">BUTTON</div>
        </div>
        <div className='image-container-song'>
          {images.map((image, index) => (
            <div key={index} className='image-row-song'>
              <img src={image.src} alt={image.name} className="image-song" />
              <div className='image-name-song'>{image.name}</div>
              <div className="btn">
                <div className="btn-fix"  onClick={handleEditClick}>EDIT</div>
                {isAddModalOpen && (
                    <div className="add-modal"> 
                      <div className="modal-content">
                
                        <span className="close-modal" onClick={handleCloseModal}>×</span>

                        <h2>Thêm Bài Hát</h2>
                        <form className='form-box'> 
                          <label htmlFor="songName">Song name:</label>
                          <input type="text" id="songName" name="songName" />

                          <label htmlFor="artist">Artist:</label>
                          <input type="text" id="artist" name="artist" />

                          <label htmlFor="songImage">Song image:</label>
                          <input type="file" id="songImage" name="songImage" />

                          <label htmlFor="songFile">Song file:</label>
                          <input type="file" id="songFile" name="songFile" />

                          <label htmlFor="Describe">Description:</label>
                          <input type="text" id="Describe" name="Describe" />

                          <button type="submit">Save</button>
                        </form>
                      </div>
                    </div>
                  )}

                <div className="btn-del" onClick={handleDeleteClick}>DELETE</div>
              </div>
            </div>
          ))}
        </div>
        <div className="name">New Song</div>
        <SongCarousel songs={songs} /> 
        
      </div>
    </div>
  )
}

export default SongPage