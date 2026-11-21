import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MdArrowOutward, MdVerified } from "react-icons/md";
import "./styles/Certifications.css";
import { config } from "../config";

gsap.registerPlugin(ScrollTrigger);

const Certifications = () => {
  useEffect(() => {
    const tween = gsap.fromTo(
      ".cert-card",
      { opacity: 0, y: 60 },
      {
        opacity: 1,
        y: 0,
        stagger: 0.08,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: { trigger: ".cert-section", start: "top 75%" },
      }
    );
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  // Spotlight that follows the pointer inside each card.
  const onMove = (e: React.MouseEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  return (
    <div className="cert-section section-container" id="certifications">
      <p className="eyebrow">03 — Certifications</p>
      <h2>
        Earned <span>credentials</span>
      </h2>
      <div className="cert-grid">
        {config.certifications.map((c) => {
          const inner = (
            <>
              <div className="cert-image" style={{ backgroundImage: `url("${c.image}")` }}></div>
              <div className="cert-body">
                <p className="cert-issuer">{c.issuer}</p>
                <h3>{c.name}</h3>
                <span className={`cert-tag ${c.status ? "cert-tag-progress" : ""}`}>
                  {c.status ? (
                    c.status
                  ) : (
                    <>
                      <MdVerified /> View certificate <MdArrowOutward />
                    </>
                  )}
                </span>
              </div>
            </>
          );
          return c.file ? (
            <a
              key={c.name}
              className="cert-card"
              href={encodeURI(c.file)}
              target="_blank"
              rel="noopener noreferrer"
              onMouseMove={onMove}
              data-cursor="disable"
            >
              {inner}
            </a>
          ) : (
            <div key={c.name} className="cert-card" onMouseMove={onMove}>
              {inner}
            </div>
          );
        })}
      </div>
      <div className="cert-also">
        <h4>Also certified</h4>
        <div className="cert-also-list">
          {config.alsoCertified.map((c) => (
            <span key={c}>{c}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Certifications;
