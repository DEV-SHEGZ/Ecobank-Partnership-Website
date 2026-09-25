import react from "react";
import "./ourteachers.css";
import indicator from "../images/indicator icon.png";
import Teach1 from "../images/teacher1.png";
import Teach2 from "../images/teacher 2.png";
import Teach3 from "../images/teacher3.jpg";
import linkedIn from "../images/LinkedIn.png";
import rightArr from "../images/Right.png";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
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
    school: "Greenwood Senior School",
    years: "3 years - 6 years",
    img: Teach2,
  },
  {
    name: "Wale Thompson",
    school: " Code14 High School",
    years: "8 years - 12 years",
    img: Teach3,
  },
  {
    name: "Albert Faith",
    school: "ATC High School",
    years: "1 years - 4 years",
    img: Teach2,
  },
];

const OurTeachers = () => {
  const teacherCards = teacherDetails.map((teacher, i) => {
    return (
      <SwiperSlide id="swiper-slide">
        <div id="teacher-card" class="card" style={{ width: "18rem" }}>
          <img
            id="teachers-img"
            src={teacher.img}
            class="card-img-top"
            alt="..."
          />
          <div id="teach-crd-bdy" class="card-body">
            <h5 class="card-title roboto-medium pb-2">{teacher.name}</h5>
            <p id="first-p" class="card-text roboto-regular pb-2">
              Currently teaches at ${teacher.school}
            </p>
            <p id="years" class="card-text pb-5">
              {teacher.years}
            </p>
            <div className="linkedprof">
              <img className="ms-2 me-2" src={linkedIn} />
              <a href="#" class="btn roboto-regular me-2">
                View Profile
              </a>
              <img className="right-arr" src={rightArr} />
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
          <img src={indicator} className="indicator me-2" />
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
          modules={[Autoplay]}
          slidesPerView={2.1}
          spaceBetween={0}
          loop={true}
          autoplay={{
            delay: 4000,
            disableOnInteraction: true,
          }}
          id="new-slide"
        >
          {teacherCards}
        </Swiper>
      </div>
    </div>
  );
};

export default OurTeachers;
