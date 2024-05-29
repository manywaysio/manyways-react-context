import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
// import reportWebVitals from "./reportWebVitals";

export { ManywaysProvider } from "./lib/ManywaysContext";

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

    const slug = this.getAttribute("slug") || "heat-pump-right-sizing-guide";
    const locale = this.getAttribute("locale");
    const root = ReactDOM.createRoot(mountPoint);
    root.render(<App locale={locale} slug={slug} />);
  }
}

customElements.define("manyways-wrapper", ManywaysWrapper);

window.exports = window.exports || {};

window.manyways = {};
window.manyways.restart = function (e) {
  !!e && e.preventDefault();
  window.umami.track("restart");
  if (window.location.search.includes("continue") !== -1) {
    window.location.href = window.location.href.split("?")[0];
  } else {
    window.location.reload();
  }
};

window.manyways.dispatcher = (function () {
  var topics = {};
  var hOP = topics.hasOwnProperty;

  return {
    subscribe: function (topic, listener) {
      // Create the topic's object if not yet created
      if (!hOP.call(topics, topic)) topics[topic] = [];

      // Add the listener to queue
      var index = topics[topic].push(listener) - 1;

      // Provide handle back for removal of topic
      return {
        remove: function () {
          delete topics[topic][index];
        },
      };
    },
    publish: function (topic, info) {
      // If the topic doesn't exist, or there's no listeners in queue, just leave
      if (!hOP.call(topics, topic)) return;

      // Cycle through topics queue, fire!
      topics[topic].forEach(function (item) {
        item(info != undefined ? info : {});
      });
    },
  };
})();

window.manyways.back = function (e) {
  window.manyways.dispatcher.publish("graph/back");
};

window.manyways.share = function (e) {
  if (e?.type === "click" || e?.keyCode === 13) {
    !!e && e.preventDefault();
    window.umami.track("Share");
    navigator.share({
      title: "MESCA - Rebate Finder",
      url: window.location.href,
    });
  }
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
