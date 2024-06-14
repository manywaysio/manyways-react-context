import { useCallback } from "react";
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
  const { enumOptions, enumDisabled, inline, emptyValue } = options;

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

  const hasImages = () => {
    if (!enumOptions) {
      return false;
    }
    return (
      enumOptions.find(
        (item) =>
          item && item.schema && item.schema.icon && item.schema.icon.url
      ) !== undefined
    );
  };

  return (
    <div
      role="radiogroup"
      className={`field-radio-group 
      field-group-images-${!!schema.enum_icons || hasImages()} 
      ${inline ? "field-layout-inline" : "field-layout-block"}`}
      id={id}
    >
      {Array.isArray(enumOptions) &&
        enumOptions.map((option, i) => {
          const checked = enumOptionsIsSelected(option.value, value);

          const itemDisabled =
            Array.isArray(enumDisabled) &&
            enumDisabled.indexOf(option.value) !== -1;

          const disabledCls =
            disabled || itemDisabled || readonly ? "disabled" : "";

          const handleChange = () => onChange(option.value);

          const radio = (
            <>
              <input
                type="radio"
                id={optionId(id, i)}
                name={id}
                // required={required}
                value={String(i)}
                disabled={disabled || itemDisabled || readonly}
                checked={checked}
                autoFocus={autofocus && i === 0}
                onChange={handleChange}
                onBlur={handleBlur}
                onFocus={handleFocus}
                aria-describedby={ariaDescribedByIds(id)}
                tabIndex={-1}
              />
              <div className="label-content">
                {(!!schema.enum_icons?.[i] || !!option?.schema?.icon?.url) && (
                  <img
                    src={schema?.enum_icons?.[i] || option?.schema?.icon?.url}
                    alt={option?.schema?.icon?.alt_text || `${option.label}`}
                  />
                )}
                <div>
                  <span dangerouslySetInnerHTML={{ __html: option.label }} />

                  {(!!schema.enum_descriptions?.[i] ||
                    option?.schema?.description) && (
                    <p className="label-description">
                      {schema.enum_descriptions?.[i] ||
                        option?.schema?.description}
                    </p>
                  )}
                </div>
              </div>
            </>
          );

          return (
            <label
              key={i}
              className={`${
                inline ? "radio-inline" : "radio"
              } selected-${checked} ${disabledCls}`}
              tabIndex={disabled ? -1 : 0}
              role="radio"
              htmlFor={optionId(id, i)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleChange();
              }}
            >
              {radio}
            </label>
          );
        })}
    </div>
  );
};

export default ManywaysRadioWidget;
