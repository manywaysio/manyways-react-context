import React, { useState } from "react";
import Close from "../icons/Close";

const SubmitModal = ({ submitModalOpen, setSubmitModalOpen }) => {
  const [formSubmitted, setFormSubmitted] = useState(false);

  return (
    <div className={`submit-modal-container ${submitModalOpen ? "show" : ""}`}>
      <div className={`submit-modal-content ${submitModalOpen ? "show" : ""}`}>
        <div className="submit-button-hold">
          <button
            onClick={() => {
              setSubmitModalOpen(false);
              setFormSubmitted(false);
            }}>
            <Close />
          </button>
        </div>
        <div className="submission-confirmation">
          <h3>Received!</h3>
          <p>We will contact you shortly.</p>
        </div>
      </div>
    </div>
  );
};

export default SubmitModal;
