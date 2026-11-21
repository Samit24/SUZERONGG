import { useEffect, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { setGlobeTimeline } from "./utils/GsapScroll";

const CYAN = new THREE.Color("#22d3ee");
const BLUE = new THREE.Color("#3b82f6");
const RADIUS = 1.6;

// Random point on a sphere of the given radius.
function randomOnSphere(r: number) {
  const u = Math.random() * 2 - 1;
  const t = Math.random() * Math.PI * 2;
  const s = Math.sqrt(1 - u * u);
  return new THREE.Vector3(s * Math.cos(t) * r, u * r, s * Math.sin(t) * r);
}

function buildGlobe() {
  const globe = new THREE.Group();

  // Dark core hides the far side of the wireframe so the globe reads as solid.
  const core = new THREE.Mesh(
    new THREE.SphereGeometry(RADIUS * 0.985, 48, 48),
    new THREE.MeshBasicMaterial({ color: "#050b14", transparent: true, opacity: 0.92 })
  );
  globe.add(core);

  // Wireframe shell, coloured top-to-bottom from cyan to blue.
  const shellGeo = new THREE.WireframeGeometry(new THREE.IcosahedronGeometry(RADIUS, 4));
  const pos = shellGeo.getAttribute("position");
  const colors: number[] = [];
  const c = new THREE.Color();
  for (let i = 0; i < pos.count; i++) {
    const y = pos.getY(i) / RADIUS;
    c.copy(BLUE).lerp(CYAN, (y + 1) / 2);
    colors.push(c.r, c.g, c.b);
  }
  shellGeo.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
  const shell = new THREE.LineSegments(
    shellGeo,
    new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.28 })
  );
  globe.add(shell);

  // Network nodes (endpoints) scattered on the surface.
  const nodes: THREE.Vector3[] = [];
  for (let i = 0; i < 90; i++) nodes.push(randomOnSphere(RADIUS * 1.005));
  const nodeGeo = new THREE.BufferGeometry().setFromPoints(nodes);
  const nodeMat = new THREE.PointsMaterial({
    color: CYAN,
    size: 0.045,
    transparent: true,
    opacity: 0.95,
  });
  globe.add(new THREE.Points(nodeGeo, nodeMat));

  // Attack / telemetry arcs between nodes, drawn in over time.
  const arcs: { line: THREE.Line; total: number; speed: number; offset: number }[] = [];
  for (let i = 0; i < 16; i++) {
    const a = nodes[Math.floor(Math.random() * nodes.length)];
    const b = nodes[Math.floor(Math.random() * nodes.length)];
    if (a.distanceTo(b) < 0.8) continue;
    const mid = a.clone().add(b).multiplyScalar(0.5);
    mid.setLength(RADIUS + a.distanceTo(b) * 0.45);
    const curve = new THREE.QuadraticBezierCurve3(a, mid, b);
    const pts = curve.getPoints(60);
    const geo = new THREE.BufferGeometry().setFromPoints(pts);
    const line = new THREE.Line(
      geo,
      new THREE.LineBasicMaterial({
        color: i % 3 === 0 ? "#fb7185" : i % 2 ? CYAN : BLUE, // a few red "threat" arcs
        transparent: true,
        opacity: 0.85,
      })
    );
    geo.setDrawRange(0, 0);
    arcs.push({ line, total: pts.length, speed: 0.25 + Math.random() * 0.35, offset: Math.random() * 3 });
    globe.add(line);
  }

  // Scanner rings orbiting the globe.
  const ringMat = new THREE.MeshBasicMaterial({ color: CYAN, transparent: true, opacity: 0.55 });
  const ring1 = new THREE.Mesh(new THREE.TorusGeometry(RADIUS * 1.32, 0.006, 8, 160), ringMat);
  ring1.rotation.x = Math.PI / 2.3;
  const ring2 = new THREE.Mesh(
    new THREE.TorusGeometry(RADIUS * 1.5, 0.004, 8, 160),
    new THREE.MeshBasicMaterial({ color: BLUE, transparent: true, opacity: 0.35 })
  );
  ring2.rotation.x = Math.PI / 1.7;
  ring2.rotation.y = 0.4;
  const rings = new THREE.Group();
  rings.add(ring1, ring2);

  // A little satellite riding the first ring.
  const sat = new THREE.Mesh(
    new THREE.SphereGeometry(0.035, 12, 12),
    new THREE.MeshBasicMaterial({ color: "#e0f7ff" })
  );
  ring1.add(sat);

  return { globe, shell, arcs, rings, sat };
}

