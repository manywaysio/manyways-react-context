import { useEffect } from "react";

import styles from "./styles/App.css";
import "./index.css";

import vars from "./styles/variables.css";
import layoutStyles from "./styles/layouts.css";
import buttonStyles from "./styles/buttons.css";
import mediaStyles from "./styles/media.css";
import formStyles from "./styles/forms.css";
import loaderStyles from "./styles/loader.css";
import eptStyles from "./styles/ept.css";
import swiperStyles from "./styles/swiperbundle.css";

import { ManywaysProvider } from "./lib/ManywaysContext";

function App({ locale, slug, mode = "scroll" }) {
  useEffect(() => {
    // document.body.style.overflowY = "hidden";
    document.body.style.margin = 0;
    const style = document.createElement("style");
    style.type = "text/css";
    style.innerHTML = `
    ::-webkit-scrollbar { width: 0; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: transparent; }
    ::-webkit-scrollbar-thumb:hover { background: transparent; }
  `;
    document.head.appendChild(style);
    return () => {
      // document.body.style.overflowY = "";
      document.body.style.margin = "";
      document.body.removeChild(style);
    };
  }, []);

  const stylesToString = `
  ${styles}  
  ${vars}
    ${layoutStyles}
    ${buttonStyles}
    ${mediaStyles}
    ${formStyles}
    ${loaderStyles}
    ${eptStyles}
    ${swiperStyles}
  `;

  return (
    <ManywaysProvider slug={slug} locale={locale} mode={mode}>
      <style dangerouslySetInnerHTML={{ __html: stylesToString }}></style>
    </ManywaysProvider>
  );
}

export default App;
