import { useEffect, useState } from "react";
import "./styles/SocialIcons.css";
import { TbNotes } from "react-icons/tb";
import HoverLinks from "./HoverLinks";
import { config } from "../config";

// Fixed bottom-right "RESUME" link. (Social icons orbit the globe on the landing screen.)
// On phones it waits until you scroll past the landing screen, so it never sits on top of the globe.
const SocialIcons = () => {
  const [onLanding, setOnLanding] = useState(true);

  useEffect(() => {
    const landing = document.getElementById("landingDiv");
    if (!landing) return;
    const io = new IntersectionObserver(([entry]) => setOnLanding(entry.intersectionRatio > 0.35), {
      threshold: [0, 0.35, 1],
    });
    io.observe(landing);
    return () => io.disconnect();
  }, []);

  return (
    <div className={`icons-section ${onLanding ? "on-landing" : ""}`}>
      <a className="resume-button" href={config.contact.resume} target="_blank" rel="noopener noreferrer">
        <HoverLinks text="RESUME" />
        <span>
          <TbNotes />
        </span>
      </a>
    </div>
  );
};

export default SocialIcons;
