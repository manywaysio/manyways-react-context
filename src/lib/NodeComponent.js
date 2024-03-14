import React, { useState, useEffect } from "react";

const NodeComponent = ({ isCurrent, children }) => {
  const [visibility, setVisibility] = useState("hidden");
  const [display, setDisplay] = useState("none");
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    if (isCurrent) {
      setDisplay("block");
      setVisibility("visible");
      const timeout = setTimeout(() => setOpacity(1), 10);
      return () => clearTimeout(timeout);
    } else {
      setOpacity(0);
      const timeout = setTimeout(() => {
        setVisibility("hidden");
        setDisplay("none");
      }, 500); // match transition duration
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
