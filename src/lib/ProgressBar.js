import React, { useState, useEffect } from "react";

const ProgressBar = ({ initialCurrentId }) => {
  const [currentId, setCurrentId] = useState(initialCurrentId);
  const showProgressBar = initialCurrentId >= 34;

  useEffect(() => {
    if (typeof initialCurrentId === "number") {
      setCurrentId(initialCurrentId);
    }
  }, [initialCurrentId]);

  return (
    <div
      className={`universal-wrapper progress-bar-container ${
        showProgressBar ? "show" : ""
      }`}>
      <div className="progress-bar">
        <div className={`first-bar ${currentId >= 34 ? "bar-filled" : ""}`}></div>
        <div className="progress-inner">
          <div className={`bar-item ${currentId >= 35 ? "bar-filled" : ""}`}></div>
          <div className={`bar-item ${currentId >= 38 ? "bar-filled" : ""}`}></div>
          <div className={`bar-item ${currentId >= 39 ? "bar-filled" : ""}`}></div>
          <div className={`bar-item ${currentId >= 41 ? "bar-filled" : ""}`}></div>
          <div className={`bar-item ${currentId >= 42 ? "bar-filled" : ""}`}></div>
          <div className={`bar-item ${currentId >= 43 ? "bar-filled" : ""}`}></div>
          <div className={`bar-item ${currentId >= 44 ? "bar-filled" : ""}`}></div>
          <div className={`bar-item ${currentId >= 45 ? "bar-filled" : ""}`}></div>
          <div className={`bar-item ${currentId >= 46 ? "bar-filled" : ""}`}></div>
          <div className={`last-bar ${currentId >= 47 ? "bar-filled" : ""}`}></div>
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;
