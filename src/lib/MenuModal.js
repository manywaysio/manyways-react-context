const MenuModal = ({ menuModalOpen, shareJourney, copyLink }) => {
  return (
    <div className={`menu-modal-container ${menuModalOpen ? "show" : ""}`}>
      <ul>
        <li
          onClick={(e) => {
            window.manyways.restart();
          }}
        >
          Restart this guide
        </li>
        <li
          onClick={(e) => {
            window.manyways.share();
          }}
        >
          Share this guide
        </li>
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
