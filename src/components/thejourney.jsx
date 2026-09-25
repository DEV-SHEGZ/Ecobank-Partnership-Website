import react from "react";
import indicator from "../images/indicator icon.png";
import arrowDown from "../images/arrow-down.png";
import defaultImg from "../images/default.png";
import "./thejourney.css";

const TheJourney = () => {
  const handleChange = (e) => {
    console.log(e.target.value);
  };
  return (
    <>
      <div className="thejourneycont">
        <div className="head-ind">
          <img src={indicator} className="indicator me-2" />
          <p className="roboto-medium">The Journey</p>
        </div>
        <div id="teach-div" className="head-h1 roboto-medium mb-3">
          <h1>Simulate your Child’s Learning Journey from Zero to Mastery</h1>
        </div>
        <div className="options-cont">
          <div className="option-age">
            <label className="roboto-medium pb-1">
              Select Your Child’s Age Range{" "}
            </label>
            <select id="Age-range" onChange={handleChange}>
              {" "}
              <option value="Select">Select</option>
              <option value="5 - 6 years">5 - 6 years</option>
              <option value="7 - 13 years">7 - 13 years</option>
            </select>
            <img className="arr-down" src={arrowDown} />
          </div>
          <div className="option-age">
            <label className="roboto-medium pb-1">
              Enter Your Child’s First Name
            </label>
            <input type="text" id="Age-range" placeholder="Andrew" />
          </div>
          <div className="option-age">
            <label className="roboto-medium pb-1">
              Select Your Child’s Gender
            </label>
            <select id="Age-range" onChange={handleChange}>
              {" "}
              <option value="Select">Select</option>
              <option value="Male"> Male</option>
              <option value="Female">Female</option>
            </select>
            <img className="arr-down" src={arrowDown} />
          </div>
          <button className="submit roboto-medium">Simulate Now</button>
        </div>
      </div>

      <img className="mt-5" src={defaultImg} />
    </>
  );
};

export default TheJourney;
