import react from "react";
import "./navbar.css";
import atcLogo from "../images/A.T.C.png";

const navbar = () => {
  return (
    <nav class="navbar navbar-expand-lg bg-body-tertiary">
      <div class="container-fluid">
        <a class="navbar-brand" href="#">
          Navbar
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
        <div class="collapse navbar-collapse" id="navbarTogglerDemo02">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item">
              <a class="nav-link active" aria-current="page" href="#">
                Home
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#">
                Link
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link disabled" aria-disabled="true">
                Disabled
              </a>
            </li>
          </ul>
          <button class="d-flex align-items-center" role="search">
            <p>Start Learning</p>
            <img src={atcLogo} alt="ATC Logo" className="atc-logo" />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default navbar;
