import "./styles/Career.css";
import { config } from "../config";

const Career = () => {
  return (
    <div className="career-section section-container" id="experience">
      <div className="career-container">
        <p className="eyebrow">02 — Career</p>
        <h2>
          My career <span>&</span>
          <br /> <em>experience</em>
        </h2>
        <div className="career-info">
          <div className="career-timeline">
            <div className="career-dot"></div>
          </div>
          {config.career.map((exp, index) => (
            <div key={index} className="career-info-box">
              <div className="career-info-in">
                <div className="career-role">
                  <h4>{exp.position}</h4>
                  <h5>{exp.company}</h5>
                  <h6>{exp.period}</h6>
                </div>
                <h3>{exp.year}</h3>
              </div>
              <p>{exp.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Career;
