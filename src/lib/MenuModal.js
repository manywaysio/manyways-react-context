const MenuModal = ({ menuModalOpen }) => {
  return (
    <div className={`menu-modal-container ${menuModalOpen ? "show" : ""}`}>
      <ul>
        <li>Restart this guide</li>
        <li>Copy link to continue later</li>
        <li>Share this guide</li>
        <li className="manyways ">Powered by Manyways</li>
      </ul>
    </div>
  );
};

export default MenuModal;
