const MediaContent = ({ schema, ...props }) => {
  return (
    <div>
      xx
      <div dangerouslySetInnerHTML={{ __html: schema?.text }} />
      <div>
        <img src={schema?.media} />
      </div>
    </div>
  );
};

export default MediaContent;
