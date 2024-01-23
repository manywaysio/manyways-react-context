import { useContext, createContext, useEffect, useState } from "react";
import NodeRenderer from "./NodeRenderer";
import Footer from "./Footer";
import Header from "./Header";
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
  let [isLoading, setIsLoading] = useState(true);

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
        let final_json = data?.form_schema;
        try {
          final_json = JSON.parse(data?.content?.replace(/=>/g, ":"));
        } catch (e) {
          console.log(e);
        }
        setNodes([...nodes, { ...data, form_schema: final_json }]);
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
      <div
        className={`${classNamePrefix}-${slug} ${classNamePrefix}-${mode} ${classNamePrefix}-journey-container has-header-${!!treeConfig
          ?.run_mode?.logo}`}
      >
        {/* Renders when in scroll mode with a global background set */}
        {mode === "scroll" &&
        treeConfig?.run_mode?.ui_variables?.backgroundImage ? (
          <div
            className={`${classNamePrefix}-global-bg-image`}
            style={{
              backgroundImage: `url(${treeConfig?.run_mode?.ui_variables?.backgroundImage})`,
            }}
          ></div>
        ) : null}
        {/* Adds a header when a logo is added */}
        {treeConfig?.run_mode?.logo || treeConfig?.run_mode?.header ? (
          <Header />
        ) : null}
        <NodeRenderer />
        {children}
        {mode === "scroll" && isLoading && (
          <div className="loader-container">
            <div className="loader">
              <svg class="circular-loader" viewBox="25 25 50 50">
                <circle
                  class="loader-path"
                  cx="50"
                  cy="50"
                  r="20"
                  fill="none"
                  stroke="#939393"
                  stroke-width="4"
                />
              </svg>
            </div>
          </div>
        )}
        {mode === "scroll" && <Footer />}
      </div>
    </ManywaysContext.Provider>
  );
};

const useManyways = () => useContext(ManywaysContext);

export { ManywaysProvider, useManyways };
