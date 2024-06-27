import { useManyways } from "../ManywaysContext";
import { useEffect, useState } from "react";

const CustomTable = (props) => {
  const { journeyNodes, currentNode, responses } = useManyways();
  let [lookupData, setLookupData] = useState([]);
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
  return (
    <div
      onClick={(e) => {
        console.log(lookupData);
      }}
    >
      HAHAHAAAHH <hr /> {JSON.stringify(lookupData)}
    </div>
  );
};

export default CustomTable;
