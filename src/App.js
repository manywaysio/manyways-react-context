import styles from "./styles/App.css";

import vars from "./styles/variables.css";
import layoutStyles from "./styles/layouts.css";
import buttonStyles from "./styles/buttons.css";
import mediaStyles from "./styles/media.css";
import formStyles from "./styles/forms.css";
import loaderStyles from "./styles/loader.css";
import mescaStyles from "./styles/mesca2.css";

import { useState, useEffect } from "react";

// import all styles as a var called css

import { ManywaysProvider } from "./lib/ManywaysContext";
import { useRef } from "react";

function App({ locale, slug, mode = "scroll" }) {
  const stylesToString = `
  ${styles}
  ${vars}
    ${layoutStyles}
    ${buttonStyles}
    ${mediaStyles}
    ${formStyles}
    ${loaderStyles}
    ${mescaStyles}
  `;

  const [_slug, _setSlug] = useState("");
  const analyticsHasFired = useRef(false);

  useEffect(() => {
    if (
      !analyticsHasFired.current &&
      window.manyways &&
      window.manyways.pushAnalyticsPageView
    ) {
      window.manyways.pushAnalyticsPageView(
        "virtual_pageview",
        "https://mitsubishielectric.ca/en/rebate-finder/landing",
        "Rebate finder landing | MESCA"
      );
      analyticsHasFired.current = true;
    }
  }, []);

  useEffect(() => {
    // get slug query param from url and set to state
    const urlParams = new URLSearchParams(window.location.search);
    const __slug = urlParams.get("slug");
    console.log("setting slug", __slug);
    _setSlug(!!__slug ? __slug : slug);

    const data = {
      event: eventName,
      page_url: pageUrl,
      page_title: pageTitle,
    };
    if (window.dataLayer && typeof window.dataLayer.push === "function") {
      window.dataLayer.push(data);
      console.log("Page View Event:", data);
    } else {
      console.log("No dataLayer available for analytics - page view:", data);
    }
  }, []);

  return (
    !!_slug && (
      <ManywaysProvider slug={_slug} locale={locale} mode={mode}>
        <style dangerouslySetInnerHTML={{ __html: stylesToString }}></style>
      </ManywaysProvider>
    )
  );
}

export default App;
