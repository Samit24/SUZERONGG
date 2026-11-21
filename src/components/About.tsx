import "./styles/About.css";
import { config } from "../config";

const About = () => {
  return (
    <div className="about-section" id="about">
      <div className="about-me">
        <h3 className="title">01 — {config.about.title}</h3>
        {config.about.paragraphs.map((p, i) => (
          <p className="para" key={i}>
            {p}
          </p>
        ))}
        <div className="about-stats">
          {config.about.stats.map((s) => (
            <div className="about-stat" key={s.label}>
              <strong>{s.value}</strong>
              <span>{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default About;
