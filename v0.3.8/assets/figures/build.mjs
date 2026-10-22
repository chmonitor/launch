// Fig: detached parts triage bench (chmonitor v0.3.8).
// A detached part rides a carriage past a block-range gauge that compares it with
// the active part of the same partition on this replica, then over four review
// trays. The trays are the four triage classes; none of them is "safe to drop".
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import * as k from "/home/duyet/.claude/skills/anatomy/kit/iso-kit.mjs";
import { kitScript } from "/home/duyet/.claude/skills/anatomy/scripts/inline-kit.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const theme = process.argv.includes("--light") ? "light" : "dark";
const WIDTH = 640;
const HEIGHT = 400;

const PLATE = { x: -150, y: -84, w: 300, d: 168, r: 8 };
const PLATE_H = 12;
const FOOT_H = 5;

// Block-range ruler and the active part it is measured against.
const RULER = { x: -132, y: -76, w: 264, d: 8, r: 1 };
const ACTIVE = { x: -96, y: -62, w: 150, d: 12, r: 1.5 }; // blocks 0..150 (scaled)
const ACTIVE_H = 6;

// Rails + carriage.
const RAIL_Y = [-36, -16];
const RAIL_FROM = -138;
const RAIL_TO = 138;
const CAR = { x: -18, y: -40, w: 36, d: 28, r: 3 };
const CAR_Z = 3;
const CAR_TOP = 8;
const PART = { x: -11, y: -34, w: 22, d: 16, r: 1 };
const PART_H = 9;

// Four review trays, one per class.
const TRAYS = [
  { name: "cannot_drop_via_sql", fill: 2 },
  { name: "needs_attention", fill: 3 },
  { name: "review_after_coverage_check", fill: 4 },
  { name: "review", fill: 2 },
];
const TRAY_W = 60;
const TRAY_D = 52;
const TRAY_H = 14;
const WALL = 2.2;
const TRAY_X = (i) => -132 + i * 68;
const TRAY_Y = 14;
const STOPS = TRAYS.map((_, i) => TRAY_X(i) + TRAY_W / 2);

const P = k.fitProjection(
  [...k.boxCorners(PLATE, -PLATE_H - FOOT_H, 0), [0, -60, 70], [PLATE.x + PLATE.w, PLATE.y + PLATE.d, 16]],
  WIDTH,
  HEIGHT,
  { pad: 28, azimuth: 40 },
);

const at = (p) => k.iso(p, P);
const S = (paths, style) => k.solidSvg(paths, style);
const L = (d, style) => k.lineSvg(d, style);
const D = (points, style) => k.dotsSvg(points, style);
const byDepth = (pts) => [...pts].sort((a, b) => k.depthOf([a[0], a[1], 0], P) - k.depthOf([b[0], b[1], 0], P));

function plate() {
  const out = [`<path class="iso-halo" d="${k.haloOf(PLATE, -PLATE_H - FOOT_H, PLATE_H, P)}"/>`];
  for (const [x, y] of byDepth(k.corners(PLATE, 22))) {
    out.push(S(k.cylinder(x, y, 7, -PLATE_H - FOOT_H, 1.6, P, 28), { tone: "lo" }));
    out.push(S(k.cylinder(x, y, 5.4, -PLATE_H - FOOT_H + 1.6, FOOT_H - 1.6, P, 28), { tone: "mid" }));
  }
  out.push(S(k.slabOf(PLATE, -PLATE_H, PLATE_H, P, 8, 1.6), { tone: "mid" }));
  out.push(L(k.planOutline(k.insetPlan(PLATE, 5), 0, P), { tone: "lo" }));
  const screws = k.corners(PLATE, 10);
  out.push(L(screws.map(([x, y]) => k.ring(x, y, 2.2, 0, P, 16)).join(""), { tone: "lo" }));
  out.push(D(screws.map(([x, y]) => at([x, y, 0])), { size: 0.5 }));
  // Label plate, front right, with three rule lines.
  const label = { x: 96, y: PLATE.y + PLATE.d - 14, w: 40, d: 8, r: 1 };
  out.push(S(k.slabOf(label, 0, 0.6, P, 3), { tone: "lo", crease: "none" }));
  out.push(D([at([label.x + 2, label.y + 4, 0.6]), at([label.x + label.w - 2, label.y + 4, 0.6])], { size: 0.4 }));
  return out.join("");
}

