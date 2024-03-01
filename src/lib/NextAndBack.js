import { useManyways } from "./ManywaysContext";

const NextAndBack = ({ currentNode = {}, className }) => {
  const { goBack, responses, classNamePrefix, mode, labels } = useManyways();

  let theResponse = responses.find((r) => r.node_id === currentNode?.id);
  console.log(currentNode);

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
        }}
      >
      {labels ? labels.back : 'Back'}
      </button> */}
      <button className={`${classNamePrefix}-next`} type="submit">
        {labels ? labels.next : "Next"}
      </button>
    </div>
  );
};

export default NextAndBack;
