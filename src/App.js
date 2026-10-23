import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import React, { useEffect } from "react";
import Hero from "./components/hero.jsx";
import Nav from "./components/navbar.jsx";
import How from "./components/how.jsx";
import Getting from "./components/gettingstarted.jsx";
import Initiate from "./components/initiative.jsx";
import OurTeachers from "./components/ourteachers.jsx";
import TheJourney from "./components/thejourney.jsx";
import Footer from "./components/footer.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

import AccountOpening from "./features/account-opening/AccountOpening";

function ScrollToSection() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    requestAnimationFrame(() => {
      if (hash) document.getElementById(hash.slice(1))?.scrollIntoView();
      else window.scrollTo(0, 0);
    });
  }, [pathname, hash]);
  return null;
}

function App() {
  return (
    <Router>
      <ScrollToSection />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/open-account" element={<AccountOpening />} />
      </Routes>
    </Router>
  );
}

function MainPage() {
  return (
    <>
      <Nav />
      <Hero />
      <div id="about"><Initiate /></div>
      <div id="how-it-works"><How /></div>
      <div id="teachers"><OurTeachers /></div>
      <div id="journey"><TheJourney /></div>
      <div id="enrol"><Getting /></div>
      <Footer />
    </>
  );
}

export default App;
