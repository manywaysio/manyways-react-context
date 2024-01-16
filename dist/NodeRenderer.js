"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
require("core-js/modules/es.symbol.description.js");
var _ManywaysContext = require("./ManywaysContext");
var _validatorAjv = _interopRequireDefault(require("@rjsf/validator-ajv8"));
var _core = _interopRequireDefault(require("@rjsf/core"));
var _NextAndBack = _interopRequireDefault(require("./NextAndBack"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
const NodeRenderer = props => {
  const {
    nodes,
    goBack,
    responses,
    classNamePrefix,
    currentNodeId,
    goForward,
    mode,
    treeConfig
  } = (0, _ManywaysContext.useManyways)();
  return nodes.filter(n => {
    if (mode === "scroll") {
      return true;
    } else {
      return n.id === currentNodeId;
    }
  }).map(currentNode => {
    var _treeConfig$run_mode;
    let theResponse = responses.find(r => r.node_id === (currentNode === null || currentNode === void 0 ? void 0 : currentNode.id));

    // UI VARIABLES
    let UIVariables = (currentNode === null || currentNode === void 0 ? void 0 : currentNode.ui_variables) || {};
    let globalUIVariables = (treeConfig === null || treeConfig === void 0 || (_treeConfig$run_mode = treeConfig.run_mode) === null || _treeConfig$run_mode === void 0 ? void 0 : _treeConfig$run_mode.ui_variables) || {};
    let impliedUIVariables = _objectSpread(_objectSpread({}, globalUIVariables), UIVariables);
    let {
      backgroundImage,
      nodeLayout,
      foregroundImage,
      isFullScreen
    } = impliedUIVariables;
    return /*#__PURE__*/React.createElement("div", {
      className: "".concat(classNamePrefix, "-node \n          is-current-node-").concat(currentNodeId === (currentNode === null || currentNode === void 0 ? void 0 : currentNode.id), " \n          has-response-").concat(!!theResponse, "\n          layout-").concat(nodeLayout || "center", "\n          is-full-screen-").concat(!!isFullScreen, "\n          has-background-").concat(!!backgroundImage, "\n          has-foreground-").concat(!!foregroundImage, "\n          "),
      style: !!backgroundImage ? {
        backgroundImage: "url(".concat(backgroundImage, ")")
      } : {}
    }, !!foregroundImage && /*#__PURE__*/React.createElement("div", {
      className: "".concat(classNamePrefix, "-foreground-image-wrapper")
    }, /*#__PURE__*/React.createElement("img", {
      className: "".concat(classNamePrefix, "-foreground-image"),
      src: foregroundImage
    })), /*#__PURE__*/React.createElement(_core.default, {
      disabled: !!theResponse,
      formData: (theResponse === null || theResponse === void 0 ? void 0 : theResponse.response) || {},
      className: "".concat(classNamePrefix, "-form \n          has-response-").concat(!!theResponse, "\n          "),
      key: (currentNode === null || currentNode === void 0 ? void 0 : currentNode.id) || 1123456789,
      onSubmit: goForward,
      schema: (currentNode === null || currentNode === void 0 ? void 0 : currentNode.form_schema) || {},
      validator: _validatorAjv.default,
      uiSchema: !!(currentNode !== null && currentNode !== void 0 && currentNode.ui_schema) ? currentNode === null || currentNode === void 0 ? void 0 : currentNode.ui_schema : {}
    }, /*#__PURE__*/React.createElement(_NextAndBack.default, {
      currentNode: currentNode
    })));
  });
};
var _default = exports.default = NodeRenderer;