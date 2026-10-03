---
workflow: general-video
flow: automation
storyboard: no
message: "The ops dashboard for ClickHouse — see every query, merge and replica, with an AI advisor on top."
destination: landing-hero
aspect: "16:9"
length: 18s
language: en
audience: ClickHouse operators / data engineers landing on chmonitor.dev
---

## Intent

Showreel-grade 18s hero film for chmonitor.dev that replaces the dark v0.3 hero
video (`chmonitor/assets/videos/chmonitor-v0.3.mp4`). Premium motion design, cut
to the music, light canvas matching the landing + brand kit.

User's words (verbatim, adapted from the pasted brief): "Use actual product
screenshot/logo/assets … Must have music and motion must match the music, light
bg style, matched the design … people should pay $10000 for this video
production … should capture the real UI and components."

## Assets

- Real UI: live 2x light captures of dash.chmonitor.dev (demo host) + repo light
  screenshots (`chmonitor/assets/screenshots/*-light.png`).
- Brand: `apps/landing/public/brand/logo-chmonitor.svg`, `logo.svg`; tokens from
  `apps/landing/src/styles/globals.css` (brand #f54e00, ink #26251e, paper #ffffff,
  canvas-soft #fafafa, hairline #e7e6e2, success #1f8a65; logo bars #f97316 + cap #10b981).
- Fonts: Geist + Geist Mono (landing ships only these).
- Music: Pixabay "monume — product launch review" (already used for v0.3.3
  launch), 160 BPM, cut 69.114s→87.114s so the drop lands at t=3.0s.
- Reuse: 2.2s dark-mode clip of the old hero (Query Insights) for a theme-flip beat.

## Customizations

- Scene changes on the 3s phrase downbeats (0/3/6/9/12/15), accents on the
  160-BPM eighth grid (0.375s).
- Rebuilt-in-HTML dashboard components (stat cards, heatmap, query rows,
  health rows) so they stay sharp and can animate on beat.

## Notes

- HeyGen not signed in → offline; no BGM catalog; repo track used.
- Canvas 1920×1080. Landing `Hero.astro` currently declares 1920×1126 for the
  old video — adjust width/height attrs when wiring the new file.

---

## 2026-09-29 · v2 (30s, "studio" restyle)

User notes: new style not tied to the landing page, new music that fits the vibe,
more feature highlights, a strong first screen, 3D + motion design "like a
product intro by a large firm", keep a light background but change it (a clean
background image is fine, no AI slop).

- Music: ElevenLabs Music API (`music_v1`), 120 BPM premium keynote electronic,
  `assets/audio/v2/try1.mp3` (40s). Cut at 4.02s → `assets/audio/bgm-v2.mp3`:
  groove at 4.0, break 10.5–12, drop at 12.0, final hit at 28.0 (10ms peak-verified).
- Look: lit studio wall (warm off-white, soft sun, drifting window-light gobo,
  floor falloff), CSS 3D worlds per scene, one lateral camera direction across cuts.
- Scenes: open (3D extruded logo poster) · overview · queries · cluster · disk break ·
  alerts (drop) · AI agent · AI advisor · CLI & MCP · gallery wall · deploy · end.
- Previous 30s cut archived at `archive/index-30s-v1b-160bpm.html`.
