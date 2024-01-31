import { useContext, createContext, useEffect, useState } from "react";
import NodeRenderer from "./NodeRenderer";
import Footer from "./Footer";
import Header from "./Header";
import { slugify } from "./utils/helpers";
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

  const getInitialData = async (props = {}) => {
    const { callback = () => {}, callbackArgs = {} } = props;
    setIsLoading(true);
    await fetch(`https://apiv2.manyways.io/response_sessions/${slug}/begin`)
      .then((response) => response.json())
      .then((data) => {
        setNodes([data?.current_node]);
        setCurrentNodeId(data?.node_id);
        setResponseId(data?.id);
        setTreeConfig(data?.revision);
        setIsLoading(false);
        callback({ data, nodes: [data?.current_node], callbackArgs });
        setTimeout(() => {
          // hack for tabs
          document
            .querySelectorAll(".mw-node-find-by-form .field-radio-group label")
            .forEach((el) => {
              el.addEventListener("click", function () {
                if (!!el.closest(".has-response-false")) {
                  console.log("no response. should be forwarded");
                  return false;
                } else {
                  console.log("response exists. should be restarted in queue");
                  // window.manyways.restartInQueue([{ result: el.innerText }]);
                }
              });
            });
        }, 400);
      });
  };

  const goForward = async ({ formData }) => {
    setIsLoading(true);
    let theResponse = {
      // node_id: currentNode?.id,
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
          final_json = data?.content;
        } catch (e) {
          console.log(e);
        }
        setNodes([...nodes, { ...data, form_schema: final_json }]);
        setResponses([
          ...responses,
          { node_id: currentNode?.id, ...theResponse },
        ]);
        setCurrentNodeId(data?.id);
        setIsLoading(false);
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

  const setQueueData = async ({ data, nodes, callbackArgs }) => {
    await fetch(`https://apiv2.manyways.io/response_sessions/${data?.id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ responses: callbackArgs }),
    })
      .then((response) => response.json())
      .then((d) => {
        console.log("setQueueData", d, data, callbackArgs, nodes);
        let final_json = d?.form_schema;
        try {
          final_json = d?.content;
        } catch (e) {
          console.log(e);
        }
        setNodes([...nodes, { ...d, form_schema: final_json }]);
        setResponses([...responses]);
        setCurrentNodeId(d?.id);
        setIsLoading(false);
      });
  };

  const restartInQueue = async (nodeData) => {
    setNodes([]);
    setResponses([]);
    setCurrentNodeId(false);
    setTreeConfig({});
    setIsLoading(true);
    await getInitialData({ callback: setQueueData, callbackArgs: nodeData });
  };

  useEffect(() => {
    window.manyways.restartInQueue = restartInQueue;
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
          ?.run_mode?.logo} ${nodes
          .map((n) => `mw-${slugify(n.title)}`)
          .join(" ")}`}
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
              <svg className="circular-loader" viewBox="25 25 50 50">
                <circle
                  className="loader-path"
                  cx="50"
                  cy="50"
                  r="20"
                  fill="none"
                  stroke="#939393"
                  strokeWidth="4"
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
