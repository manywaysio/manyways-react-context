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
  const [selectedValue, setSelectedValue] = useState(value);
  const [theValue, setTheValue] = useState(null);

  const theOptions =
    indoorUnitNumbers?.length > 0
      ? indoorUnitNumbers.sort((a, b) => {
          if (a.label < b.label) {
            return -1;
          }
          if (a.label > b.label) {
            return 1;
          }
          return 0;
        })
      : [];

  useEffect(() => {
    let foundValue = theOptions.find((o) => o.value === selectedValue);
    if (!foundValue) {
      foundValue = false;
    }
    setTheValue(foundValue);
  }, [theOptions, selectedValue]);

  const getResponses = async () => {
    let responses = await fetch(
      `https://mw-apiv2-prod.fly.dev/response_sessions/${responseId}?render_response_nodes=true`,
    )
      .then((r) => r.json())
      .then((r) => r?.responses);

    let _lookupData = responses
      .reverse()
      .find((r) => r.node_id === props?.uiSchema?.lookup_node_id);

    const _units =
      _lookupData?.response?.look_up_responses?.["docgen-indoor-outdoor"]
        ?.result || [];
    setUnits(_units);
  };

  useEffect(() => {
    getResponses();
  }, []);

  useEffect(() => {
    if (indoorUnitNumbers?.length === 1) {
      setSelectedValue(indoorUnitNumbers[0].value);
      onChange(indoorUnitNumbers[0].value);
    }
  }, [selectedOutdoor, indoorUnitNumbers]);

  useEffect(() => {
    window.manyways.dispatcher.subscribe(
      "mesca/outdoor-unit-selected",
      function (data) {
        setSelectedOutdoor(data);
      },
    );
  }, [options]);

  useEffect(() => {
    window.manyways.dispatcher.subscribe(
      "mesca/ahri-unit-selected",
      function () {
        setSelectedValue(null);
      },
    );
  }, []);

  useEffect(() => {
    if (!selectedValue) {
      onChange("");
    }
  }, [selectedValue]);

  useEffect(() => {
    if (units) {
      const filteredIndoorUnits = units
        .filter((unit) => unit.outdoor_unit_model_number === selectedOutdoor)
        .reduce((acc = [], unit) => {
          if (!acc.includes(unit.idu_override)) {
            acc.push(unit.idu_override);
          }
          return acc;
        }, [])
        .map((o) => {
          if (o.indexOf("Unit") > -1) {
            return { idu_override: o, clean: o };
          }
          let clean = `${o}`.replace(/\*+$/, "");
          clean = clean.replace(/\d+$/, "");
          // clean = clean.replace(/-/g, "");
          clean = clean.replace(/U+$/, "");
          return { idu_override: o, clean };
        })
        .reduce((acc = [], o) => {
          if (!acc.find((a) => a.clean === o.clean)) {
            acc.push(o);
          }
          return acc;
        }, [])
        .map((o) => {
          return { value: o.idu_override, label: o.clean };
        });

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
          setSelectedValue(v.value);
          onChange(v.value);
          window.manyways.dispatcher.publish(
            "mesca/indoor-unit-selected",
            v.value,
          );
          setMenuIsOpen(false);
        }}
        onMenuOpen={() => {
          setMenuIsOpen(true);
        }}
        onFocus={() => {
          setMenuIsOpen(true);
        }}
        blurInputOnSelect={true}
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
