import { useManyways } from "../ManywaysContext";
import { Fragment, useEffect, useState } from "react";
import { FaImage } from "react-icons/fa6";

const images = {
  "Wall Mounted":
    "https://mwassets.imgix.net/Organization_3/MESCA-wall-mounted.jpg",
  "Floor Mounted":
    "https://mwassets.imgix.net/Organization_3/MESCA-floor-mounted.jpg",
  "4 Way Ceiling Cassette":
    "https://mwassets.imgix.net/Organization_3/MESCA-4-way-ceiling-cassette.jpg",
  "1 Way Ceiling Cassette":
    "https://mwassets.imgix.net/Organization_3/MESCA-1-way-ceiling-cassette.jpg",
  "Multi position AHU - Cooling":
    "https://mwassets.imgix.net/Organization_3/MESCA-central-cooling-cycle.jpg",
  "Multi position AHU - Heating":
    "https://mwassets.imgix.net/Organization_3/MESCA-central-heating-cycle.jpg",
  "Hybrid Heating & Cooling":
    "https://mwassets.imgix.net/Organization_3/MESCA-a-coil.jpg",
  "Ceiling concealed":
    "https://mwassets.imgix.net/Organization_3/MESCA-4-way-ceiling-cassette.jpg",
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
  if (
    value === "not eligible" ||
    value === "not found" ||
    value === "not listed"
  ) {
    return <span className="unavail"></span>;
  }
  if (value === "no provincial rebate available") {
    return <span>{value}</span>;
  }
  // const formattedValue = { __html: value.replace(/;/g, "<br />") };
  const formattedValue = { __html: "" };
  return (
    <span className="available" dangerouslySetInnerHTML={formattedValue}></span>
  );
};

const CustomTable = (props) => {
  const { journeyNodes, currentNode, responses, responseId } = useManyways();
  let [lookupData, setLookupData] = useState([]);
  const [unitsByCategory, setUnitsByCategory] = useState([]);
  const [province, setProvince] = useState([]);

  let getResponses = async (responseId) => {
    let responses = await fetch(
      `https://mw-apiv2-prod.fly.dev/response_sessions/${responseId}?render_response_nodes=true`
    )
      .then((r) => r.json())
      .then((r) => r?.responses);
    let _lookupData = responses.find((r) => r.node_id === 74);
    setLookupData(
      _lookupData?.response?.look_up_responses?.["TABLE BUILDER"]?.result || []
    );
  };

  const sortUnits = () => {
    const units = lookupData.reduce((acc, item) => {
      const groupKey = (() => {
        if (item.indoor_unit_model_number.includes("MSZ"))
          return "Wall Mounted";
        if (item.indoor_unit_model_number.includes("MFZ"))
          return "Floor Mounted";
        if (item.indoor_unit_model_number.includes("SLZ"))
          return "4 Way Ceiling Cassette";
        if (item.indoor_unit_model_number.includes("MLZ"))
          return "1 Way Ceiling Cassette";
        if (item.indoor_unit_model_number.includes("SVZ"))
          return "Multi position AHU - Cooling";
        if (item.indoor_unit_model_number.includes("PVA"))
          return "Multi position AHU - Heating";
        if (item.indoor_unit_model_number.includes("PAA"))
          return "Hybrid Heating & Cooling";
        if (item.indoor_unit_model_number.includes("SEZ"))
          return "Ceiling concealed";
        if (item.indoor_unit_model_number.includes("PEAD"))
          return "Ceiling concealed";
        return "Others";
      })();

      if (!acc[groupKey]) {
        acc[groupKey] = [];
      }
      acc[groupKey].push(item);
      return acc;
    }, {});

    const sortedUnits = Object.keys(units).sort((a, b) => {
      if (a === "Others") return 1;
      if (b === "Others") return -1;
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

    const lastResponse = responses[responses.length - 1];
    setProvince(lastResponse?.response?.province_name);
  }, [lookupData]);

  return lookupData?.length < 1 ? (
    <div className="no-results">
      <p>No results found</p>
    </div>
  ) : (
    <>
      <table>
        <thead>
          <tr>
            <th>AHRI</th>
            <th>Outdoor Unit #</th>
            <th>Indoor Unit #</th>
            <th>Provincial Rebate</th>
            <th>
              {province === "Ontario" ? (
                <span>HER+ Canada Greener Homes Grant</span>
              ) : (
                <span>Federal - Canada Greener Homes Grant (CGHG)</span>
              )}
            </th>
            <th>Federal - Oil to heat pump affordability program (OHPA)</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(unitsByCategory).map(([key, items], idx) => (
            <Fragment key={idx}>
              <tr>
                <th colSpan="6" className="subheading">
                  <div>
                    {key}
                    {images[key] ? (
                      <div className="unit-image">
                        <FaImage className="icon" />
                        <div className="unit-image-popover">
                          <img src={images[key]} alt={key} />
                        </div>
                      </div>
                    ) : (
                      <div className="no-unit-image"></div>
                    )}
                  </div>
                </th>
              </tr>

              {items.map((row, rowIdx) => (
                <TableRow row={row} key={rowIdx} province={province} />
              ))}
            </Fragment>
          ))}
        </tbody>
      </table>
      <ul className="card-list">
        {Object.entries(unitsByCategory).map(([key, items], idx) => (
          <Fragment key={idx}>
            <div className="subheading">
              <div>
                {key}
                {images[key] ? (
                  <div className="unit-image">
                    <FaImage className="icon" />
                    <div className="unit-image-popover">
                      <img src={images[key]} alt={key} />
                    </div>
                  </div>
                ) : (
                  <div className="no-unit-image"></div>
                )}
              </div>
            </div>

            {items.map((row, rowIdx) => (
              <ListItem row={row} key={rowIdx} province={province} />
            ))}
          </Fragment>
        ))}
      </ul>
    </>
  );
};

const TableRow = ({ row, province }) => {
  const rebateKey = findProvincialRebateKey(province);
  const rebateValue = row[rebateKey];

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
      <td>{renderRebateValue(rebateValue)}</td>
      <td>
        {province === "Ontario"
          ? renderRebateValue(row?.her_canada_greener_homes_grant)
          : renderRebateValue(row?.federal_greener_homes_rebate)}
      </td>
      <td>{renderRebateValue(row?.ohpa)}</td>
    </tr>
  );
};

const ListItem = ({ row, province }) => {
  const rebateKey = findProvincialRebateKey(province);
  const rebateValue = row[rebateKey];

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
          {renderRebateValue(rebateValue)}
        </p>
      </div>
      {province === "Ontario" ? (
        <div className="rebate-list-item">
          <p>HER+ Canada Greener Homes Grant</p>
          <p className="rebate-list-item-result">
            {renderRebateValue(row?.her_canada_greener_homes_grant)}
          </p>
        </div>
      ) : (
        <div className="rebate-list-item">
          <p>Federal - Canada Greener Homes Grant (CGHG)</p>
          <p className="rebate-list-item-result">
            {renderRebateValue(row?.federal_greener_homes_rebate)}
          </p>
        </div>
      )}

      <div className="rebate-list-item">
        <p>Federal - Oil to heat pump affordability program (OHPA)</p>
        <p className="rebate-list-item-result">
          {renderRebateValue(row?.ohpa)}
        </p>
      </div>
    </li>
  );
};

export default CustomTable;
