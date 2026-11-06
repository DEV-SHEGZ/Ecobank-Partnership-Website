import "./initiative.css";
import icon from "../images/Icon.png";
import robot from "../images/Robot.png";
import book from "../images/atc_book.png";
import laptop from "../images/laptop.png";
import boy from "../images/lying boy.png";
import girl from "../images/lying_girl.png";
const Initiative = () => {
  return (
    <section className="initiative">
        <div className="content">
      <div className="initiative-left">
        <p className="title">
          <img src={icon} alt="" className="icon" />
          About the Initiative
        </p>

        <h2 className="initiative-title">
          Quality Technology Education for Every Child, in Every Community
        </h2>

        <p className="initiative-description">
          Through the Junior Savers Account, <strong>Ecobank</strong> Nigeria is partnering with
          Andrew Teaches Coding to expand the accessibility, credibility and reach
          of coding education for school children across Nigeria.
        </p>

        <a className="button" href="https://punchng.com/ecobank-partners-firm-on-digital-training-for-students/?utm_source=rss.punchng.com&utm_medium=web" target="_blank" rel="noopener noreferrer">
          Read Official Statement{" "}
          <svg className="button-arrow" width="24" height="24" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M19.75 11.726h-15M13.7 5.701l6.05 6.024-6.05 6.025" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </a>
      </div>

      <div className="initiative-right">

        <div className="initiative-art">
          <img src={robot} alt="robot mascot" className="robot" />
          <img src={laptop} alt="laptop" className="laptop" />
          <img src={book} alt="coding-workbook" className="screen" />
        </div>

        
      </div>
      </div>
      <div className="initiative-kids">
          <img src={boy} alt="child reading"className="boy-reading"/>
          <img src={girl} alt="child reading" className="girl-reading"/>
        </div>
    </section>
  );
};

export default Initiative;
