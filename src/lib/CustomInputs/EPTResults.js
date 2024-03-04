import { useEffect, useState } from "react";
import _results from "./../../data-samples/results.json";
import Phone from "./../../icons/Phone";
import Envelope from "./../../icons/Envelope";

const Price = ({ priceRange }) => {
  const discountedPrice = priceRange
    .split(" - ")
    .map((p) => parseInt(p))
    .map((p) => p - (p * 10) / 100)
    .join(" - ");
  const [discountApplied, setDiscountApplied] = useState(false);
  return (
    <div>
      <div
        className="fullprice"
        style={{
          textDecoration: discountApplied ? "line-through" : "none",
        }}
      >
        {priceRange}
      </div>
      {discountApplied && (
        <div className="discountedprice">{discountedPrice}</div>
      )}
      {!discountApplied && (
        <button
          className="apply-price"
          onClick={() => {
            setDiscountApplied(!discountApplied);
          }}
        >
          Apply Discount
        </button>
      )}
    </div>
  );
};

const SingleEPTResult = ({
  featuredImage,
  name,
  description,
  overviewText,
  largeOverview,
  regions,
  countries,
  cruiseType,
  ship,
  smallOverview,
  years,
  waterways,
  results,
  packages,
}) => {
  const thePackage = packages[0] || { price: {} };
  const {
    price: { priceRange, prices },
    currency,
    discount,
    discountCurrency,
    itineraryDays,
    duration,
    itineraryImages,
    itineraryHeroImage,
    mainEnlargedMap,
  } = thePackage;
  return (
    <div className="single-result" style={{ background: "black" }}>
      <div
        className="single-result-background"
        style={{
          backgroundImage: `url(${featuredImage})`,
          backgroundSize: `cover`,
          color: `white`,
        }}
      >
        <div className="inner-bg">
          <div className="inner-bg-content">
            <h2>{name}</h2>
            <div className="inner-bg-grid">
              <div className="overview-content hide-on-mobile">
                <div
                  dangerouslySetInnerHTML={{
                    __html: smallOverview,
                  }}
                ></div>
                <a className="big-button">Let's Sail</a>
              </div>
              <div className="countries">
                <h4 className="ept-subtitle">Countries</h4>
                {countries.map((c, i) => (
                  <div key={i}>{c}</div>
                ))}
              </div>
              <div className="price">
                <h4 className="ept-subtitle">Member Price</h4>
                <Price priceRange={priceRange} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="inner-content-container">
        <div
          className="overview-content-mobile hide-on-tablet"
          dangerouslySetInnerHTML={{
            __html: smallOverview,
          }}
        ></div>
        <a className="big-button">Let's Sail</a>
      </div>
      <div className="image-side-scene">
        <img src={itineraryHeroImage} />
      </div>
      <div className="inner-content-container">
        <div className="iternary-and-images">
          <div className="iternary">
            {itineraryDays.map(
              (
                {
                  number,
                  title,
                  image,
                  destinationName,
                  destinationDescription,
                  description,
                },
                idx
              ) => {
                return (
                  <div key={idx}>
                    <h4>
                      DAY {number} &mdash; {title}
                    </h4>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: destinationDescription,
                      }}
                    ></div>
                  </div>
                );
              }
            )}
            {mainEnlargedMap && <img src={mainEnlargedMap} />}
          </div>
          <div className="iternary-images">
            {itineraryImages.map((img, i) => {
              return <img key={i} src={img} />;
            })}
          </div>
          <div className="vessel-info">
            <img className="viking-logo" src="/viking.png" />
            <div className="vessel-grid">
              <div>
                <h4>Vessel</h4>
                <p>{ship.name}</p>
              </div>
              <div className="staterooms-holder">
                <h4>Staterooms</h4>
                {ship.stateRooms.map((room, idx) => {
                  return (
                    <div
                      key={idx}
                      dangerouslySetInnerHTML={{ __html: room.name }}
                    ></div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="image-final-scene">
        <img src={featuredImage} />
      </div>
      <div className="inner-content-container charlotte-modal-content show">
        <h2>Ready to turn your travel dreams into reality?</h2>
        <p>
          We'd love to make it happen! Please provide your phone number or email
          address below, and Charlotte will contact you to reserve your spot on
          the perfect journey.
        </p>
        <form>
          <p className="char-desc">
            Please provide your phone number or email address below, and
            Charlotte will contact you to assist you with any of your travel
            questions!
          </p>
          <div className="input-icon-container">
            <Phone className="input-icon" />
            <input
              type="text"
              className="input-with-icon"
              placeholder="Enter phone number"
            />
          </div>
          <span>OR</span>
          <div className="input-icon-container">
            <Envelope className="input-icon" />
            <input
              type="text"
              className="input-with-icon"
              placeholder="Enter email address"
            />
          </div>
          <button className="submit-button" type="submit">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

let EPTResults = () => {
  const [results, setResults] = useState([]);
  const getResults = async () => {
    // const response = await fetch(
    //   "https://carp.eptravel.ca/api/ept?howlong=Up%20to%209%20nights&"
    // );
    // const data = await response.json();
    // setResults(data);
    setResults(_results.reverse());
    console.log(_results);
  };
  useEffect(() => {
    getResults();
  }, []);

  return (
    <div
      className="results-holder"
      style={{
        background: `black`,
        height: `100%`,
        minHeight: `100vh`,
        zIndex: 1000,
        marginTop: `56px`,
      }}
    >
      {results.map((r) => (
        <SingleEPTResult {...r} />
      ))}
    </div>
  );
};

export default EPTResults;