function gauge() {
  const out = [];
  // Ruler strip: block numbers along x.
  out.push(S(k.slabOf(RULER, 0, 0.6, P, 3), { tone: "lo", crease: "none" }));
  const t = k.topTicks(RULER.x + 4, RULER.x + RULER.w - 4, 4, 5, RULER.y + 0.8, 0.6, [2.2, 4], P);
  out.push(L(t.minor, { tone: "lo" }), L(t.major, { tone: "mid" }));
  out.push(D([at([RULER.x + 2, RULER.y + 4, 0.6]), at([RULER.x + RULER.w - 2, RULER.y + 4, 0.6])], { size: 0.45 }));
  // Active part of the partition: the reference bar.
  out.push(S(k.slabOf({ x: ACTIVE.x - 2, y: ACTIVE.y - 2, w: ACTIVE.w + 4, d: ACTIVE.d + 4, r: 2 }, 0, 2, P, 4, 0.4), { tone: "lo" }));
  out.push(S(k.slabOf(ACTIVE, 2, ACTIVE_H, P, 3, 0.5), { tone: "mid" }));
  out.push(L(k.planOutline(k.insetPlan(ACTIVE, 2), 2 + ACTIVE_H, P, 3), { tone: "faint" }));
  for (const x of [ACTIVE.x, ACTIVE.x + ACTIVE.w]) {
    out.push(S(k.slabOf({ x: x - 1.5, y: ACTIVE.y - 4, w: 3, d: 4, r: 0.6 }, 0, 12, P, 2), { tone: "mid" }));
  }
  // Bridge with a probe over the carriage path.
  for (const x of [-60, 60]) {
    out.push(S(k.slabOf({ x: x - 4, y: -50, w: 8, d: 8, r: 1.5 }, 0, 4, P, 3, 0.4), { tone: "lo" }));
    out.push(S(k.cylinder(x, -46, 2.6, 4, 42, P, 20), { tone: "mid", crease: "none" }));
  }
  out.push(S(k.slabOf({ x: -66, y: -50, w: 132, d: 8, r: 2 }, 46, 5, P, 4, 0.5), { tone: "mid" }));
  out.push(D([-56, -20, 20, 56].map((x) => at([x, -46, 51])), { size: 0.45 }));
  out.push(S(k.slabOf({ x: -6, y: -50, w: 12, d: 12, r: 1.5 }, 34, 12, P, 3, 0.4), { tone: "mid" }));
  out.push(S(k.cylinder(0, -44, 1.3, 20, 14, P, 16), { tone: "hi", crease: "none" }));
  return out.join("");
}

function rails() {
  const out = [];
  for (const y of RAIL_Y) {
    out.push(S(k.slabOf({ x: RAIL_FROM, y: y - 2.5, w: RAIL_TO - RAIL_FROM, d: 5, r: 1 }, 0, 3, P, 3, 0.4), { tone: "mid" }));
    out.push(D([RAIL_FROM + 6, 0, RAIL_TO - 6].map((x) => at([x, y, 3])), { size: 0.4 }));
  }
  for (const x of [RAIL_FROM - 5, RAIL_TO]) {
    out.push(S(k.slabOf({ x, y: -42, w: 5, d: 32, r: 1.2 }, 0, 7, P, 3, 0.5), { tone: "mid" }));
    out.push(D([at([x + 2.5, -38, 7]), at([x + 2.5, -14, 7])], { size: 0.45 }));
  }
  return out.join("");
}

