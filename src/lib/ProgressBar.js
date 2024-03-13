import React, { useState, useEffect } from "react";

const ProgressBar = ({ initialCurrentId }) => {
  const [currentId, setCurrentId] = useState(initialCurrentId);
  // const showProgressBar = initialCurrentId >= 34 && initialCurrentId <= 46;
  const [fadeout, setfadeout] = useState(false);
  const [showProgressBar, setShowProgressBar] = useState(false);

  useEffect(() => {
    if (initialCurrentId < 34) {
      setShowProgressBar(false);
      setfadeout(true);
    }
    if (typeof initialCurrentId === "number") {
      setCurrentId(initialCurrentId);
    }
    if (initialCurrentId === 47) {
      setShowProgressBar(false);
      setfadeout(true);
    }
    if (initialCurrentId === 34) {
      setShowProgressBar(true);
      setfadeout(false);
    }
  }, [initialCurrentId]);

  return (
    <div
      className={`universal-wrapper progress-bar-container ${
        showProgressBar ? "show" : ""
      } current-${currentId}`}>
      <div className="progress-bar">
        <div className={`first-bar bar-filled`}></div>
        <div className="progress-inner">
          <div className={`bar-item ${currentId >= 35 ? "bar-filled" : ""}`}></div>
          <div className={`bar-item ${currentId >= 38 ? "bar-filled" : ""}`}></div>
          <div className={`bar-item ${currentId >= 39 ? "bar-filled" : ""}`}></div>
          <div className={`bar-item ${currentId >= 41 ? "bar-filled" : ""}`}></div>
          {/* <div className={`bar-item ${currentId >= 42 ? "bar-filled" : ""}`}></div> */}
          <div className={`bar-item ${currentId >= 43 ? "bar-filled" : ""}`}></div>
          <div className={`bar-item ${currentId >= 44 ? "bar-filled" : ""}`}></div>
          <div className={`bar-item ${currentId >= 45 ? "bar-filled" : ""}`}></div>
          <div className={`bar-item ${currentId >= 46 ? "bar-filled" : ""}`}></div>
          <div className={`bar-item ${currentId >= 47 ? "bar-filled" : ""}`}></div>
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;
