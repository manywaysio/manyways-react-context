import Phone from "../icons/Phone";
import Envelope from "../icons/Envelope";

const ContactForm = ({
  resultsPage = false,
  setSubmitModalOpen,
  contactPermission,
  setContactPermission,
  marketingConsent,
  setMarketingConsent,
  // setCharlotteFormSubmitted,
}) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitModalOpen(true);
    // setCharlotteFormSubmitted(true);
  };

  return (
    <form>
      {/* <form onSubmit={handleSubmit}> */}
      <div className={`input-container ${resultsPage ? "results-style" : ""}`}>
        <div className={`inputs-holder ${resultsPage ? "results-style" : ""}`}>
          <div className="input-icon-container first-input">
            <Phone className="input-icon" />
            <input
              type="text"
              className="input-with-icon"
              placeholder="Enter phone number"
            />
          </div>
          {resultsPage && <span>OR</span>}
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
            I agree that CruiseIQ may contact me at the email address or phone number
            provided for purposes related to my cruise travel inquiries. This may include
            follow-up communications, support, or assistance with the services offered by
            CruiseIQ.
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
            I also consent to receive exclusive marketing and promotional messages from
            CruiseIQ. These may include special offers, new cruise deals, and personalized
            recommendations designed to enhance my cruise travel experience.
          </label>
        </div>
        <button
          className="submit-button"
          type="submit"
          disabled={!contactPermission}
          onClick={handleSubmit}
          // disabled={!contactPermission || !marketingConsent}
        >
          Submit
        </button>
      </div>
    </form>
  );
};

export default ContactForm;
