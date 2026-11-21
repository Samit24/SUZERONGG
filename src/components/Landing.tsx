import { lazy, Suspense, useEffect, useState } from "react";
import "./styles/Landing.css";
import { config } from "../config";
import OrbitSocials from "./OrbitSocials";

const ThreatGlobe = lazy(() => import("./ThreatGlobe"));

// Phones and tablets get the globe inside the landing section (desktop uses the fixed full-screen one).
const isCompactWidth = () => window.innerWidth <= 1024;

const Landing = () => {
  const [compact, setCompact] = useState(isCompactWidth);

  useEffect(() => {
    const onResize = () => setCompact(isCompactWidth());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <div className="landing-section" id="landingDiv">
      <div className="landing-container">
        <div className="landing-intro">
          <h2>Hello! I'm</h2>
          <h1>
            <span className="name-first">{config.developer.firstName}</span>{" "}
            <span className="name-last">{config.developer.lastName}</span>
          </h1>
        </div>
        <div className="landing-info">
          <h3>A</h3>
          <h2 className="landing-info-h2">
            <div className="landing-h2-1">Security</div>
            <div className="landing-h2-2">Threat</div>
          </h2>
          <h2>
            <div className="landing-h2-info">Engineer</div>
            <div className="landing-h2-info-1">Hunter</div>
          </h2>
        </div>
        {compact ? (
          <div className="mobile-globe">
            <Suspense>
              <ThreatGlobe inline />
            </Suspense>
            <OrbitSocials />
          </div>
        ) : (
          <OrbitSocials />
        )}
      </div>
    </div>
  );
};

export default Landing;
