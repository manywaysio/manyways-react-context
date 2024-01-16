"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _ManywaysContext = require("./ManywaysContext");
const NextAndBack = _ref => {
  let {
    currentNode = {}
  } = _ref;
  const {
    goBack,
    responses,
    classNamePrefix,
    mode
  } = (0, _ManywaysContext.useManyways)();
  let theResponse = responses.find(r => r.node_id === (currentNode === null || currentNode === void 0 ? void 0 : currentNode.id));
  return /*#__PURE__*/React.createElement("div", {
    className: "".concat(classNamePrefix, "-next-and-back"),
    style: {
      display: mode === "scroll" && !!theResponse ? "none" : "block"
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "".concat(classNamePrefix, "-back"),
    onClick: e => {
      e.preventDefault();
      goBack();
    }
  }, "Back"), /*#__PURE__*/React.createElement("button", {
    className: "".concat(classNamePrefix, "-next"),
    type: "submit"
  }, "Submit"));
};
var _default = exports.default = NextAndBack;