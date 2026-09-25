import logo from "./logo.svg";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React, { useState, useEffect, Component } from "react";
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

function App() {
  return (
    <Router>
      <Nav />
      <Routes>
        <Route path="/" element={<MainPage />} />
      </Routes>
    </Router>
  );
}

function MainPage() {
  return (
    <>
      <Hero />
      <Initiate />
      <How />
      <OurTeachers />
      <TheJourney />
      <Getting />
      <Footer />
    </>
  );
}

export default App;
