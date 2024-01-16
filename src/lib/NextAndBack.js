import { useManyways } from "./ManywaysContext";

const NextAndBack = ({ currentNode = {} }) => {
  const { goBack, responses, classNamePrefix, mode } = useManyways();

  let theResponse = responses.find((r) => r.node_id === currentNode?.id);

  return (
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
  );
};

export default NextAndBack;
