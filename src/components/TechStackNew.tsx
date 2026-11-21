import { useEffect, type CSSProperties } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MdCheck } from "react-icons/md";
import "./styles/TechStackNew.css";

gsap.registerPlugin(ScrollTrigger);

interface Software {
  name: string;
  logo: string; // file in /img/logos
  brand: string; // official brand colour, shown on hover
  multicolor?: boolean; // full-colour image logo (greyed out until hover)
}

const L = (file: string) => `/img/logos/${file}`;

// Software & platforms, shown as tiles with each product's official logo.
const software: { group: string; items: Software[] }[] = [
  {
    group: "Security & network",
    items: [
      { name: "CrowdStrike Falcon", logo: L("crowdstrike.png"), brand: "#e32515" },
      { name: "Wireshark", logo: L("wireshark.svg"), brand: "#1679a7" },
      { name: "Nmap", logo: L("nmap.png"), brand: "#4fb3e8", multicolor: true },
      { name: "Zeek", logo: L("zeek.png"), brand: "#29a8e0", multicolor: true },
      { name: "Kali Linux", logo: L("kalilinux.svg"), brand: "#557c94" },
    ],
  },
  {
    group: "Systems & scripting",
    items: [
      { name: "Windows", logo: L("windows.svg"), brand: "#0078d6" },
      { name: "Linux", logo: L("linux.svg"), brand: "#fcc624" },
      { name: "Python", logo: L("python.svg"), brand: "#3776ab" },
      { name: "PowerShell", logo: L("powershell.svg"), brand: "#5391fe" },
      { name: "Bash", logo: L("gnubash.svg"), brand: "#4eaa25" },
      { name: "Git", logo: L("git.svg"), brand: "#f05032" },
    ],
  },
  {
    group: "Cloud & web",
    items: [
      { name: "AWS", logo: L("amazonaws.svg"), brand: "#ff9900" },
      { name: "Azure", logo: L("microsoftazure.svg"), brand: "#0078d4" },
      { name: "Google Cloud", logo: L("googlecloud.svg"), brand: "#4285f4" },
      { name: "WordPress", logo: L("wordpress.svg"), brand: "#21759b" },
      { name: "PHP", logo: L("php.svg"), brand: "#777bb4" },
      { name: "JavaScript", logo: L("javascript.svg"), brand: "#f7df1e" },
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

// Official logo: a neutral silhouette that fills with the brand colour on hover
// (full-colour logos are shown greyed out and regain their colour instead).
const SoftwareLogo = ({ item }: { item: Software }) =>
  item.multicolor ? (
    <img className="kit-logo-img" src={item.logo} alt="" loading="lazy" decoding="async" />
  ) : (
    <span className="kit-logo" style={{ maskImage: `url("${item.logo}")`, WebkitMaskImage: `url("${item.logo}")` }} />
  );

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
                    <div
                      className="kit-tile"
                      key={item.name}
                      title={item.name}
                      style={{ "--brand": item.brand } as CSSProperties}
                    >
                      <SoftwareLogo item={item} />
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
