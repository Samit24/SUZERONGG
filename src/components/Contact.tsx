import { MdArrowOutward, MdCopyright } from "react-icons/md";
import "./styles/Contact.css";
import { config } from "../config";
import { activeSocials } from "./socialIconMap";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useState } from "react";

gsap.registerPlugin(ScrollTrigger);

const Contact = () => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const contactTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: ".contact-section",
        start: "top 80%",
        end: "bottom center",
        toggleActions: "play none none none",
      },
    });
    contactTimeline
      .fromTo(".contact-cta", { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" })
      .fromTo(
        ".contact-box",
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.15, ease: "power3.out" },
        "-=0.4"
      );
    return () => {
      contactTimeline.kill();
    };
  }, []);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(config.contact.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${config.contact.email}`;
    }
  };

  return (
    <div className="contact-section section-container" id="contact">
      <div className="contact-container">
        <div className="contact-cta">
          <p className="eyebrow">06 — Contact</p>
          <p className="contact-kicker">Open to security engineering, threat hunting and SOC roles.</p>
          <h3>
            Ready to secure <span>the network?</span>
          </h3>
          <div className="contact-actions">
            <a href={`mailto:${config.contact.email}`} className="contact-btn contact-btn-primary" data-cursor="disable">
              Contact me <MdArrowOutward />
            </a>
            <button type="button" className="contact-btn" onClick={copyEmail} data-cursor="disable">
              {copied ? "Copied ✓" : "Copy email"}
            </button>
          </div>
        </div>
        <div className="contact-flex">
          <div className="contact-box">
            <h4>Email</h4>
            <p>
              <a href={`mailto:${config.contact.email}`} data-cursor="disable">
                {config.contact.email}
              </a>
            </p>
            <h4>Location</h4>
            <p>
              <span>{config.contact.location}</span>
            </p>
          </div>
          <div className="contact-box">
            <h4>Connect</h4>
            {activeSocials.map(({ name, url }) => (
              <a key={name} href={url} target="_blank" rel="noopener noreferrer" data-cursor="disable" className="contact-social">
                {name} <MdArrowOutward />
              </a>
            ))}
            <a href={config.contact.resume} target="_blank" rel="noopener noreferrer" data-cursor="disable" className="contact-social">
              Resume (PDF) <MdArrowOutward />
            </a>
          </div>
          <div className="contact-box">
            <h2>
              Designed and built <br /> by <span>{config.developer.fullName}</span>
            </h2>
            <h5>
              <MdCopyright /> {new Date().getFullYear()} {config.developer.handle}
            </h5>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
