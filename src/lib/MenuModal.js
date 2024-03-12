const MenuModal = ({ menuModalOpen, shareJourney, copyLink }) => {
  return (
    <div className={`menu-modal-container ${menuModalOpen ? "show" : ""}`}>
      <ul>
        <li>Restart this guide</li>
        <li onClick={copyLink}>Copy link to continue later</li>
        <li onClick={shareJourney}>Share this guide</li>
        <li className="manyways ">Powered by Manyways</li>
      </ul>
    </div>
  );
};

export default MenuModal;
