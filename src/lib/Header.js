import { useManyways } from "./ManywaysContext";
import { mergeNodetoLocaleNoSubNode } from "./utils/helpers";
import mescaGraphic from "../assets/icons/mesca.svg";

const Header = () => {
  const { classNamePrefix, treeConfig, locale } = useManyways();

  const content = mergeNodetoLocaleNoSubNode(treeConfig?.run_mode, locale);

  // console.log(treeConfig);

  return (
    <div className={`${classNamePrefix}-container `}>
      <div className="header-actions-row">
        <form
          id="redirectForm"
          target="_blank"
          action={
            locale === "fr"
              ? "https://www.mitsubishielectric.ca/fr/hvac/where-to-buy"
              : "https://www.mitsubishielectric.ca/en/hvac/where-to-buy"
          }
          method="get"
          className="where-to-buy where-to-buy-header"
        >
          <label htmlFor="postal_code_header">
            {locale === "fr" ? "Où Acheter" : "Where to buy"}
          </label>
          <div className="findDealerForm">
            <input
              style={{ display: "none" }}
              id="commercial_header"
              name="commercial"
              value="residential"
              type="text"
              readOnly
            />
            <input
              id="postal_code_header"
              name="postal_code"
              type="text"
              pattern="[A-Za-z][0-9][A-Za-z] ?[0-9][A-Za-z][0-9]"
              onInvalid={(e) =>
                e.target.setCustomValidity("Please enter a valid postal code")
              }
              onChange={(e) => e.target.setCustomValidity("")}
              required
              placeholder={locale === "fr" ? "Code postal" : "Postal Code"}
            />
            <button type="submit">
              {locale === "fr" ? "Trouvez un concessionnaire" : "Find a dealer"}
            </button>
          </div>
        </form>
        <div className="header-buttons-divider"></div>
        <a
          className="heat-pump-solutions-btn"
          href={
            locale === "fr"
              ? "https://www.mitsubishielectric.ca/fr/hvac/home-owners/ductless-solutions"
              : "https://www.mitsubishielectric.ca/en/hvac/home-owners/ductless-solutions"
          }
          target="_blank"
          rel="noopener noreferrer"
        >
          {locale === "fr"
            ? "SOLUTIONS DE POMPES À CHALEUR"
            : "HEAT PUMP SOLUTIONS"}
        </a>
      </div>
      <div className={`mesca-header mesca-header-with-svg  `}>
        {/* SVG positioned absolutely */}
        <div className="mesca-svg-container">
          <img src={mescaGraphic} alt="Mesca graphic" className="mesca-svg" />
        </div>

        {/* Existing header content */}
        {/* {content?.logo && (
          <img
            className={`${classNamePrefix}-logo`}
            src={content?.logo}
            alt="logo"
          />
        )}*/}
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