function carriage() {
  const out = [`<path class="iso-halo" d="${k.haloOf(k.insetPlan(CAR, 3), CAR_Z, 0.1, P)}" style="filter:blur(4px)"/>`];
  out.push(S(k.slabOf(CAR, CAR_Z, CAR_TOP - CAR_Z, P, 5, 0.6), { tone: "mid" }));
  out.push(D([-13, 13].flatMap((x) => [at([x, CAR.y + 2.6, CAR_TOP]), at([x, CAR.y + CAR.d - 2.6, CAR_TOP])]), { size: 0.4, tone: "lo" }));
  // The detached part: the one lit thing.
  out.push(S(k.slabOf(PART, CAR_TOP, PART_H, P, 3, 0.6), { tone: "hi", lit: true }));
  out.push(L(k.planOutline(k.insetPlan(PART, 2), CAR_TOP + PART_H, P, 3), { tone: "faint" }));
  const knob = [CAR.x + CAR.w + 3, CAR.y + CAR.d / 2];
  out.push(S(k.cylinder(knob[0], knob[1], 3, CAR_Z, 5, P, 20), { tone: "mid" }));
  out.push(L(k.knurl(knob[0], knob[1], 3, CAR_Z, CAR_Z + 5, 18, P), { tone: "lo" }));
  return out.join("");
}

function tray(i) {
  const x0 = TRAY_X(i);
  const T = { x: x0, y: TRAY_Y, w: TRAY_W, d: TRAY_D, r: 2 };
  const out = [`<path class="iso-halo" d="${k.haloOf(T, 0, 2, P)}" style="filter:blur(3px)"/>`];
  out.push(S(k.slabOf(T, 0, 2, P, 4, 0.4), { tone: "lo" }));
  // back + left + right walls, then contents, then front wall.
  out.push(S(k.slabOf({ x: x0, y: TRAY_Y, w: TRAY_W, d: WALL, r: 0.6 }, 2, TRAY_H, P, 2), { tone: "mid" }));
  out.push(S(k.slabOf({ x: x0, y: TRAY_Y, w: WALL, d: TRAY_D, r: 0.6 }, 2, TRAY_H, P, 2), { tone: "mid" }));
  const parts = [];
  for (let n = 0; n < TRAYS[i].fill; n++) {
    parts.push([x0 + 8 + (n % 2) * 24, TRAY_Y + 8 + Math.floor(n / 2) * 20]);
  }
  for (const [px, py] of byDepth(parts)) {
    const plan = { x: px, y: py, w: 18, d: 12, r: 1 };
    out.push(S(k.slabOf(plan, 2, 6, P, 3, 0.4), { tone: i === 1 ? "hi" : "mid" }));
    out.push(L(k.planOutline(k.insetPlan(plan, 1.6), 8, P, 3), { tone: "faint" }));
  }
  out.push(S(k.slabOf({ x: x0 + TRAY_W - WALL, y: TRAY_Y, w: WALL, d: TRAY_D, r: 0.6 }, 2, TRAY_H, P, 2), { tone: "mid" }));
  out.push(S(k.slabOf({ x: x0, y: TRAY_Y + TRAY_D - WALL, w: TRAY_W, d: WALL, r: 0.6 }, 2, TRAY_H, P, 2), { tone: "mid" }));
  // Engraved index dots on the front wall top: tray 1..4.
  out.push(D(Array.from({ length: i + 1 }, (_, n) => at([x0 + 6 + n * 4, TRAY_Y + TRAY_D - WALL / 2, TRAY_H + 2])), { size: 0.5, tone: "hi" }));
  return out.join("");
}

const start = STOPS[2];
const svgBody = [
  plate(),
  gauge(),
  rails(),
  `<g data-part="carriage" transform="${k.translateAlong(P, [start, 0, 0])}">${carriage()}</g>`,
  ...byDepth(TRAYS.map((_, i) => [TRAY_X(i) + TRAY_W / 2, TRAY_Y + TRAY_D / 2, i])).map((c) => tray(c[2])),
];
const label =
  "A triage bench on a surface plate. A detached part rides a carriage under a block-range gauge that compares it with the active part of the same partition on this replica, then over four review trays: cannot drop via SQL, needs attention, review after coverage check, and review. No tray means safe to drop.";

