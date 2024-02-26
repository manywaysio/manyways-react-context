import { useManyways } from "./ManywaysContext";
import { mergeNodetoLocaleNoSubNode } from "./utils/helpers";

const Header = () => {
  const { classNamePrefix, treeConfig, locale } = useManyways();

  const content = mergeNodetoLocaleNoSubNode(treeConfig?.run_mode, locale);

  console.log(treeConfig);

  return (
    <header>
      <div className={`${classNamePrefix}-container`}>
        {content?.logo && (
          <img
            className={`${classNamePrefix}-logo`}
            src={content?.logo}
            alt="logo"
          />
        )}
        {content?.header && (
          <div
            className="text-container"
            dangerouslySetInnerHTML={{ __html: content?.header }}
          />
        )}
      </div>
    </header>
  );
};

export default Header;
