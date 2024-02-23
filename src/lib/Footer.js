import { useManyways } from "./ManywaysContext";
import { mergeNodetoLocaleNoSubNode } from "./utils/helpers";

const Footer = () => {
  const { classNamePrefix, treeConfig, locale } = useManyways();

  const content = mergeNodetoLocaleNoSubNode(treeConfig?.run_mode, locale);

  return (
    <div className="footer">
      <div className={`${classNamePrefix}-container-footer`}>
        {content?.footer && (
          <div
            className="footer-content"
            dangerouslySetInnerHTML={{ __html: content?.footer }}
          />
        )}
      </div>
    </div>
  );
};

export default Footer;
