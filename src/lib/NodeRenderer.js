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
import { useEffect, useState } from "react";
import ManywaysSelect from "./CustomInputs/ManywaysSelect";
import RightSizingLocationLookup from "./CustomInputs/RightSizingLocationLookup";
import AHRILookup from "./CustomInputs/AHRILookup";

const isFormWithOneChoiceFieldOnly = (formSchema, uiSchema) => {
  if (!!formSchema?.properties) {
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

const Thanks = () => {
  const { responesByNodeTitle } = useManyways();
  return (
    <div>
      <h1>Your summary is ready</h1>
      <p>
        The sizing calculation is now available in a pdf. Please click the
        button below to open it in a new window and download.
      </p>
      <a
        href={`https://wayfinder.manyways.io/right-size?s=${btoa(
          JSON.stringify(responesByNodeTitle)
        )}`}
        target="_blank"
        className="button"
      >
        View Summary
      </a>
    </div>
  );
};

const ManywaysCustomWidget = (props) => {
  const { schema, value, disabled, onChange, options } = props;
  const { enumOptions, enumDisabled, emptyValue: optEmptyVal } = options;

  return (
    <div
      onClick={(e) => {
        console.log(props);
      }}
    >
      {value} click
    </div>
  );
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

  const [transitioningNodes, setTransitioningNodes] = useState([]);

  //add transitioning state to last two nodes
  useEffect(() => {
    if (nodes) {
      const updatedNodes = nodes.map((node, index) => {
        if (index === nodes.length - 1 || index === nodes.length - 2) {
          return true;
        }
        return false;
      });
      setTransitioningNodes(updatedNodes);
    }

    const timeout = setTimeout(() => {
      if (nodes) {
        const updatedNodes = nodes.map(() => {
          return false;
        });
        setTransitioningNodes(updatedNodes);
      }
    }, 2000);

    return () => clearTimeout(timeout);
  }, [nodes]);

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
          if (!translations || !translations[locale]) {
            return error;
          }
          if (!!translations[locale].errors?.[error.property]?.[error.name]) {
            error.message =
              translations[locale].errors?.[error.property]?.[error.name];
          }
          return error;
        });
      }

      let currentNodeIndex = nodes.findIndex((n) => n.id === currentNode?.id);
      let hasNextNode = !!nodes[currentNodeIndex + 1];

      return (
        <div
          key={currentNode?.id}
          className={`${classNamePrefix}-node
          is-current-node-${currentNodeId === currentNode?.id} 
          has-response-${!!theResponse}
          layout-${nodeLayout || "center"}
          is-full-screen-${!!isFullScreen}
          has-background-${!!backgroundImage}
          has-foreground-${!!foregroundImage}
          is-transitioning-${!!transitioningNodes[currentNodeIndex]}
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
              disabled={!!hasNextNode}
              formData={theResponse?.response || {}}
              className={`${classNamePrefix}-form ${classNamePrefix}-node-${slugify(
                currentNode?.title
              )}-form
          has-response-${!!theResponse}
          `}
              widgets={{
                RadioWidget: ManywaysRadioWidget,
                CheckboxesWidget: ManywaysCheckboxWidget,
                checkboxes: ManywaysCheckboxWidget,
                SelectWidget: ManywaysSelect,
                Select: ManywaysSelect,
                Custom: ManywaysCustomWidget,
                RightSizingLocationLookup: RightSizingLocationLookup,
              }}
              onChange={(e) => {
                if (!!singleChoiceField) {
                  goForward(e);
                }
                // console.log(e, e.formData, theResponse?.response);
              }}
              fields={{
                MediaContent: MediaContent,
                AHRILookup,
                Thanks,
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
