// import { useManyways } from "./ManywaysContext";
// import { mergeNodetoLocaleNoSubNode } from "./utils/helpers";
import CruiseIq from "../icons/CruiseIq.js";
import Hamburger from "../icons/Hamburger.js";

const Header = () => {
  // const { classNamePrefix, treeConfig, locale } = useManyways();
  // const content = mergeNodetoLocaleNoSubNode(treeConfig?.run_mode, locale);

  // console.log("Header treeConfig", treeConfig);

  return (
    <header>
      <div className="header-container mt-8">
        <div className="header-item">
          <button>
            <Hamburger />
          </button>
          <CruiseIq />
        </div>
        <div className="header-item">
          <button>Ask Charlotte</button>
          <button></button>
        </div>
      </div>
    </header>
  );
};

export default Header;
