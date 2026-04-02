import { useManyways } from "../ManywaysContext";
import { Fragment, useEffect, useState } from "react";
import { FaMinus, FaPlus } from "react-icons/fa6";
import { MdInfo } from "react-icons/md";

const baseUrl =
  "https://mesca-submittal-rebate-tic.manyways.io/api/rebate-programs/lookup";

const RESIDENTIAL = [
  "MSZ",
  "MFZ",
  "SLZ",
  "MLZ",
  "SVZ",
  "PVA",
  "PAA",
  "SEZ",
  "PEAD",
];
const LIGHT_COMMERCIAL = [
  "PKFY",
  "PFFY",
  "PKA",
  "PLA",
  "PLFY",
  "PVFY",
  "PEFY",
  "PMFY",
  "PKA",
  "PVA",
  "PCA",
  "PAA",
  "PEAD",
];

const images = {
  "Wall Mounted":
    "https://mwassets.imgix.net/Organization_3/MESCA-wall-mounted.jpg",
  "Floor Mounted":
    "https://mwassets.imgix.net/Organization_3/MESCA-floor-mounted.jpg",
  "4 Way Ceiling Cassette":
    "https://mwassets.imgix.net/Organization_3/MESCA-4-way-ceiling-cassette.jpg",
  "1 Way Ceiling Cassette":
    "https://mwassets.imgix.net/Organization_3/MESCA-1-way-ceiling-cassette.jpg",
  // "Multi position AHU - cooling":
  //   "https://mwassets.imgix.net/Organization_3/MESCA-central-cooling-cycle.jpg",
  "Multi position AHU":
    "https://mwassets.imgix.net/Organization_3/MESCA-central-heating-cycle.jpg",
  "Hybrid Heating & Cooling":
    "https://mwassets.imgix.net/Organization_3/MESCA-a-coil.jpg",
  "Ceiling suspended":
    "https://mwassets.imgix.net/Organization_3/PCA-CE~1.jpeg",
  "Ceiling Concealed":
    "https://mwassets.imgix.net/Organization_3/Ceiling_concealed.jpg",
};

const categoryTranslations = {
  "Wall Mounted": "Unité murale",
  "Floor Mounted": "Unité console",
  "4 Way Ceiling Cassette": "Unité cassette de plafond à 4 voies",
  "1 Way Ceiling Cassette": "Unité cassette de plafond à 1 voie",
  "Multi position AHU": "Unité de traitement d'air multiposition",
  "Hybrid Heating & Cooling": "Chauffage hybride et climatisation",
  "Ceiling suspended": "Unité suspendue au plafond",
  "Ceiling Concealed": "Unité de plafond encastrable",
  "Multi Zone": "Multizone",
};

const findProvincialRebateKey = (prov) => {
  if (prov === "British Columbia") return "bc";
  else if (prov === "Alberta") return "ab";
  else if (prov === "Manitoba") return "mb";
  else if (prov === "New Brunswick") return "nb";
  else if (prov === "Newfoundland & Labrador") return "nl";
  else if (prov === "Nova Scotia") return "ns";
  else if (prov === "Ontario") return "ofalse";
  else if (prov === "Saskatchewan") return "sk";
  else if (prov === "Prince Edward Island") return "pei";
  else if (prov === "Quebec") return "qc";
  else if (prov === "Northwest Territories") return "nwt";
  else if (prov === "Nunavut") return "nunavut";
  else return "yukofalse";
};