// Standalone SVGs for the blog and video.
for (const t of ["dark", "light"]) {
  writeFileSync(join(HERE, `triage-bench-${t}.svg`), k.figureSvg({ width: WIDTH, height: HEIGHT, label, body: svgBody, standalone: t }));
}

const svg = k.figureSvg({ width: WIDTH, height: HEIGHT, label, body: svgBody });
const live = `
const P = ${JSON.stringify(P)};
const STOPS = ${JSON.stringify(STOPS)};
const NAMES = ${JSON.stringify(TRAYS.map((t) => t.name))};
const stage = document.querySelector(".iso-stage");
const car = stage.querySelector('[data-part="carriage"]');
const readout = document.querySelector("[data-readout]");
const still = matchMedia("(prefers-reduced-motion: reduce)");
let x = ${start}, idx = 2, last = 0, clock = 0, frame = 0, visible = false, touring = !still.matches, idle = 0;
function draw() {
  car.setAttribute("transform", translateAlong(P, [x, 0, 0]));
  const t = "tray " + (idx + 1) + " · " + NAMES[idx];
  if (readout.textContent !== t) readout.textContent = t;
  stage.setAttribute("aria-valuenow", String(idx + 1));
  stage.setAttribute("aria-valuetext", t);
}
function tick(now) {
  const dt = last ? Math.min((now - last) / 1000, 1 / 30) : 1 / 60; last = now;
  if (touring) { clock += dt; idx = Math.floor(clock / 2.4) % STOPS.length; }
  const target = STOPS[idx];
  x = still.matches ? target : x + (target - x) * (1 - Math.exp(-dt / 0.35));
  if (Math.abs(target - x) < 0.01) x = target;
  draw();
  frame = visible && (touring || x !== target) ? requestAnimationFrame(tick) : 0;
}
const run = () => { if (!frame && visible) { last = 0; frame = requestAnimationFrame(tick); } };
const steer = (i) => { touring = false; idx = i; clearTimeout(idle); idle = setTimeout(() => { touring = !still.matches; clock = idx * 2.4; run(); }, 3600); run(); };
new IntersectionObserver((e) => { visible = e[e.length - 1].isIntersecting; if (visible) run(); }).observe(stage);
stage.addEventListener("pointermove", (ev) => { const b = stage.getBoundingClientRect(); steer(Math.max(0, Math.min(3, Math.floor(((ev.clientX - b.left) / b.width) * 4)))); });
stage.addEventListener("keydown", (ev) => { if (ev.key === "ArrowRight") steer(Math.min(3, idx + 1)); else if (ev.key === "ArrowLeft") steer(Math.max(0, idx - 1)); else return; ev.preventDefault(); });
draw();
`;
const body = k.plateHtml({
  fig: "Fig 1",
  title: "Detached parts triage",
  hint: "Hover to move the part across the trays",
  readout: `tray 3 · ${TRAYS[2].name}`,
  keys: [
    { mark: "lit", label: "The detached part under review" },
    { mark: "raised", label: "Active part of the same partition on this replica" },
  ],
  caption:
    "Each detached part is measured against the active part of its partition on this replica, then sorted into one of four review classes. Coverage on one replica proves nothing about the others, so no class means safe to drop.",
  body: `<div class="iso-stage" tabindex="0" role="slider" aria-label="Triage bench: arrow keys move between trays" aria-valuemin="1" aria-valuemax="4" aria-valuenow="3">${svg}</div>`,
});
writeFileSync(join(HERE, theme === "light" ? "triage-bench-light.html" : "triage-bench.html"), k.pageHtml({ title: "Detached parts triage", theme, body, script: kitScript() + live }));
console.log("ok");
