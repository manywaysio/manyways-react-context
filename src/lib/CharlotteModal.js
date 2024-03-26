import ContactForm from "./ContactForm";
import Close from "../icons/Close";
import charlotte from "../pictures/charlotte.png";

const CharlotteModal = ({
  setSubmitModalOpen,
  charlotteModalOpen,
  setCharlotteModalOpen,
  contactPermission,
  setContactPermission,
  marketingConsent,
  setMarketingConsent,
  charlotteFormSubmitted,
  setCharlotteFormSubmitted,
}) => {
  return (
    <div className={`charlotte-modal-container ${charlotteModalOpen ? "show" : ""}`}>
      <div className={`charlotte-modal-content ${charlotteModalOpen ? "show" : ""}`}>
        <div className="char-button-hold">
          <button
            onClick={() => {
              setCharlotteModalOpen(false);
              setCharlotteFormSubmitted(false);
            }}>
            <Close />
          </button>
        </div>
        <h3>Speak to our cruise experts</h3>
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
