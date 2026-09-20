import atc from "../images/atc_banner.png";
import ecobank from "../images/ecoobank-logo.png";
import icon from "../images/Icon.png";
import "./footer.css";

const Footer = () => {
  return (
    <section className="footer">
      {/* Banner section */}
      <div className="banner-wrap">
        <div className="banner">
          <img src={atc} alt="Andrew Teaches Coding" />
          <div className="banner-text">
            <h2>Our Learning Outcomes are Guaranteed by Research, Data, and Technology</h2>
            <p>
              All educators are provided with world class teaching tools and training for extracting data from learning sessions from Day 1. This data serves as the backbone for verifying learning has occurred. At Andrew Teaches Coding our full trust and confidence is in data alone.
            </p>
            <button type="button">Talk to a Learning Specialists</button>
          </div>
        </div>
      </div>

      {/* Footer main content */}
      <footer className="site-footer">
        <div className="footer-top">
          <div className="footer-brand">
            {/* Brand row */}
            <div className="brand-row">
              <div className="ecobank-lockup lockup">
                <img className="logo-image" src={ecobank} alt="Ecobank" />
              </div>
              <p className="divider">|</p>
              <div className="lockup">
                <img className="badge-image" src={atc} alt="Andrew Teaches Coding" />
              </div>
            </div>

            <p className="brand-description">
              Ecobank Nigeria is partnering with Andrew Teaches Coding to expand the accessibility, credibility and reach of coding education for school children across Nigeria.
            </p>
          </div>

          {/* Footer navigation */}
          <div className="footer-links">
            <div className="link-column">
              <h4>Social Links</h4>
              <ul>
                <li><a href="#instagram">Instagram <span className="arrow">↗</span></a></li>
                <li><a href="#facebook">Facebook <span className="arrow">↗</span></a></li>
                <li><a href="#linkedin">LinkedIn <span className="arrow">↗</span></a></li>
                <li><a href="mailto:hello@example.com">Email <span className="arrow">↗</span></a></li>
              </ul>
            </div>

            <div className="link-column">
              <h4>Quick Links</h4>
              <ul>
                <li><a href="#about">About</a></li>
                <li><a href="#how-it-works">How it Works</a></li>
                <li><a href="#journey">The Journey</a></li>
                <li><a href="#teachers">Our Teachers</a></li>
                <li><a href="#learning-pathway">Learning Pathway</a></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer legal row */}
        <div className="legal">
          <hr className="footer-divider" />

          <div className="footer-bottom">
            <p>© 2026. Ecobank/Andrew Teaches Coding. All Rights Reserved.</p>
            <div className="legal-links">
              <a href="#terms">Terms and Conditions</a>
              <a href="#privacy">Privacy Policy</a>
              <a href="#legal">Legal</a>
            </div>
          </div>
        </div>
      </footer>
    </section>
  );
};

export default Footer;