import React, { useState } from "react";
import CruiseIq from "../icons/CruiseIq.js";
import Hamburger from "../icons/Hamburger.js";
import Speaker from "../icons/Speaker.js";
import charlotte from "../pictures/charlotte.png";
import backgroundAudio from "../assets/audio/waves.mp3";
import CloseLarge from "../icons/CloseLarge.js";

const Header = ({
  // shareJourney,
  // copyLink,
  charlotteModalOpen,
  setCharlotteModalOpen,
  menuModalOpen,
  setMenuModalOpen,
}) => {
  const [isMuted, setIsMuted] = useState(true);

  const toggleSound = (e) => {
    e.stopPropagation();
    const wasMuted = isMuted;
    setIsMuted(!wasMuted);

    if (wasMuted) {
      const audioElement = document.getElementById("backgroundAudio");
      if (audioElement) {
        audioElement.play().catch((error) => console.error("Playback failed:", error));
      }
    }
  };

  const handleToggleModal = () => {
    if (charlotteModalOpen) {
      setTimeout(() => {
        setCharlotteModalOpen(false);
      }, 300);
    } else {
      setCharlotteModalOpen(true);
    }
  };

  const handleMenuToggleModal = () => {
    if (menuModalOpen) {
      setTimeout(() => {
        setMenuModalOpen(false);
      }, 100);
    } else {
      setMenuModalOpen(true);
    }
  };

  return (
    <header className="universal-wrapper">
      <audio
        id="backgroundAudio"
        src={backgroundAudio}
        autoPlay
        loop
        muted={isMuted}
        onCanPlayThrough={(e) => console.log("Audio can play through")}
        // controls
      ></audio>
      <div className="header-container">
        <div className="header-item">
          <button className="hamburger-button" onClick={handleMenuToggleModal}>
            {menuModalOpen ? <CloseLarge className="close-icon" /> : <Hamburger />}
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
