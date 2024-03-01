import React, { useState, useEffect } from "react";

const NodeComponent = ({ currentNode, isCurrent, backgroundImage, children }) => {
  const [shouldRender, setShouldRender] = useState(isCurrent);

  useEffect(() => {
    if (isCurrent) {
      setShouldRender(true);
    }
  }, [isCurrent]);

  useEffect(() => {
    let timeoutId;
    if (!isCurrent && shouldRender) {
      timeoutId = setTimeout(() => setShouldRender(false), 500); // Match your CSS transition duration
    }
    return () => clearTimeout(timeoutId);
  }, [isCurrent, shouldRender]);

  return (
    shouldRender && (
      <div
        style={{
          backgroundImage: `url(${backgroundImage})`,
          transition: "opacity 0.5s ease",
          opacity: isCurrent ? 1 : 0,
          visibility: isCurrent ? "visible" : "hidden",
          display: isCurrent ? "block" : "none",
        }}>
        {children}
      </div>
    )
  );
};

export default NodeComponent;
