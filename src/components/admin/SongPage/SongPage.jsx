import React from 'react'
import './SongPage.css'
import NavbarAD from '../NavbarAdmin/Navbar'
import After_hours from '../../assets/images/After-hours.jpg'
import  Friends from '../../assets/images/Friends.jpg'
import High_Beams from '../../assets/images/High-Beams.jpg'
import Stay from '../../assets/images/Stay.jpg'
import Tomorrow from '../../assets/images/Tomorrow.jpg'

function SongPage() {

  const images = [
    { src: After_hours, name: 'After Hours' },
    { src: Friends, name: 'Friends' },
    { src: High_Beams, name: 'High Beams' },
    { src: Stay, name: 'Stay' },
    { src: Tomorrow, name: 'Tomorrow' },
  ];

  return (
    <div>
        <NavbarAD />
        <button className='btn-add'>ADD</button>
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
              <div className="btn-fix">EDIT</div>
              <div className="btn-del">DELETE</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>   
  )
}

export default SongPage
