import { useEffect, useState } from "react";
import Select from "react-select";
import { useManyways } from "../ManywaysContext";

const IndoorUnitWidget = ({ value, onChange, disabled, ...props }) => {
  const { responseId } = useManyways();
  const { options } = props;
  const [__options, setOptions] = useState([]);
  const [menuIsOpen, setMenuIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [units, setUnits] = useState();
  const [indoorUnitNumbers, setIndoorUnitNumbers] = useState();
  const [selectedOutdoor, setSelectedOutdoor] = useState();

  const theOptions = indoorUnitNumbers?.length > 0 ? indoorUnitNumbers : [];

  let theValue = theOptions.find((o) => o.value === value);
  if (!theValue) {
    theValue = false;
  }

  let getResponses = async () => {
    let responses = await fetch(
      `https://mw-apiv2-prod.fly.dev/response_sessions/${responseId}?render_response_nodes=true`
    )
      .then((r) => r.json())
      .then((r) => r?.responses);

    let _lookupData = responses.reverse().find((r) => r.node_id === 543);

    const _units =
      _lookupData?.response?.look_up_responses?.["indoor-outdoor-units"]
        ?.result || [];
    setUnits(_units);
  };

  useEffect(() => {
    getResponses();
  }, []);

  useEffect(() => {
    if (indoorUnitNumbers?.length === 1) {
      theValue = indoorUnitNumbers[0].value;
      onChange(indoorUnitNumbers[0].value);
    }
  }, [selectedOutdoor, indoorUnitNumbers]);

  useEffect(() => {
    window.manyways.dispatcher.subscribe(
      "mesca/outdoor-unit-selected",
      function (data) {
        setSelectedOutdoor(data);
        // console.log("i am inside indoor. but outdoor said : outdoor unit selected", data);
      }
    );
  }, [options]);

  useEffect(() => {
    if (units) {
      const filteredIndoorUnits = units
        .filter((unit) => unit.outdoor_unit_model_number === selectedOutdoor)
        .map((unit) => ({
          value: unit.idu_override,
          label: unit.idu_override,
        }));

      setIndoorUnitNumbers(filteredIndoorUnits);
    }
  }, [units, selectedOutdoor]);

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
      />
    </>
  );
};

export default IndoorUnitWidget;
