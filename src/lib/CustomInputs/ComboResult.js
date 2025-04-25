import { useState, useEffect } from "react";

const ComboResult = (props) => {
  const { schema } = props;
  const [data, setData] = useState({});
  const [results, setResults] = useState([]);

  useEffect(() => {
    try {
      let d = JSON.parse(schema.text);
      setData(d);
      getResults(d);
    } catch (e) {
      console.error("Error parsing schema", e);
    }
  }, [schema]);

  const getResults = async (data) => {
    setResults([]);
    await fetch("https://wayfinder.manyways.io/api/hvac-rebate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((dd) => {
        console.log("data", dd);
        setResults(dd);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <div>
      {/* <button
        onClick={(e) => {
          e.preventDefault();
          console.log("combo result clicked");
          getResults(data);
        }}
      >
        combo result: {JSON.stringify(data)}
      </button> */}
      <div className="results-container text-container">
        <div className="result grid-2">
          {!!results?.d?.items &&
            results.d.items.map((rebate) => {
              return (
                <div>
                  <div
                    className="result-card"
                    style={{
                      height: "100%",
                    }}
                  >
                    <h6>
                      {rebate.area_type}
                      {rebate.program_name && <br />}
                      {rebate.program_name}
                    </h6>
                    {!!rebate.rebate_amount ? (
                      <p className="rebate-status available">Available</p>
                    ) : (
                      <p className="rebate-status unavailable">Unavailable</p>
                    )}
                    {rebate?.rebate_amount && (
                      <div className="rebate-details">
                        {rebate?.rebate_amount.split(";").map((s, i) => (
                          <p>{s}</p>
                        ))}
                      </div>
                    )}

                    <a
                      href={rebate.link}
                      target="_blank"
                      className="button external-link"
                      onClick={() =>
                        window.manyways.pushAnalyticsClick(
                          "rebate_form_click",
                          "model_number",
                          results?.province,
                          "Learn more",
                          rebate.link,
                        )
                      }
                    >
                      Learn more
                    </a>
                    {
                    manyways.pushAnalyticsClick(\"rebate_form_click\", \"model_number\", \"{{responses['Model Number'].province_name}}\", \"Find a dealer near you\", \"https://www.mitsubishielectric.ca/en/hvac/where-to-buy\"  )
                    }
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default ComboResult;
