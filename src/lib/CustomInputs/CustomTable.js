import { useManyways } from "../ManywaysContext";
import { useEffect, useState } from "react";

const CustomTable = (props) => {
  const { journeyNodes, currentNode, responses } = useManyways();
  let [lookupData, setLookupData] = useState([]);
  let [unitsByCategory, setUnitsByCategory] = useState([]);
  let getResponses = async () => {
    let responses = await fetch(
      `https://mw-apiv2-prod.fly.dev/response_sessions/f7a89c3e-0d56-42ae-ad11-a511cf39d802?render_response_nodes=true`
    )
      .then((r) => r.json())
      .then((r) => r?.responses);
    let _lookupData = responses.find((r) => r.node_id === 74);
    setLookupData(
      _lookupData?.response?.look_up_responses?.["TABLE BUILDER"]?.result || []
    );
  };
  useEffect(() => {
    getResponses();
  }, [currentNode]);

  console.log(responses, "responses");
  console.log(lookupData, "lookup data");

  useEffect(() => {
    const reducedData = lookupData.reduce((acc, item) => {
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
          return "Multi position AHU";
        if (item.indoor_unit_model_number.includes("PVA"))
          return "Multi position AHU";
        if (item.indoor_unit_model_number.includes("PAA"))
          return "Hybrid Heating & Cooling";
        if (item.indoor_unit_model_number.includes("SEZ"))
          return "Ceiling concealed";
        if (item.indoor_unit_model_number.includes("PEAD"))
          return "Ceiling concealed";
        return "others";
      })();

      if (!acc[groupKey]) {
        acc[groupKey] = [];
      }
      acc[groupKey].push(item);
      return acc;
    }, {});
    setUnitsByCategory(reducedData);
  }, [lookupData]);

  return (
    <>
      <table>
        <thead>
          <tr>
            <th>AHRI</th>
            <th>Outdoor Unit #</th>
            <th>Indoor Unit #</th>
            <th>Provincial Rebate</th>
            <th>Federal - Canada Greener Homes Grant (CGHG)</th>
            {/* <th>HER+ Canada Greener Homes Grant</th> */}
            <th>Federal - Oil to heat pump affordability program (OHPA)</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(unitsByCategory).map(([key, items]) => (
            <>
              <tr>
                <th colSpan="26" className="subheading">
                  {key}
                </th>
              </tr>

              {items.map((row, rowIdx) => (
                <TableRow row={row} key={rowIdx} />
              ))}
            </>
          ))}
        </tbody>
      </table>
    </>
  );
};

const TableRow = ({ row }) => {
  return (
    <tr>
      <td>{row?.ahri_number}</td>
      <td>{row?.outdoor_unit_model_number}</td>
      <td>{row?.idu_override}</td>
      <td>
        {/* province  */}
        <span className="available"></span>
        <span></span>
      </td>
      <td>
        <span className="unavail"></span>
        {/* greener homes */}
      </td>
      <td>
        <span className="unavail"></span>
        {/* greener homes */}
      </td>
    </tr>
  );
};

export default CustomTable;
