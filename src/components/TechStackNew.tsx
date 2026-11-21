import { useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MdCheck } from "react-icons/md";
import "./styles/TechStackNew.css";

gsap.registerPlugin(ScrollTrigger);

interface Software {
  name: string;
  icon?: string; // simple-icons slug
  mono?: string; // initials shown when there is no icon
}

const ICON_CDN = "https://cdn.jsdelivr.net/npm/simple-icons@13.21.0/icons/";

// Software & platforms, shown as icon tiles.
const software: { group: string; items: Software[] }[] = [
  {
    group: "Security platforms",
    items: [
      { name: "CrowdStrike Falcon", mono: "CS" },
      { name: "Falcon LogScale", mono: "LS" },
      { name: "Falcon Next-Gen SIEM", mono: "NG" },
      { name: "Fusion SOAR", mono: "SOAR" },
    ],
  },
  {
    group: "Network & analysis",
    items: [
      { name: "Wireshark", icon: "wireshark" },
      { name: "Nmap", mono: "NMAP" },
      { name: "Zeek", mono: "ZEEK" },
      { name: "Kali Linux", icon: "kalilinux" },
    ],
  },
  {
    group: "Systems & scripting",
    items: [
      { name: "Windows", mono: "WIN" },
      { name: "Linux", icon: "linux" },
      { name: "Python", icon: "python" },
      { name: "PowerShell", mono: "PS" },
      { name: "Bash", icon: "gnubash" },
      { name: "Git", icon: "git" },
    ],
  },
  {
    group: "Cloud & web",
    items: [
      { name: "AWS", mono: "AWS" },
      { name: "Azure", mono: "AZ" },
      { name: "Google Cloud", icon: "googlecloud", mono: "GCP" },
      { name: "WordPress", icon: "wordpress" },
      { name: "PHP", icon: "php" },
      { name: "JavaScript", icon: "javascript" },
    ],
  },
];

// Skills, shown as grouped checklists.
const skills: { group: string; items: string[] }[] = [
  {
    group: "Detection",
    items: ["Threat hunting", "SIEM monitoring", "Log analysis", "IoC analysis", "MITRE ATT&CK mapping"],
  },
  {
    group: "Response",
    items: ["Alert triage", "Incident response", "Root-cause analysis"],
  },
  {
    group: "Engineering",
    items: ["Log ingestion & parsing", "Detection workflow automation", "EDR deployment & administration"],
  },
];

const languages = ["Nepali · native", "English · fluent", "Hindi · intermediate"];

// Gradient-filled icon from simple-icons, or initials when there's no icon (or it fails to load).
const SoftwareIcon = ({ item }: { item: Software }) => {
  const [failed, setFailed] = useState(false);
  if (!item.icon || failed) {
    return <span className="kit-mono">{item.mono ?? item.name.slice(0, 2).toUpperCase()}</span>;
  }
  const src = `${ICON_CDN}${item.icon}.svg`;
  const url = `url("${src}")`;
  return (
    <>
      <span className="kit-icon" style={{ maskImage: url, WebkitMaskImage: url }} />
      <img src={src} alt="" hidden onError={() => setFailed(true)} />
    </>
  );
};

const TechStackNew = () => {
  useEffect(() => {
    const tweens = [
      gsap.fromTo(
        ".kit-tile",
        { opacity: 0, y: 30, scale: 0.92 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          ease: "power3.out",
          stagger: 0.035,
          scrollTrigger: { trigger: ".kit-software", start: "top 80%" },
        }
      ),
      gsap.fromTo(
        ".kit-skill",
        { opacity: 0, x: 30 },
        {
          opacity: 1,
          x: 0,
          duration: 0.6,
          ease: "power3.out",
          stagger: 0.05,
          scrollTrigger: { trigger: ".kit-skills", start: "top 80%" },
        }
      ),
    ];
    return () => tweens.forEach((t) => (t.scrollTrigger?.kill(), t.kill()));
  }, []);

  return (
    <section className="techstack-new" id="stack">
      <div className="techstack-video-container" aria-hidden="true">
        <div className="techstack-grid"></div>
        <div className="techstack-overlay"></div>
      </div>

      <div className="techstack-content">
        <p className="eyebrow eyebrow-center">04 — Skills & tools</p>
        <h2>
          What I <em>work with</em>
        </h2>
        <p className="stack-intro">The software I use every day, and the skills I bring to a security team.</p>

        <div className="kit-panels">
          <div className="kit-panel kit-software">
            <h3 className="kit-panel-title">
              <span>01</span> Software & platforms
            </h3>
            {software.map((g) => (
              <div className="kit-group" key={g.group}>
                <h4>{g.group}</h4>
                <div className="kit-tiles">
                  {g.items.map((item) => (
                    <div className="kit-tile" key={item.name} title={item.name}>
                      <SoftwareIcon item={item} />
                      <span className="kit-tile-name">{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="kit-panel kit-skills">
            <h3 className="kit-panel-title">
              <span>02</span> Skills
            </h3>
            {skills.map((g) => (
              <div className="kit-group" key={g.group}>
                <h4>{g.group}</h4>
                <ul className="kit-skill-list">
                  {g.items.map((s) => (
                    <li className="kit-skill" key={s}>
                      <span className="kit-check" aria-hidden="true">
                        <MdCheck />
                      </span>
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <div className="kit-group">
              <h4>Languages</h4>
              <div className="kit-langs">
                {languages.map((l) => (
                  <span className="kit-skill kit-lang" key={l}>
                    {l}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TechStackNew;
