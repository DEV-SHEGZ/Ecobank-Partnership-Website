import react from "react";
import Nav from "./navbar.jsx";
import curtain from "../images/pink curtain.png";
import girl from "../images/pink girl.png";
import GettingStarted from "./gettingstarted.jsx";
import Footer from "./footer.jsx";
import Initiative from "./initiative.jsx";
import "./hero.css";


const Hero = () => {
  return (
    <div className="page">
      <section className="hero-container">
      <Nav />
      <div className="hero-content">
        <h1 className="roboto-medium zero-h1">
          Zero to Mastery with Andrew Teaching Coding
        </h1>
        <p className="roboto-regular zero-p">
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
      <img src={curtain} alt="Pink Curtain" className="curtain" />
      <img src={girl} alt="Pink Girl" className="girl" />
      </section>
     <div className="initiative-container">
        <Initiative />
    </div>
      <div className="getting-started-container">
      <GettingStarted />
      </div>
      <div className="footer-container">
        <Footer />
      </div>

    </div>
  );
};

export default Hero;
