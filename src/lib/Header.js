import React, { useState } from "react";
import CruiseIq from "../icons/CruiseIq.js";
import Hamburger from "../icons/Hamburger.js";
import Speaker from "../icons/Speaker.js";
import charlotte from "../pictures/charlotte.png";
import backgroundAudio from "../assets/audio/waves.mp3";

const Header = ({ charlotteModalOpen, setCharlotteModalOpen }) => {
  const [isMuted, setIsMuted] = useState(true);

  const toggleSound = (e) => {
    e.stopPropagation();
    console.log("Before toggling, isMuted:", isMuted);
    setIsMuted(!isMuted);
    console.log("After toggling, isMuted:", !isMuted);
  };

  const handleToggleModal = () => {
    if (charlotteModalOpen) {
      // Begin fade-out
      setTimeout(() => {
        setCharlotteModalOpen(false); // Hide modal after transition
      }, 500); // Ensure this matches your CSS transition time
    } else {
      // Immediately show modal, CSS transition for fade-in will handle the rest
      setCharlotteModalOpen(true);
    }
  };

  return (
    <header className="universal-wrapper">
      <audio
        id="backgroundAudio"
        src={backgroundAudio}
        autoPlay
        loop
        muted={isMuted}></audio>
      <div className="mt-8 header-container">
        <div className="header-item">
          <button className="hamburger-button" onClick={() => console.log("clicked")}>
            <Hamburger />
          </button>
          <div className="mobile-cruise">
            <CruiseIq />
          </div>
        </div>
        <div className="desktop-cruise">
          <CruiseIq />
        </div>

        <div className="header-item">
          <button className="char-button" onClick={handleToggleModal}>
            <p>Ask Charlotte</p>
            <img className="char-photo-header" src={charlotte} alt="Charlotte" />
          </button>
          <button className="speaker-button" onClick={toggleSound}>
            <Speaker />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
