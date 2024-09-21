import React from 'react';
import './BGPage.css';
import NavbarAD from '../NavbarAdmin/Navbar';
import BeachPreview from '../../assets/images/imgBeach.jpg';
import BedroomPreview from '../../assets/images/imgBedroom.jpg';
import CampfirePreview from '../../assets/images/imgCampfire.jpg';
import ChillStudyPreview from '../../assets/images/imgChill.jpg';
import EndlessStrollPreview from '../../assets/images/imgendless.jpg';
import LatenightPreview from '../../assets/images/imglate.png';
import MorningPreview from '../../assets/images/imgMorning.png';
import SummerPreview from '../../assets/images/imgSummer.jpg';
import SummerSunPreview from '../../assets/images/imgSummerSun.jpg';

function BGPage() {
  const images = [
    { src: BeachPreview, name: 'Beach' },
    { src: BedroomPreview, name: 'Bedroom' },
    { src: CampfirePreview, name: 'Campfire' },
    { src: ChillStudyPreview, name: 'Chill Study' },
    { src: EndlessStrollPreview, name: 'Endless Stroll' },
    { src: LatenightPreview, name: 'Late Night' },
    { src: MorningPreview, name: 'Morning' },
    { src: SummerPreview, name: 'Summer' },
    { src: SummerSunPreview, name: 'Summer Sun' },
  ];

  return (
    <div>
      <NavbarAD />
      <div className='wrapper'>
        <div className='image-container'>
          {images.map((image, index) => (
            <div key={index} className='image-row'>
              <img src={image.src} alt={image.name} className="image" />
              <div className='image-name'>{image.name}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default BGPage;