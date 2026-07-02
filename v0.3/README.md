# chmonitor v0.3 — launch film

`chmonitor-v03-design-launch.mp4` — ~31s · 1920×1080 · H.264 + AAC.

A redesigned cut of the chmonitor v0.3 launch film. The look is deliberately
un-generic — a flat instrument-panel ground with a faint measurement grid, an
editorial numbered-cue system with ruled kickers and mask-revealed titles, flat
monospace "spec" tags in place of glassy pills, a hairline product window (no
traffic-light chrome), and a persistent film rail (index · progress · domain).
The score is an original, deterministic synth bed (no stock/AI track).

## Scenes (14 cues · 11 numbered features)

1.  **Intro** — logo + `v0.3`, "A full rebuild. Here's what shipped." (20 features · 120+ fixes · 15+ perf wins · 3 breaking, count-up)
2.  **The Dashboard** — rebuilt on TanStack Start, 71 edge-cached charts *(live recording)*
3.  **AI Agent** `NEW` — ask your cluster anything, over MCP, any LLM
4.  **Query Monitoring** — running / slow / failed queries, live *(live recording)*
5.  **SQL Console** `NEW` — multi-query results, database tree, live dependency graph *(live recording)*
6.  **AI Insights** `NEW` — anomalies & regressions, ranked by severity
7.  **Alerts** `NEW` — threshold alerts as browser notifications, on by default *(rendered card, no screenshot)*
8.  **Metrics & Profiler** — CPU / memory / IO + ClickHouse profiler events
9.  **Query EXPLAIN** — the EXPLAIN plan as a tree
10. **Cluster Topology** — nodes, shards, replicas, Keeper quorum
11. **Health & Audit** — color-coded health → ready-made audit prompt
12. **And a lot more** — 15+ pages, 71 charts; expensive queries, MCP server, replication (montage)
13. **Deploy anywhere** — Cloudflare Workers / Docker / Kubernetes; pluggable auth (none · Clerk · trusted proxy)
14. **End card** — chmonitor.dev · github.com/chmonitor/chmonitor

The timeline is **data-driven**: cue durations live in `buildCues()` in
`src/index.html`, and start/end times (with 0.15s cross-fade overlaps) plus the
total duration are derived automatically. To retime or reorder, edit that array —
`<Stage duration>` and the render both read the computed total via `window.__duration`.

## Self-contained runtime (no CDN)

The film no longer loads anything from a CDN. React 18, ReactDOM and Babel
standalone are vendored under [`src/vendor/`](src/vendor/), and the Space Grotesk
/ JetBrains Mono latin subsets under [`src/fonts/`](src/fonts/). This makes the
render fully offline and deterministic, and keeps GitHub Pages self-hosting the
player. (The Lottie pulse-ring dependency was removed in the redesign.)

## Re-rendering

The film is a self-contained, deterministic React timeline (`src/animations.jsx`)
mounted in `src/index.html`. It is rendered by seeking its native
`window.__seek(t)` clock frame-by-frame in headless Chrome and encoding with ffmpeg.

```bash
cd src
bun add puppeteer-core                  # first time only
CHROME=/path/to/chrome node render.mjs  # captures 933 frames (30fps × 31.1s) to frames/ at 2× supersample
ffmpeg -y -framerate 30 -i frames/f%05d.png -i music.mp3 \
  -vf "scale=1920:1080:flags=lanczos,format=yuv420p" \
  -c:v libx264 -profile:v high -preset slow -crf 16 \
  -c:a aac -b:a 192k -af "afade=out:st=30.1:d=1" \
  -t 31.1 -movflags +faststart ../chmonitor-v03-design-launch.mp4
```

`render.mjs` reads the total length from `window.__duration` and takes the Chrome
path from `$CHROME` (any Chromium works). Frames and `node_modules/` are gitignored.

## Assets

- `src/index.html` — the film (harness + engine + scenes); open in a browser to preview
- `src/animations.jsx` — the babel script block mirrored for diffing
- `src/render.mjs` — puppeteer seek-and-screenshot renderer
- `src/vendor/*` — React / ReactDOM / Babel standalone (vendored, no CDN)
- `src/fonts/*` — Space Grotesk + JetBrains Mono (latin woff2) + `fonts.css`
- `src/music.mp3` — original ~32s synth bed (deterministic; see *Music* below)
- `src/shots/*.png` — product screenshots (Git LFS)
- `src/clips/*.mp4` — live screen recordings, constant 30fps (Git LFS)

## Music

`src/music.mp3` is an original, fully synthesized bed — a steady "monitor pulse"
kick, a warm plucked bass, an arp and a soft pad over an Am–F–C–G loop, computed
sample-by-sample (no samples, no stock/AI track) so it is reproducible. It has a
soft intro, a fuller body and a gentle outro; the final 1s fade is applied by
ffmpeg at render time. Regenerate it deterministically with:

```bash
cd src
node scripts/synth-music.mjs music.wav
ffmpeg -y -i music.wav \
  -af "highpass=f=30,lowpass=f=15800,alimiter=limit=0.97:level=false" \
  -c:a libmp3lame -b:a 192k music.mp3 && rm music.wav
```

## Continuous rendering (CI)

`.github/workflows/render.yml` re-renders the film and commits the finished LFS
media (the MP4 and the synthesized `music.mp3`) back whenever the **source**
changes on `main` (or on manual dispatch). This lets the reproducible source land
via PR while CI produces the binaries — useful when a contributor's environment
can't push Git LFS objects. The workflow only triggers on source paths, never on
the media it writes, so it cannot loop.

## Mixed media (video + screenshots)

Scenes use a screenshot (`Frame`), a live recording (`VideoFrame`), a cycling
montage (`MontageScene`) or a fully-rendered mock (the Alerts cards).
`VideoFrame` drives the clip's `currentTime` from the scene clock
(`currentTime = trim + lt * speed`) so it renders deterministically frame-by-frame;
`render.mjs` waits for each `<video>` to finish decoding before each screenshot.

To add a recording, re-encode to **constant frame rate** first (macOS `.mov`
captures are VFR and seek inaccurately), drop it in `src/clips/`, and point a
scene's `VideoFrame src` at it:

```bash
ffmpeg -i screen.mov -vf "fps=30" -c:v libx264 -crf 18 -pix_fmt yuv420p -an \
  -movflags +faststart src/clips/<name>.mp4
```

## Notes

- A **9:16 vertical** cut is available from the same source — `Video` accepts
  `orientation="portrait"` (1080×1920); all layout constants switch via `PORT`.
- The end card now reads `github.com/chmonitor/chmonitor` (the old pre-rebrand
  `duyet/clickhouse-monitoring` URL was fixed in this cut).
