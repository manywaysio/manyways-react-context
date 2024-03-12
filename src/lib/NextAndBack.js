import { useManyways } from "./ManywaysContext";

const NextAndBack = ({ currentNode = {}, className }) => {
  const { goBack, responses, classNamePrefix, mode, labels } = useManyways();

  let theResponse = responses.find((r) => r.node_id === currentNode?.id);

  return (
    <div
      className={`${className} next-and-back-hidden-${
        mode === "scroll" && !!theResponse
      } ${classNamePrefix}-next-and-back`}>
      {/* <button
        className={`${classNamePrefix}-back`}
        onClick={(e) => {
          e.preventDefault();
          goBack();
        }}>
        {labels ? labels.back : "Back"}
      </button> */}
      <button className={`${classNamePrefix}-next`} type="submit">
        {labels
          ? labels.next
          : currentNode.id === 32
          ? "Start"
          : currentNode.id === 33
          ? "I got it!"
          : currentNode.id === 34
          ? "Continue"
          : currentNode.id === 36
          ? "Continue"
          : "Next"}
      </button>
    </div>
  );
};

export default NextAndBack;
