const ProgressBar = ({ currentNode }) => {
  console.log(currentNode);
  return (
    <div className="progress-bar">
      <div
        className={`first-bar ${
          currentNode === "when it comes to travel" ? "bar-filled" : ""
        }`}></div>
      <div className="progress-inner">
        <div
          className={`bar-item ${
            currentNode === "relax and adventure" ? "bar-filled" : ""
          }`}></div>
      </div>
    </div>
  );
};

export default ProgressBar;
