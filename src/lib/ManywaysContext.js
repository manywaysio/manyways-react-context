import { useContext, createContext, useEffect, useState } from "react";
import NodeRenderer from "./NodeRenderer";
import Footer from "./Footer";
import Header from "./Header";
import { mergeNodetoLocaleNoSubNode, slugify } from "./utils/helpers";
import { merge } from "lodash";

const ManywaysContext = createContext(null);

const ManywaysProvider = ({
  children,
  slug,
  classNamePrefix = "mw",
  mode = "scroll",
  locale = "en"
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

  let umamidata = {
    website: treeConfig?.analytics_config?.umami_id,
  };

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
                if (!!el.closest(".is-current-node-true")) {
                  console.log("no response. should be forwarded");
                  return false;
                } else {
                  console.log("response exists. should be restarted in queue");
                  window.manyways.restartInQueue([{ result: el.innerText }]);
                }
              });
            });
        }, 400);
      });
  };

  const goForward = async ({ formData }) => {
    if (!!isLoading) {
      console.log("is loading aborting go forward");
      return false;
    }
    setIsLoading(true);
    let theResponse = {
      // node_id: currentNode?.id,
      response: formData,
    };

    // window.umami.track({
    //   title: currentNode?.title,
    //   data: {
    //     nodeId: currentNode?.id,
    //     response: JSON.stringify(formData),
    //   },
    //   hostname: window.location.hostname,
    //   language: navigator.language,
    //   referrer: document.referrer,
    //   screen: `${window.screen.width}x${window.screen.height}`,
    //   url: window.location.pathname,
    //   website: treeConfig?.analytics_config?.umami_id,
    //   name: "Node Response",
    // });

    await fetch(`https://apiv2.manyways.io/response_sessions/${responseId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(theResponse),
    })
      .then((response) => response.json())
      .then((data) => {
        window.umami.track((props) => ({
          ...props,
          url: `/${slugify(data.title)}`,
          title: data.title,
        }));

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
        setResponses([...responses.map((r, i) => ({ ...r, node_id: i.id }))]);
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

  const restart = async () => {
    setNodes([]);
    setResponses([]);
    setCurrentNodeId(false);
    setTreeConfig({});
    setIsLoading(true);
    await getInitialData();
  };

  const setUpUmami = () => {
    if (!!treeConfig?.analytics_config?.umami_id) {
      var el = document.createElement("script");
      el.setAttribute(
        "src",
        "https://umami-analytics-nine-xi.vercel.app/script.js"
      );
      el.setAttribute(
        "data-website-id",
        treeConfig?.analytics_config?.umami_id
      );
      document.body.appendChild(el);
    }
  };

  useEffect(() => {
    window.manyways.restartInQueue = restartInQueue;
    window.manyways.restart = restart;
    getInitialData();
  }, [slug]);

  useEffect(() => {
    setUpUmami();
  }, [treeConfig]);

  let getResponseByNodeID,
    journeyNodes,
    // locale,
    setLocale,
    shareJourney,
    copyLink; 

  return (
    <ManywaysContext.Provider
      value={{
        nodes: nodes.map(n => mergeNodetoLocaleNoSubNode(n, locale)),
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
