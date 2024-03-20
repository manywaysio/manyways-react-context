import { useCallback } from "react";
import { useManyways } from "../ManywaysContext";
import {
  ariaDescribedByIds,
  enumOptionsIsSelected,
  enumOptionsValueForIndex,
  optionId,
} from "@rjsf/utils";

const ManywaysRadioWidget = ({
  schema,
  options,
  value,
  required,
  disabled,
  readonly,
  autofocus = false,
  onBlur,
  onFocus,
  onChange,
  id,
}) => {
  const { enumOptions, enumDisabled, inline, emptyValue, goBack } = options;
  const { currentNodeId } = useManyways();

  const handleBlur = useCallback(
    ({ target: { value } }) =>
      onBlur(id, enumOptionsValueForIndex(value, enumOptions, emptyValue)),
    [onBlur, id, enumOptions, emptyValue]
  );

  const handleFocus = useCallback(
    ({ target: { value } }) =>
      onFocus(id, enumOptionsValueForIndex(value, enumOptions, emptyValue)),
    [onFocus, id, enumOptions, emptyValue]
  );

  // console.log("enumOptions", enumOptions);

  return (
    <div
      className={`field-radio-group 
      field-group-images-${!!schema.enum_icons}
      ${inline ? "field-layout-inline" : "field-layout-block"} ${
        !!enumOptions && enumOptions.length > 6 ? "enum-grid" : ""
      }`}
      id={id}>
      {Array.isArray(enumOptions) &&
        enumOptions.map((option, i) => {
          const checked = enumOptionsIsSelected(option.value, value);

          const itemDisabled =
            Array.isArray(enumDisabled) && enumDisabled.indexOf(option.value) !== -1;

          const disabledCls = disabled || itemDisabled || readonly ? "disabled" : "";

          const handleChange = () => onChange(option.value);

          const radio = (
            <>
              <input
                type="radio"
                id={optionId(id, i)}
                name={id}
                required={required}
                value={String(i)}
                disabled={disabled || itemDisabled || readonly}
                checked={checked}
                autoFocus={autofocus && i === 0}
                onChange={handleChange}
                onBlur={handleBlur}
                onFocus={handleFocus}
                aria-describedby={ariaDescribedByIds(id)}
              />
              <label
                htmlFor={optionId(id, i)}
                className={`${disabledCls} ${
                  currentNodeId == 43 && option.label.length > 19
                    ? "enum-grid-item-minimize"
                    : ""
                }`}>
                {!!schema.enum_icons?.[i] && (
                  <img src={schema?.enum_icons?.[i]} alt={`${option.label}`} />
                )}
                {option.label}
              </label>
            </>
          );

          return (
            <>
              <div
                key={optionId(id, i)}
                className={`${inline ? "radio-inline" : "radio"} selected-${checked}`}>
                {radio}
              </div>
            </>
          );
        })}
    </div>
  );
};

export default ManywaysRadioWidget;
