import { useEffect, useRef, useState } from "react";
import indicator from "../images/indicator icon.png";
import defaultImg from "../images/default.png";
import defaultImgMobile from "../images/journey-mobile-figma.png";
import downloadIcon from "../images/Download icon.png";
import bookShelve from "../images/books on shelf.png";
import htmlArtwork from "../images/journey-html-figma.png";
import interfaceArtwork from "../images/journey-interface-figma.png";
import gridArtwork from "../images/journey-grid-figma.png";
import graduate from "../images/journey-graduate-figma.png";
import sittingBoy from "../images/sitting boy.png";
import sittingGirl from "../images/sitting girl.png";
import standingBoy from "../images/boy.png";
import standingGirl from "../images/polka-dotted girl.png";
import "./thejourney.css";

const years = [
  {
    image: bookShelve,
    topics: [
      { title: "Engineering Thinking Book 1", points: ["Start developing object and situation awareness skills", "Build mind-hand coordination"] },
      { title: "Engineering Thinking Book 2", points: ["Solidify ability to recognise pattern", "Learn to see and analyse problems"] },
      { title: "Engineering Thinking Book 3", points: ["Solidify ability to recognise pattern", "Learn to see and analyse problems"] },
    ],
  },
  {
    image: htmlArtwork,
    topics: [{ title: "HTML and the Web", points: ["Identify correct html code and it’s function", "Write grammatically correct HTML code", "Listen and convert text content into HTML"] }],
  },
  {
    image: interfaceArtwork,
    topics: [{ title: "Interface Design and Analysis", points: ["See HTML tags as 3-dimensional objects", "Understand & Implement organisation of interfaces", "Master implementation of styles", "Implement professional web interface development"] }],
  },
  {
    image: gridArtwork,
    topics: [{ title: "Grid Design & Analysis", points: ["See web interfaces as grids", "Implement grid organisation", "Master professional interface development"] }],
  },
];

const ordinals = ["First", "Second", "Third", "Fourth"];

function learningPlanText(result, plan) {
  return [
    `${result.name}’s learning journey`,
    `Age range: ${result.age}`,
    `${plan.length} years · ${result.age === "5 - 6 years" ? 6 : 3} workbooks`,
    ...plan.flatMap((year, index) => ["", `${ordinals[index]} Year`, ...year.topics.flatMap(topic => [topic.title, ...topic.points.map(point => `- ${point}`)])]),
  ].join("\n");
}

const TheJourney = () => {
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [name, setName] = useState("");
  const [result, setResult] = useState(null);
  const [yearIndex, setYearIndex] = useState(0);
  const resultRef = useRef(null);
  const plan = result?.age === "5 - 6 years" ? years : years.slice(1);
  const year = plan[yearIndex];

  useEffect(() => {
    if (result) resultRef.current?.scrollIntoView({ block: "start", behavior: "smooth" });
  }, [result]);

  function simulate(event) {
    event.preventDefault();
    const childName = name.trim();
    if (!childName) return;
    setYearIndex(0);
    setResult({ age, gender, name: childName });
  }

  const learner = result?.gender === "Female"
    ? (yearIndex === 0 && result?.age === "5 - 6 years" ? sittingGirl : standingGirl)
    : (yearIndex === plan.length - 1 ? graduate : yearIndex === 0 && result?.age === "5 - 6 years" ? sittingBoy : standingBoy);

  return (
    <>
      <div className="thejourneycont">
        <div className="head-ind">
          <img src={indicator} className="indicator me-2" alt="" />
          <p className="roboto-medium">The Journey</p>
        </div>
        <div id="teach-div" className="head-h1 roboto-medium mb-3">
          <h1>Simulate your Child’s Learning Journey from Zero to Mastery</h1>
        </div>
        <form className="options-cont" onSubmit={simulate}>
          <div className="option-age">
            <label className="roboto-medium pb-1" htmlFor="journey-age">Select Your Child’s Age Range</label>
            <select id="journey-age" value={age} onChange={event => setAge(event.target.value)} required>
              <option value="">Select</option>
              <option value="5 - 6 years">5 - 6 years</option>
              <option value="7 - 13 years">7 - 13 years</option>
            </select>
            <svg className="arr-down" width="16" height="8" viewBox="0 0 16 8" aria-hidden="true" focusable="false"><path d="M.75.75 8 7.25 15.25.75" fill="none" stroke="#023448" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </div>
          <div className="option-age">
            <label className="roboto-medium pb-1" htmlFor="journey-name">Enter Your Child’s First Name</label>
            <input id="journey-name" value={name} onChange={event => setName(event.target.value)} type="text" placeholder="Andrew" maxLength={80} required />
          </div>
          <div className="option-age">
            <label className="roboto-medium pb-1" htmlFor="journey-gender">Select Your Child’s Gender</label>
            <select id="journey-gender" value={gender} onChange={event => setGender(event.target.value)} required>
              <option value="">Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
            <svg className="arr-down" width="16" height="8" viewBox="0 0 16 8" aria-hidden="true" focusable="false"><path d="M.75.75 8 7.25 15.25.75" fill="none" stroke="#023448" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </div>
          <button className="submit roboto-medium" type="submit">Simulate Now</button>
        </form>
      </div>

      {!result ? <picture><source media="(max-width: 600px)" srcSet={defaultImgMobile} /><img className="journey-default" src={defaultImg} alt="Children learning to code with a teacher" /></picture> : (
        <section ref={resultRef} className="journey-result" aria-label={`${result.name}’s learning plan`}>
          <div className="journey-summary">
            <p>{result.name}’s journey to mastery will take</p>
            <strong>{plan.length}<small> yrs</small></strong>
            <p>to complete. {result.gender === "Female" ? "She" : "He"} will use {result.age === "5 - 6 years" ? "six (6)" : "three (3)"} workbooks over that time.</p>
            <a href="#enrol">Enrol Now</a>
          </div>
          <div className="journey-result-content">
            <h2>{result.name}’s {ordinals[yearIndex]} Year</h2>
            <a className="journey-download" href={`data:text/plain;charset=utf-8,${encodeURIComponent(learningPlanText(result, plan))}`} download="learning-plan.txt"><img src={downloadIcon} alt="" /> Download Learning Plan</a>
            <div className="journey-year-art">
              <img src={year.image} alt="" />
              <button type="button" aria-label="Previous year" disabled={yearIndex === 0} onClick={() => setYearIndex(index => index - 1)}>‹</button>
              <button type="button" aria-label="Next year" disabled={yearIndex === plan.length - 1} onClick={() => setYearIndex(index => index + 1)}>›</button>
            </div>
            <h3>{result.gender === "Female" ? "She" : "He"} will master:</h3>
            <div className="journey-topics">
              {year.topics.map(topic => <div key={topic.title}><h4>{topic.title}</h4><ul>{topic.points.map(point => <li key={point}>{point}</li>)}</ul></div>)}
            </div>
            <img className="journey-learner" src={learner} alt="" />
          </div>
        </section>
      )}
    </>
  );
};

export default TheJourney;
