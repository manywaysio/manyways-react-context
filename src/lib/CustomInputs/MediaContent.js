import React, { useEffect, useRef } from "react";
import CharlotteNodeInsert from "../CharlotteNodeInsert";
import { useManyways } from "../ManywaysContext";

const MediaContent = ({ schema, ...props }) => {
  const { setSubmitModalOpen, charlotteModalOpen, setCharlotteModalOpen, currentNode } =
    useManyways();

  return (
    <div className={`media-content ${schema?.customClassName}`}>
      <div
        className="text-container"
        dangerouslySetInnerHTML={{ __html: schema?.text }}
      />
      {currentNode?.title === "Charlotte" && (
        <CharlotteNodeInsert
          charlotteModalOpen={charlotteModalOpen}
          setCharlotteModalOpen={setCharlotteModalOpen}
        />
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
