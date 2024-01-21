import { useContext, createContext, useEffect, useState } from "react";
import NodeRenderer from "./NodeRenderer";
import Footer from "./Footer";
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

  const globalSettings = {
    backgroundImage: treeConfig?.run_mode?.ui_variables?.backgroundImage
      ? treeConfig?.run_mode?.ui_variables?.backgroundImage
      : null,
    header: treeConfig?.run_mode?.logo ? treeConfig?.run_mode?.logo : null,
    footer: treeConfig?.run_mode?.footer
      ? treeConfig?.run_mode?.footer
      : null,
  };

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
      <div
        className={`${classNamePrefix}-${slug} ${classNamePrefix}-${mode} ${classNamePrefix}-journey-container has-header-${!!globalSettings.header}`}
      >
        {/* Renders when in scroll mode with a global background set */}
        {mode === "scroll" && globalSettings.backgroundImage ? (
          <div
            className={`${classNamePrefix}-global-bg-image`}
            style={{
              backgroundImage: `url(${globalSettings.backgroundImage})`,
            }}
          ></div>
        ) : null}
        {/* Adds a header when a logo is added */}
        {globalSettings.header && (
          <header>
            <div className={`${classNamePrefix}-container`}>
              <img
                className={`${classNamePrefix}-logo`}
                src={globalSettings.header}
                alt="logo"
              />
            </div>
          </header>
        )}
        <NodeRenderer />
        {children}
        {mode === "scroll" && <Footer />}
      </div>
    </ManywaysContext.Provider>
  );
};

const useManyways = () => useContext(ManywaysContext);

export { ManywaysProvider, useManyways };
