import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
// import reportWebVitals from "./reportWebVitals";

console.log("MANYWAYS! ");

class ManywaysWrapper extends HTMLElement {
  connectedCallback() {
    const mountPoint = document.createElement("div");
    this.attachShadow({ mode: "open" }).appendChild(mountPoint);

    const slug = this.getAttribute("slug") || "mesca-rebates";
    const root = ReactDOM.createRoot(mountPoint);
    root.render(<App slug={slug} />);
  }
}

customElements.define("manyways-wrapper", ManywaysWrapper);

window.exports = window.exports || {};

window.manyways = {};
window.manyways.restart = function (e) {
  !!e && e.preventDefault();
  window.umami.track("reload");
  window.location.reload();
};

window.manyways.share = function (e) {
  !!e && e.preventDefault();
  window.umami.track("Share");
  navigator.share({
    title: "MESCA - Rebate Finder",
    url: window.location.href,
  });
};

// var eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
// var eventer = window[eventMethod];
// var messageEvent = eventMethod === "attachEvent" ? "onmessage" : "message";

// eventer(messageEvent, function (e) {
//   if (
//     e.data === "manyways-remove-iframe" ||
//     e.message === "manyways-remove-iframe"
//   ) {
//     const frames = Array.from(
//       document.getElementsByClassName("manyways-iframe-container")
//     );
//     frames.forEach((frame) => {
//       frame.remove();
//     });
//   }
// });

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
