import "./ourteachers.css";
import indicator from "../images/indicator icon.png";
import Teach1 from "../images/teacher1.png";
import Teach2 from "../images/teacher 2.png";
import Teach3 from "../images/teacher3-figma.jpg";
import linkedIn from "../images/LinkedIn.png";
import rightArr from "../images/Right.png";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

const teacherDetails = [
  {
    name: "Andrew Cole",
    school: "Benedict High School",
    years: "7 years - 10 years",
    img: Teach1,
  },
  {
    name: "Kate Adewale",
    school: "Greenwood Senior High School",
    years: "3 years - 6 years",
    img: Teach2,
  },
  {
    name: "Daniel Onaga",
    school: "Ultimate Private School",
    years: "11 years - 15 years",
    img: Teach3,
  },
];

const OurTeachers = () => {
  const teacherCards = teacherDetails.map((teacher, i) => {
    return (
      <SwiperSlide key={teacher.name} className="teacher-slide">
        <div className={`teacher-card card teacher-card-${i % 2}`}>
          <img
            className="teachers-img"
            src={teacher.img}
            alt={teacher.name}
          />
          <div className="teach-crd-bdy card-body">
            <h5 className="card-title roboto-medium pb-2">{teacher.name}</h5>
            <p className="teacher-school card-text roboto-regular pb-2">
              Currently teaches at {teacher.school}
            </p>
            <p className="teacher-years card-text">
              {teacher.years}
            </p>
            <div className="linkedprof">
              <img className="linkedin-icon" src={linkedIn} alt="LinkedIn" />
              <button type="button" className="btn roboto-regular me-2">
                View Profile
              </button>
              <img className="right-arr" src={rightArr} alt="" />
            </div>
          </div>
        </div>
      </SwiperSlide>
    );
  });

  return (
    <div className="overall-cont">
      <div className="ourteacherscont">
        <div className="head-ind">
          <img src={indicator} className="indicator me-2" alt="" />
          <p className="roboto-medium">Our Teachers</p>
        </div>
        <div id="teach-div" className="head-h1 roboto-medium">
          <h1>
            Enrol your learners under trusted Class Educators, with Verified
            Results
          </h1>
        </div>
      </div>

      <div className="cards-cont">
        <Swiper
          slidesPerView={2.1}
          spaceBetween={0}
          loop={false}
          className="teacher-swiper"
        >
          {teacherCards}
        </Swiper>
      </div>
    </div>
  );
};

export default OurTeachers;
