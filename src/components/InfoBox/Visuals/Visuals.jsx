import React, { useRef, useEffect, useState } from 'react';
import './Visuals.css';

// Import đường dẫn ảnh preview
import BeachPreview from '../../assets/images/imgBeach.jpg';
import BedroomPreview from '../../assets/images/imgBedroom.jpg';
import CampfirePreview from '../../assets/images/imgCampfire.jpg';
import ChillStudyPreview from '../../assets/images/imgChill.jpg';
import EndlessStrollPreview from '../../assets/images/imgendless.jpg';
import LatenightPreview from '../../assets/images/imglate.png';
import MorningPreview from '../../assets/images/imgMorning.png';
import SummerPreview from '../../assets/images/imgSummer.jpg';
import SummerSunPreview from '../../assets/images/imgSummerSun.jpg';

// Import đường dẫn video
import beach from '../../assets/videos/Beach.mp4';
import bedroom from '../../assets/videos/Bedroom.mp4';
import campfire from '../../assets/videos/CampfireChill.mp4';
import chillStudy from '../../assets/videos/ChillStudy.mp4';
import endlessStroll from '../../assets/videos/EndlessStroll.mp4';
import latenight from '../../assets/videos/Latenight.mp4';
import morning from '../../assets/videos/Morning.mp4';
import summer from '../../assets/videos/Summer.mp4';
import summerSunBath from '../../assets/videos/SummerSunBath.mp4';

const backgroundsData = [
  { id: 1, name: 'Bedroom', preview: BedroomPreview, video: bedroom },
  { id: 2, name: 'Campfire Chill', preview: CampfirePreview, video: campfire },
  { id: 3, name: 'Beach', preview: BeachPreview, video: beach },
  { id: 4, name: 'Chill Study', preview: ChillStudyPreview, video: chillStudy },
  { id: 5, name: 'Endless Stroll', preview: EndlessStrollPreview, video: endlessStroll },
  { id: 6, name: 'Late Night', preview: LatenightPreview, video: latenight },
  { id: 7, name: 'Morning', preview: MorningPreview, video: morning },
  { id: 8, name: 'Summer', preview: SummerPreview, video: summer },
  { id: 9, name: 'Summer Sun Bath', preview: SummerSunPreview, video: summerSunBath },
];

const Visuals = ({ onBackgroundChange }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [selectedVideo, setSelectedVideo] = useState(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    const updateBackground = () => {
      if (selectedVideo && videoRef.current) {
        context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        document.body.style.backgroundImage = `url(${canvas.toDataURL()})`;
      }

      requestAnimationFrame(updateBackground);
    };

    updateBackground();

    return () => {
      cancelAnimationFrame(updateBackground);
    };
  }, [selectedVideo]);

  const handleBackgroundChange = (videoSrc) => {
    setSelectedVideo(videoSrc);
    onBackgroundChange(videoSrc); 
  };

  return (
    <div className="backgrounds-container">
      <video ref={videoRef} src={selectedVideo} loop muted autoPlay style={{ display: 'none' }} />
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {backgroundsData.map((background) => (
        <div
          key={background.id}
          className="background-item"
          onClick={() => handleBackgroundChange(background.video)}
        >
          <img src={background.preview} alt={background.name} className="background-image" />
          <span className="background-name">{background.name}</span>
        </div>
      ))}
    </div>
  );
};

export default Visuals;