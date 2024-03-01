const MenuModal = ({ menuModalOpen }) => {
  return (
    <div className={`menu-modal-container ${menuModalOpen ? "show" : ""}`}>
      This is the menu
    </div>
  );
};

export default MenuModal;
