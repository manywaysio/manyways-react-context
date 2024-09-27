const MediaContent = ({ schema, ...props }) => {
  console.log("text", schema.text);
  // find tag of <indoor></indoor> and relace contents with IndoorUnitWidget
  // find tag of <outdoor></outdoor> and remove spaces at the end of the content
  const cleanUp = (str) => {
    let o = str
      .replace(/<indoor>/, "")
      .replace(/<\/indoor>/, "")
      .replace(/<outdoor>/, "")
      .replace(/<\/outdoor>/, "");
    // remove all * from the end of the string
    let clean = o.replace(/\*+$/, "");
    // remove all numbers from the end of the strint
    clean = clean.replace(/\d+$/, "");
    // remove all dashes from the string
    clean = clean.replace(/-/g, "");
    // remova all instances of U at the end of the string
    clean = clean.replace(/U+$/, "");
    return clean;
  };

  let replacedText = schema.text.replace(
    /<indoor>.*<\/indoor>/,
    function (match, capture) {
      return cleanUp(match);
    }
  );

  return (
    <div className={`media-content ${schema?.customClassName}`}>
      <div
        className="text-container"
        dangerouslySetInnerHTML={{ __html: replacedText }}
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
