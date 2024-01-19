import { useManyways } from "./ManywaysContext";
import validator from "@rjsf/validator-ajv8";
import Form from "@rjsf/core";
import NextAndBack from "./NextAndBack";
import ManywaysRadioWidget from "./CustomInputs/ManywaysRadioWidget";
import MediaContent from "./CustomInputs/MediaContent";
import ManywaysCheckboxWidget from "./CustomInputs/ManywaysCheckboxWidget";
import ManywaysSelectWidget from "./CustomInputs/ManywaysSelectWidget";
import Footer from "./Footer";

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

      const isFirstNode = idx === 0 ? true : false  

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
          ${classNamePrefix}-node-${currentNodeId}
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
              className={`${classNamePrefix}-form 
          has-response-${!!theResponse}
          `}
              widgets={{
                RadioWidget: ManywaysRadioWidget,
                CheckboxesWidget:  ManywaysCheckboxWidget,
                SelectWidget:  ManywaysSelectWidget
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
              <NextAndBack currentNode={currentNode} />
            </Form>
          </div>
          {
            mode === 'slideshow' ? <Footer /> : null
          }
        </div>
      );
    });
};

export default NodeRenderer;
