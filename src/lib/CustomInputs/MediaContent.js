const MediaContent = ({ schema, ...props }) => {
  return (
    <div className={`media-content ${schema?.customClassName}`}>
      <div
        className="text-container"
        dangerouslySetInnerHTML={{ __html: schema?.text }}
      />

      {schema?.media && (
        <div className="image-container">
          <img
            src={schema?.media}
            alt={schema?.mediaAlt ? schema?.mediaAlt : ""}
          />
        </div>
      )}
    </div>
  );
};

export default MediaContent;
