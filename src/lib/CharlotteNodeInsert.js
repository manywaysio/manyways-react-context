import React, { useState } from "react";
import ContactForm from "./ContactForm";
import charlotte from "../pictures/charlotte.png";

const CharlotteNodeInsert = ({
  contactPermission,
  setContactPermission,
  marketingConsent,
  setMarketingConsent,
}) => {
  const [charlotteFormSubmitted, setCharlotteFormSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setCharlotteFormSubmitted(true);
  };

  return (
    <div
      className={`charlotte-modal-content-node ${charlotteFormSubmitted ? "show" : ""}`}>
      {charlotteFormSubmitted ? (
        <div className="submission-confirmation">
          <h3>Received!</h3>
          <p>We will contact you shortly.</p>
        </div>
      ) : (
        <>
          <h3>
            We'd be delighted to assist you in booking your luxury travel experience
          </h3>
          <p className="char-desc">
            Please provide your phone number or email address below, and Charlotte will
            contact you to assist you with any of your travel questions!
          </p>
          {/* <form onSubmit={handleSubmit}> */}
          <ContactForm
            contactPermission={contactPermission}
            setContactPermission={setContactPermission}
            marketingConsent={marketingConsent}
            setMarketingConsent={setMarketingConsent}
            setCharlotteFormSubmitted={setCharlotteFormSubmitted}
          />
        </>
      )}
      {charlotteFormSubmitted && (
        <div className="char-cta-holder">
          <button
            className="submit-button"
            onClick={() => {
              setCharlotteFormSubmitted(false);
              setContactPermission(false);
              setMarketingConsent(false);
              window.manyways.restart();
            }}>
            Restart journey
          </button>
          <button className="submit-button">
            <a href="https://www.manyways.io/" target="_blank">
              Visit our website
            </a>
          </button>
        </div>
      )}
      {!charlotteFormSubmitted && (
        <div className="char-image-container node-insert">
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
      )}
    </div>
  );
};

export default CharlotteNodeInsert;
