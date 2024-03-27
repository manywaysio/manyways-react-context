import ContactForm from "./ContactForm";
import charlotte from "../pictures/charlotte.png";

const CharlotteNodeInsert = ({
  setSubmitModalOpen,
  contactPermission,
  setContactPermission,
  marketingConsent,
  setMarketingConsent,
  setCharlotteFormSubmitted,
  // charlotteFormSubmitted,
}) => {
  return (
    <div className="charlotte-modal-content-node">
      <h3>We'd be delighted to assist you in booking your luxury travel experience</h3>
      <p className="char-desc">
        Please provide your phone number or email address below, and Charlotte will
        contact you to assist you with any of your travel questions!
      </p>
      <ContactForm
        setSubmitModalOpen={setSubmitModalOpen}
        contactPermission={contactPermission}
        setContactPermission={setContactPermission}
        marketingConsent={marketingConsent}
        setMarketingConsent={setMarketingConsent}
        setCharlotteFormSubmitted={setCharlotteFormSubmitted}
      />
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
    </div>
  );
};

export default CharlotteNodeInsert;
