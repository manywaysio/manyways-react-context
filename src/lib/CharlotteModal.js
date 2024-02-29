import Close from "../icons/Close";

const CharlotteModal = ({ setCharlotteModalOpen }) => {
  return (
    <div className="charlotte-modal-container">
      <div className="charlotte-modal-content">
        <div className="char-button-hold">
          <button onClick={() => setCharlotteModalOpen(false)}>
            <Close />
          </button>
        </div>
        <h3>Ask Charlotte</h3>
        <p>
          Please provide your phone number or email address below, and Charlotte will
          contact you to assist you with any of your travel questions!
        </p>
        <div>
          <input type="text" />
          <p>OR</p>
          <input type="text" />
        </div>
      </div>
    </div>
  );
};

export default CharlotteModal;
