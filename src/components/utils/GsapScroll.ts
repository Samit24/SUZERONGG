import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Moves the 3D globe as the visitor scrolls through Landing → About → What I Do.
export function setGlobeTimeline(globe: THREE.Object3D, camera: THREE.PerspectiveCamera) {
  if (window.innerWidth <= 1024) return;

  // Centre the globe through GSAP so its own x/y tweens don't wipe out the CSS translate(-50%).
  gsap.set(".globe-model", { xPercent: -50 });

  const tl1 = gsap.timeline({
    scrollTrigger: {
      trigger: ".landing-section",
      start: "top top",
      end: "bottom top",
      scrub: true,
      invalidateOnRefresh: true,
    },
  });
  const tl2 = gsap.timeline({
    scrollTrigger: {
      trigger: ".about-section",
      start: "center 55%",
      end: "bottom top",
      scrub: true,
      invalidateOnRefresh: true,
    },
  });
  const tl3 = gsap.timeline({
    scrollTrigger: {
      trigger: ".whatIDO",
      start: "top top",
      end: "bottom top",
      scrub: true,
      invalidateOnRefresh: true,
    },
  });

  tl1
    .fromTo(globe.rotation, { z: 0 }, { z: -0.25, duration: 1 }, 0)
    .to(camera.position, { z: 11.5 }, 0)
    .fromTo(".globe-model", { x: 0 }, { x: "-25%", duration: 1 }, 0)
    .to(".landing-container", { opacity: 0, duration: 0.4 }, 0)
    .to(".landing-container", { y: "40%", duration: 0.8 }, 0)
    .fromTo(".about-me", { y: "-50%" }, { y: "0%" }, 0);

  tl2
    .to(camera.position, { z: 19, duration: 6, delay: 2, ease: "power3.inOut" }, 0)
    .to(".about-section", { y: "30%", duration: 6 }, 0)
    .to(".about-section", { opacity: 0, delay: 3, duration: 2 }, 0)
    .fromTo(
      ".globe-model",
      { pointerEvents: "inherit" },
      { pointerEvents: "none", x: "-2%", delay: 2, duration: 5 },
      0
    )
    .to(globe.rotation, { x: 0.35, delay: 3, duration: 3 }, 0)
    .fromTo(".what-box-in", { display: "none" }, { display: "flex", duration: 0.1, delay: 6 }, 0)
    .fromTo(
      ".globe-rim",
      { opacity: 0.45, scaleX: 1.4 },
      { opacity: 0, scale: 0, y: "-70%", duration: 5, delay: 2 },
      0.3
    );

  tl3
    .fromTo(".globe-model", { y: "0%" }, { y: "-100%", duration: 4, ease: "none", delay: 1 }, 0)
    .fromTo(".whatIDO", { y: 0 }, { y: "15%", duration: 2 }, 0)
    .to(globe.rotation, { x: -0.1, duration: 2, delay: 1 }, 0);
}

export function setAllTimeline() {
  const careerTimeline = gsap.timeline({
    scrollTrigger: {
      trigger: ".career-section",
      start: "top 50%",
      end: "bottom 30%",
      scrub: 1.5,
      invalidateOnRefresh: true,
    },
  });
  careerTimeline
    .fromTo(".career-timeline", { maxHeight: "0%" }, { maxHeight: "100%", duration: 1, ease: "none" }, 0)
    .fromTo(".career-timeline", { opacity: 0 }, { opacity: 1, duration: 0.2 }, 0)
    .fromTo(".career-info-box", { opacity: 0 }, { opacity: 1, stagger: 0.1, duration: 0.5 }, 0)
    .fromTo(
      ".career-dot",
      { animationIterationCount: "infinite" },
      { animationIterationCount: "1", delay: 0.3, duration: 0.1 },
      0
    );

  if (window.innerWidth > 1024) {
    careerTimeline.fromTo(".career-section", { y: 0 }, { y: "20%", duration: 0.5, delay: 0.2 }, 0);
  }

  // Below desktop the globe isn't rendered, so reveal the What I Do cards on scroll.
  if (window.innerWidth <= 1024) {
    gsap.set(".what-box-in", { display: "flex" });
  }
}
