import React, { useState, useEffect } from "react";

const NodeComponent = ({ isCurrent, children }) => {
  const [visibility, setVisibility] = useState("hidden");
  const [display, setDisplay] = useState("none");
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    if (isCurrent) {
      // Make the element visible and prepare for fade-in
      setDisplay("block");
      setVisibility("visible");
      // Start fade-in after a very short delay to ensure display and visibility are applied
      const timeout = setTimeout(() => setOpacity(1), 10);
      return () => clearTimeout(timeout);
    } else {
      // Start fade-out
      setOpacity(0);
      // Set visibility and display to hidden and none after transition ends
      const timeout = setTimeout(() => {
        setVisibility("hidden");
        setDisplay("none");
      }, 500); // Match your transition duration
      return () => clearTimeout(timeout);
    }
  }, [isCurrent]);

  return (
    <div
      style={{
        transition: "opacity 0.5s ease",
        opacity: opacity,
        visibility: visibility,
        display: display,
      }}>
      {children}
    </div>
  );
};

export default NodeComponent;
