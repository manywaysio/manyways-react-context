import React, { useState } from "react";

const SubmitModal = ({ submitModalOpen, setSubmitModalOpen }) => {
  const [formSubmitted, setFormSubmitted] = useState(false);

  return (
    <div className={`submit-modal-container ${submitModalOpen ? "show" : ""}`}>
      <div className={`submit-modal-content ${submitModalOpen ? "show" : ""}`}>
        <div className="submission-confirmation">
          <h3>Received!</h3>
          <p>We will contact you shortly.</p>
        </div>
        <div className="char-cta-holder">
          <button
            className="submit-button"
            onClick={() => {
              setSubmitModalOpen(false);
              setFormSubmitted(false);
            }}>
            Continue journey
          </button>
          <button className="submit-button">
            <a href="https://www.manyways.io/" target="_blank">
              Visit our website
            </a>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubmitModal;
