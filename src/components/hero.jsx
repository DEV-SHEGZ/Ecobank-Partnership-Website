import { useEffect, useRef, useState } from "react";
import curtain from "../images/pink curtain.png";
import girl from "../images/pink girl.png";
import flower from "../images/flowers.png";
import atcbook from "../images/atc digital.png";
import child from "../images/Child.png";
import leftbg from "../images/Background Hero 2.png";
import rightbg from "../images/Background Hero 2 b.png";
import satbig from "../images/Satellite big.png";
import teacher from "../images/Teacher.png";
import greengirl from "../images/green girl.png";
import earth from "../images/green earth.png";
import greenboy from "../images/green boy.png";
import mobileCurtain from "../images/mobile-hero-curtain-figma.png";
import mobileGirl from "../images/mobile-hero-girl-figma.png";
import mobileFloor from "../images/mobile-hero-floor-figma.png";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

import "swiper/css";

import "./hero.css";

// How far (px) past the hero the claim bar must be before it pins to the top, and
// how early it unpins on the way back up — so it is gone before the hero returns.
const STICKY_OFFSET = 160;

// "static" = inside the hero; "pinned" = fixed to the top of the screen;
// "leaving" = sliding back up before returning to the hero.
function useStickyClaimBar(heroRef) {
  const [mode, setMode] = useState("static");
  const modeRef = useRef(mode);
  modeRef.current = mode;

  useEffect(() => {
    let frame = 0;
    let leaveTimer = 0;
    const update = () => {
      frame = 0;
      const hero = heroRef.current;
      if (!hero) return;
      const pastHero = hero.getBoundingClientRect().bottom < -STICKY_OFFSET;
      const current = modeRef.current;
      if (pastHero && current !== "pinned") {
        clearTimeout(leaveTimer);
        setMode("pinned");
      } else if (!pastHero && current === "pinned") {
        setMode("leaving");
        leaveTimer = setTimeout(() => setMode("static"), 300);
      }
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    update();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
      clearTimeout(leaveTimer);
    };
  }, [heroRef]);

  return mode;
}

const Hero = () => {
  const heroRef = useRef(null);
  const swiperRef = useRef(null);
  const claimInputRef = useRef(null);
  const [showMobileClaimBar, setShowMobileClaimBar] = useState(false);
  const claimMode = useStickyClaimBar(heroRef);

  const focusClaimInput = (event) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    setShowMobileClaimBar(true);
    requestAnimationFrame(() => claimInputRef.current?.focus({ preventScroll: true }));
  };

  return (
    <div
      className={`hero-home${claimMode === "static" ? "" : " hero-home--claim-pinned"}${showMobileClaimBar ? " hero-home--mobile-claim-active" : ""}`}
      ref={heroRef}
      onFocusCapture={() => swiperRef.current?.autoplay?.stop()}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          swiperRef.current?.autoplay?.start();
        }
      }}
    >
      <Swiper
        modules={[Autoplay]}
        onSwiper={(swiper) => { swiperRef.current = swiper; }}
        slidesPerView={1}
        spaceBetween={0}
        loop={true}
        autoplay={{
          delay: 6000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
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
                <a className="claim-btn roboto-medium" href="#enrol" onClick={focusClaimInput}>Claim Now</a>
                <a className="open-btn roboto-medium" href="/open-account" target="_blank" rel="noopener noreferrer">
                  Open a Junior Savers Account
                </a>
              </div>
            </div>
            <img src={mobileFloor} alt="" className="hero-mobile-floor" />
            <picture><source media="(max-width: 600px)" srcSet={mobileCurtain} /><img src={curtain} alt="" className="curtain" /></picture>
            <picture><source media="(max-width: 600px)" srcSet={mobileGirl} /><img src={girl} alt="Child learning to code" className="girl" /></picture>
            <img src={flower} alt="Flowers" className="flower" />
          </div>
        </SwiperSlide>

        {/* Slide 2 */}
        <SwiperSlide>
          <div className="hero-container-green">
            <img src={leftbg} alt="" className="left-bg" />
            <img src={rightbg} alt="" className="right-bg" />
            <img src={satbig} alt="" className="sat-big" />
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
                <a id="green-white" className="open-btn roboto-medium" href="#teachers">
                  See Teachers Profile
                </a>
              </div>
            </div>
            <img src={teacher} alt="Teacher guiding a student" className="teacher" />
            <img src={greengirl} alt="Student learning" className="greengirl" />
            <img src={greenboy} alt="Student learning" className="greenboy" />
            <img src={earth} alt="" className="earth" />
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

      <div className={`claim-section${claimMode === "static" ? "" : ` claim-section--${claimMode}`}${showMobileClaimBar ? " claim-section--mobile-active" : ""}`}>
        <button className="claim-mobile-close" type="button" aria-label="Close account number bar" onClick={() => setShowMobileClaimBar(false)}>×</button>
        <div className="claim-container d-flex align-items-center">
          <div className="atc-digital d-flex align-items-center">
            <img src={atcbook} alt="ATC Digital" className="atc-book" />
            <div className="input-section d-flex flex-column align-items-center">
              <p className="roboto-medium input-p ">
                Claim your Free Book Now!
              </p>
              <input
                ref={claimInputRef}
                className="claim-input roboto-regular mb-1"
                type="text"
                inputMode="numeric"
                aria-label="Junior Savers account number"
                placeholder="Enter account number"
              />
              <button className="claim-book-btn roboto-medium">
                Claim Now
              </button>
            </div>
          </div>

          <div className="child-section d-flex align-items-center">
            <div className="child-content d-flex flex-column">
              <p className="roboto-medium child-p">
                Don’t have a Junior Savers Account?
              </p>
              <a className="open-btn-child roboto-medium" href="/open-account" target="_blank" rel="noopener noreferrer">Open Now</a>
            </div>
            <img src={child} alt="Child" className="child" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
