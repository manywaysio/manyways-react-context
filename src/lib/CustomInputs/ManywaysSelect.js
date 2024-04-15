import { useEffect, useState } from "react";
import Select from "react-select";

const selectStyles = {
  clearIndicator: (baseStyles, state) => {
    return { ...baseStyles };
  },
  container: (baseStyles, state) => {
    return { ...baseStyles };
  },
  control: (baseStyles, state) => {
    return { ...baseStyles };
  },
  dropdownIndicator: (baseStyles, state) => {
    return { ...baseStyles };
  },
  group: (baseStyles, state) => {
    return { ...baseStyles };
  },
  groupHeading: (baseStyles, state) => {
    return { ...baseStyles };
  },
  indicatorsContainer: (baseStyles, state) => {
    return { ...baseStyles };
  },
  indicatorSeparator: (baseStyles, state) => {
    return { ...baseStyles };
  },
  input: (baseStyles, state) => {
    return { ...baseStyles };
  },
  loadingIndicator: (baseStyles, state) => {
    return { ...baseStyles };
  },
  loadingMessage: (baseStyles, state) => {
    return { ...baseStyles };
  },
  menu: (baseStyles, state) => {
    return { ...baseStyles };
  },
  menuList: (baseStyles, state) => {
    return { ...baseStyles };
  },
  menuPortal: (baseStyles, state) => {
    return { ...baseStyles };
  },
  multiValue: (baseStyles, state) => {
    return { ...baseStyles };
  },
  multiValueLabel: (baseStyles, state) => {
    return { ...baseStyles };
  },
  multiValueRemove: (baseStyles, state) => {
    return { ...baseStyles };
  },
  noOptionsMessage: (baseStyles, state) => {
    return { ...baseStyles };
  },
  option: (baseStyles, state) => {
    return { ...baseStyles };
  },
  placeholder: (baseStyles, state) => {
    return { ...baseStyles };
  },
  singleValue: (baseStyles, state) => {
    return { ...baseStyles };
  },
  valueContainer: (baseStyles, state) => {
    return { ...baseStyles };
  },
};

const ManywaysSelect = ({ value, onChange, disabled, ...props }) => {
  const { options, id } = props;
  const [menuIsOpen, setMenuIsOpen] = useState(false);

  useEffect(() => {
    const _theOptions =
      !!options?.enumOptions && !!options?.enumOptions?.length > 0
        ? options?.enumOptions
        : temp_opts;
    //Default
    // if (_theOptions?.length === 1) {
    //   onChange(_theOptions[0].value);
    // }

    // Only for mesca root_indoor
    if (id === "root_indoor" && _theOptions?.length >= 1) {
      if (!value) {
        onChange(_theOptions[0].value);
      } else {
        const optionVals = _theOptions.find((item) => item?.value === value);
        if (!optionVals) {
          onChange(_theOptions[0].value);
        }
      }
    }
  }, [onChange]);

  let temp_opts = [
    { value: "xxx", label: "XXX" },
    { value: "Alberta", label: "Alberta" },
  ];
  const theOptions =
    !!options?.enumOptions && !!options?.enumOptions?.length > 0
      ? options?.enumOptions
      : temp_opts;

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
              backgroundColor: "red",
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
              backgroundColor: "red",
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
          console.log(v);
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
          console.log("focus");
          setMenuIsOpen(true);
        }}
        onDropdownClose={() => {
          console.log("dd close");
        }}
        blurInputOnSelect={true}
        onBlur={() => {
          console.log("blur");
          // setMenuIsOpen(false);
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

export default ManywaysSelect;
