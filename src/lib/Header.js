import { useManyways } from "./ManywaysContext";
import { mergeNodetoLocaleNoSubNode } from "./utils/helpers";
import mescaGraphic from "../assets/icons/mesca.svg";

const Header = () => {
  const { classNamePrefix, treeConfig, locale } = useManyways();

  const content = mergeNodetoLocaleNoSubNode(treeConfig?.run_mode, locale);

  // console.log(treeConfig);

  return (
    <div>
      <div
        className={`mesca-header mesca-header-with-svg  ${classNamePrefix}-container`}
      >
        {/* SVG positioned absolutely */}
        <div className="mesca-svg-container">
          <img src={mescaGraphic} alt="Mesca graphic" className="mesca-svg" />
        </div>

        {/* Existing header content */}
        {content?.logo && (
          <img
            className={`${classNamePrefix}-logo`}
            src={content?.logo}
            alt="logo"
          />
        )}
        {content?.header && (
          <div
            className={`text-container ${classNamePrefix}-container`}
            dangerouslySetInnerHTML={{ __html: content?.header }}
          />
        )}
      </div>
    </div>
  );
};

export default Header;
