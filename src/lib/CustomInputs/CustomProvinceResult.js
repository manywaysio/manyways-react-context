import { useEffect, useState } from "react";
import { useManyways } from "../ManywaysContext";

const baseUrl =
  "https://mesca-submittal-rebate-tic.manyways.io/api/rebate-programs/lookup";

const AutoLink = ({ text, province }) => {
  const urlRegex =
    /((?:https?:\/\/)?(?:(?:[a-z0-9]?(?:[a-z0-9\-]{1,61}[a-z0-9])?\.[^\.|\s])+[a-z\.]*[a-z]+|(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3})(?::\d{1,5})*[a-z0-9.,_\/~#&=;%+?\-\\(\\)]*)/gi;

  // First replace <br/> tags with a placeholder
  const placeholder = "__BR_TAG__";
  const textWithPlaceholder = text.replace(/<br\s*\/?>/gi, placeholder);

  // Process the text with URLs
  const parts = [];
  const segments = textWithPlaceholder.split(urlRegex);

  segments.forEach((segment, i) => {
    if (segment.match(urlRegex)) {
      // It's a URL
      const url = segment;
      parts.push(
        <a
          key={i}
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
        </a>,
      );
    } else if (segment.includes(placeholder)) {
      // It contains our <br/> placeholder
      segment.split(placeholder).forEach((part, j) => {
        if (j > 0) parts.push(<br key={`${i}-br-${j}`} />);
        if (part) parts.push(part);
      });
    } else {
      // Regular text
      parts.push(segment);
    }
  });

  return <>{parts}</>;
};

const CustomProvinceResult = ({ schema, ...props }) => {
  const [data, setData] = useState([]);
  const [rebates, setRebates] = useState([]);
  const [locale, setLocale] = useState("en");
  const { treeConfig } = useManyways();

  const getData = async () => {
    let d = await fetch(`${baseUrl}?province=${schema?.text}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((r) => r.json());

    if (window.location.href.split("/").indexOf("fr") > -1) {
      setLocale("fr");
    }

    setData(d?.d);
    setRebates(d?.rebates);
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
        {rebates?.map((rebate) => {
          return (
            <div className="results-by-province">
              <div>
                <p>
                  <strong
                    dangerouslySetInnerHTML={{ __html: rebate.name }}
                  ></strong>
                </p>
                <p>
                  <AutoLink
                    // text={d[`summary_${locale}`]}
                    text={rebate?.summary}
                    province={schema?.text}
                  />
                  {/* <a href={rebate?.rebateKey} target="_blank">
                    {rebate?.link}
                  </a>*/}
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
