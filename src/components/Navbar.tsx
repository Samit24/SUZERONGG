import { useEffect, useState } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HoverLinks from "./HoverLinks";
import { gsap } from "gsap";
import Lenis from "lenis";
import "./styles/Navbar.css";
import Logo from "./Logo";
import { MdPersonOutline, MdTimeline, MdVerified, MdBolt, MdTerminal, MdAlternateEmail } from "react-icons/md";
import type { IconType } from "react-icons";

gsap.registerPlugin(ScrollTrigger);
export let lenis: Lenis | null = null;

// in page order
const navLinks: { href: string; label: string; Icon: IconType }[] = [
  { href: "#about", label: "ABOUT", Icon: MdPersonOutline },
  { href: "#experience", label: "CAREER", Icon: MdTimeline },
  { href: "#certifications", label: "CERTS", Icon: MdVerified },
  { href: "#stack", label: "SKILLS", Icon: MdBolt },
  { href: "#work", label: "WORK", Icon: MdTerminal },
  { href: "#contact", label: "CONTACT", Icon: MdAlternateEmail },
];

const Navbar = () => {
  // phones: highlight the tab for the section currently on screen
  const [active, setActive] = useState("");
  useEffect(() => {
    const sections = navLinks
      .map((l) => document.querySelector<HTMLElement>(l.href))
      .filter((el): el is HTMLElement => !!el);
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => e.isIntersecting && setActive(`#${e.target.id}`));
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

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

    // One clock for everything: GSAP's ticker drives Lenis, and every Lenis scroll updates
    // ScrollTrigger in the same frame, so pinned / scrubbed sections never lag a frame behind.
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis?.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

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
      gsap.ticker.remove(tick);
      lenis?.destroy();
    };
  }, []);
  return (
    <>
      <div className="header">
        <a href="/#" className="navbar-title" data-cursor="disable">
          <Logo />
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
      </div>

      {/* phones: floating bottom tab bar (outside .header, whose transform would trap a fixed element) */}
      <nav className="tabbar" aria-label="Sections">
        {navLinks.map(({ href, label, Icon }) => (
          <a
            key={href}
            href={href}
            className={active === href ? "is-active" : ""}
            aria-current={active === href ? "true" : undefined}
            onClick={(e) => {
              e.preventDefault();
              document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            <Icon aria-hidden="true" />
            <span>{label.charAt(0) + label.slice(1).toLowerCase()}</span>
          </a>
        ))}
      </nav>

      <div className="landing-circle1"></div>
      <div className="landing-circle2"></div>
      <div className="nav-fade"></div>
    </>
  );
};

export default Navbar;
