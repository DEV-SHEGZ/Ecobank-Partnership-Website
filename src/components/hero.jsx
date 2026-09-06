import react from "react";
import Nav from "./navbar.jsx";
import "./hero.css";

const Hero = () => {
  return (
    <div className="hero-container">
      <Nav />
      <div className="hero-content">
        <h1 className="roboto-medium zero-h1">
          Zero to Mastery with Andrew Teaching Coding
        </h1>
        <p>
          Claim the free coding workbook to start your child learning journey
          today with 18 hrs WhatsApp support
        </p>
        <div>
          <button className="claim-btn roboto-medium">Claim Now</button>
          <button className="open-btn roboto-medium">
            Open a Junior Savers Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hero;
