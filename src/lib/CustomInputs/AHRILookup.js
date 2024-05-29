import { useState } from "react";

const AHRILookup = ({
  schema,
  value = {
    indoor_model_number: "",
    outdoor_model_number: "",
    heating_capacity_indoor: "",
    high_stage_heating: "",
    heating_capacity: "",
    heating_power: "",
    heating_cop: "",
    high_stage_cooling: "",
    cooling_capacity: "",
    cooling_powe: "",
  },
  disabled,
  onChange,
  options,
  required,
  label,
  name,
  id,
  readonly,
  autofocus,
  rawErrors,
  ...rest
}) => {
  const [val, setVal] = useState(value);

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
          <div>
            <div>BRAND: {val.brand}</div>
            {val.indoor_unit_number && (
              <div>Indoor Model : {val.indoor_unit_number}</div>
            )}
            {val.outdoor_unit_number && (
              <div>Outdoor Model : {val.outdoor_unit_number}</div>
            )}
            {val.highstageHeating && (
              <div>
                <div>
                  High Stage Heating Capacity: {val.highstageHeating.capacity}
                </div>
                <div>
                  High Stage Heating Power: {val.highstageHeating.power}
                </div>
                <div>High Stage Heating COP: {val.highstageHeating.cop}</div>
              </div>
            )}
            {val.highstageCooling && (
              <div>
                <div>
                  High Stage Cooling Capacity: {val.highstageCooling.capacity}
                </div>
                <div>
                  High Stage Cooling Power: {val.highstageCooling.power}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AHRILookup;
