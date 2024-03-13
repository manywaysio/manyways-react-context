import { useEffect, useState, useRef } from "react";
import _results from "./../../data-samples/results.json";
import Phone from "./../../icons/Phone";
import Envelope from "./../../icons/Envelope";
import { useSwiper, Swiper, SwiperSlide } from "swiper/react";
import { useManyways } from "../ManywaysContext";
import { Navigation, EffectCreative, Pagination, Scrollbar, A11y } from "swiper/modules";

import EPTResultsFooter from "./EPTResultsFooter";

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
        }}>
        {priceRange}
      </div>
      {discountApplied && <div className="discountedprice">{discountedPrice}</div>}
      {!discountApplied && (
        <button
          className="apply-price"
          onClick={() => {
            setDiscountApplied(!discountApplied);
          }}>
          Apply Discount
        </button>
      )}
    </div>
  );
};

const SingleEPTResult = ({
  featuredImage,
  id,
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
  results = [],
  packages,
  swiper,
}) => {
  const thePackage = packages[0] || { price: {} };
  console.log("the package", thePackage);
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

  const { charlotteModalOpen, setCharlotteModalOpen } = useManyways();
  return (
    <div className="single-result" style={{ background: "black" }}>
      <div className="single-results-background-holder">
        <div
          className="single-result-background"
          style={{
            color: `white`,
          }}>
          <img src={featuredImage} className="result-image" />
          <div className="inner-bg">
            <div className="inner-bg-content">
              <h2>{name}</h2>
              <div className="inner-bg-grid">
                <div className="overview-content hide-on-mobile">
                  <div
                    dangerouslySetInnerHTML={{
                      __html: smallOverview,
                    }}></div>
                  <a
                    onClick={(e) => {
                      e.preventDefault();
                      setCharlotteModalOpen(true);
                    }}
                    className="big-button">
                    Let's Sail
                  </a>
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
        <div className="single-background-spacer"></div>
      </div>

      <div className="inner-content-container">
        <div
          className="overview-content-mobile hide-on-tablet"
          dangerouslySetInnerHTML={{
            __html: smallOverview,
          }}></div>
        <a className="big-button hide-on-tablet">Let's Sail</a>
      </div>

      <div className="image-side-scene">
        <img src={itineraryHeroImage} />
      </div>
      <div className="inner-content-container">
        <div className="iternary-and-images">
          <div className="iternary">
            <h2>Itinerary & Excursions</h2>
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
                  <div className="iter-item" key={idx}>
                    <h4>
                      DAY {number} &mdash; {title}
                    </h4>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: destinationDescription,
                      }}></div>
                  </div>
                );
              }
            )}
            {mainEnlargedMap && <img src={mainEnlargedMap} />}
            <div className="vessel-info">
              <div className="vessel-grid">
                <img className="viking-logo" src="/viking.png" />
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
                        dangerouslySetInnerHTML={{ __html: room.name }}></div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
          <div className="iternary-images">
            {itineraryImages.map((img, i) => {
              return <img key={i} src={img} />;
            })}
          </div>
        </div>
      </div>
      <div className="image-and-form">
        <div className="image-final-scene">
          <img src={featuredImage} />
        </div>
        <div className="inner-content-container charlotte-modal-content show">
          <h2>Ready to turn your travel dreams into reality?</h2>
          <p>
            We'd love to make it happen! Please provide your phone number or email address
            below, and Charlotte will contact you to reserve your spot on the perfect
            journey.
          </p>
          <form className="results-char">
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
      <h2
        style={{
          textAlign: `center`,
          padding: `20px`,
        }}>
        Continue exploring your other recommendations
      </h2>
      <div className="otherresults">
        {results.map((r, i) => {
          return (
            r.id !== id &&
            i < 4 && (
              <div
                onClick={(e) => {
                  window.scrollTo({
                    top: 0,
                    behavior: "smooth",
                  });
                  setTimeout(() => {
                    swiper.current.slideTo(i);
                  }, 800);
                }}
                className="otheresult">
                <img className="otherresult-img" src={r.featuredImage} />
                <div className="otherresult-title">
                  <h5>{r.name}</h5>
                </div>
              </div>
            )
          );
        })}
      </div>
      <EPTResultsFooter />
    </div>
  );
};

let EPTResults = () => {
  const [results, setResults] = useState([]);
  const [init, setInit] = useState(false);
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

  const swiperRef = useRef();

  return (
    <div
      className={`results-holder ready-${init}`}
      style={{
        background: `black`,
        height: `100%`,
        minHeight: `100vh`,
        zIndex: 1000,
        position: `relative`,
      }}>
      <Swiper
        allowTouchMove={false}
        loop={true}
        autoHeight={true}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
        onAfterInit={(swiper) => {
          setInit(true);
        }}
        speed={800}
        modules={[EffectCreative]}
        effect="creative"
        creativeEffect={{
          prev: {
            // will set `translateZ(-400px)` on previous slides
            translate: [0, 0, -400],
            opacity: 0,
          },
          next: {
            // will set `translateX(100%)` on next slides
            translate: ["100%", 0, 0],
            opacity: 0,
          },
        }}>
        <div
          style={{
            position: `absolute`,
            top: "0%",
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
            zIndex: 1000,
          }}>
          <button className="s-nextprev" onClick={(e) => swiperRef.current.slidePrev()}>
            &larr;
          </button>
          <button className="s-nextprev" onClick={(e) => swiperRef.current.slideNext()}>
            &rarr;
          </button>
        </div>
        {results.map((r, i) => (
          <SwiperSlide key={i} slidesPerView={1}>
            <SingleEPTResult {...r} results={results} swiper={swiperRef} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default EPTResults;
