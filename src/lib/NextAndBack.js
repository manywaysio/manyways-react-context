import { useManyways } from "./ManywaysContext";

const NextAndBack = ({ currentNode = {}, className }) => {
  const { goBack, responses, classNamePrefix, mode } = useManyways();

  let theResponse = responses.find((r) => r.node_id === currentNode?.id);

  return (
    <div
      className={`${className} next-and-back-hidden-${
        mode === "scroll" && !!theResponse
      } ${classNamePrefix}-next-and-back`}
    >
      {/* <button
        className={`${classNamePrefix}-back`}
        onClick={(e) => {
          e.preventDefault();
          goBack();
        }}
      >
        Back
      </button> */}
      <button className={`${classNamePrefix}-next`} type="submit">
        Next
      </button>
    </div>
  );
};

export default NextAndBack;
