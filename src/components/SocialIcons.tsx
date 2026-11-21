import "./styles/SocialIcons.css";
import { TbNotes } from "react-icons/tb";
import HoverLinks from "./HoverLinks";
import { config } from "../config";

// Fixed bottom-right "RESUME" link. (Social icons now orbit the globe on the landing screen.)
const SocialIcons = () => (
  <div className="icons-section">
    <a className="resume-button" href={config.contact.resume} target="_blank" rel="noopener noreferrer">
      <HoverLinks text="RESUME" />
      <span>
        <TbNotes />
      </span>
    </a>
  </div>
);

export default SocialIcons;
