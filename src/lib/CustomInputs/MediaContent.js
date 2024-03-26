import React, { useEffect, useRef } from "react";
import CharlotteNodeInsert from "../CharlotteNodeInsert";
import { useManyways } from "../ManywaysContext";

const MediaContent = ({ schema, ...props }) => {
  const {
    setSubmitModalOpen,
    charlotteModalOpen,
    setCharlotteModalOpen,
    currentNode,
    contactPermission,
    setContactPermission,
    marketingConsent,
    setMarketingConsent,
  } = useManyways();

  return (
    <div className={`media-content ${schema?.customClassName}`}>
      <div
        className="text-container"
        dangerouslySetInnerHTML={{ __html: schema?.text }}
      />
      {currentNode?.title === "Charlotte" && (
        <div className="charlotte-node-inset-holder">
          <CharlotteNodeInsert
            charlotteModalOpen={charlotteModalOpen}
            setCharlotteModalOpen={setCharlotteModalOpen}
            contactPermission={contactPermission}
            setContactPermission={setContactPermission}
            marketingConsent={marketingConsent}
            setMarketingConsent={setMarketingConsent}
          />
        </div>
      )}
      {schema?.media && (
        <div className="image-container">
          <img src={schema?.media} alt={schema?.mediaAlt ? schema?.mediaAlt : ""} />
        </div>
      )}
    </div>
  );
};

export default MediaContent;
