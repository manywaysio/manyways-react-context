import EptLogo from "../../icons/EptLogo";
import SvgFacebook from "../../icons/SvgFacebook";
import SvgInstagram from "../../icons/SvgInstagram";
import SvgLinkedin from "../../icons/SvgLinkedin";
import SvgTwitter from "../../icons/SvgTwitter";

const EPTResultsFooter = ({}) => {
  return (
    <div className="footer">
      <div className="flex logo-holder">
        <div>
          <EptLogo />
        </div>
        <ul className="flex">
          <li>
            <a href="/">
              <SvgLinkedin />
            </a>
          </li>
          <li>
            <a href="/">
              <SvgInstagram />
            </a>
          </li>
          <li>
            <a href="/">
              <SvgFacebook />
            </a>
          </li>
          <li>
            <a href="/">
              <SvgTwitter />
            </a>
          </li>
        </ul>
      </div>
      <div className="content-box">
        <p>
          Brennco Travel Services and Cruises & Tours are represented in Canada by
          Exclusive Partner Travel., an Ontario licensee. Exclusive Partner Travel Inc. is
          not responsible for content on external websites.
        </p>
        <p className="reserved">
          © 2024 Exclusive Partner Travels Corp. All rights reserved.
        </p>
      </div>
      <div>
        <a href="/">Terms of Service</a>
        <a href="/">Privacy Policy</a>
      </div>
    </div>
  );
};
export default EPTResultsFooter;
