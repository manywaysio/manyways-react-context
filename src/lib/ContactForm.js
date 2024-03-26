import { useState, useRef } from "react";
import PhoneInput from "react-phone-number-input";
import { isValidPhoneNumber } from "react-phone-number-input";
import Phone from "../icons/Phone";
import Envelope from "../icons/Envelope";

const ContactForm = ({
  resultsPage = false,
  setSubmitModalOpen,
  contactPermission,
  setContactPermission,
  marketingConsent,
  setMarketingConsent,
  // setCharlotteFormSubmitted,
}) => {
  const phoneInputRef = useRef(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  const isValidEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      phoneNumber &&
      !isValidPhoneNumber(String(phoneNumber)) &&
      (!email || (email && !isValidEmail(email)))
    ) {
      if (!isValidEmail(email) && email) setEmailError("Invalid email address");
      return;
    }

    setEmailError("");
    setSubmitModalOpen(true);
  };

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   setSubmitModalOpen(true);
  //   // setCharlotteFormSubmitted(true);
  // };

  const handleCountryMouseDown = (e) => {
    e.preventDefault();
  };

  const handleEmailChange = (e) => {
    const inputEmail = e.target.value;
    setEmail(inputEmail);
    if (inputEmail && !isValidEmail(inputEmail)) {
      setEmailError("Invalid email address");
    } else {
      setEmailError("");
    }
  };

  return (
    <form>
      {/* <form onSubmit={handleSubmit}> */}
      <div className={`input-container ${resultsPage ? "results-style" : ""}`}>
        <div className={`inputs-holder ${resultsPage ? "results-style" : ""}`}>
          <div className="input-icon-container first-input">
            <div className="input-outer-container">
              <div className="error-text-holder">
                {!isValidPhoneNumber(String(phoneNumber)) && phoneNumber && (
                  <div className="error-text">Invalid phone number</div>
                )}
              </div>
              <div className="width-full">
                <Phone className="input-icon" />
                <PhoneInput
                  type="tel"
                  ref={phoneInputRef}
                  defaultCountry="CA"
                  countries={["CA", "US"]}
                  value={phoneNumber}
                  onChange={setPhoneNumber}
                  placeholder="Enter phone number"
                  className={`width-full ${resultsPage ? "result-input-width" : ""}`}
                  inputProps={{
                    autoComplete: "off",
                    autoCorrect: "off",
                    autoCapitalize: "off",
                  }}
                  countrySelectProps={{
                    onMouseDown: handleCountryMouseDown,
                  }}
                  error={
                    phoneNumber
                      ? isValidPhoneNumber(phoneNumber)
                        ? undefined
                        : "Invalid phone number"
                      : "Phone number required"
                  }
                />
              </div>
            </div>
          </div>
          {resultsPage && <span>OR</span>}
          <div className="input-outer-container">
            <div className="error-text-holder">
              {emailError && <div className="error-text">{emailError}</div>}
            </div>
            <div className="input-icon-container">
              <Envelope className="input-icon" />
              <input
                type="email"
                className="input-with-icon"
                placeholder="Enter email address"
                value={email}
                onChange={handleEmailChange}
              />
            </div>
          </div>
        </div>
        <div className="contact-permission-container">
          <input
            id="contact-permission"
            type="checkbox"
            checked={contactPermission}
            onChange={() => setContactPermission(!contactPermission)}
          />
          <label htmlFor="contact-permission">
            I agree that CruiseIQ may contact me at the email address or phone number
            provided for purposes related to my cruise travel inquiries. This may include
            follow-up communications, support, or assistance with the services offered by
            CruiseIQ.
          </label>
        </div>
        <div className="marketing-consent-container">
          <input
            id="marketing-consent"
            type="checkbox"
            checked={marketingConsent}
            onChange={() => setMarketingConsent(!marketingConsent)}
          />
          <label htmlFor="marketing-consent">
            I also consent to receive exclusive marketing and promotional messages from
            CruiseIQ. These may include special offers, new cruise deals, and personalized
            recommendations designed to enhance my cruise travel experience.
          </label>
        </div>
        <button
          className="submit-button"
          type="submit"
          disabled={
            !contactPermission ||
            (!isValidPhoneNumber(String(phoneNumber)) && !isValidEmail(email)) ||
            (!phoneNumber && !email)
          }
          onClick={handleSubmit}>
          Submit
        </button>
      </div>
    </form>
  );
};

export default ContactForm;
