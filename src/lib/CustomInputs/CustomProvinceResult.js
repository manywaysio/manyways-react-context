import { useEffect, useState } from "react";
import { useManyways } from "../ManywaysContext";

const AutoLink = ({ text, province }) => {
  const delimiter =
    /((?:https?:\/\/)?(?:(?:[a-z0-9]?(?:[a-z0-9\-]{1,61}[a-z0-9])?\.[^\.|\s])+[a-z\.]*[a-z]+|(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3})(?::\d{1,5})*[a-z0-9.,_\/~#&=;%+?\-\\(\\)]*)/gi;

  return (
    <>
      {text.split(delimiter).map((word) => {
        const match = word.match(delimiter);
        if (match) {
          const url = match[0];
          return (
            <a
              target="_blank"
              href={url.startsWith("http") ? url : `http://${url}`}
              onClick={() =>
                window.manyways.pushAnalyticsClick(
                  "rebate_form_click",
                  "rebates_in_my_area",
                  province,
                  url,
                  url,
                )
              }
            >
              {url}
            </a>
          );
        }
        return word;
      })}
    </>
  );
};
const CustomProvinceResult = ({ schema, ...props }) => {
  const [data, setData] = useState([]);
  const [locale, setLocale] = useState("en");
  const { treeConfig } = useManyways();

  const getData = async () => {
    let d = await fetch("https://wayfinder.manyways.io/api/hvac-rebate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ provinceText: schema?.text }),
    }).then((r) => r.json());

    if (window.location.href.split("/").indexOf("fr") > -1) {
      setLocale("fr");
    }

    setData(d?.d);
  };
  useEffect(() => {
    getData();
  }, []);

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

  return (
    <div>
      <div>
        {data?.map((d) => {
          return (
            <div className="results-by-province">
              <div>
                <p>
                  <strong>{d.program_name}</strong>
                </p>
                <p>
                  <AutoLink
                    text={d[`summary_${locale}`]}
                    province={schema?.text}
                  />
                  {/* <a href={d?.link} target="_blank">
                  {d?.link}
                </a> */}
                </p>
              </div>
            </div>
          );
        })}
      </div>
      <div class="last-updated">
        <p>
          Last Updated: {locale === "fr" ? formattedDateFR : formattedDateEN}
        </p>
      </div>
    </div>
  );
};

export default CustomProvinceResult;
