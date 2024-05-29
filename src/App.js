import styles from "./styles/App.css";

import vars from "./styles/variables.css";
import layoutStyles from "./styles/layouts.css";
import buttonStyles from "./styles/buttons.css";
import mediaStyles from "./styles/media.css";
import formStyles from "./styles/forms.css";
import loaderStyles from "./styles/loader.css";
import mescaStyles from "./styles/mesca2.css";

// import all styles as a var called css

import { ManywaysProvider } from "./lib/ManywaysContext";

function App({ locale, slug, mode = "scroll", cssString = false }) {
  const stylesToString =
    cssString ||
    `
  ${styles}  
  ${vars}
    ${layoutStyles}
    ${buttonStyles}
    ${mediaStyles}
    ${formStyles}
    ${loaderStyles}
    ${mescaStyles}
  `;

  return (
    <ManywaysProvider
      slug={"heat-pump-right-sizing-guide"}
      locale={locale}
      mode={mode}
    >
      <style dangerouslySetInnerHTML={{ __html: stylesToString }}></style>
    </ManywaysProvider>
  );
}

export default App;
