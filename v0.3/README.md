# chmonitor v0.3 — launch film

`chmonitor-v03-design-launch.mp4` — 20s · 1920×1080 · H.264 + AAC.
Optimized for X and LinkedIn.

A faithful render of the "chmonitor v0.3 Launch" Claude Design film
(claude.ai/design project *CHM v0.3 Release*).

## Scenes

1. **Intro** — logo + `v0.3`, "A full rebuild — here's what landed" (8 features · 70+ fixes · 13 perf wins · 3 breaking)
2. **The Dashboard** — Rebuilt on TanStack Start
3. **AI Agent** — Ask your cluster anything (over MCP)
4. **Query Monitoring** — Watch every query, live
5. **Data Query Explorer** — SQL console → dependency graph
6. **Topology & Health** — cluster topology → health summary
7. **And a lot more** — 15+ pages, 71 charts (montage)
8. **Self-host anywhere** — Cloudflare Workers / Docker / Kubernetes
9. **End card** — chmonitor.dev

## Re-rendering

The film is a self-contained, deterministic React timeline (`src/animations.jsx`)
mounted in `src/index.html` (React 18 + Babel standalone, loaded from CDN). It is
rendered by seeking its native `window.__seek(t)` clock frame-by-frame in headless
Chrome and encoding with ffmpeg.

```bash
cd src
bun add puppeteer-core        # uses an existing Chrome for Testing install
node render.mjs               # captures 600 frames (30fps × 20s) to frames/ at 2× supersample
ffmpeg -y -framerate 30 -i frames/f%05d.png -i music.mp3 \
  -vf "scale=1920:1080:flags=lanczos,format=yuv420p" \
  -c:v libx264 -profile:v high -preset slow -crf 16 \
  -c:a aac -b:a 192k -af "afade=out:st=19:d=1" \
  -t 20 -movflags +faststart ../chmonitor-v03-design-launch.mp4
```

`render.mjs` hardcodes a Chrome-for-Testing path — update `CHROME` to your local
install. Frames and `node_modules/` are gitignored.

## Assets

- `src/animations.jsx` — the film (scenes, timing, layout, copy)
- `src/index.html` — harness that mounts `<Video orientation="landscape">`
- `src/render.mjs` — puppeteer seek-and-screenshot renderer
- `src/music.mp3` — 20.5s music bed (ElevenLabs Music)
- `src/shots/*.png` — 12 product screenshots (from `apps/landing/public/landing-assets`)

## Notes

- A **9:16 vertical** cut is available from the same source — `Video` accepts
  `orientation="portrait"` (1080×1920).
- The end card reads `github.com/duyet/clickhouse-monitoring` (pre-rebrand). The
  repo is now `github.com/chmonitor/chmonitor` — update `EndScene` in
  `src/animations.jsx` before the next cut if desired.
