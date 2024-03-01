import React from "react";
import Close from "../icons/Close";
import Phone from "../icons/Phone"; // Ensure these are properly imported SVG components
import Envelope from "../icons/Envelope";
import charlotte from "../pictures/charlotte.png";

const CharlotteModal = ({ charlotteModalOpen, setCharlotteModalOpen }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted");
  };

  return (
    <div className={`charlotte-modal-container ${charlotteModalOpen ? "show" : ""}`}>
      <div className={`charlotte-modal-content ${charlotteModalOpen ? "show" : ""}`}>
        <div className="char-button-hold">
          <button onClick={() => setCharlotteModalOpen(false)}>
            <Close />
          </button>
        </div>
        <h3>Ask Charlotte</h3>
        <form onSubmit={handleSubmit}>
          <p className="char-desc">
            Please provide your phone number or email address below, and Charlotte will
            contact you to assist you with any of your travel questions!
          </p>
          <div className="input-icon-container">
            <Phone className="input-icon" />
            <input
              type="text"
              className="input-with-icon"
              placeholder="Enter phone number"
            />
          </div>
          <span>OR</span>
          <div className="input-icon-container">
            <Envelope className="input-icon" />
            <input
              type="text"
              className="input-with-icon"
              placeholder="Enter email address"
            />
          </div>
          <button className="submit-button" type="submit">
            Submit
          </button>
        </form>
        <div className="char-image-container">
          <img className="char-image" src={charlotte} alt="Charlotte" />

          <div>
            <h4>Meet Charlotte</h4>
            <p>
              Charlotte has 20+ years experience in luxury event planning and service,
              having worked for A-list celebrities and designer fashion brands throughout
              her career. A connoisseur of the world's hidden gems, Charlotte designs
              escapes that cater to the discerning traveler's quest for authenticity and
              adventure.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CharlotteModal;
