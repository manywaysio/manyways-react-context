const ManywaysRadioWidget = ({ schema, onChange, ...props }) => {
  console.log(props);
  return (
    <div>
      {schema?.enum.map((opt, idx) => {
        return (
          <div
            onClick={(e) => {
              onChange(opt);
            }}
            key={idx}
          >
            {!!schema?.enum_icons?.[idx] && (
              <img src={schema?.enum_icons?.[idx]} alt={opt} />
            )}
            <span>{opt}</span>
          </div>
        );
      })}
    </div>
  );
};

export default ManywaysRadioWidget;
