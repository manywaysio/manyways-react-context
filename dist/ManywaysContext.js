"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useManyways = exports.ManywaysProvider = void 0;
require("core-js/modules/web.dom-collections.iterator.js");
require("core-js/modules/es.promise.js");
require("core-js/modules/es.json.stringify.js");
var _react = require("react");
var _NodeRenderer = _interopRequireDefault(require("./NodeRenderer"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const ManywaysContext = /*#__PURE__*/(0, _react.createContext)(null);
const ManywaysProvider = _ref => {
  var _treeConfig$run_mode, _treeConfig$run_mode2;
  let {
    children,
    slug,
    classNamePrefix = "mw",
    mode = "scroll"
  } = _ref;
  let [nodes, setNodes] = (0, _react.useState)([]);
  let [responseId, setResponseId] = (0, _react.useState)(false);
  let [treeConfig, setTreeConfig] = (0, _react.useState)({});
  let [currentNodeId, setCurrentNodeId] = (0, _react.useState)(false);
  let [responses, setResponses] = (0, _react.useState)([]);
  let currentNode = setCurrentNodeId !== false ? nodes.find(n => n.id === currentNodeId) : false;
  const getInitialData = () => {
    fetch("https://apiv2.manyways.io/response_sessions/".concat(slug, "/begin")).then(response => response.json()).then(data => {
      setNodes([data === null || data === void 0 ? void 0 : data.current_node]);
      setCurrentNodeId(data === null || data === void 0 ? void 0 : data.node_id);
      setResponseId(data === null || data === void 0 ? void 0 : data.id);
      setTreeConfig(data === null || data === void 0 ? void 0 : data.revision);
    });
  };
  const goForward = async _ref2 => {
    let {
      formData
    } = _ref2;
    let theResponse = {
      node_id: currentNode === null || currentNode === void 0 ? void 0 : currentNode.id,
      response: formData
    };
    await fetch("https://apiv2.manyways.io/response_sessions/".concat(responseId), {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(theResponse)
    }).then(response => response.json()).then(data => {
      console.log(data);
      setNodes([...nodes, data]);
      setResponses([...responses, theResponse]);
      setCurrentNodeId(data === null || data === void 0 ? void 0 : data.id);
    });
  };
  const goBack = async () => {
    let theLastResponse = responses[responses.length - 1];
    if (!!theLastResponse && !!(theLastResponse !== null && theLastResponse !== void 0 && theLastResponse.node_id)) {
      setCurrentNodeId(theLastResponse === null || theLastResponse === void 0 ? void 0 : theLastResponse.node_id);
    } else {
      console.log("cannot go back");
    }
  };
  (0, _react.useEffect)(() => {
    console.log("init");
    getInitialData();
  }, [slug]);
  let getResponseByNodeID, journeyNodes, locale, setLocale, shareJourney, copyLink;
  return /*#__PURE__*/React.createElement(ManywaysContext.Provider, {
    value: {
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
      mode
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "".concat(classNamePrefix, "-").concat(slug)
  }, (treeConfig === null || treeConfig === void 0 || (_treeConfig$run_mode = treeConfig.run_mode) === null || _treeConfig$run_mode === void 0 ? void 0 : _treeConfig$run_mode.logo) && /*#__PURE__*/React.createElement("img", {
    className: "".concat(classNamePrefix, "-logo"),
    src: treeConfig === null || treeConfig === void 0 || (_treeConfig$run_mode2 = treeConfig.run_mode) === null || _treeConfig$run_mode2 === void 0 ? void 0 : _treeConfig$run_mode2.logo
  }), /*#__PURE__*/React.createElement(_NodeRenderer.default, null), children));
};
exports.ManywaysProvider = ManywaysProvider;
const useManyways = () => (0, _react.useContext)(ManywaysContext);
exports.useManyways = useManyways;