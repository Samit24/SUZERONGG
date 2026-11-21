import { useEffect, useState } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HoverLinks from "./HoverLinks";
import { gsap } from "gsap";
import Lenis from "lenis";
import "./styles/Navbar.css";
import { config } from "../config";
import Logo from "./Logo";
import { activeSocials } from "./socialIconMap";

gsap.registerPlugin(ScrollTrigger);
export let lenis: Lenis | null = null;

// in page order
const navLinks = [
  { href: "#about", label: "ABOUT" },
  { href: "#experience", label: "CAREER" },
  { href: "#certifications", label: "CERTS" },
  { href: "#stack", label: "SKILLS" },
  { href: "#work", label: "WORK" },
  { href: "#contact", label: "CONTACT" },
];

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  // phone menu: lock page scroll while open, close on Escape
  useEffect(() => {
    document.body.classList.toggle("menu-open", menuOpen);
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  useEffect(() => {
    // Initialize Lenis smooth scroll
    lenis = new Lenis({
      duration: 1.7,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1.7,
      touchMultiplier: 2,
      infinite: false,
    });

    // Start paused
    lenis.stop();

    // Handle smooth scroll animation frame
    function raf(time: number) {
      lenis?.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Handle navigation links
    const links = document.querySelectorAll(".header ul a");
    links.forEach((elem) => {
      const element = elem as HTMLAnchorElement;
      element.addEventListener("click", (e) => {
        if (window.innerWidth > 1024) {
          e.preventDefault();
          const elem = e.currentTarget as HTMLAnchorElement;
          const section = elem.getAttribute("data-href");
          if (section && lenis) {
            const target = document.querySelector(section) as HTMLElement;
            if (target) {
              lenis.scrollTo(target, {
                offset: 0,
                duration: 1.5,
              });
            }
          }
        }
      });
    });

    // Handle resize
    window.addEventListener("resize", () => {
      lenis?.resize();
    });

    return () => {
      lenis?.destroy();
    };
  }, []);
  return (
    <>
      <div className="header">
        <a href="/#" className="navbar-title" data-cursor="disable">
          <Logo />
        </a>
        <a
          href={`mailto:${config.contact.email}`}
          className="navbar-connect"
          data-cursor="disable"
        >
          {config.contact.email}
        </a>
        <div className="nav-right">
          <ul>
            {navLinks.map((l) => (
              <li key={l.href}>
                <a data-href={l.href} href={l.href}>
                  <HoverLinks text={l.label} />
                </a>
              </li>
            ))}
          </ul>
        </div>
        <button
          type="button"
          className={`nav-toggle ${menuOpen ? "is-open" : ""}`}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          onClick={() => setMenuOpen((o) => !o)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      {/* phone menu (outside .header, whose transform would trap a fixed panel) */}
      <nav id="mobile-menu" className={`mobile-menu ${menuOpen ? "is-open" : ""}`} aria-hidden={!menuOpen}>
        <ol>
          {navLinks.map((l, i) => (
            <li key={l.href} style={{ transitionDelay: menuOpen ? `${0.08 + i * 0.05}s` : "0s" }}>
              <a
                href={l.href}
                tabIndex={menuOpen ? 0 : -1}
                onClick={(e) => {
                  // close first (unlocks page scroll), then glide to the section
                  e.preventDefault();
                  setMenuOpen(false);
                  setTimeout(() => document.querySelector(l.href)?.scrollIntoView({ behavior: "smooth" }), 60);
                }}
              >
                <span>0{i + 1}</span>
                {l.label.charAt(0) + l.label.slice(1).toLowerCase()}
              </a>
            </li>
          ))}
        </ol>
        <div className="mobile-menu-foot">
          <a href={`mailto:${config.contact.email}`} tabIndex={menuOpen ? 0 : -1}>
            {config.contact.email}
          </a>
          <div className="mobile-menu-socials">
            {activeSocials.map(({ name, url, Icon }) => (
              <a key={name} href={url} target="_blank" rel="noopener noreferrer" aria-label={name} tabIndex={menuOpen ? 0 : -1}>
                <Icon />
              </a>
            ))}
          </div>
        </div>
      </nav>

      <div className="landing-circle1"></div>
      <div className="landing-circle2"></div>
      <div className="nav-fade"></div>
    </>
  );
};

export default Navbar;
