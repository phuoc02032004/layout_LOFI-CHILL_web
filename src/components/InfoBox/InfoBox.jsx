import React, { useState } from 'react';
import './InfoBox.css';
import { FaChevronDown } from "react-icons/fa";

const InfoBox = ({ title, content, onClose }) => {
  const [isClosing, setIsClosing] = useState(false);

  const handleCloseClick = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 500); 
  };

  return (
    <div className={`info-box ${isClosing ? 'hide' : 'show'}`}>
      <button className="close-button" onClick={handleCloseClick}>
        <FaChevronDown />
      </button>
      <h3>{title}</h3>
      {content}
    </div>
  );
};

export default InfoBox;