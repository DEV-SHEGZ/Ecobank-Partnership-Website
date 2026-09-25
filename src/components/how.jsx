import react from "react";
import "./how.css";
import indicator from "../images/indicator icon.png";
import pinkCloud from "../images/Pink cloud.png";
import pinkrope1 from "../images/pink rope.png";
import pinkrope2 from "../images/pink rope 2.png";
import orangeCloud from "../images/Orange cloud.png";
import orangerope1 from "../images/orange rope.png";
import orangerope2 from "../images/orange rope 2.png";
import purpleCloud from "../images/Purple cloud.png";
import purplerope1 from "../images/purple rope.png";
import purplerope2 from "../images/purple rope 2.png";
import greenCloud from "../images/Green cloud.png";
import greenrope1 from "../images/green rope.png";
import greenrope2 from "../images/green rope 2.png";
import code14eco from "../images/code14eco.png";

const How = () => {
  return (
    <>
      <div className="how-container">
        <div className="head-ind">
          <img src={indicator} className="indicator me-2" />
          <p className="roboto-medium">How it Works</p>
        </div>
        <div className="head-h1 roboto-medium">
          <h1>Start your Child’s Learning Journey in Four Easy Steps</h1>
        </div>
        <div className="cloud-container">
          <div id="cloud-1" className="cloud">
            <div className="cloud-head">
              <p className="roboto-medium cloud-p">Step 1</p>
              <p className="roboto-medium cloud-heading">Account Ownership</p>
            </div>
            <img src={pinkrope1} className="rope1" />
            <img src={pinkrope2} className="rope2" />
            <div id="pink-box" className="box roboto-regular">
              <div className="hole"></div>
              Open a Junior (Child) Account with Ecobank with a fixed balance of
              ₦6,000. Funds can be withdrawn at any time to discontinue coding
              program.
            </div>
          </div>
          <div id="cloud-2" className="cloud">
            <div className="cloud-head">
              <p className="roboto-medium cloud-p">Step 2</p>
              <p className="roboto-medium cloud-heading">
                Activate the <br /> E-Coding Benefit
              </p>
            </div>
            <img src={orangerope1} className="rope1" />
            <img src={orangerope2} className="rope2" />
            <div id="orange-box" className="box roboto-regular">
              <div className="hole"></div>
              Claim your free digital coding workbook from the Andrew Teaches
              Coding Literacy Series using your account number.
            </div>
          </div>
          <div id="cloud-3" className="cloud">
            <div className="cloud-head">
              <p className="roboto-medium cloud-p">Step 3</p>
              <p className="roboto-medium cloud-heading">Start Learning</p>
            </div>
            <img src={purplerope1} className="rope1" />
            <img src={purplerope2} className="rope2" />
            <div id="purple-box" className="box roboto-regular">
              <div className="hole"></div>
              Login and start self-directed use of workbooks. Contact 24/7
              WhatsApp lines for any help in using the books.
            </div>
          </div>
          <div id="cloud-4" className="cloud">
            <div className="cloud-head">
              <p className="roboto-medium cloud-p">Step 4</p>
              <p className="roboto-medium cloud-heading">
                Upgrade to 365 Day <br /> Guided Learning track
              </p>
            </div>
            <img src={greenrope1} className="rope1" />
            <img src={greenrope2} className="rope2" />
            <div id="green-box" className="box roboto-regular">
              <div className="hole"></div>
              Opt-in to register your child for 365 day guided groups comprising
              7-10 day online classes during School term breaks (Christmas,
              Summer and Easter breaks) and automated weekly tasks during school
              sessions to keep learners consistently engaged and coding.
            </div>
          </div>
        </div>
        <img src={code14eco} className="code14eco" />
      </div>
    </>
  );
};

export default How;
