# chmonitor v0.3 — launch film

`chmonitor-v03-design-launch.mp4` — ~28s · 1920×1080 · H.264 + AAC.

A faithful render of the "chmonitor v0.3 Launch" Claude Design film
(claude.ai/design project *CHM v0.3 Release*).

## Scenes (13)

1.  **Intro** — logo + `v0.3`, "A full rebuild — here's what landed" (8 features · 70+ fixes · 13 perf wins · 3 breaking)
2.  **The Dashboard** — Rebuilt on TanStack Start *(live screen recording)*
3.  **AI Agent** — Ask your cluster anything (over MCP)
4.  **Query Monitoring** — Watch every query, live *(live screen recording)*
5.  **Data Query Explorer** — dependency graph → SQL console *(live screen recording)*
6.  **AI Insights** — anomalies & regressions, ranked by severity
7.  **Metrics & Profiler** — CPU / memory / IO + ClickHouse profiler events
8.  **Query EXPLAIN** — the EXPLAIN plan as a tree
9.  **Cluster Topology** — nodes, shards, replicas, Keeper quorum
10. **Health & Audit** — color-coded health → ready-made audit prompt
11. **And a lot more** — 15+ pages, 71 charts (montage)
12. **Self-host anywhere** — Cloudflare Workers / Docker / Kubernetes
13. **End card** — chmonitor.dev

## Re-rendering

The film is a self-contained, deterministic React timeline (`src/animations.jsx`)
mounted in `src/index.html` (React 18 + Babel standalone, loaded from CDN). It is
rendered by seeking its native `window.__seek(t)` clock frame-by-frame in headless
Chrome and encoding with ffmpeg.

```bash
cd src
bun add puppeteer-core        # uses an existing Chrome for Testing install
node render.mjs               # captures 837 frames (30fps × 27.9s) to frames/ at 2× supersample
ffmpeg -y -framerate 30 -i frames/f%05d.png -i music.mp3 \
  -vf "scale=1920:1080:flags=lanczos,format=yuv420p" \
  -c:v libx264 -profile:v high -preset slow -crf 16 \
  -c:a aac -b:a 192k -af "afade=out:st=26.9:d=1" \
  -t 27.9 -movflags +faststart ../chmonitor-v03-design-launch.mp4
```

`render.mjs` hardcodes a Chrome-for-Testing path — update `CHROME` to your local
install. Frames and `node_modules/` are gitignored.

## Assets

- `src/animations.jsx` — the film (scenes, timing, layout, copy)
- `src/index.html` — harness that mounts `<Video orientation="landscape">`
- `src/render.mjs` — puppeteer seek-and-screenshot renderer
- `src/music.mp3` — ~28s music bed (ElevenLabs Music)
- `src/shots/*.png` — product screenshots (from `apps/landing/public/landing-assets`)
- `src/clips/*.mp4` — live screen recordings (constant 30fps)

## Mixed media (video + screenshots)

Scenes use either a screenshot (`<Frame>`) or a live recording (`<VideoFrame>`).
`VideoFrame` drives the clip's `currentTime` from the scene clock
(`currentTime = trim + lt * speed`), so it renders deterministically frame-by-frame
just like the rest of the film — `render.mjs` waits for each `<video>` to finish
decoding (`readyState ≥ 2 && !seeking`) before each screenshot.

To add a recording: re-encode to **constant frame rate** first (macOS `.mov`
recordings are VFR and seek inaccurately), drop it in `src/clips/`, and point a
scene's `VideoFrame src` at it.

```bash
ffmpeg -i screen.mov -vf "fps=30" -c:v libx264 -crf 18 -pix_fmt yuv420p -an \
  -movflags +faststart src/clips/<name>.mp4
```

## Notes

- A **9:16 vertical** cut is available from the same source — `Video` accepts
  `orientation="portrait"` (1080×1920).
- The end card reads `github.com/duyet/clickhouse-monitoring` (pre-rebrand). The
  repo is now `github.com/chmonitor/chmonitor` — update `EndScene` in
  `src/animations.jsx` before the next cut if desired.
