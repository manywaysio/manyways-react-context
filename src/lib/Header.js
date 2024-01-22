import { useManyways } from "./ManywaysContext";

const Header = () => {
  const { classNamePrefix, treeConfig } = useManyways();

  return (
    <header>
      <div className={`${classNamePrefix}-container`}>
        {treeConfig?.run_mode?.logo && (
          <img
            className={`${classNamePrefix}-logo`}
            src={treeConfig?.run_mode?.logo}
            alt="logo"
          />
        )}
        {treeConfig?.run_mode?.header && (
          <div
            className="text-container"
            dangerouslySetInnerHTML={{ __html: treeConfig?.run_mode?.header }}
          />
        )}
      </div>
    </header>
  );
};

export default Header;
