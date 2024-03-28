import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
// import reportWebVitals from "./reportWebVitals";

try {
  const script = document.createElement("script");
  script.src = "https://unpkg.com/share-api-polyfill/dist/share-min.js";
  script.async = true;
  document.head.appendChild(script);
} catch (error) {
  console.log(error);
}

class ManywaysWrapper extends HTMLElement {
  connectedCallback() {
    const mountPoint = document.createElement("div");
    this.attachShadow({ mode: "open" }).appendChild(mountPoint);

    const slug = this.getAttribute("slug") || "cruise-selector";
    const locale = this.getAttribute("locale");
    const root = ReactDOM.createRoot(mountPoint);
    root.render(<App locale={locale} slug={slug} />);
  }
}

customElements.define("manyways-wrapper", ManywaysWrapper);

window.exports = window.exports || {};

window.manyways = {};

window.manyways.restart = function (e) {
  if (e) e.preventDefault();

  if (window?.umami?.track) {
    window.umami.track("restart");
  }

  // Should a fade animation/opacity be added here?
  // setTimeout(function () {
  //   window.location.reload();
  // }, 1000);
};

window.manyways.share = function (e) {
  !!e && e.preventDefault();
  !!window?.umami && !!window?.umami?.track && window.umami.track("Share");
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
