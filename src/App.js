import styles from "./styles/App.css";

import vars from "./styles/variables.css";
import layoutStyles from "./styles/layouts.css";
import buttonStyles from "./styles/buttons.css";
import mediaStyles from "./styles/media.css";
import formStyles from "./styles/forms.css";
import loaderStyles from "./styles/loader.css";
import mescaStyles from "./styles/mesca2.css";

import { usState, useEffect } from "react";

// import all styles as a var called css

import { ManywaysProvider } from "./lib/ManywaysContext";

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

  useEffect(() => {
    // get slug query param from url and set to state
    const urlParams = new URLSearchParams(window.location.search);
    const __slug = urlParams.get("slug");
    _setSlug(!!__slug ? __slug : slug);
  }, []);

  return (
    !!slug && (
      <ManywaysProvider slug={_slug} locale={locale} mode={mode}>
        <style dangerouslySetInnerHTML={{ __html: stylesToString }}></style>
      </ManywaysProvider>
    )
  );
}

export default App;
