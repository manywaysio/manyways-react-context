const MenuModal = ({ menuModalOpen, shareJourney, copyLink }) => {
  return (
    <div className={`menu-modal-container ${menuModalOpen ? "show" : ""}`}>
      <ul>
        <li>Restart this guide</li>
        <li onClick={copyLink}>Copy link to continue later</li>
        <li onClick={shareJourney}>Share this guide</li>
        <li className="manyways">
          <a className="manyways" href="https://www.manyways.io/">
            Powered by Manyways
          </a>
        </li>
      </ul>
    </div>
  );
};

export default MenuModal;
