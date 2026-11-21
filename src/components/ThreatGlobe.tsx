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

// Latitude/longitude (degrees) to a point on the sphere.
function latLonToVec(lat: number, lon: number, r: number) {
  const phi = ((90 - lat) * Math.PI) / 180;
  const theta = ((lon + 180) * Math.PI) / 180;
  return new THREE.Vector3(-r * Math.sin(phi) * Math.cos(theta), r * Math.cos(phi), r * Math.sin(phi) * Math.sin(theta));
}

// World map outlines (coastlines bright, country borders faint), loaded after the globe appears.
async function buildMapOutlines() {
  const [{ mesh }, world] = await Promise.all([
    import("topojson-client"),
    import("world-atlas/countries-110m.json"),
  ]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const topo = ((world as any).default ?? world) as any;
  const toSegments = (lines: number[][][]) => {
    const pts: number[] = [];
    for (const line of lines) {
      for (let i = 0; i < line.length - 1; i++) {
        const a = latLonToVec(line[i][1], line[i][0], RADIUS * 1.003);
        const b = latLonToVec(line[i + 1][1], line[i + 1][0], RADIUS * 1.003);
        pts.push(a.x, a.y, a.z, b.x, b.y, b.z);
      }
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
    return geo;
  };
  const coast = mesh(topo, topo.objects.countries, (a, b) => a === b);
  const borders = mesh(topo, topo.objects.countries, (a, b) => a !== b);
  const group = new THREE.Group();
  const coastMat = new THREE.LineBasicMaterial({ color: "#a5f3fc", transparent: true, opacity: 0 });
  const borderMat = new THREE.LineBasicMaterial({ color: "#22d3ee", transparent: true, opacity: 0 });
  group.add(new THREE.LineSegments(toSegments(coast.coordinates), coastMat));
  group.add(new THREE.LineSegments(toSegments(borders.coordinates), borderMat));
  return { group, coastMat, borderMat };
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
    new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.14 })
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

  return { globe, core, shell, arcs, rings, sat };
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

    const { globe, core, arcs, rings, sat } = buildGlobe();
    const root = new THREE.Group(); // scroll timeline moves this
    const tilt = new THREE.Group(); // mouse moves this
    const spin = new THREE.Group(); // dragging rotates this, in any direction
    spin.add(globe);
    tilt.add(spin, rings);

    // map outlines fade in once the (small, lazily loaded) world data arrives
    let disposed = false;
    let mapFade: gsap.core.Tween[] = [];
    buildMapOutlines()
      .then(({ group, coastMat, borderMat }) => {
        if (disposed) return;
        globe.add(group);
        mapFade = [
          gsap.to(coastMat, { opacity: 0.75, duration: 1.6, ease: "power2.out" }),
          gsap.to(borderMat, { opacity: 0.22, duration: 1.6, ease: "power2.out" }),
        ];
      })
      .catch(() => {});
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
    }, 60);

    const mouse = { x: 0, y: 0 };
    const onMouseMove = (e: MouseEvent) => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    document.addEventListener("mousemove", onMouseMove);

    // Drag the globe to rotate it freely (any direction), with momentum.
    // It only grabs when the pointer is on the globe itself, so the rest of the page scrolls as usual.
    const raycaster = new THREE.Raycaster();
    const ndc = new THREE.Vector2();
    const hitsGlobe = (x: number, y: number) => {
      if (Number(getComputedStyle(host).opacity) < 0.2) return false;
      const r = renderer.domElement.getBoundingClientRect();
      if (x < r.left || x > r.right || y < r.top || y > r.bottom) return false;
      ndc.set(((x - r.left) / r.width) * 2 - 1, -((y - r.top) / r.height) * 2 + 1);
      raycaster.setFromCamera(ndc, camera);
      return raycaster.intersectObject(core, false).length > 0;
    };
    const isControl = (el: EventTarget | null) =>
      el instanceof Element && !!el.closest("a, button, input, textarea, select, .orbit-item");
    let dragging = false;
    let hovering = false;
    let lastX = 0;
    let lastY = 0;
    const vel = { x: 0, y: 0 }; // radians per frame
    const axisX = new THREE.Vector3(1, 0, 0);
    const axisY = new THREE.Vector3(0, 1, 0);
    const qTmp = new THREE.Quaternion();
    const rotateBy = (dx: number, dy: number) => {
      qTmp.setFromAxisAngle(axisY, dx);
      spin.quaternion.premultiply(qTmp);
      qTmp.setFromAxisAngle(axisX, dy);
      spin.quaternion.premultiply(qTmp);
    };
    const dragStart = (x: number, y: number) => {
      dragging = true;
      lastX = x;
      lastY = y;
      vel.x = vel.y = 0;
      document.documentElement.style.cursor = "grabbing";
    };
    const dragMove = (x: number, y: number) => {
      const k = 0.006;
      vel.x = (x - lastX) * k;
      vel.y = (y - lastY) * k;
      rotateBy(vel.x, vel.y);
      lastX = x;
      lastY = y;
    };
    const dragEnd = () => {
      if (!dragging) return;
      dragging = false;
      document.documentElement.style.cursor = hovering ? "grab" : "";
    };
    // mouse / pen
    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType === "touch" || e.button !== 0 || isControl(e.target)) return;
      if (!hitsGlobe(e.clientX, e.clientY)) return;
      e.preventDefault();
      dragStart(e.clientX, e.clientY);
    };
    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      if (dragging) dragMove(e.clientX, e.clientY);
      else {
        const over = !isControl(e.target) && hitsGlobe(e.clientX, e.clientY);
        if (over !== hovering) {
          hovering = over;
          document.documentElement.style.cursor = over ? "grab" : "";
        }
      }
    };
    // touch: a finger on the globe rotates it; anywhere else scrolls the page
    const onTouchStart = (e: TouchEvent) => {
      const t = e.touches[0];
      if (e.touches.length !== 1 || isControl(e.target) || !hitsGlobe(t.clientX, t.clientY)) return;
      dragStart(t.clientX, t.clientY);
    };
    const onTouchMove = (e: TouchEvent) => {
      if (!dragging) return;
      e.preventDefault();
      dragMove(e.touches[0].clientX, e.touches[0].clientY);
    };
    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", dragEnd);
    window.addEventListener("pointercancel", dragEnd);
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", dragEnd);
    window.addEventListener("touchcancel", dragEnd);

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
      if (!dragging) {
        // momentum after a drag eases off, and the slow auto-spin carries on
        vel.x *= 0.95;
        vel.y *= 0.95;
        if (Math.abs(vel.x) + Math.abs(vel.y) > 0.0001) rotateBy(vel.x, vel.y);
        globe.rotation.y += 0.002;
      }
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
      disposed = true;
      mapFade.forEach((tw) => tw.kill());
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", dragEnd);
      window.removeEventListener("pointercancel", dragEnd);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", dragEnd);
      window.removeEventListener("touchcancel", dragEnd);
      document.documentElement.style.cursor = "";
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
