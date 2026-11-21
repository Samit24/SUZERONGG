import { MdArrowOutward, MdArrowUpward, MdCheck, MdContentCopy } from "react-icons/md";
import "./styles/Contact.css";
import { config } from "../config";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useState } from "react";
import { lenis } from "./Navbar";

gsap.registerPlugin(ScrollTrigger);

const kathmanduTime = () =>
  new Date().toLocaleTimeString("en-GB", { timeZone: "Asia/Kathmandu", hour: "2-digit", minute: "2-digit" });

const Contact = () => {
  const [copied, setCopied] = useState(false);
  const [ktmTime, setKtmTime] = useState(() => kathmanduTime());

  useEffect(() => {
    const id = setInterval(() => setKtmTime(kathmanduTime()), 30_000);
    return () => clearInterval(id);
  }, []);

  const toTop = () => {
    if (lenis) lenis.scrollTo(0, { duration: 1.6 });
    else window.scrollTo({ top: 0, behavior: "smooth" });
  };

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
        ".contact-card",
        { opacity: 0, y: 40, scale: 0.97 },
        { opacity: 1, y: 0, scale: 1, duration: 0.7, ease: "power3.out" },
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
          <div className="contact-card">
            <span className="contact-card-label">Email me directly</span>
            <a href={`mailto:${config.contact.email}`} className="contact-email" data-cursor="disable">
              {config.contact.email}
              <MdArrowOutward aria-hidden="true" />
            </a>
            <button type="button" className="contact-copy" onClick={copyEmail} data-cursor="disable" aria-live="polite">
              {copied ? <MdCheck /> : <MdContentCopy />}
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
        </div>
      </div>

      <footer className="site-footer">
        <div className="footer-row">
          <div className="footer-status">
            <span className="footer-pulse" aria-hidden="true"></span>
            {config.contact.location} · <time>{ktmTime}</time> NPT
          </div>
          <button type="button" className="footer-top" onClick={toTop} aria-label="Back to top" data-cursor="disable">
            <MdArrowUpward />
          </button>
        </div>
        <div className="footer-word" aria-hidden="true">
          {config.developer.handle}
        </div>
        <div className="footer-legal">
          <span>© {new Date().getFullYear()} {config.developer.fullName}</span>
          <span>Security Engineer · Threat Hunter</span>
        </div>
      </footer>
    </div>
  );
};

export default Contact;
