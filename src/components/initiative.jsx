import { useState } from "react";
import "./initiative.css";
import icon from "../images/Icon.png";
import robot from "../images/Robot.png";
import book from "../images/atc_book.png";
import laptop from "../images/laptop.png";
import boy from "../images/lying boy.png";
import girl from "../images/lying_girl.png";
const Initiative = () => {
  const [showSupportPrompt, setShowSupportPrompt] = useState(true);

  return (
    <section className="initiative">
      <div className="support-widget">
        {showSupportPrompt && (
          <p className="support-prompt">How can we help you today?</p>
        )}
        <button
          className="support-toggle"
          type="button"
          aria-label={showSupportPrompt ? "Hide help prompt" : "Show help prompt"}
          aria-expanded={showSupportPrompt}
          onClick={() => setShowSupportPrompt((visible) => !visible)}
        >
          <svg viewBox="0 0 32 32" aria-hidden="true">
            <path d="M16 3.4a12.4 12.4 0 0 0-10.6 19L4 28.6l6.4-1.7A12.4 12.4 0 1 0 16 3.4Z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
            <path d="M9.5 7.8 12 7l2.4 4.8-2 1.8c1.4 2.7 3.4 4.7 6.1 6.1l1.8-2 4.8 2.4-.8 2.5c-.3.9-1.2 1.4-2.1 1.2-8.1-1.7-14.2-7.8-15.9-15.9-.2-.9.3-1.8 1.2-2.1Z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
        <div className="content">
      <div className="initiative-left">
        <p className="title">
          <img src={icon} alt="" className="icon" />
          About the Initiative
        </p>

        <h2 className="initiative-title">
          Quality Technology Education for Every Child, in Every Community
        </h2>

        <p className="initiative-description">
          Through the Junior Savers Account, <strong>Ecobank</strong> Nigeria is partnering with
          Andrew Teaches Coding to expand the accessibility, credibility and reach
          of coding education for school children across Nigeria.
        </p>

        <button className="button">
          Read Official Statement{" "}
          <svg className="button-arrow" width="24" height="24" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M19.75 11.726h-15M13.7 5.701l6.05 6.024-6.05 6.025" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
      </div>

      <div className="initiative-right">

        <div className="initiative-art">
          <img src={robot} alt="robot mascot" className="robot" />
          <img src={laptop} alt="laptop" className="laptop" />
          <img src={book} alt="coding-workbook" className="screen" />
        </div>

        
      </div>
      </div>
      <div className="initiative-kids">
          <img src={boy} alt="child reading"className="boy-reading"/>
          <img src={girl} alt="child reading" className="girl-reading"/>
        </div>
    </section>
  );
};

export default Initiative;
