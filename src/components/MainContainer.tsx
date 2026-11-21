import { PropsWithChildren, useEffect, useState } from "react";
import About from "./About";
import Career from "./Career";
import Certifications from "./Certifications";
import Contact from "./Contact";
import Cursor from "./Cursor";
import Landing from "./Landing";
import Navbar from "./Navbar";
import SocialIcons from "./SocialIcons";
import WhatIDo from "./WhatIDo";
import Work from "./Work";
import TechStackNew from "./TechStackNew";
import setSplitText from "./utils/splitText";
import { setAllTimeline } from "./utils/GsapScroll";
import { initialFX } from "./utils/initialFX";

const MainContainer = ({ children }: PropsWithChildren) => {
  const [isDesktopView, setIsDesktopView] = useState<boolean>(
    window.innerWidth > 1024
  );

  useEffect(() => {
    let lastWidth = 0;
    const resizeHandler = () => {
      // phones fire resize while scrolling (address bar); only re-split when the width really changes
      if (window.innerWidth === lastWidth) return;
      lastWidth = window.innerWidth;
      setSplitText();
      setIsDesktopView(window.innerWidth > 1024);
    };
    resizeHandler();
    window.addEventListener("resize", resizeHandler);
    // No loading screen: play the intro as soon as the page has mounted.
    const intro = setTimeout(initialFX, 150);
    // Section timelines that don't depend on the 3D globe.
    const t = setTimeout(setAllTimeline, 300);
    return () => {
      clearTimeout(t);
      clearTimeout(intro);
      window.removeEventListener("resize", resizeHandler);
    };
  }, []);

  return (
    <div className="container-main">
      <Cursor />
      <Navbar />
      <SocialIcons />
      {isDesktopView && children}
      <div className="container-main">
        <Landing />
        <About />
        <WhatIDo />
        <Career />
        <Certifications />
        <TechStackNew />
        <Work />
        <Contact />
      </div>
    </div>
  );
};

export default MainContainer;
