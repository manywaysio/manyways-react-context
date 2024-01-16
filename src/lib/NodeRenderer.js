import { useManyways } from "./ManywaysContext";
import validator from "@rjsf/validator-ajv8";
import Form from "@rjsf/core";

const NodeRenderer = (props) => {
  const {
    nodes,
    goBack,
    responses,
    classNamePrefix,
    currentNodeId,
    goForward,
    mode,
  } = useManyways();

  return nodes
    .filter((n) => {
      if (mode === "scroll") {
        return true;
      } else {
        return n.id === currentNodeId;
      }
    })
    .map((currentNode) => {
      let theResponse = responses.find((r) => r.node_id === currentNode?.id);
      return (
        <Form
          disabled={!!theResponse}
          formData={theResponse?.response || {}}
          className={`${classNamePrefix}-form is-current-node-${
            currentNodeId === currentNode?.id
          } has-response-${!!theResponse}`}
          key={currentNode?.id || 1123456789}
          onSubmit={goForward}
          schema={currentNode?.form_schema || {}}
          validator={validator}
          uiSchema={!!currentNode?.ui_schema ? currentNode?.ui_schema : {}}
        >
          <div
            className={`${classNamePrefix}-next-and-back`}
            style={{
              display: mode === "scroll" && !!theResponse ? "none" : "block",
            }}
          >
            <button
              className={`${classNamePrefix}-back`}
              onClick={(e) => {
                e.preventDefault();
                goBack();
              }}
            >
              Back
            </button>
            <button className={`${classNamePrefix}-next`} type="submit">
              Submit
            </button>
          </div>
        </Form>
      );
    });
};

export default NodeRenderer;
