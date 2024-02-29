// import { useManyways } from "./ManywaysContext";
// import { mergeNodetoLocaleNoSubNode } from "./utils/helpers";
import CruiseIq from "../icons/CruiseIq.js";
import Hamburger from "../icons/Hamburger.js";
import Speaker from "../icons/Speaker.js";
import charlotte from "../pictures/charlotte.png";

const Header = () => {
  // const { classNamePrefix, treeConfig, locale } = useManyways();
  // const content = mergeNodetoLocaleNoSubNode(treeConfig?.run_mode, locale);

  // console.log("Header treeConfig", treeConfig);

  return (
    <header>
      <div className="header-container mt-8">
        <div className="header-item">
          <button className="hamburger-button" onClick={() => console.log("clicked")}>
            <Hamburger />
          </button>
          <div className="mobile-cruise">
            <CruiseIq />
          </div>
        </div>
        <div className="desktop-cruise">
          <CruiseIq />
        </div>

        <div className="header-item">
          <button className="char-button">
            <p>Ask Charlotte</p>
            <img className="char-photo-header" src={charlotte} />
          </button>
          <button className="speaker-button">
            <Speaker />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
