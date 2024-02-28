import { useManyways } from "./ManywaysContext";
import validator from "@rjsf/validator-ajv8";
import Form from "@rjsf/core";
import NextAndBack from "./NextAndBack";
import ManywaysRadioWidget from "./CustomInputs/ManywaysRadioWidget";
import MediaContent from "./CustomInputs/MediaContent";
import ManywaysCheckboxWidget from "./CustomInputs/ManywaysCheckboxWidget";
import ManywaysSelectWidget from "./CustomInputs/ManywaysSelectWidget";
import Footer from "./Footer";
import { slugify } from "./utils/helpers";
import Select from "react-select";
import { useState } from "react";

const isFormWithOneChoiceFieldOnly = (formSchema, uiSchema) => {
  if (formSchema.properties) {
    const properties = Object.keys(formSchema.properties).filter((key) => {
      return formSchema.properties[key].type !== "null" && key;
    });
    if (properties.length === 1) {
      const property = formSchema.properties[properties[0]];
      if (
        property.type === "string" &&
        property.enum &&
        uiSchema[properties[0]] &&
        uiSchema[properties[0]]["ui:widget"] === "radio"
      ) {
        return true;
      }
    }
  }
  return false;
};

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

const NodeRenderer = (props) => {
  const {
    nodes,
    goBack,
    responses,
    classNamePrefix,
    currentNodeId,
    goForward,
    mode,
    treeConfig,
    locale,
  } = useManyways();

  return nodes
    .filter((n) => {
      if (mode === "scroll") {
        return true;
      } else {
        return n.id === currentNodeId;
      }
    })
    .map((currentNode, idx) => {
      let theResponse = responses.find((r) => r.node_id === currentNode?.id);

      // UI VARIABLES
      let UIVariables = currentNode?.ui_variables || {};
      let { translations = {} } = currentNode;
      let globalUIVariables =
        mode === "slideshow" ? treeConfig?.run_mode?.ui_variables || {} : {};
      let impliedUIVariables = {
        ...globalUIVariables,
        ...UIVariables,
      };

      let { backgroundImage, nodeLayout, foregroundImage, isFullScreen } =
        impliedUIVariables;

      const isFirstNode = idx === 0 ? true : false;

      const singleChoiceField = isFormWithOneChoiceFieldOnly(
        currentNode?.form_schema,
        currentNode?.ui_schema
      );

      function transformErrors(errors) {
        return errors.map((error) => {
          if (!translations[locale]) {
            return error;
          }
          if (!!translations[locale].errors?.[error.property]?.[error.name]) {
            error.message =
              translations[locale].errors?.[error.property]?.[error.name];
          }
          return error;
        });
      }

      return (
        <div
          key={idx}
          className={`${classNamePrefix}-node
          is-current-node-${currentNodeId === currentNode?.id} 
          has-response-${!!theResponse}
          layout-${nodeLayout || "center"}
          is-full-screen-${!!isFullScreen}
          has-background-${!!backgroundImage}
          has-foreground-${!!foregroundImage}
          is-first-node-${isFirstNode}
          ${classNamePrefix}-node-${slugify(currentNode?.title)}
          `}
          id={`${classNamePrefix}-node-${currentNode?.id}`}
          style={
            !!backgroundImage
              ? {
                  backgroundImage: `url(${backgroundImage})`,
                }
              : {}
          }
        >
          <div className={`${classNamePrefix}-container`}>
            {!!foregroundImage && (
              <div className={`${classNamePrefix}-foreground-image-wrapper`}>
                <img
                  alt={currentNode?.title}
                  className={`${classNamePrefix}-foreground-image`}
                  src={foregroundImage}
                />
              </div>
            )}
            <Form
              disabled={!!theResponse}
              formData={theResponse?.response || {}}
              className={`${classNamePrefix}-form ${classNamePrefix}-node-${slugify(
                currentNode?.title
              )}-form
          has-response-${!!theResponse}
          `}
              widgets={{
                RadioWidget: ManywaysRadioWidget,
                CheckboxesWidget: ManywaysCheckboxWidget,
                SelectWidget: ManywaysSelectWidget,
                Select: ({ value, onChange, disabled, ...props }) => {
                  const { options } = props;
                  const [menuIsOpen, setMenuIsOpen] = useState(false);

                  let temp_opts = [
                    { value: "xxx", label: "XXX" },
                    { value: "Alberta", label: "Alberta" },
                  ];
                  const theOptions =
                    !!options?.enumOptions && !!options?.enumOptions?.length > 0
                      ? options?.enumOptions
                      : temp_opts;
                  return (
                    <>
                      {!!menuIsOpen && (
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
                        onMen
                        onDropdownClose={() => {
                          console.log("dd close");
                        }}
                        blurInputOnSelect={true}
                        onBlur={() => {
                          console.log("blur");
                          // setMenuIsOpen(false);
                        }}
                        menuIsOpen={menuIsOpen}
                        styles={selectStyles}
                        // isDisabled={disabled}
                        // value={theOptions.find((o) => o.value === value)}
                        placeholder={props.placeholder}
                        options={theOptions}
                        classNamePrefix="select-mw"
                      />
                    </>
                  );
                },
              }}
              onChange={(e) => {
                if (!!singleChoiceField) {
                  goForward(e);
                }
              }}
              fields={{
                MediaContent: MediaContent,
              }}
              transformErrors={transformErrors}
              key={currentNode?.id || 1123456789}
              onSubmit={goForward}
              schema={currentNode?.form_schema || {}}
              validator={validator}
              uiSchema={!!currentNode?.ui_schema ? currentNode?.ui_schema : {}}
            >
              <NextAndBack
                currentNode={currentNode}
                className={`singleChoiceField-${singleChoiceField}`}
              />
            </Form>
          </div>
          {mode === "slideshow" ? <Footer /> : null}
        </div>
      );
    });
};

export default NodeRenderer;