const CustomTable = (props) => {
  const { currentNode, responses, responseId, locale, treeConfig } =
    useManyways();
  const { schema } = props;
  const [applicationType, setApplicationType] = useState("residential");
  const [categoryApplicationType, setCategoryApplicationType] = useState("");
  const [unitsByCategory, setUnitsByCategory] = useState([]);
  const [province, setProvince] = useState(null);
  const [theProvince, setTheProvince] = useState("");
  const [collapsedCategories, setCollapsedCategories] = useState({});
  const [toggleImage, setToggleImage] = useState(null);
  const [sortBy, setSortBy] = useState("Outdoor Unit");
  const [rebateTypes, setRebateTypes] = useState([]);

  const formatDate = (date, locale) => {
    return new Intl.DateTimeFormat(locale, {
      year: "numeric",
      month: "short",
      day: "numeric",
      timeZone: "UTC",
    }).format(date);
  };

  const lastUpdatedDate = new Date(treeConfig?.run_mode.last_updated_data);

  const formattedDateEN = formatDate(lastUpdatedDate, "en-US");
  const formattedDateFR = formatDate(lastUpdatedDate, "fr-FR");

  // let nodeSelection = responses
  //   .slice()
  //   .reverse()
  //   .find((r) => !!r.response?.application_type);

  let getResponses = async (responseId) => {
    let responses = await fetch(
      `https://mw-apiv2-prod.fly.dev/response_sessions/${responseId}?render_response_nodes=true`,
    )
      .then((r) => r.json())
      .then((r) => r?.responses);

    let _provinceName = responses.reverse().find((r) => r.node_id === 2132);
    console.log("NODEID RESPONSE", responses);
    setTheProvince(_provinceName?.response?.province_name);

    let _lookupData = responses.reverse().find((r) => r.node_id === 2132);
    setApplicationType(
      _lookupData?.response?.application_type || "residential",
    );

    setCategoryApplicationType(
      _lookupData?.response?.hvac_type || "Single Zone",
    );

    // setLookupData(
    //   _lookupData?.response?.look_up_responses?.["July 3 2024 - table builder"]
    //     ?.result || []
    // );

    // getProvincialRebates({ lookupData: _lookupData, province: _provinceName });
  };

  useEffect(() => {
    if (!province) {
      return;
    }
    getProvincialRebates({ province: theProvince });
  }, [categoryApplicationType, province]);

  const sortUnits = (lookupData) => {
    if (lookupData.length < 1) {
      return {};
    }

    // console.log(lookupData);

    const units = lookupData
      .filter((row) => {
        if (row.multiZone) {
          return true;
        }
        if (
          applicationType === "Residential" &&
          RESIDENTIAL.some((prefix) =>
            row.indoorUnitModelNumber.includes(prefix),
          )
        ) {
          return true;
        }
        if (
          applicationType === "Light Commercial" &&
          LIGHT_COMMERCIAL.some((prefix) =>
            row.indoorUnitModelNumber.includes(prefix),
          )
        ) {
          return true;
        }
        return false;
      })
      .reduce((acc, item) => {
        const groupKey = (() => {
          if (item.multiZone) {
            return "Multi Zone";
          }
          if (item.indoorUnitModelNumber.includes("MSZ")) return "Wall Mounted";
          if (item.indoorUnitModelNumber.includes("PKA")) return "Wall Mounted";
          if (item.indoorUnitModelNumber.includes("MFZ"))
            return "Floor Mounted";
          if (item.indoorUnitModelNumber.includes("SLZ"))
            return "4 Way Ceiling Cassette";
          if (item.indoorUnitModelNumber.includes("PLA"))
            return "4 Way Ceiling Cassette";
          if (item.indoorUnitModelNumber.includes("MLZ"))
            return "1 Way Ceiling Cassette";
          if (item.indoorUnitModelNumber.includes("SVZ"))
            return "Multi position AHU";
          if (item.indoorUnitModelNumber.includes("PVA"))
            return "Multi position AHU";
          if (item.indoorUnitModelNumber.includes("PAA"))
            return "Hybrid Heating & Cooling";
          if (item.indoorUnitModelNumber.includes("PCA"))
            return "Ceiling suspended";
          if (item.indoorUnitModelNumber.includes("SEZ"))
            return "Ceiling Concealed";
          if (item.indoorUnitModelNumber.includes("PCA"))
            return "Ceiling Suspended";
          if (item.indoorUnitModelNumber.includes("PEAD"))
            return "Ceiling Concealed";
          return "Multi Zone";
        })();

        if (!acc[groupKey]) {
          acc[groupKey] = [];
        }
        acc[groupKey].push(item);
        return acc;
      }, {});

    const sortedUnits = Object.keys(units).sort((a, b) => {
      if (a === "Multi Zone") return 1;
      if (b === "Multi Zone") return -1;
      return a.localeCompare(b);
    });

    const sortedUnitsByCategory = sortedUnits.reduce((acc, key) => {
      acc[key] = units[key];
      return acc;
    }, {});

    return sortedUnitsByCategory;
  };

  function createFilterFunction(node) {
    return function (item) {
      // HVAC Type conditions
      let hvacTypeCondition = true;
      if (node.hvac_type === "Multi Zone") {
        hvacTypeCondition = item.multiZone;
      } else if (node.hvac_type === "Single Zone") {
        hvacTypeCondition = !item.multiZone && item.isDucted;
      } else if (node.hvac_type === "Centrally ducted") {
        hvacTypeCondition = !item.isDucted;
      }

      // Cold climate condition
      const coldClimateCondition =
        node.cold_climate === "Cold climate"
          ? item.isColdClimate
          : !item.isColdClimate;

      // Energy Star certification condition
      const energyStarCondition =
        node.energy_star_cert === "Energy Star Certified"
          ? item.isEnergyStar
          : true;

      // Combine all conditions
      return hvacTypeCondition && coldClimateCondition && energyStarCondition;
    };
  }

  const getProvincialRebates = async ({ province }) => {
    if (!province) return;
    let d = await fetch(`${baseUrl}?province=${province}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      // body: JSON.stringify({ province: theProvince, lookupData }),
    }).then((r) => r.json());

    let nodeItem = JSON.parse(schema?.text);

    setRebateTypes(d?.rebates);

    const sorted = sortUnits(
      d?.products.filter(createFilterFunction(nodeItem)),
    );

    setUnitsByCategory(sorted);
  };

  useEffect(() => {
    getResponses(responseId);
  }, [currentNode, responseId]);

  useEffect(() => {
    if (!responses) {
      return;
    }
    const lastResponse = responses[responses?.length - 1];
    // console.log("province", lastResponse?.response?.province_name);
    setProvince(lastResponse?.response?.province_name);
  }, [responses]);

  const toggleCollapse = (e, category) => {
    e.preventDefault();
    setCollapsedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  let indoorUnitTypeLabel =
    locale === "fr" ? "Modèle Intérieur" : "Indoor Unit # ";

  if (categoryApplicationType === "Multi Zone") {
    indoorUnitTypeLabel =
      locale === "fr" ? "Type de Modèle Intérieur" : "Indoor Unit Type ";
  }

  return Object.keys(unitsByCategory)?.length < 1 ? (
    <div className="no-results">
      <p>{locale === "fr" ? "Aucun résultat trouvé" : "No results found"}</p>
    </div>
  ) : (
    <>
      <div className="legend-and-sorts">
        <div className="es-legend">
          <img
            src="https://mwassets.imgix.net/Organization_3/energystar.png"
            alt="energy star certified"
          />{" "}
          <p>
            {locale === "fr"
              ? "Homologués ENERGY STAR®"
              : "ENERGY STAR® certified"}
          </p>
        </div>
        <div className="sort-holder">
          <button
            className={sortBy === "Heat Pump Size" ? "selected" : ""}
            onClick={(e) => {
              e.preventDefault();
              setSortBy("Heat Pump Size");
              window.manyways.pushAnalyticsClick(
                "rebate_form_click",
                "advanced_search",
                theProvince,
                "Heat Pump Size",
                "https://mitsubishielectric.ca/en/rebate-finder/submit/advanced-search",
              );
            }}
          >
            {locale === "fr" ? "Taille de Thermopompe" : "Heat Pump Size"}
          </button>
          <button
            className={sortBy === "Outdoor Unit" ? "selected" : ""}
            onClick={(e) => {
              e.preventDefault();
              setSortBy("Outdoor Unit");
              window.manyways.pushAnalyticsClick(
                "rebate_form_click",
                "advanced_search",
                theProvince,
                "Ourdoor Unit (A-Z)",
                "https://mitsubishielectric.ca/en/rebate-finder/submit/advanced-search",
              );
            }}
          >
            {locale === "fr" ? "Modèle Extérieur (A-Z)" : "Outdoor Unit (A-Z)"}
          </button>
          <button
            className={sortBy === "Indoor Unit" ? "selected" : ""}
            onClick={(e) => {
              e.preventDefault();
              setSortBy("Indoor Unit");

              window.manyways.pushAnalyticsClick(
                "rebate_form_click",
                "advanced_search",
                theProvince,
                "Indoor Unit (A-Z)",
                "https://mitsubishielectric.ca/en/rebate-finder/submit/advanced-search",
              );
            }}
          >
            {locale === "fr" ? "Modèle Intérieur (A-Z)" : "Indoor Unit (A-Z)"}
          </button>
          <button
            className={sortBy === "AHRI Number" ? "selected" : ""}
            onClick={(e) => {
              e.preventDefault();
              setSortBy("AHRI Number");
              window.manyways.pushAnalyticsClick(
                "rebate_form_click",
                "advanced_search",
                theProvince,
                "AHRI Number",
                "https://mitsubishielectric.ca/en/rebate-finder/submit/advanced-search",
              );
            }}
          >
            {locale === "fr" ? "AHRI" : "AHRI Number"}
          </button>
          <label>{locale === "fr" ? "TRIER PAR" : "SORT BY"}</label>
        </div>
      </div>
      <table>
        <thead>
          <tr>
            <th>AHRI</th>
            <th>{locale === "fr" ? "Modèle Extérieur" : "Outdoor Unit # "}</th>
            <th>{indoorUnitTypeLabel}</th>

            {rebateTypes?.map((rebate) => {
              return (
                <th dangerouslySetInnerHTML={{ __html: rebate?.name }}></th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {Object.entries(unitsByCategory).map(([key, items], idx) => (
            <Fragment key={idx}>
              <tr>
                <th colSpan={3 + rebateTypes?.length} className="subheading">
                  <div className="category">
                    <div>
                      {locale === "fr" ? categoryTranslations[key] : key}
                      {images[key] ? (
                        <div className="unit-image">
                          <MdInfo className="icon" />
                          <div className="unit-image-popover">
                            <img src={images[key]} alt={key} />
                          </div>
                        </div>
                      ) : (
                        <div className="no-unit-image"></div>
                      )}
                    </div>
                    <button
                      onClick={(e) => {
                        toggleCollapse(e, key);
                      }}
                      className="toggle-category"
                    >
                      <span className="sr-only">Toggle</span>
                      {collapsedCategories[key] ? <FaPlus /> : <FaMinus />}
                    </button>
                  </div>
                </th>
              </tr>

              {!collapsedCategories[key] &&
                items
                  .sort((a, b) => {
                    if (sortBy === "Heat Pump Size") {
                      let aSize = a.outdoorUnitModelNumber.match(/\d+/)[0];
                      let bSize = b.outdoorUnitModelNumber.match(/\d+/)[0];
                      return aSize - bSize;
                    } else if (sortBy === "Outdoor Unit") {
                      return a.outdoorUnitModelNumber.localeCompare(
                        b.outdoorUnitModelNumber,
                      );
                    } else if (sortBy === "Indoor Unit") {
                      return a.indoorUnitModelNumber.localeCompare(
                        b.indoorUnitModelNumber,
                      );
                    } else if (sortBy === "AHRI Number") {
                      return a.ahri.localeCompare(b.ahri);
                    } else if (sortBy === "A-Z") {
                      return a.outdoorUnitModelNumber.localeCompare(b.ahri);
                    }
                  })
                  .map((row, rowIdx) => (
                    <TableRow
                      row={row}
                      key={rowIdx}
                      province={province}
                      locale={locale}
                      rebateTypes={rebateTypes}
                    />
                  ))}
            </Fragment>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan="6" className="last-updated">
              {locale === "fr"
                ? `Base de données et règles mises à jour le ${formattedDateFR}`
                : `Last updated: ${formattedDateEN}`}
            </td>
          </tr>
        </tfoot>
      </table>

      <ul className="card-list">
        {Object.entries(unitsByCategory).map(([key, items], idx) => (
          <div key={idx} className="card-item">
            <div className="subheading">
              <div className="category">
                <div>
                  {locale === "fr" ? categoryTranslations[key] : key}
                  {images[key] ? (
                    <>
                      <div
                        className="unit-image"
                        onClick={() => {
                          toggleImage === images[key]
                            ? setToggleImage(null)
                            : setToggleImage(images[key]);
                        }}
                      >
                        <MdInfo className="icon" />
                      </div>
                    </>
                  ) : (
                    <div className="no-unit-image"></div>
                  )}
                </div>

                <button
                  onClick={(e) => toggleCollapse(e, key)}
                  className="toggle-category"
                >
                  <span className="sr-only">Toggle Category</span>
                  {collapsedCategories[key] ? <FaPlus /> : <FaMinus />}
                </button>
              </div>
            </div>
            {toggleImage === images[key] && (
              <div className="unit-image-dropdown">
                <img src={images[key]} alt={key} />
              </div>
            )}

            {!collapsedCategories[key] &&
              items?.length > 0 &&
              items.map((row, rowIdx) => (
                <ListItem
                  row={row}
                  key={rowIdx}
                  province={province}
                  locale={locale}
                  rebateTypes={rebateTypes}
                />
              ))}
          </div>
        ))}
        <p className="last-updated">
          {locale === "fr"
            ? `Base de données et règles mises à jour le ${formattedDateFR}`
            : `Last updated: ${formattedDateEN}`}
        </p>
      </ul>
    </>
  );
};

const TableRow = ({ row, province, locale = "en", rebateTypes = [] }) => {
  return (
    <tr
    // onClick={(e) => {
    //   console.log(row, provKey, province);
    // }}
    >
      <td className="ahri-column">
        {row?.ahri}{" "}
        {row?.isEnergyStar && (
          <img
            src="https://mwassets.imgix.net/Organization_3/energystar.png"
            alt="energy star certified"
          />
        )}
      </td>
      <td>{row?.outdoorUnitModelNumber}</td>
      <td>{row?.indoorUnitModelNumber}</td>

      {rebateTypes.map((rebate) => {
        let theRebate = row?.rebatesAvailable?.find(
          (r) => r.name === rebate?.name,
        );
        let theAmount = theRebate?.amount;
        return (
          <td
            key={rebate?.name}
            dangerouslySetInnerHTML={{ __html: theAmount || "-" }}
          ></td>
        );
      })}
    </tr>
  );
};

const ListItem = ({ row, province, rebateTypes, locale }) => {
  const provKey = findProvincialRebateKey(province);
  const provRebateValue = row[provKey];

  return (
    <li className="card">
      <h5 className="ahri-column">
        {row?.ahri}{" "}
        {row?.isEnergyStar && (
          <img
            src="https://mwassets.imgix.net/Organization_3/energystar.png"
            alt="energy star certified"
          />
        )}
      </h5>
      <p>
        {row?.outdoorUnitModelNumber} · {row?.indoorUnitModelNumber}
      </p>
      {rebateTypes.map((rebate) => {
        let theRebate = rebateTypes?.find((r) => r.name === rebate?.name);
        let theAmount = theRebate?.amount;
        return (
          <div className="rebate-list-item">
            <p>
              <strong>{rebate?.name}</strong>
            </p>
            <p className="rebate-list-item-result">
              <span>{theAmount}</span>
            </p>
            {theRebate?.link && (
              <a
                href={rebate?.link}
                target="_blank"
                className="button external-link"
                style={{
                  fontSize: "12px",
                }}
              >
                Learn more
              </a>
            )}
          </div>
        );
      })}
    </li>
  );
};

export default CustomTable;
