import { useManyways } from "./ManywaysContext";


const Footer = () => {
  const {
    classNamePrefix,
    treeConfig,
  } = useManyways();
  
    return (
      <div className="footer">
        <div className={`${classNamePrefix}-container`}>
          {treeConfig?.run_mode?.customFooter && 
          <div className="footer-content" dangerouslySetInnerHTML={{ __html: treeConfig?.run_mode?.customFooter }} />
          }
        </div>
      </div>
    );
  };
  
  export default Footer;
  