import react from "react";
import indicator from "../images/indicator icon.png";
import arrowDown from "../images/arrow-down.png";
import defaultImg from "../images/default.png";
import downloadIcon from "../images/Download icon.png";
import bookShelve from "../images/books on shelf.png";
import React, { useRef, useState } from "react";
import "./thejourney.css";

const TheJourney = () => {
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [name, setName] = useState("");

  const dataForFiveToSixYears = [
    {
      book: "Engineering Thinking Book 1",
      point1: "Start developing object and situation awareness skills",
      point2: "Build mind-hand coordination",
      book1: "Engineering Thinking Book 2",
      point3: "Solidify ability to recognise pattern",
      point4: "Learn to see and analyse problems",
      book2: "Engineering Thinking Book 3",
    },

    {
      book: "HTML and the Web",
      point1: "Identify correct html code and it’s function",
      point2: "Write grammatically correct HTML code",
      point3: "Listen and convert text content into HTML",
    },
    {
      book: "Interface Design and Analysis",
      point1: "See HTML tags as 3-dimensional objects",
      point2: "Understand & Implement organisation of interfaces",
      point3: "Master implementation of styles",
      point4: "Implement professional web interface development",
    },
    {
      book: "Grid Design & Analysis",
      point1: "See web interfaces as grids",
      point2: "Implement grid organisation",
      point3: "Master professional interface development",
    },
  ];

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
            <select
              value={age}
              id="Age-range"
              onChange={(e) => setAge(e.target.value)}
            >
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
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              type="text"
              id="Age-range"
              placeholder="Andrew"
            />
          </div>
          <div className="option-age">
            <label className="roboto-medium pb-1">
              Select Your Child’s Gender
            </label>
            <select
              value={gender}
              id="Age-range"
              onChange={(e) => {
                setGender(e.target.value);
              }}
            >
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

      <img className="mt-5 d-none" src={defaultImg} />
      <div className="slideCardCont">
        <div>
          <div>
            <h1 className="roboto-medium atc-yr">Andrew’s First Year</h1>
            <button className="submit roboto-medium">
              {" "}
              <img src={downloadIcon} /> Simulate Now
            </button>
            <img src={bookShelve} />
          </div>
          <div>
            <h2 className="roboto-medium">He will master:</h2>
            <p>Engineering Thinking Book 1</p>
            <ul>
              <li>Start developing object and situation awareness skills</li>
              <li>Build mind-hand coordination </li>
            </ul>
            <p>Engineering Thinking Book 2</p>
            <ul>
              <li>Solidify ability to recognise pattern </li>
              <li> Learn to see and analyse problems</li>
            </ul>
            <p>Engineering Thinking Book 3</p>
            <ul>
              <li>Solidify ability to recognise pattern </li>
              <li>Learn to see and analyse problems</li>
            </ul>
          </div>
        </div>
        <div>
          <h1>Andrew journey to mastery will take</h1>
        </div>
      </div>
    </>
  );
};

export default TheJourney;
