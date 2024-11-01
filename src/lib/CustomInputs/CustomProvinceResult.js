import { useEffect, useState } from "react";

const CustomProvinceResult = ({ schema, ...props }) => {
  console.log(props);
  const [data, setData] = useState([]);
  const [locale, setLocale] = useState("en");
  const getData = async () => {
    let d = await fetch("http://localhost:3000/api/hvac-rebate", {
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
                  {d[`summary_${locale}`]}
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
        <p>Last Updated: Aug 21, 2024</p>
      </div>
    </div>
  );
};

export default CustomProvinceResult;
