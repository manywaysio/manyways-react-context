const ProgressBar = ({ currentNode }) => {
  return (
    <div className="universal-wrapper progress-bar-container">
      <div className="progress-bar">
        <div
          className={`first-bar ${
            currentNode === "when it comes to travel" ||
            currentNode === "relax and adventure" ||
            currentNode === "dream getaway" ||
            currentNode === "charlotte" ||
            currentNode === "have you taken a cruise" ||
            currentNode === "cruise lines" ||
            currentNode === "do you get seasick" ||
            currentNode === "type of cruise" ||
            currentNode === "dont-worry" ||
            currentNode === "parts of the world" ||
            currentNode === "traveling with" ||
            currentNode === "traveling how long" ||
            currentNode === "which seasons" ||
            currentNode === "results"
              ? "bar-filled"
              : ""
          }`}></div>
        <div className="progress-inner">
          <div
            className={`bar-item ${
              currentNode === "relax and adventure" ||
              currentNode === "dream getaway" ||
              currentNode === "charlotte" ||
              currentNode === "have you taken a cruise" ||
              currentNode === "cruise lines" ||
              currentNode === "do you get seasick" ||
              currentNode === "type of cruise" ||
              currentNode === "dont-worry" ||
              currentNode === "parts of the world" ||
              currentNode === "traveling with" ||
              currentNode === "traveling how long" ||
              currentNode === "which seasons" ||
              currentNode === "results"
                ? "bar-filled"
                : ""
            }`}></div>
          <div
            className={`bar-item ${
              currentNode === "have you taken a cruise" ||
              currentNode === "cruise lines" ||
              currentNode === "do you get seasick" ||
              currentNode === "type of cruise" ||
              currentNode === "dont-worry" ||
              currentNode === "parts of the world" ||
              currentNode === "traveling with" ||
              currentNode === "traveling how long" ||
              currentNode === "which seasons" ||
              currentNode === "results"
                ? "bar-filled"
                : ""
            }`}></div>
          <div
            className={`bar-item ${
              currentNode === "type of cruise" ||
              currentNode === "dont-worry" ||
              currentNode === "parts of the world" ||
              currentNode === "traveling with" ||
              currentNode === "traveling how long" ||
              currentNode === "which seasons" ||
              currentNode === "results"
                ? "bar-filled"
                : ""
            }`}></div>
          <div
            className={`bar-item ${
              currentNode === "parts of the world" ||
              currentNode === "traveling with" ||
              currentNode === "traveling how long" ||
              currentNode === "which seasons" ||
              currentNode === "results"
                ? "bar-filled"
                : ""
            }`}></div>
          <div
            className={`bar-item ${
              currentNode === "traveling with" ||
              currentNode === "traveling how long" ||
              currentNode === "which seasons" ||
              currentNode === "results"
                ? "bar-filled"
                : ""
            }`}></div>
          <div
            className={`bar-item ${
              currentNode === "traveling how long" ||
              currentNode === "which seasons" ||
              currentNode === "results"
                ? "bar-filled"
                : ""
            }`}></div>
          <div
            className={`bar-item ${
              currentNode === "which seasons" || currentNode === "results"
                ? "bar-filled"
                : ""
            }`}></div>
          <div
            className={`last-bar ${currentNode === "results" ? "bar-filled" : ""}`}></div>
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;
