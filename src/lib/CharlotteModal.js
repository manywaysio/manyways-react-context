import React, { useState } from "react";
import Close from "../icons/Close";
import Phone from "../icons/Phone";
import Envelope from "../icons/Envelope";
import charlotte from "../pictures/charlotte.png";

const CharlotteModal = ({ charlotteModalOpen, setCharlotteModalOpen }) => {
  const [contactPermission, setContactPermission] = useState(false);
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormSubmitted(true);
  };

  return (
    <div className={`charlotte-modal-container ${charlotteModalOpen ? "show" : ""}`}>
      <div className={`charlotte-modal-content ${charlotteModalOpen ? "show" : ""}`}>
        {!formSubmitted && (
          <div className="char-button-hold">
            <button
              onClick={() => {
                setCharlotteModalOpen(false);
                setFormSubmitted(false);
              }}>
              <Close />
            </button>
          </div>
        )}
        {formSubmitted ? (
          <div className="submission-confirmation">
            <h3>Received!</h3>
            <p>We will contact you shortly.</p>
          </div>
        ) : (
          <>
            <h3>Speak to our cruise experts</h3>
            <p className="char-desc">
              Please provide your phone number or email address below, and Charlotte will
              contact you to assist you with any of your travel questions!
            </p>
            <form onSubmit={handleSubmit}>
              <div className="input-container">
                <div className="inputs-holder">
                  <div className="input-icon-container first-input">
                    <Phone className="input-icon" />
                    <input
                      type="text"
                      className="input-with-icon"
                      placeholder="Enter phone number"
                    />
                  </div>
                  <div className="input-icon-container">
                    <Envelope className="input-icon" />
                    <input
                      type="text"
                      className="input-with-icon"
                      placeholder="Enter email address"
                    />
                  </div>
                </div>
                <div className="contact-permission-container">
                  <input
                    id="contact-permission"
                    type="checkbox"
                    checked={contactPermission}
                    onChange={() => setContactPermission(!contactPermission)}
                  />
                  <label htmlFor="contact-permission">
                    I agree that CruiseIQ may contact me at the email address or phone
                    number provided for purposes related to my cruise travel inquiries.
                    This may include follow-up communications, support, or assistance with
                    the services offered by CruiseIQ.
                  </label>
                </div>
                <div className="marketing-consent-container">
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
                  disabled={!contactPermission}
                  // disabled={!contactPermission || !marketingConsent}
                >
                  Submit
                </button>
              </div>
            </form>
          </>
        )}
        {formSubmitted && (
          <div className="char-cta-holder">
            <button
              className="submit-button"
              onClick={() => {
                setCharlotteModalOpen(false);
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
        )}
        {!formSubmitted && (
          <div className="char-image-container">
            <img className="char-image" src={charlotte} alt="Charlotte" />

            <div>
              <h4>Meet your assigned agent</h4>
              <p>
                Charlotte has 20+ years experience in luxury event planning and service,
                having worked for A-list celebrities and designer fashion brands
                throughout her career. A connoisseur of the world's hidden gems, Charlotte
                designs escapes that cater to the discerning traveler's quest for
                authenticity and adventure.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CharlotteModal;
