import { useContext, createContext, useEffect, useState } from "react";
import NodeRenderer from "./NodeRenderer";
const ManywaysContext = createContext(null);

const ManywaysProvider = ({
  children,
  slug,
  classNamePrefix = "mw",
  mode = "scroll",
}) => {
  let [nodes, setNodes] = useState([]);
  let [responseId, setResponseId] = useState(false);
  let [treeConfig, setTreeConfig] = useState({});
  let [currentNodeId, setCurrentNodeId] = useState(false);
  let [responses, setResponses] = useState([]);
  let currentNode =
    setCurrentNodeId !== false
      ? nodes.find((n) => n.id === currentNodeId)
      : false;

  const getInitialData = () => {
    fetch(`https://apiv2.manyways.io/response_sessions/${slug}/begin`)
      .then((response) => response.json())
      .then((data) => {
        setNodes([data?.current_node]);
        setCurrentNodeId(data?.node_id);
        setResponseId(data?.id);
        setTreeConfig(data?.revision);
      });
  };

  const goForward = async ({ formData }) => {
    let theResponse = {
      node_id: currentNode?.id,
      response: formData,
    };

    await fetch(`https://apiv2.manyways.io/response_sessions/${responseId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(theResponse),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setNodes([...nodes, data]);
        setResponses([...responses, theResponse]);
        setCurrentNodeId(data?.id);
      });
  };

  const goBack = async () => {
    let theLastResponse = responses[responses.length - 1];
    if (!!theLastResponse && !!theLastResponse?.node_id) {
      setCurrentNodeId(theLastResponse?.node_id);
    } else {
      console.log("cannot go back");
    }
  };

  useEffect(() => {
    console.log("init");
    getInitialData();
  }, [slug]);

  let getResponseByNodeID,
    journeyNodes,
    locale,
    setLocale,
    shareJourney,
    copyLink;
  return (
    <ManywaysContext.Provider
      value={{
        nodes,
        currentNodeId,
        currentNode,
        goBack,
        responses,
        goForward,
        getResponseByNodeID,
        treeConfig,
        journeyNodes,
        locale,
        setLocale,
        shareJourney,
        copyLink,
        classNamePrefix,
        mode,
      }}
    >
      <div className={`${classNamePrefix}-${slug}`}>
        {treeConfig?.run_mode?.logo && (
          <img
            className={`${classNamePrefix}-logo`}
            src={treeConfig?.run_mode?.logo}
          />
        )}
        <NodeRenderer />
        {children}
      </div>
    </ManywaysContext.Provider>
  );
};

const useManyways = () => useContext(ManywaysContext);

export { ManywaysProvider, useManyways };
