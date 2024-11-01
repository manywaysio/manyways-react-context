import { useManyways } from "../ManywaysContext";
import { Fragment, useEffect, useState } from "react";
import { FaMinus, FaPlus } from "react-icons/fa6";
import { MdInfo } from "react-icons/md";

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

const renderRebateValue = (value, locale, override) => {
  if (!value) {
    return;
  }
  if (
    value === "not eligible" ||
    value === "not found" ||
    value === "not listed" ||
    value === "kNotElgible"
  ) {
    return <span className="unavail"></span>;
  }
  if (value === "no provincial rebate available") {
    return <span>{value}</span>;
  }
  if ((override = "ohpa")) {
    const textBefore = locale === "fr" ? "Jusqu'à" : "Up to";
    const overrideVal =
      value === "$15,000" || value === "$10,000"
        ? `${textBefore} ${value} `
        : value;
    return <span>{overrideVal}</span>;
  }
  const formattedValue = { __html: value.replace(/;/g, "<br />") };
  // const formattedValue = { __html: "" };
  return (
    <span className="available" dangerouslySetInnerHTML={formattedValue}></span>
  );
};

const CustomTable = (props) => {
  const { currentNode, responses, responseId, locale, treeConfig } =
    useManyways();
  const [applicationType, setApplicationType] = useState("residential");
  const [categoryApplicationType, setCategoryApplicationType] = useState("");
  let [lookupData, setLookupData] = useState([]);
  const [unitsByCategory, setUnitsByCategory] = useState([]);
  const [province, setProvince] = useState([]);
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
      `https://mw-apiv2-prod.fly.dev/response_sessions/${responseId}?render_response_nodes=true`
    )
      .then((r) => r.json())
      .then((r) => r?.responses);

    console.log(responses);

    let _provinceName = responses.reverse().find((r) => r.node_id === 808);
    setTheProvince(_provinceName?.response?.province_name);

    let _lookupData = responses.reverse().find((r) => r.node_id === 808);
    setApplicationType(
      _lookupData?.response?.application_type || "residential"
    );

    setCategoryApplicationType(
      _lookupData?.response?.hvac_type || "Single Zone"
    );

    // setLookupData(
    //   _lookupData?.response?.look_up_responses?.["July 3 2024 - table builder"]
    //     ?.result || []
    // );

    // getProvincialRebates({ lookupData: _lookupData, province: _provinceName });
  };

  useEffect(() => {
    getProvincialRebates({ province: theProvince });
  }, [categoryApplicationType]);

  const sortUnits = (lookupData) => {
    if (lookupData.length < 1) {
      return {};
    }

    console.log(lookupData);

    const units = lookupData
      .filter((row) => {
        if (row.multi_zone === "Y") {
          return true;
        }
        if (
          applicationType === "Residential" &&
          RESIDENTIAL.some((prefix) =>
            row.indoor_unit_model_number.includes(prefix)
          )
        ) {
          return true;
        }
        if (
          applicationType === "Light Commercial" &&
          LIGHT_COMMERCIAL.some((prefix) =>
            row.indoor_unit_model_number.includes(prefix)
          )
        ) {
          return true;
        }
        return false;
      })
      .reduce((acc, item) => {
        const groupKey = (() => {
          if (item.multi_zone === "Y") {
            return "Multi Zone";
          }
          if (item.indoor_unit_model_number.includes("MSZ"))
            return "Wall Mounted";
          if (item.indoor_unit_model_number.includes("PKA"))
            return "Wall Mounted";
          if (item.indoor_unit_model_number.includes("MFZ"))
            return "Floor Mounted";
          if (item.indoor_unit_model_number.includes("SLZ"))
            return "4 Way Ceiling Cassette";
          if (item.indoor_unit_model_number.includes("PLA"))
            return "4 Way Ceiling Cassette";
          if (item.indoor_unit_model_number.includes("MLZ"))
            return "1 Way Ceiling Cassette";
          if (item.indoor_unit_model_number.includes("SVZ"))
            return "Multi position AHU";
          if (item.indoor_unit_model_number.includes("PVA"))
            return "Multi position AHU";
          if (item.indoor_unit_model_number.includes("PAA"))
            return "Hybrid Heating & Cooling";
          if (item.indoor_unit_model_number.includes("PCA"))
            return "Ceiling suspended";
          if (item.indoor_unit_model_number.includes("SEZ"))
            return "Ceiling Concealed";
          if (item.indoor_unit_model_number.includes("PCA"))
            return "Ceiling Suspended";
          if (item.indoor_unit_model_number.includes("PEAD"))
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

  const getProvincialRebates = async ({ lookupData }) => {
    let d = await fetch("https://wayfinder.manyways.io/api/hvac-rebate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ province: theProvince, lookupData }),
    }).then((r) => r.json());

    let rebateNames = [];
    d?.d?.validProducts.forEach((product) => {
      product.rebates.forEach((rebate) => {
        if (!rebateNames.includes(rebate?.program_name)) {
          rebateNames.push(rebate?.program_name);
        }
      });
    });

    setRebateTypes(rebateNames);
    console.log("rebate names", rebateNames);

    const sorted = sortUnits(d?.d?.validProducts);
    console.log("sorted", sorted);
    setUnitsByCategory(sorted);

    console.log(d);
  };

  useEffect(() => {
    getResponses(responseId);
  }, [currentNode, responseId]);

  useEffect(() => {
    if (!lookupData || !responses) {
      return;
    }
    const lastResponse = responses[0];
    console.log("province", lastResponse?.response?.province_name);
    setProvince(lastResponse?.response?.province_name);
  }, [lookupData]);

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
            }}
          >
            {locale === "fr" ? "Taille de Thermopompe" : "Heat Pump Size"}
          </button>
          <button
            className={sortBy === "Outdoor Unit" ? "selected" : ""}
            onClick={(e) => {
              e.preventDefault();
              setSortBy("Outdoor Unit");
            }}
          >
            {locale === "fr" ? "Modèle Extérieur (A-Z)" : "Outdoor Unit (A-Z)"}
          </button>
          <button
            className={sortBy === "Indoor Unit" ? "selected" : ""}
            onClick={(e) => {
              e.preventDefault();
              setSortBy("Indoor Unit");
            }}
          >
            {locale === "fr" ? "Modèle Intérieur (A-Z)" : "Indoor Unit (A-Z)"}
          </button>
          <button
            className={sortBy === "AHRI Number" ? "selected" : ""}
            onClick={(e) => {
              e.preventDefault();
              setSortBy("AHRI Number");
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

            {rebateTypes?.map((name) => {
              return <th>{name}</th>;
            })}
          </tr>
        </thead>
        <tbody>
          {Object.entries(unitsByCategory).map(([key, items], idx) => (
            <Fragment key={idx}>
              <tr>
                <th colSpan={3 + rebateTypes.length} className="subheading">
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
                      let aSize = a.outdoor_unit_model_number.match(/\d+/)[0];
                      let bSize = b.outdoor_unit_model_number.match(/\d+/)[0];
                      return aSize - bSize;
                    } else if (sortBy === "Outdoor Unit") {
                      return a.outdoor_unit_model_number.localeCompare(
                        b.outdoor_unit_model_number
                      );
                    } else if (sortBy === "Indoor Unit") {
                      return a.idu_override.localeCompare(b.idu_override);
                    } else if (sortBy === "AHRI Number") {
                      return a.ahri_number.localeCompare(b.ahri_number);
                    } else if (sortBy === "A-Z") {
                      return a.outdoor_unit_model_number.localeCompare(
                        b.ahri_number
                      );
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
              items.map((row, rowIdx) => (
                <ListItem
                  row={row}
                  key={rowIdx}
                  province={province}
                  locale={locale}
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
  const provKey = findProvincialRebateKey(province);
  const provRebateValue = row[provKey];

  return (
    <tr
    // onClick={(e) => {
    //   console.log(row, provKey, province);
    // }}
    >
      <td className="ahri-column">
        {row?.ahri_number}{" "}
        {row?.energystar_6_1_qualified === "Yes" && (
          <img
            src="https://mwassets.imgix.net/Organization_3/energystar.png"
            alt="energy star certified"
          />
        )}
      </td>
      <td>{row?.outdoor_unit_model_number}</td>
      <td>{row?.idu_override}</td>
      {rebateTypes.map((name) => {
        let theRebate = row.rebates?.find((r) => r.program_name === name);
        let theAmount = theRebate?.rebate_amount;
        return <td key={name}>{theAmount || "-"}</td>;
      })}
    </tr>
  );
};

const ListItem = ({ row, province, locale }) => {
  const provKey = findProvincialRebateKey(province);
  const provRebateValue = row[provKey];

  return (
    <li className="card">
      <h5 className="ahri-column">
        {" "}
        {row?.ahri_number}{" "}
        {row?.energystar_6_1_qualified === "Yes" && (
          <img
            src="https://mwassets.imgix.net/Organization_3/energystar.png"
            alt="energy star certified"
          />
        )}
      </h5>
      <p>
        {row?.outdoor_unit_model_number} · {row?.idu_override}
      </p>

      {row.rebates.map((rebate) => {
        return (
          <div className="rebate-list-item">
            <p>
              <strong>{rebate?.program_name}</strong>
            </p>
            <p className="rebate-list-item-result">
              <span>{rebate?.rebate_amount}</span>
            </p>
            <a
              href={rebate.link}
              target="_blank"
              className="button external-link"
              style={{
                fontSize: "12px",
              }}
            >
              Learn more
            </a>
          </div>
        );
      })}
    </li>
  );
};

export default CustomTable;
