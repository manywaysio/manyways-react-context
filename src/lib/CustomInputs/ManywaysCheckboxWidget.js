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

  const hasImages = () => {
    return (
      enumOptions && enumOptions.find(
        (item) =>
          item && item.schema && item.schema.icon && item.schema.icon.url
      ) !== undefined
    );
  };

  return (
    <div
      className={`field-checkbox-group 
    field-group-images-${!!schema.enum_icons || hasImages()}
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

              {!!schema.enum_icons?.[index] || !!option?.schema?.icon?.url ? (
                <img
                  src={schema?.enum_icons?.[index] || option?.schema.icon.url}
                  alt={option?.schema.icon?.alt_text || `${option.label}`}
                />
              ) : (
                <div className="checkbox-checkmark"></div>
              )}
              <div>
                {option.label}
                {(!!schema.enum_descriptions?.[index] ||
                  option?.schema?.description) && (
                  <p className="label-description">
                    {schema.enum_descriptions?.[index] ||
                      option?.schema?.description}
                  </p>
                )}
              </div>
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
