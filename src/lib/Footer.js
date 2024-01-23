import { useEffect } from "react";
import { useManyways } from "./ManywaysContext";


const Footer = () => {

  const {
    classNamePrefix,
    treeConfig,
  } = useManyways();
  
  useEffect(() => {
    if (!treeConfig?.run_mode?.scripts) {
      return 
    }
    const scriptElement = document.createElement('script');
    scriptElement.innerHTML = treeConfig?.run_mode?.scripts;
    document.head.appendChild(scriptElement);

  }, [treeConfig?.run_mode?.scripts]);

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