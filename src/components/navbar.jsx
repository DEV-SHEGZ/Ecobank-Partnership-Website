import react from "react";
import "./navbar.css";
import atcLogo from "../images/A.T.C.png";
import ecologo from "../images/layer1 (1).png";

const navbar = () => {
  return (
    <nav id="eco-navbar" class="navbar navbar-expand-lg bg-body-tertiary">
      <div class="container-fluid">
        <a class="navbar-brand" href="#">
          <img src={ecologo} alt="Ecobank Logo" className="eco-logo" />
        </a>
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarTogglerDemo02"
          aria-controls="navbarTogglerDemo02"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="rmv-flx collapse navbar-collapse" id="navbarTogglerDemo02">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item roboto-regular ">
              <a class="nav-link" href="#">
                About
              </a>
            </li>
            <li class="nav-item roboto-regular ">
              <a class="nav-link" href="#">
                How it works
              </a>
            </li>
            <li class="nav-item roboto-regular ">
              <a class="nav-link" href="#">
                Our Teachers
              </a>
            </li>

            <li class="nav-item roboto-regular ">
              <a class="nav-link" href="#">
                The journey
              </a>
            </li>
            <li class="nav-item roboto-regular ">
              <a class="nav-link" href="#">
                Enroll now
              </a>
            </li>
          </ul>
        </div>
        <button
          id="start-learning-btn"
          class="d-flex align-items-center"
          role="search"
        >
          <p>Start Learning</p>
          <img src={atcLogo} alt="ATC Logo" className="atc-logo" />
        </button>
      </div>
    </nav>
  );
};

export default navbar;
