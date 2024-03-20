import { useEffect, useState, useRef } from "react";
import _results from "./../../data-samples/results.json";
import Phone from "./../../icons/Phone";
import Envelope from "./../../icons/Envelope";
import { useSwiper, Swiper, SwiperSlide } from "swiper/react";
import { useManyways } from "../ManywaysContext";
import { EffectCreative, Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";

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
        className={`fullprice ${discountApplied ? "applied" : ""}`}
        style={{
          textDecoration: discountApplied ? "line-through" : "none",
        }}>
        {priceRange}
      </div>
      {discountApplied && <div className="discountedprice">{discountedPrice}</div>}
      <button
        className={`apply-price ${discountApplied ? "applied" : ""}`}
        onClick={() => {
          setDiscountApplied(true);
        }}>
        Apply Discount
      </button>
    </div>
  );
};

const SingleEPTResult = ({
  featuredImage,
  id,
  name,
  countries,
  ship,
  smallOverview,
  results = [],
  packages,
  swiper,
  // years,
  // waterways,
  // cruiseType,
  // description,
  // overviewText,
  // largeOverview,
  // regions,
}) => {
  const thePackage = packages[0] || { price: {} };
  // console.log("the package", thePackage);
  const {
    price: { priceRange, prices },
    itineraryDays,
    duration,
    guidedTours,
    itineraryImages,
    mainEnlargedMap,
    // currency,
    // discount,
    // discountCurrency,
    // itineraryHeroImage,
  } = thePackage;

  // console.log(ship);

  const { setCharlotteModalOpen } = useManyways();

  return (
    <div
      className="single-result results-wrapper-desktop"
      style={{ background: "black" }}>
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
                <div className="country-day">
                  <div className="countries">
                    <h4 className="ept-subtitle">Countries</h4>
                    {countries.map((c, i) => (
                      <p key={i}>{c}</p>
                    ))}
                  </div>
                  <div className="duration mobile-show">
                    <h4 className="ept-subtitle">Days</h4>
                    <p>{duration}</p>
                  </div>
                </div>
                <div className="country-day mobile-hide">
                  <div className="duration">
                    <h4 className="ept-subtitle">Days</h4>
                    <p>{duration}</p>
                  </div>
                </div>
                <div className="price">
                  <h4 className="ept-subtitle">Member Price</h4>
                  <Price priceRange={priceRange} />
                </div>
              </div>
              <div className="full-width">
                <p className="activities">
                  <span className="strong">Activities:</span> Take part in one of the{" "}
                  <span className="strong">{guidedTours}</span> guided tours offered.
                </p>
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
        <a className="big-button hide-on-tablet">Let's Sail!</a>
      </div>

      <div className="image-side-scene">
        <div className="image-side">
          <img src={ship?.heroImage} />
        </div>
      </div>
      <div className="inner-content-container">
        <h2>Itinerary & Excursions</h2>
        <div className="iternary-and-images">
          <div className="iternary">
            {itineraryDays.map(
              (
                {
                  number,
                  title,
                  destinationDescription,
                  // image,
                  // destinationName,
                  // description,
                },
                idx
              ) => {
                return (
                  <div className="iter-item" key={idx}>
                    <div className="iter-item-flex">
                      <div className="item-inner">
                        <h4 className="day">DAY {number}</h4>
                      </div>
                      <div className="item-inner">
                        <h4 className="title">{title}</h4>
                      </div>
                    </div>

                    <div
                      className="day"
                      dangerouslySetInnerHTML={{
                        __html: destinationDescription,
                      }}></div>
                  </div>
                );
              }
            )}
            <div className="enlarged-map">
              {mainEnlargedMap && <img src={mainEnlargedMap} />}
            </div>
            <div className="vessel-info">
              <div className="vessel-grid">
                <div className="viking-logo">
                  <img src="/viking.png" />
                </div>
                <div className="vessel-content">
                  <div>
                    <h4>Vessel</h4>
                    <p>{ship.name}</p>
                  </div>
                  <div className="staterooms-holder-mobile">
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
        <div className="results-char inner-content-container charlotte-modal-content show">
          <h2>Book this trip at a member-only price</h2>
          <p>
            Turn this travel experience into reality; please provide your phone number or
            email, and our cruise expert will help you to reserve a spot on the perfect
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
      <div className="grid-topper">
        <h2>Continue exploring your other recommendations</h2>
      </div>
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
                  <div className="fake-button">
                    <p>View trip</p>
                  </div>
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
  const { updateSwiperControls } = useManyways();
  const [results, setResults] = useState([]);
  const [init, setInit] = useState(false);
  const getResults = async () => {
    // const response = await fetch(
    //   "https://carp.eptravel.ca/api/ept?howlong=Up%20to%209%20nights&"
    // );
    // const data = await response.json();
    // setResults(data);
    setResults(_results.reverse());
    // console.log(_results);
  };
  useEffect(() => {
    getResults();
  }, []);

  const swiperRef = useRef();

  useEffect(() => {
    if (swiperRef.current) {
      updateSwiperControls({
        slideNext: () => swiperRef.current.slideNext(),
        slidePrev: () => swiperRef.current.slidePrev(),
      });
    }
  }, [swiperRef.current]);

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
        speed={900}
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
        <div className="nextprev-holder-arrows">
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
