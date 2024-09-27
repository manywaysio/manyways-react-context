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

  let getResponses = async () => {
    let responses = await fetch(
      `https://mw-apiv2-prod.fly.dev/response_sessions/${responseId}?render_response_nodes=true`
    )
      .then((r) => r.json())
      .then((r) => r?.responses);

    let _lookupData = responses.reverse().find((r) => r.node_id === 803);

    console.log(responses);

    const _units =
      _lookupData?.response?.look_up_responses?.["model-num-and-ahri"]
        ?.result || [];
    setUnits(_units);
  };

  useEffect(() => {
    const _theOptions = outdoorUnitNumbers ? outdoorUnitNumbers : temp_opts;
    if (_theOptions?.length === 1) {
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
          // remove all numbers from the end of the strint
          clean = clean.replace(/\d+$/, "");
          // remove all dashes from the string
          clean = clean.replace(/-/g, "");
          // remove all instances of U at the end of the string
          clean = clean.replace(/U+$/, "");
          return { outdoor_unit_model_number: o, clean };
        })
        .reduce((acc = [], o) => {
          // remove duplicates
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
        // 9 is the keycode for Tab key
        setMenuIsOpen(false);
      }
    };
    document.addEventListener("keydown", handleEscKey);
    document.addEventListener("keydown", shiftTabKeyListener);

    return () => {
      document.removeEventListener("keydown", handleEscKey);
    };
  }, []);

  console.log(window.manyways.dispatcher);

  let temp_opts = [
    { value: "xxx", label: "XXX" },
    { value: "Alberta", label: "Alberta" },
  ];
  const theOptions =
    outdoorUnitNumbers?.length > 0 ? outdoorUnitNumbers : temp_opts;

  let theValue = theOptions.find((o) => o.value === value);
  if (!theValue) {
    theValue = false;
  }
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
            onClick={(e) => {
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
            onClick={(e) => {
              setMenuIsOpen(false);
            }}
          ></div>
        </>
      )}
      <Select
        onChange={(v) => {
          // console.log(v);
          onChange(v.value);
          window.manyways.dispatcher.publish(
            "mesca/outdoor-unit-selected",
            v.value
          );
          setMenuIsOpen(false);
        }}
        onMenuOpen={() => {
          // onChange(null);
          // console.log(
          //   document
          //     .querySelector("manyways-wrapper")
          //     .shadowRoot.getElementById("react-select-2-listbox")
          // );
        }}
        onFocus={() => {
          setMenuIsOpen(true);
        }}
        onDropdownClose={() => {
          // console.log("dd close");
        }}
        blurInputOnSelect={true}
        onBlur={() => {
          // !isMobile && setMenuIsOpen(false);
        }}
        menuIsOpen={menuIsOpen}
        isDisabled={disabled}
        isSearchable={true}
        value={theValue}
        placeholder={props.placeholder}
        options={theOptions}
        classNamePrefix="select-mw"
        // styles={selectStyles}
      />
    </>
  );
};

export default OutdoorUnitWidget;
