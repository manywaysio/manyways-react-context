import { useManyways } from "./ManywaysContext";

const NextAndBack = ({ currentNode = {}, className }) => {
  const {
    goBack,
    currentNodeId,
    responses,
    classNamePrefix,
    mode,
    nodes,
    labels,
  } = useManyways();

  let currentNodeIndex = nodes.findIndex((n) => n.id === currentNode?.id);
  let hasNextNode = !!nodes[currentNodeIndex + 1];

  let theResponse = responses.find((r) => r.node_id === currentNode?.id);

  const handleSubmitAnalytics = (e) => {
    switch (currentNode?.title) {
      case "Province or Territory":
        window.manyways.pushAnalytics("Form_Submit", "Rebates in my area");
        break;
      case "Model Number":
        window.manyways.pushAnalytics("Form_Submit", "By Model Number");
        break;
      case "Products":
        window.manyways.pushAnalytics("Form_Submit", "Advanced Search");
        break;
      default:
        break;
    }
  };

  return (
    <div
      className={`${className} next-and-back-hidden-${
        mode === "scroll" && !!hasNextNode
      } ${classNamePrefix}-next-and-back`}
    >
      <button
        className={`${classNamePrefix}-back`}
        onClick={(e) => {
          e.preventDefault();
          goBack();
        }}
      >
        {currentNode?.ui_variables?.custom_back_text
          ? currentNode.ui_variables.custom_back_text
          : labels
            ? labels.back
            : "Restart"}
      </button>
      <button
        className={`${classNamePrefix}-next`}
        type="submit"
        onClick={handleSubmitAnalytics}
      >
        {currentNode?.ui_variables?.custom_next_text
          ? currentNode.ui_variables.custom_next_text
          : labels
            ? labels.next
            : "Next"}
      </button>
    </div>
  );
};

export default NextAndBack;
