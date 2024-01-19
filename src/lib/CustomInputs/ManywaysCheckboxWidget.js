import { ChangeEvent, FocusEvent, useCallback } from "react";
import {
  ariaDescribedByIds,
  enumOptionsDeselectValue,
  enumOptionsIsSelected,
  enumOptionsSelectValue,
  enumOptionsValueForIndex,
  optionId,
  FormContextType,
  WidgetProps,
  RJSFSchema,
  StrictRJSFSchema,
} from "@rjsf/utils";

const ManywaysCheckboxWidget = ({
  schema,
  id,
  disabled,
  options: { inline = false, enumOptions, enumDisabled, emptyValue },
  value,
  autofocus = false,
  readonly,
  onChange,
  onBlur,
  onFocus,
}) => {
  const checkboxesValues = Array.isArray(value) ? value : [value];

  const handleBlur = useCallback(
    ({ target: { value } }) =>
      onBlur(id, enumOptionsValueForIndex(value, enumOptions, emptyValue)),
    [onBlur, id]
  );

  const handleFocus = useCallback(
    ({ target: { value } }) =>
      onFocus(id, enumOptionsValueForIndex(value, enumOptions, emptyValue)),
    [onFocus, id]
  );

  return (
    <div
      className={`field-checkbox-group 
    field-group-images-${!!schema.enum_icons}
    ${inline ? "field-layout-inline" : "field-layout-block"}`}
      id={id}
    >
      {Array.isArray(enumOptions) &&
        enumOptions.map((option, index) => {
          const checked = enumOptionsIsSelected(option.value, checkboxesValues);
          const itemDisabled =
            Array.isArray(enumDisabled) &&
            enumDisabled.indexOf(option.value) !== -1;
          const disabledCls =
            disabled || itemDisabled || readonly ? "disabled" : "";

          const handleChange = (event) => {
            if (event.target.checked) {
              onChange(
                enumOptionsSelectValue(index, checkboxesValues, enumOptions)
              );
            } else {
              onChange(
                enumOptionsDeselectValue(index, checkboxesValues, enumOptions)
              );
            }
          };

          const checkbox = (
            <>
              <input
                type="checkbox"
                id={optionId(id, index)}
                name={id}
                checked={checked}
                value={String(index)}
                disabled={disabled || itemDisabled || readonly}
                autoFocus={autofocus && index === 0}
                onChange={handleChange}
                onBlur={handleBlur}
                onFocus={handleFocus}
                aria-describedby={ariaDescribedByIds(id)}
              />

              {!!schema.enum_icons?.[index] ? (
                <img
                  src={schema?.enum_icons?.[index]}
                  alt={`${option.label}`}
                />
              ) : (
                <div class="checkbox-checkmark"></div>
              )}
              {option.label}
            </>
          );

          return (
            <label
              className={`${disabledCls} ${checked ? "selected" : ""}
              ${inline ? "checkbox-inline" : "checkbox"}
              `}
              key={index}
            >
              {checkbox}
            </label>
          );
        })}
    </div>
  );
};

export default ManywaysCheckboxWidget;
