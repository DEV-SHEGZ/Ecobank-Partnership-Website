import "./gettingstarted.css";
import girl from "../images/polka-dotted girl.png";
import boy from "../images/boy.png";
import icon from "../images/Icon.png";
const GettingStarted = () => {
  return (
    <section className="getting-started">
      <p className="section-label">
        <img src={icon} alt="" aria-hidden="true" /> Enrol Now
      </p>

      <h2>
        Getting started is as easy as Claiming
        <br />a Free Digital Coding Workbook!
      </h2>
      <div className="getting-started-cards">
        <div className="coding-card">
          <div className="card-text">
            <h3>
              Free Digital Coding <br />
              Workbook
            </h3>
            <div className="card-text-list">
              <ul>
                <li>4 engaging chapters & 100 lesson evaluations</li>
                <li>Portfolio storage for 4 projects</li>
                <button
                  className="card-button"
                  aria-label="Claim your free digital coding workbook"
                >
                  Claim Now
                </button>
              </ul>
              <img
                src={girl}
                alt="Girl learning to code"
                className="card-girl"
              />
            </div>
          </div>
        </div>

        <div className="coding-card">
          <div className="card-text">
            <h3>
              Coding Workbook + Annual <br />
              Learning Group
            </h3>
            <div className="card-text-list">
              <ul>
                <li>Full workbook access</li>
                <li>Teacher support</li>
                <li>Year-long guided group learning</li>
                <li>Peer collaboration & interactive lessons</li>
                <li>Teacher interaction during school holidays</li>
                <li>Guidance for proficiency examinations</li>
                <li>Graded assessments & real-time projects</li>
                <li>Live editor streaming & progress reports</li>
                <button
                  className="card-button"
                  aria-label="Enrol in the coding workbook and annual learning group"
                >
                  Enrol Now
                </button>
              </ul>

              <img src={boy} alt="Boy learning to code" className="card-boy" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GettingStarted;