// inline: phone/tablet version that sits inside the landing section instead of the fixed
// full-screen canvas used on desktop.
const ThreatGlobe = ({ inline = false }: { inline?: boolean }) => {
  const canvasDiv = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const host = canvasDiv.current;
    if (!host) return;

    const rect = host.getBoundingClientRect();
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(rect.width, rect.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, rect.width / rect.height, 0.1, 100);
    camera.position.set(0, 0, inline ? 8.4 : 13);

    const { globe, arcs, rings, sat } = buildGlobe();
    const root = new THREE.Group(); // scroll timeline moves this
    const tilt = new THREE.Group(); // mouse moves this
    tilt.add(globe, rings);
    root.add(tilt);
    root.scale.setScalar(0.001);
    scene.add(root);

    let intro: gsap.core.Tween | null = null;
    // Globe grows in alongside the landing text intro.
    let scrollTl: gsap.core.Timeline | null = null;
    const rim = host.querySelector(".globe-rim");
    const startTimer = setTimeout(() => {
      intro = gsap.to(root.scale, { x: 1, y: 1, z: 1, duration: 2.2, ease: "expo.out" });
      gsap.to(rim, { opacity: 0.45, duration: 2, delay: 0.3 });
      if (!inline) {
        setGlobeTimeline(root, camera);
      } else {
        // phones: the globe shrinks, tilts and fades as you scroll past the landing screen
        scrollTl = gsap.timeline({
          scrollTrigger: { trigger: ".landing-section", start: "top top", end: "bottom top", scrub: true },
        });
        scrollTl
          .to(camera.position, { z: 11, ease: "none" }, 0)
          .to(root.rotation, { x: 0.6, ease: "none" }, 0)
          .to(host, { opacity: 0, ease: "none" }, 0.3);
      }
    }, 400);

    const mouse = { x: 0, y: 0 };
    const onMouseMove = (e: MouseEvent) => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    document.addEventListener("mousemove", onMouseMove);

    // touch / pen: drag sideways to spin the globe (vertical swipes still scroll the page)
    let spin = 0;
    let spinAngle = 0;
    let dragX: number | null = null;
    const onPointerDown = (e: PointerEvent) => {
      dragX = e.clientX;
    };
    const onPointerMove = (e: PointerEvent) => {
      if (dragX === null) return;
      spin += (e.clientX - dragX) * 0.008;
      dragX = e.clientX;
    };
    const onPointerUp = () => {
      dragX = null;
    };
    if (inline) {
      host.addEventListener("pointerdown", onPointerDown);
      window.addEventListener("pointermove", onPointerMove);
      window.addEventListener("pointerup", onPointerUp);
      window.addEventListener("pointercancel", onPointerUp);
    }

    // stop rendering while the globe is off-screen (saves battery on phones)
    let visible = true;
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    io.observe(host);

    const onResize = () => {
      const r = host.getBoundingClientRect();
      renderer.setSize(r.width, r.height);
      camera.aspect = r.width / r.height;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", onResize);
    const ro = new ResizeObserver(onResize);
    ro.observe(host);

    const clock = new THREE.Clock();
    let frame = 0;
    const animate = () => {
      frame = requestAnimationFrame(animate);
      if (!visible) return;
      const t = clock.getElapsedTime();
      spin *= 0.97; // drag momentum eases off
      spinAngle += spin * 0.1;
      globe.rotation.y = t * 0.12 + spinAngle;
      rings.rotation.z = t * 0.2;
      sat.position.set(Math.cos(t * 0.9) * 1.6 * 1.32, Math.sin(t * 0.9) * 1.6 * 1.32, 0);
      tilt.rotation.y += (mouse.x * 0.35 - tilt.rotation.y) * 0.05;
      tilt.rotation.x += (mouse.y * 0.25 - tilt.rotation.x) * 0.05;
      arcs.forEach((a) => {
        // Each arc draws in, holds, then erases, on its own cycle.
        const cycle = ((t * a.speed + a.offset) % 2) / 2;
        const geo = a.line.geometry as THREE.BufferGeometry;
        if (cycle < 0.5) geo.setDrawRange(0, Math.floor(a.total * cycle * 2));
        else {
          const start = Math.floor(a.total * (cycle - 0.5) * 2);
          geo.setDrawRange(start, a.total - start);
        }
      });
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      clearTimeout(startTimer);
      intro?.kill();
      scrollTl?.scrollTrigger?.kill();
      scrollTl?.kill();
      cancelAnimationFrame(frame);
      io.disconnect();
      ro.disconnect();
      host.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);
      document.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      host.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div className={inline ? "globe-inline" : "globe-container"}>
      <div className={inline ? "globe-inline-model" : "globe-model"} ref={canvasDiv}>
        <div className="globe-rim"></div>
      </div>
    </div>
  );
};

export default ThreatGlobe;
