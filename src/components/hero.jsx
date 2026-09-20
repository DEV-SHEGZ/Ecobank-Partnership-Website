import react from "react";
import Nav from "./navbar.jsx";
import curtain from "../images/pink curtain.png";
import girl from "../images/pink girl.png";
import GettingStarted from "./gettingstarted.jsx";
import Footer from "./footer.jsx";
import Initiative from "./initiative.jsx";
import flower from "../images/flowers.png";
import atcbook from "../images/atc digital.png";
import child from "../images/Child.png";
import leftbg from "../images/Background Hero 2.png";
import rightbg from "../images/Background Hero 2 b.png";
import satbig from "../images/Satellite big.png";
import satsmall from "../images/Satellite small.png";
import teacher from "../images/Teacher.png";
import greengirl from "../images/green girl.png";
import earth from "../images/green earth.png";
import greenboy from "../images/green boy.png";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

import "swiper/css";

import "./hero.css";


const Hero = () => {
  return (
    <>
      <Swiper
        modules={[Autoplay]}
        slidesPerView={1}
        spaceBetween={0}
        loop={true}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
      >
        {/* Slide 1 */}
        <SwiperSlide>
          <div className="hero-container">
            <div className="hero-content">
              <h1 className="roboto-medium zero-h1">
                Zero to Mastery with Andrew Teaching Coding
              </h1>
              <p className="roboto-regular zero-p">
                Claim the free coding workbook to start your child learning
                journey today with 18 hrs WhatsApp support
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
            <img src={flower} alt="Flowers" className="flower" />
          </div>
        </SwiperSlide>

        {/* Slide 2 */}
        <SwiperSlide>
          <div className="hero-container-green">
            <img src={leftbg} className="left-bg" />
            <img src={rightbg} className="right-bg" />
            <img src={satbig} className="sat-big" />
            <div className="hero-content">
              <h1 className="roboto-medium zero-h1 mb-3">
                1 year guidance from Educators for ₦60,000 yearly
              </h1>
              <p className="roboto-regular zero-p mb-3">
                Plug your child into a 365 Day plan including online training
                every holiday, automated activities and certification on
                completion
              </p>
              <div>
                <button id="green-btn" className="claim-btn roboto-medium">
                  Download Learning Calendar
                </button>
                <button id="green-white" className="open-btn roboto-medium">
                  See Teachers Profile
                </button>
              </div>
            </div>
            <img src={teacher} className="teacher" />
            <img src={greengirl} className="greengirl" />
            <img src={greenboy} className="greenboy" />
            <img src={earth} className="earth" />
          </div>
        </SwiperSlide>
      </Swiper>

      {/* 

      <div className="page">
      <section className="hero-container">
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
        <img src={flower} alt="Flowers" className="flower" />
      </div>

      

      <div className="hero-container-green">
        <img src={leftbg} className="left-bg" />
        <img src={rightbg} className="right-bg" />
        <img src={satbig} className="sat-big" />
        <div className="hero-content">
          <h1 className="roboto-medium zero-h1 mb-3">
            1 year guidance from Educators for ₦60,000 yearly
          </h1>
          <p className="roboto-regular zero-p mb-3">
            Plug your child into a 365 Day plan including online training every
            holiday, automated activities and certification on completion
          </p>
          <div>
            <button id="green-btn" className="claim-btn roboto-medium">
              Download Learning Calendar
            </button>
            <button id="green-white" className="open-btn roboto-medium">
              See Teachers Profile
            </button>
          </div>
        </div>
        <img src={teacher} className="teacher" />
        <img src={greengirl} className="greengirl" />
        <img src={greenboy} className="greenboy" />
        <img src={earth} className="earth" />
      </div>

      */}

      <div className="claim-section">
        <div className="claim-container d-flex align-items-center">
          <div className="atc-digital d-flex align-items-center">
            <img src={atcbook} alt="ATC Digital" className="atc-book" />
            <div className="input-section d-flex flex-column align-items-center">
              <p className="roboto-medium input-p ">
                Claim your Free Book Now!
              </p>
              <input
                className="claim-input roboto-regular mb-1"
                type="number"
                placeholder="Enter account number"
              />
              <button className="claim-book-btn roboto-medium">
                Claim now
              </button>
            </div>
          </div>

          <div className="child-section d-flex align-items-center">
            <div className="child-content d-flex flex-column">
              <p className="roboto-medium child-p">
                Don’t have a Junior Savers Account?
              </p>
              <button className="open-btn-child roboto-medium">Open Now</button>
            </div>
            <img src={child} alt="Child" className="child" />
          </div>
        </div>
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
    </>
  );
};

export default Hero;
