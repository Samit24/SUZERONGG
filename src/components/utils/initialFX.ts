import { TextSplitter } from "../../utils/textSplitter";
import gsap from "gsap";
import { lenis } from "../Navbar";

export function initialFX() {
  document.body.style.overflowY = "auto";
  if (lenis) {
    lenis.start();
  }
  document.getElementsByTagName("main")[0].classList.add("main-active");
  gsap.to("body", {
    backgroundColor: "#060b14",
    duration: 0.5,
    delay: 1,
  });

  const selectors = [".landing-info h3", ".landing-intro h2", ".landing-intro h1 .name-first", ".landing-intro h1 .name-last"];
  const elements = selectors.flatMap(selector => Array.from(document.querySelectorAll(selector)));
  const landingText = new TextSplitter(elements, {
    type: "chars,lines",
    linesClass: "split-line",
  });
  gsap.fromTo(
    landingText.chars,
    { opacity: 0, y: 80, filter: "blur(5px)" },
    {
      opacity: 1,
      duration: 1.2,
      filter: "blur(0px)",
      ease: "power3.inOut",
      y: 0,
      stagger: 0.025,
      delay: 0.3,
    }
  );

  const TextProps = { type: "chars,lines", linesClass: "split-h2" };

  const landingText2 = new TextSplitter(".landing-h2-info", TextProps);
  gsap.fromTo(
    landingText2.chars,
    { opacity: 0, y: 80, filter: "blur(5px)" },
    {
      opacity: 1,
      duration: 1.2,
      filter: "blur(0px)",
      ease: "power3.inOut",
      y: 0,
      stagger: 0.025,
      delay: 0.3,
    }
  );

  gsap.fromTo(
    ".landing-info-h2",
    { opacity: 0, y: 30 },
    {
      opacity: 1,
      duration: 1.2,
      ease: "power1.inOut",
      y: 0,
      delay: 0.8,
    }
  );
  gsap.fromTo(
    [".header", ".icons-section", ".nav-fade"],
    { opacity: 0 },
    {
      opacity: 1,
      duration: 1.2,
      ease: "power1.inOut",
      delay: 0.1,
    }
  );

  const landingText3 = new TextSplitter(".landing-h2-info-1", TextProps);
  const landingText4 = new TextSplitter(".landing-h2-1", TextProps);
  const landingText5 = new TextSplitter(".landing-h2-2", TextProps);

  LoopText(landingText2, landingText3);
  LoopText(landingText4, landingText5);
}

// Rolls between two words in the same clipped slot: the shown word slides up and out while the
// other slides up from below. Only one word is ever at rest in the slot, so they never overlap.
// yPercent (not px) keeps the distance right at every font size; the intro's `y` tween is separate.
function LoopText(Text1: TextSplitter, Text2: TextSplitter) {
  const hold = 3.2; // seconds each word stays
  const roll = { duration: 0.9, ease: "power3.inOut", stagger: 0.05 };
  const OUT = -150;
  const IN = 150;

  gsap.set(Text2.chars, { yPercent: IN, opacity: 1 });

  gsap
    .timeline({ repeat: -1, delay: 1.2 })
    .to(Text1.chars, { yPercent: OUT, ...roll }, hold)
    .fromTo(Text2.chars, { yPercent: IN }, { yPercent: 0, ...roll }, hold)
    .to(Text2.chars, { yPercent: OUT, ...roll }, `+=${hold}`)
    .fromTo(Text1.chars, { yPercent: IN }, { yPercent: 0, immediateRender: false, ...roll }, "<");
}
