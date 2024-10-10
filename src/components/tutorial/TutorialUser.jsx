import React, { useState, useRef } from 'react';
import { IoIosCloseCircle } from 'react-icons/io';
import ChillStudy from '../assets/images/imgCampfire.jpg';
import tutorial_2 from '../assets/images/tutorial_2.jpg';
import im from '../assets/images/imgSummer.jpg';
import './TutorialUser.css';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { GrNext, GrPrevious } from "react-icons/gr";

const Tutorial = () => {
  const [showTutorial, setShowTutorial] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const stepsContainerRef = useRef(null);

  const tutorialSteps = [
    {
      id: 1,
      image: ChillStudy,
      title: "Welcome to the Chillhop mixer!",
      content: "Craft your personalized livestream setup combining music with visuals and atmospheric sounds. You can chat with others, and save music to Spotify with one click, all while supporting the artists. Ready to get started? Click Continue to begin your chillhop adventure!",
      button: "Continue",
    },
    {
      id: 2,
      image: tutorial_2,
      title: "Finetune your experience",
      content: "Choose a station with your favourite music, select a visual and add any atmospheric background sounds you'd like to hear to craft your perfect setup. You can save & share any combination through the presets button.",
      button: "Continue",
    },
    {
      id: 3,
      image: im,
      title: "Enjoy this place",
      content: "We'd love to learn more about bugs, suggestions and ideas for us to make this an even better experience for you all. You can use the feedback button on the right to let us know what you think. a station with your favourite music, select a visual and add any atmospheric background sounds you'd like to hear to craft your perfect setup.",
      button: "START NOW",
    }
  ];

  const handleClose = () => setShowTutorial(false);
  const handlePrevious = () => setCurrentStep(currentStep > 0 ? currentStep - 1 : 0);
  const handleNext = () => setCurrentStep(currentStep < tutorialSteps.length - 1 ? currentStep + 1 : currentStep);
  const handleStartNow = () => setShowTutorial(false);

  const currentStepData = tutorialSteps[currentStep];

  return (
    <div className={`tutorial-container ${showTutorial ? 'show' : ''}`}>
      <div className="tutorial-content">
        <TransitionGroup component={null} childFactory={(node) => node}>
          <CSSTransition
            key={currentStepData.id}
            timeout={500}
            classNames="fade"
            onEnter={() => stepsContainerRef.current.focus()}
          >
            <div className="steps-container" ref={stepsContainerRef}>
              <div className="tutorial-step">
                <div className="tutorial-header">
                  <div className="tutorial-image" style={{ backgroundImage: `url(${currentStepData.image})` }} />
                  <h2 className="welcome">{currentStepData.title}</h2>
                  <button className="close-button-tt" onClick={handleClose}>
                    <IoIosCloseCircle />
                  </button>
                </div>
                <div className="tutorial-body">
                  <p>{currentStepData.content}</p>
                </div>
                {currentStep === tutorialSteps.length - 1 ? (
                  <button className="continue-button" onClick={handleStartNow}>
                    {currentStepData.button}
                  </button>
                ) : (
                  <button className="continue-button" onClick={handleNext}>
                    {currentStepData.button}
                  </button>
                )}
              </div>
            </div>
          </CSSTransition>
        </TransitionGroup>
      </div>
      <div className="control-buttons">
        <button className="previous-button" onClick={handlePrevious} disabled={currentStep === 0}>
          <GrPrevious />
        </button>
        {currentStep < tutorialSteps.length - 1 && (
          <button className="next-button" onClick={handleNext} disabled={currentStep === tutorialSteps.length - 1}>
            <GrNext />
          </button>
        )}
      </div>
    </div>
  );
};

export default Tutorial;