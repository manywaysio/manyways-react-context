import React, { useState } from "react";
import Close from "../icons/Close";
import Phone from "../icons/Phone";
import Envelope from "../icons/Envelope";
import charlotte from "../pictures/charlotte.png";

const CharlotteModal = ({ charlotteModalOpen, setCharlotteModalOpen }) => {
  const [contactPermission, setContactPermission] = useState(false);
  const [marketingConsent, setMarketingConsent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted");
  };

  return (
    <div className={`charlotte-modal-container ${charlotteModalOpen ? "show" : ""}`}>
      <div className={`charlotte-modal-content ${charlotteModalOpen ? "show" : ""}`}>
        <div className="char-button-hold">
          <button onClick={() => setCharlotteModalOpen(false)}>✕</button>
        </div>
        <h3>Speak to our cruise experts</h3>
        <form onSubmit={handleSubmit}>
          <p className="char-desc">
            Please provide your phone number or email address below, and Charlotte will
            contact you to assist you with any of your travel questions!
          </p>
          <div className="input-container">
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
            {/* Checkbox for contact permission */}
            <div>
              <input
                id="contact-permission"
                type="checkbox"
                checked={contactPermission}
                onChange={() => setContactPermission(!contactPermission)}
              />
              <label htmlFor="contact-permission">
                {/* I agree that CruiseIQ may contact me at the email address or phone number
                provided for purposes related to my cruise travel inquiries. This may
                include follow-up communications, support, or assistance with the services
                offered by CruiseIQ. */}
              </label>
            </div>
            {/* Checkbox for marketing consent */}
            <div>
              <input
                id="marketing-consent"
                type="checkbox"
                checked={marketingConsent}
                onChange={() => setMarketingConsent(!marketingConsent)}
              />
              <label htmlFor="marketing-consent">
                I also consent to receive exclusive marketing and promotional messages
                from CruiseIQ. These may include special offers, new cruise deals, and
                personalized recommendations designed to enhance my cruise travel
                experience.
              </label>
            </div>
            <button
              className="submit-button"
              type="submit"
              disabled={!contactPermission || !marketingConsent}>
              Submit
            </button>
          </div>
        </form>
        <div className="char-image-container">
          <img className="char-image" src={charlotte} alt="Charlotte" />

          <div>
            <h4>Meet your assigned agent</h4>
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
