import { useContext, createContext, useEffect, useState } from "react";
import NodeRenderer from "./NodeRenderer";
import Footer from "./Footer";
import Header from "./Header";
import { mergeNodetoLocaleNoSubNode, slugify } from "./utils/helpers";
import labels from "./labels/index";
import { render } from "@testing-library/react";

const ManywaysContext = createContext(null);

const ManywaysProvider = ({
  children,
  slug,
  classNamePrefix = "mw",
  mode = "scroll",
  locale = "en",
}) => {
  let [nodes, setNodes] = useState([]);
  let [responseId, setResponseId] = useState(false);
  let [treeConfig, setTreeConfig] = useState({});
  let [currentNodeId, setCurrentNodeId] = useState(false);
  let [responses, setResponses] = useState([]);
  let [isLoading, setIsLoading] = useState(true);
  let [slugAndRevisionParams, setSlugAndRevisionParams] = useState(
    `${slug}/begin`
  );
  let currentNode =
    setCurrentNodeId !== false
      ? nodes.find((n) => n.id === currentNodeId)
      : false;

  let umamidata = {
    website: treeConfig?.analytics_config?.umami_id,
  };

  const isPreview = () => {
    // @TODO
    // if (window.location.search.includes("revision")) {
    //   let revisionId = window.location.search
    //     .split("revision=")[1]
    //     .split("&")[0];
    //   setSlugAndRevisionParams(`${slug}/begin?revision=${revisionId}`);
    // }

    return window.location.search.includes("preview");
  };

  const getRevisionId = () => {
    let revisonID =
      window?.location?.search?.split("revision=")?.[1]?.split("&")?.[0] || "";
    return revisonID ? `?revision=${revisonID}` : "";
  };

  const shouldContinue = () => {
    return window.location.search.includes("continue");
  };

  const postMessageHandler = (ev) => {
    if (ev.data.type === "SCHEMA_UPDATED") {
      // console.log(
      //   "from SDK - schema updated - I should update my ManywaysContext in SDK",
      //   ev.data
      // );
      setNodes([ev.data.node]);
    }
  };

  useEffect(() => {
    if (!isPreview()) {
      return;
    }
    window.parent.postMessage({ type: "IFRAME_READY" }, "*");
    // listen for postmessage
    window.addEventListener("message", postMessageHandler);
    return () => {
      window.removeEventListener("message", postMessageHandler);
    };
  }, []);

  const getInitialData = async (
    props = {},
    ignoreContinue = false,
    ignorePreview = false
  ) => {
    const { callback = () => {}, callbackArgs = {} } = props;

    if (isPreview()) {
      setIsLoading(false);
      return;
    }

    console.log(ignoreContinue);

    if (shouldContinue() && !ignoreContinue) {
      const sessionId = window.location.search.split("continue=")[1];
      continueJourney(sessionId);
    } else {
      setIsLoading(true);
      await fetch(
        `https://mw-apiv2-prod.fly.dev/response_sessions/${slugAndRevisionParams}${getRevisionId()}`
      )
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
              .querySelectorAll(
                ".mw-node-find-by-form .field-radio-group label"
              )
              .forEach((el) => {
                el.addEventListener("click", function () {
                  if (!!el.closest(".is-current-node-true")) {
                    console.log("no response. should be forwarded");
                    return false;
                  } else {
                    console.log(
                      "response exists. should be restarted in queue"
                    );
                    window.manyways.restartInQueue([{ result: el.innerText }]);
                  }
                });
              });
          }, 400);
        });
    }
  };

  const goForward = async ({ formData }) => {
    if (isPreview()) {
      return;
    }
    if (!!isLoading) {
      console.log("is loading aborting go forward");
      return false;
    }
    setIsLoading(true);
    let theResponse = {
      node_id: currentNodeId,
      response: formData,
    };

    Object.keys(formData).forEach((key) => {
      !isPreview() && !getRevisionId() && window.umami.track(formData[key]);
    });

    await fetch(
      `https://mw-apiv2-prod.fly.dev/response_sessions/${responseId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(theResponse),
      }
    )
      .then((response) => response.json())
      .then((data) => {
        !isPreview() &&
          !getRevisionId() &&
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

  const goBack = async function () {
    if (isPreview()) {
      return;
    }
    let currentNodeIndexInResponses = responses.findIndex(
      (r) => r.node_id === currentNodeId
    );
    currentNodeIndexInResponses =
      currentNodeIndexInResponses > -1
        ? currentNodeIndexInResponses
        : responses.length;
    let theLastResponse = responses[currentNodeIndexInResponses - 1];
    if (
      !!theLastResponse &&
      !!theLastResponse?.node_id &&
      responses?.[0].node_id === theLastResponse?.node_id
    ) {
      restart();
    } else if (!!theLastResponse && !!theLastResponse?.node_id) {
      let _nodes = nodes.filter((n, idx) => idx < nodes.length - 1);
      setNodes(_nodes);
      setCurrentNodeId(theLastResponse?.node_id);
    } else {
      console.log("cannot go back");
      console.log("the last response", theLastResponse);
    }
  };

  const continueJourney = async (sessionId) => {
    setIsLoading(true);
    await fetch(
      `https://mw-apiv2-prod.fly.dev/response_sessions/${sessionId}?render_response_nodes=true`
    )
      .then((response) => response.json())
      .then((data) => {
        const { current_node, responses, revision, rendered_nodes } = data;
        let _nodes = [...rendered_nodes, current_node].map((d) => {
          let final_json = d?.form_schema;
          try {
            if (!!d?.content) {
              final_json = d?.content;
            }
          } catch (e) {
            console.log(e);
          }
          return { ...d, form_schema: final_json };
        });

        setNodes(_nodes);
        setCurrentNodeId(current_node?.id);
        setResponseId(sessionId);
        setResponses(responses);
        setTreeConfig(revision);
        setIsLoading(false);
      });
  };

  const setQueueData = async ({ data, nodes, callbackArgs }) => {
    // setNodes([]);
    // setCurrentNodeId(1);
    // setIsLoading(false);
    await fetch(`https://mw-apiv2-prod.fly.dev/response_sessions/${data?.id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ responses: callbackArgs }),
    })
      .then((response) => response.json())
      .then((d) => {
        // let final_json = d?.form_schema;
        // try {
        //   final_json = d?.content;
        // } catch (e) {
        //   console.log(e);
        // }
        // setNodes([...nodes, { ...d, form_schema: final_json }]);
        // setResponses([...responses.map((r, i) => ({ ...r, node_id: i.id }))]);
        // setCurrentNodeId(d?.id);
        // setIsLoading(false);
        continueJourney(data?.id);
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
    await getInitialData({}, { ignoreContinue: true });
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
    !!window?.manyways._garbage?.remove && window.manyways._garbage?.remove();
    window.manyways._garbage = window.manyways.dispatcher.subscribe(
      "graph/back",
      function (obj) {
        goBack();
      }
    );
  }, [currentNodeId]);

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
        nodes: nodes.map((n) => mergeNodetoLocaleNoSubNode(n, locale)),
        currentNodeId,
        currentNode,
        goBack,
        responses,
        goForward,
        getResponseByNodeID,
        treeConfig,
        journeyNodes,
        locale,
        labels: labels[locale],
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
