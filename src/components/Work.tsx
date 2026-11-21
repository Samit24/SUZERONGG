import "./styles/Work.css";
import ProjectCover from "./ProjectCover";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect } from "react";
import { config } from "../config";

gsap.registerPlugin(ScrollTrigger);

const Work = () => {
  useEffect(() => {
    // Phones: no sideways pinning, but each project rises into view as you scroll.
    if (window.innerWidth <= 768) {
      const reveals = gsap.utils.toArray<HTMLElement>(".work-box").map((box) =>
        gsap.fromTo(
          box,
          { opacity: 0, y: 60 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: { trigger: box, start: "top 88%" },
          }
        )
      );
      return () => reveals.forEach((t) => (t.scrollTrigger?.kill(), t.kill()));
    }

    let translateX: number = 0;

    function setTranslateX() {
      const box = document.getElementsByClassName("work-box");
      if (box.length === 0) return;
      const rectLeft = document
        .querySelector(".work-container")!
        .getBoundingClientRect().left;
      const rect = box[0].getBoundingClientRect();
      const parentWidth = box[0].parentElement!.getBoundingClientRect().width;
      const padding: number =
        parseInt(window.getComputedStyle(box[0]).padding) / 2;
      translateX = rect.width * box.length - (rectLeft + parentWidth) + padding;
    }

    setTranslateX();

    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: ".work-section",
        start: "top top",
        end: `+=${translateX}`,
        scrub: 1,
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
        id: "work",
        invalidateOnRefresh: true,
      },
    });

    timeline.to(".work-flex", {
      x: -translateX,
      ease: "none",
    });

    // Refresh ScrollTrigger after layout settles
    ScrollTrigger.refresh();

    // Clean up
    return () => {
      timeline.kill();
      ScrollTrigger.getById("work")?.kill();
    };
  }, []);
  return (
    <div className="work-section" id="work">
      <div className="work-container section-container">
        <p className="eyebrow">05 — Selected work</p>
        <h2>
          My <span>work</span>
        </h2>
        <div className="work-flex">
          {config.projects.map((project, index) => (
            <div className="work-box" key={project.title}>
              <div className="work-info">
                <div className="work-title">
                  <h3>0{index + 1}</h3>

                  <div>
                    <h4>{project.title}</h4>
                    <p>{project.category}</p>
                  </div>
                </div>
                <h4>Tools and features</h4>
                <p>{project.technologies}</p>
                <p className="work-desc">{project.description}</p>
              </div>
              <ProjectCover title={project.title} lines={project.snippet} link={project.link} />
            </div>
          ))}
          {/* More on GitHub */}
          <div className="work-box work-box-cta">
            <div className="see-all-works">
              <h3>More in the lab</h3>
              <p>Detection code, scripts and experiments on GitHub</p>
              <a href={config.contact.github} target="_blank" rel="noopener noreferrer" className="see-all-btn" data-cursor="disable">
                github.com/Samit24 →
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Work;
