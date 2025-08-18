import { useState, useEffect } from "react";
import { useManyways } from "../ManywaysContext";

const ComboResult = (props) => {
  const { schema } = props;
  const { locale, treeConfig } = useManyways();
  const [data, setData] = useState({});
  const [results, setResults] = useState([]);
  const [rebateTypes, setRebateTypes] = useState();
  const [province, setProvince] = useState();

  // const baseUrl =
  //   process.env.REACT_APP_MESCA_API_BASE_URL || "https://mesca-docgen.onrender.com";
  const baseUrl =
    "https://mesca-docgen.onrender.com/api/rebate-programs/lookup";

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

  useEffect(() => {
    try {
      let d = JSON.parse(schema.text);
      setData(d);
      setProvince(d?.province);
      getResults(d);
    } catch (e) {
      console.error("Error parsing schema", e);
    }
  }, [schema]);

  const getResults = async (data) => {
    setResults([]);

    const params = new URLSearchParams();
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        params.append(key, data[key]);
      }
    }

    await fetch(`${baseUrl}?${params.toString()}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((dd) => {
        setResults(dd?.products[0]?.rebatesAvailable);
        setRebateTypes(dd?.rebates);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <div>
      {!results ||
        (results?.length < 1 && (
          <div className="no-results">
            <p>
              {locale === "fr" ? "Aucun résultat trouvé" : "No rebates found"}
            </p>
          </div>
        ))}

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
          {!!results &&
            results.map((rebate) => {
              // const theRebate = rebateTypes?.find(
              //   (r) => r.name === rebate?.name,
              // );
              return (
                <div>
                  <div
                    className="result-card"
                    style={{
                      height: "100%",
                    }}
                  >
                    <h6>{rebate.name}</h6>
                    {!!rebate.amount ? (
                      <p className="rebate-status available">Available</p>
                    ) : (
                      <p className="rebate-status unavailable">Unavailable</p>
                    )}
                    {rebate?.amount && (
                      <div className="rebate-details">
                        {rebate?.amount}
                        {/* {theRebate?.rebateAmount.split(";").map((s, i) => (
                          <p>{s}</p>
                        ))}*/}
                      </div>
                    )}
                    {rebate?.link && (
                      <a
                        href={rebate.link}
                        target="_blank"
                        className="button external-link"
                        onClick={() =>
                          window.manyways.pushAnalyticsClick(
                            "rebate_form_click",
                            "model_number",
                            province,
                            "Learn more",
                            rebate.link,
                          )
                        }
                      >
                        Learn more
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
        </div>
      </div>
      <div class="last-updated">
        <p>
          Last Updated: {locale === "fr" ? formattedDateFR : formattedDateEN}
        </p>
      </div>
    </div>
  );
};

export default ComboResult;
