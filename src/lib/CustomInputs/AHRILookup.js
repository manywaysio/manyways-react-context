import { useState } from "react";

const AHRILookup = (props) => {
  const {
    schema,
    value = {},
    disabled,
    onChange,
    options,
    required,
    label,
    name,
    id,
    formData,
    readonly,
    autofocus,
    rawErrors,
    ...rest
  } = props;
  const [val, setVal] = useState(formData);

  console.log("AHRILookup", props);

  const getBaseDataFromAHRINumber = async (ahriNumber) => {
    // https://ashp.neep.org/api/products/?page=1&style=tile&brand=null&ahri_certificate_number=210404027&system_type=1&config=0&cap5min=0&cap5max=80000&capmin=0&capmax=80000

    await fetch(
      `https://wayfinder.manyways.io/api/ahri?ahri_number=${ahriNumber}`
    )
      .then((response) => response.json())
      .then((data) => {
        let highstageHeating = {};
        let highstageCooling = {};

        // @TODO : need to modify to grab all ratings based on outdoor_dry_bulb, looking for 17 & 47 for heating

        let heatingCandidate = data?.ratings?.find(
          (r) =>
            r.heat_cool === "Heating" &&
            !!r.capacity_rated &&
            !!r.power_rated &&
            !!r.cop_rated
        );

        highstageHeating = {
          capacity: heatingCandidate?.capacity_rated,
          power: heatingCandidate?.power_rated,
          cop: heatingCandidate?.cop_rated,
        };

        let coolingCandidate = data?.ratings?.find(
          (r) =>
            r.heat_cool === "Cooling" && !!r.capacity_rated && !!r.power_rated
        );

        highstageCooling = {
          capacity: coolingCandidate?.capacity_rated,
          power: coolingCandidate?.power_rated,
        };

        setVal({ ...val, ...data, highstageHeating, highstageCooling });
        onChange({ ...val, ...data, highstageHeating, highstageCooling });
      });
  };

  return (
    <div>
      <h2>Heat Pump Specifications</h2>
      <p>
        Please enter your AHRI number below. We will match your ahri number to
        determine the following
      </p>
      {!val?.ahri && (
        <ul>
          <li>Indoor Model Number</li>
          <li>Outdoor Model Number</li>
          <li>Heating Capacity Indoor (BTU/hr)</li>
          <li>High Stage Heating</li>
          <li>Heating Capacity (BTU)</li>
          <li>Heating Power (kW)</li>
          <li>Heating COP</li>
          <li>High Stage Cooling</li>
          <li>Cooling Capacity (BTU/hr)</li>
          <li>Cooling Power (kW)</li>
        </ul>
      )}
      <div class="form-group field field-string">
        <label class="control-label" for="root_ahri">
          AHRI Number
        </label>
        <div
          style={{
            display: "flex",
          }}
        >
          <input
            id="root_ahri"
            name="root_ahri"
            class="form-control"
            label="Percentage of savings possible by performing all recommend non-space heating upgrades"
            placeholder=""
            type="text"
            aria-describedby="root_ahri__error root_ahri__description root_ahri__help"
            value={val.ahri}
            onChange={(e) => {
              setVal({ ahri: e.target.value, ahri_number: e.target.value });
            }}
          />
          <button
            onClick={(e) => {
              e.preventDefault();
              setVal({ ahri: e.target.value });
              getBaseDataFromAHRINumber(val.ahri);
            }}
            className="fetching-ahri"
          >
            LOOKUP
          </button>
        </div>
        {val?.ahri_certificate_number && (
          <section className="library-card">
            <div
              className="header"
            >
              <div>
                <h3>
                  BRAND
                </h3>
                <h2>{val.brand}</h2>
              </div>
              <div className="models">
                {val.indoor_unit_number && (
                  <div>
                    <strong>
                      Indoor Model
                    </strong>
                    {val.indoor_unit_number}
                  </div>
                )}
                {val.outdoor_unit_number && (
                  <div>
                    <strong>
                      Outdoor Model
                    </strong>{" "}
                    {val.outdoor_unit_number}
                  </div>
                )}
              </div>

              {val.ratings
                .filter(
                  (x) => x.outdoor_dry_bulb == 17 || x.outdoor_dry_bulb == 47
                )
                .map((rating, idx) => {
                  return (
                    <div key={idx} className="rating">
                      <h4>
                        {rating.outdoor_dry_bulb}°F
                      </h4>
                      <div>Heating Capacity: {rating.capacity_rated}</div>
                      <div>Heating Power: {rating.power_rated}</div>
                      <div>Heating COP: {rating.cop_rated}</div>
                    </div>
                  );
                })}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default AHRILookup;
