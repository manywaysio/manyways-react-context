import React, { useState } from "react";

const SubmitModal = ({
  submitModalOpen,
  setSubmitModalOpen,
  setCharlotteFormSubmitted,
  currentNode,
  setCharlotteModalOpen,
  setContactPermission,
  setMarketingConsent,
}) => {
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
              setCharlotteFormSubmitted(false);
              setSubmitModalOpen(false);
              setCharlotteModalOpen(false);
              setContactPermission(false);
              setMarketingConsent(false);
              if (currentNode?.title === "Charlotte") {
                window.manyways.restart();
              }
            }}>
            {currentNode?.title === "Charlotte" ? "Restart journey" : "Continue browsing"}
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
