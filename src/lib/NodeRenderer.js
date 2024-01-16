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
  } = useManyways();

  return nodes.map((currentNode) => {
    let theResponse = responses.find((r) => r.node_id === currentNode?.id);
    return (
      <Form
        disabled={!!theResponse}
        formData={theResponse?.response}
        className={`${classNamePrefix}-form is-current-node-${
          currentNodeId === currentNode?.id
        } has-response-${!!theResponse}`}
        key={currentNode?.id || 1123456789}
        onSubmit={goForward}
        schema={currentNode?.form_schema}
        validator={validator}
        uiSchema={!!currentNode?.ui_schema ? currentNode?.ui_schema : {}}
      >
        {currentNodeId}
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
      </Form>
    );
  });
};

export default NodeRenderer;
