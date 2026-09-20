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
          Through the Junior Savers Account, Ecobank Nigeria is partnering with
          Andrew Teaches Coding to expand the accessibility, credibility and reach
          of coding education for school children across Nigeria.
        </p>

        <button className="button">
          Read Official Statement <span>→</span>
        </button>
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