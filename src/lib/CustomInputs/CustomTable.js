import { useManyways } from "../ManywaysContext";
import { Fragment, useEffect, useState } from "react";
import { FaMinus, FaPlus } from "react-icons/fa6";
import { MdInfo } from "react-icons/md";

const RESIDENTIAL = ["MSZ", "MFZ", "SLZ", "MLZ", "SVZ", "PVA", "PAA", "SEZ", "PEAD"];
const LIGHT_COMMERCIAL = ["PKA", "PL", "PVA", "PC", "PA", "PEAD"];

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

const renderRebateValue = (value) => {
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
  const formattedValue = { __html: value.replace(/;/g, "<br />") };
  // const formattedValue = { __html: "" };
  return (
    <span className="available" dangerouslySetInnerHTML={formattedValue}></span>
  );
};

const CustomTable = (props) => {
  const { currentNode, responses, responseId, locale } =
    useManyways();
  const [applicationType, setApplicationType] = useState("residential");
  let [lookupData, setLookupData] = useState([]);
  const [unitsByCategory, setUnitsByCategory] = useState([]);
  const [province, setProvince] = useState([]);
  const [collapsedCategories, setCollapsedCategories] = useState({});
  const [toggleImage, setToggleImage] = useState(null);

  let getResponses = async (responseId) => {
    let responses = await fetch(
      `https://mw-apiv2-prod.fly.dev/response_sessions/${responseId}?render_response_nodes=true`
    )
      .then((r) => r.json())
      .then((r) => r?.responses);

    let _lookupData = responses.reverse().find((r) => r.node_id === 541);
    setApplicationType(
      _lookupData?.response?.application_type || "residential"
    );

    setLookupData(
      _lookupData?.response?.look_up_responses?.["July 3 2024 - table builder"]
        ?.result || []
    );

  };

  const sortUnits = () => {
    if (lookupData.length < 1) {
      return {};
    }
    const units = lookupData
      .filter((row) => {
        if (!row.multi_zone === "Y") {
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

  useEffect(() => {
    getResponses(responseId);

  }, [currentNode, responseId]);

  useEffect(() => {
    if (!lookupData || !responses) {
      return;
    }
    const sorted = sortUnits();
    setUnitsByCategory(sorted);
    console.log(lookupData)
    const lastResponse = responses[responses.length - 1];
    setProvince(lastResponse?.response?.province_name);
  }, [lookupData]);

  const toggleCollapse = (e, category) => {
    e.preventDefault();
    setCollapsedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  return Object.keys(unitsByCategory)?.length < 1 ? (
    <div className="no-results">
      <p>No results found</p>
    </div>
  ) : (
    <>
      {" "}
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
      <table>
        <thead>
          <tr>
            <th>AHRI</th>
            <th>{locale === "fr" ? "Modèle Extérieur" : "Outdoor Unit # "}</th>
            <th>{locale === "fr" ? "Modèle Intérieur" : "Indoor Unit # "}</th>
            <th>{locale === "fr" ? "Provincial" : "Provincial Rebate"}</th>
            <th>
              {locale === "fr"
                ? "FÉDÉRAL - SUBVENTION CANADIENNE POUR DES MAISONS PLUS VERTES"
                : "Federal - Canada Greener Homes Grant (CGHG)"}
            </th>
            <th>
              {locale === "fr"
                ? "FÉDÉRAL - PROGRAMME POUR LA CONVERSION ABORDABLE DU MAZOUT À LA THERMOPOMPE"
                : "Federal - Oil to heat pump affordability program (OHPA)"}
            </th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(unitsByCategory).map(([key, items], idx) => (
            <Fragment key={idx}>
              <tr>
                <th colSpan="6" className="subheading">
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
                items.map((row, rowIdx) => (
                  <TableRow row={row} key={rowIdx} province={province} />
                ))}
            </Fragment>
          ))}
        </tbody>
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
                <ListItem row={row} key={rowIdx} province={province} />
              ))}
          </div>
        ))}
      </ul>
    </>
  );
};

const TableRow = ({ row, province }) => {
  const provKey = findProvincialRebateKey(province);
  const provRebateValue = row[provKey];

  return (
    <tr>
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
      <td>{renderRebateValue(provRebateValue)}</td>
      <td>
        {province === "Quebec" || province === "Nova Scotia"
          ? renderRebateValue(row?.federal_qcns)
          : renderRebateValue(row?.federal_greener_homes_rebate)}
      </td>
      <td>
        {" "}
        {province === "British Columbia"
          ? renderRebateValue(row?.ohpa_bc)
          : province === "Nova Scotia"
          ? renderRebateValue(row?.ohpa_ns)
          : renderRebateValue(row?.ohpa_roc)}
      </td>
    </tr>
  );
};

const ListItem = ({ row, province }) => {
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
      <div className="rebate-list-item">
        <p>Provincial Rebate</p>
        <p className="rebate-list-item-result">
          {renderRebateValue(provRebateValue)}
        </p>
      </div>

      <div className="rebate-list-item">
        <p>Federal - Canada Greener Homes Grant (CGHG)</p>
        <p className="rebate-list-item-result">
          {province === "Quebec" || province === "Nova Scotia"
            ? renderRebateValue(row?.federal_qcns)
            : renderRebateValue(row?.federal_greener_homes_rebate)}
        </p>
      </div>

      <div className="rebate-list-item">
        <p>Federal - Oil to heat pump affordability program (OHPA)</p>
        <p className="rebate-list-item-result">
          {province === "British Columbia"
            ? renderRebateValue(row?.ohpa_bc)
            : province === "Nova Scotia"
            ? renderRebateValue(row?.ohpa_ns)
            : renderRebateValue(row?.ohpa_roc)}
        </p>
      </div>
    </li>
  );
};

export default CustomTable;
