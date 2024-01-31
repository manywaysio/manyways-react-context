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
                  console.log(props);
                  let temp_opts = [
                    { value: "xxx", label: "XXX" },
                    { value: "Alberta", label: "Alberta" },
                  ];
                  const theOptions =
                    !!options?.enumOptions && !!options?.enumOptions?.length > 0
                      ? options?.enumOptions
                      : temp_opts;
                  return (
                    <Select
                      onChange={(v) => {
                        console.log(v);
                        onChange(v.value);
                      }}
                      isDisabled={disabled}
                      value={theOptions.find((o) => o.value === value)}
                      placeholder={props.placeholder}
                      options={theOptions}
                      classNamePrefix={classNamePrefix}
                      theme={(theme) => ({
                        ...theme,
                        borderRadius: 0,
                        colors: {
                          ...theme.colors,
                          text: "#000",
                          font: "#000",
                          primary25: "#f6f6f6",
                          primary: "#000",
                          color: "black",
                        },
                      })}
                    />
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
