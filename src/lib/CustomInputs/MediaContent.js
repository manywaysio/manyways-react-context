import React, { useEffect, useRef } from "react";
import { useManyways } from "../ManywaysContext";

const MediaContent = ({ schema, ...props }) => {
  const { setSubmitModalOpen } = useManyways();
  const contentRef = useRef(null);

  useEffect(() => {
    const submitButton = contentRef.current.querySelector(
      'button[type="submit"], .submit-button'
    );

    const openModal = (event) => {
      event.preventDefault();
      setSubmitModalOpen(true);
    };

    if (submitButton) {
      submitButton.addEventListener("click", openModal);
    }

    return () => {
      if (submitButton) {
        submitButton.removeEventListener("click", openModal);
      }
    };
  }, []);

  return (
    <div className={`media-content ${schema?.customClassName}`}>
      <div
        ref={contentRef}
        className="text-container"
        dangerouslySetInnerHTML={{ __html: schema?.text }}
      />
      {schema?.media && (
        <div className="image-container">
          <img src={schema?.media} alt={schema?.mediaAlt ? schema?.mediaAlt : ""} />
        </div>
      )}
    </div>
  );
};

export default MediaContent;
