import { CSSProperties } from "react";
import { activeSocials } from "./socialIconMap";
import "./styles/OrbitSocials.css";

// Social links riding a slow orbit around the 3D globe (a plain row on smaller screens).
const OrbitSocials = () => {
  const items = activeSocials.map((s) => ({ name: s.name, url: s.url, Icon: s.Icon, external: true }));
  // Start offset so no icon begins exactly beside the name or the role text.
  const start = -60;

  return (
    <nav className="orbit-socials" aria-label="Social links">
      <div className="orbit-ring">
        {items.map(({ name, url, Icon, external }, i) => (
          <div
            key={name}
            className="orbit-item"
            style={{ "--a": `${start + (360 / items.length) * i}deg` } as CSSProperties}
          >
            <a
              href={url}
              aria-label={name}
              data-cursor="disable"
              {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            >
              <Icon />
              <span className="orbit-label">{name}</span>
            </a>
          </div>
        ))}
      </div>
    </nav>
  );
};

export default OrbitSocials;
