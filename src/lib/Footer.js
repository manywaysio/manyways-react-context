import { useManyways } from "./ManywaysContext";


const Footer = () => {
  const {
    classNamePrefix,
    treeConfig,
  } = useManyways();
  
    return (
      <div className="footer">
        <div className={`${classNamePrefix}-container-footer`}>
          {treeConfig?.run_mode?.footer && 
          <div className="footer-content" dangerouslySetInnerHTML={{ __html: treeConfig?.run_mode?.footer }} />
          }
        </div>
      </div>
    );
  };
  
  export default Footer;