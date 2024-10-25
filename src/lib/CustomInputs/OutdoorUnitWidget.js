import { useEffect, useState } from "react";
import Select from "react-select";
import { useManyways } from "../ManywaysContext";

const OutdoorUnitWidget = ({ value, onChange, disabled, ...props }) => {
  const { responseId } = useManyways();
  const { options } = props;
  const [menuIsOpen, setMenuIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [units, setUnits] = useState();
  const [outdoorUnitNumbers, setOutdoorUnitNumbers] = useState();
  const [selectedValue, setSelectedValue] = useState(null);

  let getResponses = async () => {
    let responses = await fetch(
      `https://mw-apiv2-prod.fly.dev/response_sessions/${responseId}?render_response_nodes=true`
    )
      .then((r) => r.json())
      .then((r) => r?.responses);

    let _lookupData = responses
      .reverse()
      .find((r) => r.node_id === props?.uiSchema?.lookup_node_id);

    // console.log(responses);

    const _units =
      _lookupData?.response?.look_up_responses?.["model-num-and-ahri"]
        ?.result || [];
    setUnits(_units);
  };

  useEffect(() => {
    const _theOptions = outdoorUnitNumbers ? outdoorUnitNumbers : temp_opts;
    if (_theOptions?.length === 1) {
      setSelectedValue(_theOptions[0]);
      onChange(_theOptions[0].value);
    }

    getResponses();
  }, []);

  useEffect(() => {
    if (units) {
      const uniqueOutdoorUnitModelNumbers = units
        .reduce((acc = [], unit) => {
          if (!acc.includes(unit.outdoor_unit_model_number)) {
            acc.push(unit.outdoor_unit_model_number);
          }
          return acc;
        }, [])
        .map((o) => {
          let clean = `${o}`.replace(/\*+$/, "");
          clean = clean.replace(/\d+$/, "");
          // clean = clean.replace(/-/g, "");
          clean = clean.replace(/U+$/, "");
          // remove any dashes at the end of the string
          clean = clean.replace(/-+$/, "");
          return { outdoor_unit_model_number: o, clean };
        })
        .reduce((acc = [], o) => {
          if (!acc.find((a) => a.clean === o.clean)) {
            acc.push(o);
          }
          return acc;
        }, [])
        .map((o) => {
          return { value: o.outdoor_unit_model_number, label: o.clean };
        });
      setOutdoorUnitNumbers(uniqueOutdoorUnitModelNumbers);
    }
  }, [units]);

  // close on escape
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.keyCode === 27) {
        setMenuIsOpen(false);
      }
    };

    const shiftTabKeyListener = (event) => {
      if (event.keyCode === 9 && event.shiftKey) {
        setMenuIsOpen(false);
      }
    };
    document.addEventListener("keydown", handleEscKey);
    document.addEventListener("keydown", shiftTabKeyListener);

    return () => {
      document.removeEventListener("keydown", handleEscKey);
    };
  }, []);

  // console.log(window.manyways.dispatcher);

  let temp_opts = [
    { value: "xxx", label: "XXX" },
    { value: "Alberta", label: "Alberta" },
  ];
  const theOptions =
    outdoorUnitNumbers?.length > 0 ? outdoorUnitNumbers : temp_opts;

  useEffect(() => {
    if (value) {
      const selected = theOptions.find((o) => o.value === value);
      setSelectedValue(selected);
    }
  }, [value, theOptions]);

  useEffect(() => {
    window.manyways.dispatcher.subscribe(
      "mesca/ahri-unit-selected",
      function () {
        setSelectedValue(null);
      }
    );
  }, []);

  useEffect(() => {
    if (!selectedValue) {
      onChange("");
    }
  }, [selectedValue]);

  return (
    <>
      {!!menuIsOpen && (
        <>
          <div
            style={{
              position: "fixed",
              top: "0",
              left: "0",
              width: "100%",
              height: "100%",
              zIndex: "1",
              opacity: "0",
            }}
            onClick={() => {
              setMenuIsOpen(false);
            }}
          ></div>
          <div
            style={{
              position: "absolute",
              top: "0",
              right: "0",
              width: "80px",
              height: "100%",
              zIndex: "20",
              opacity: "0",
              cursor: "pointer",
            }}
            onClick={() => {
              setMenuIsOpen(false);
            }}
          ></div>
        </>
      )}
      <Select
        onChange={(v) => {
          setSelectedValue(v);
          onChange(v.value);
          window.manyways.dispatcher.publish(
            "mesca/outdoor-unit-selected",
            v.value
          );
          setMenuIsOpen(false);
        }}
        onFocus={() => {
          setMenuIsOpen(true);
        }}
        menuIsOpen={menuIsOpen}
        isDisabled={disabled}
        isSearchable={true}
        value={selectedValue}
        placeholder={props.placeholder}
        options={theOptions}
        classNamePrefix="select-mw"
      />
    </>
  );
};

export default OutdoorUnitWidget;
