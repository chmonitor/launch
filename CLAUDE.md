# chmonitor/launch — Claude context

Launch video repository for [chmonitor](https://chmonitor.dev).
Each release folder holds the finished MP4 and the full source to reproduce or edit it.

## How the film works

Each version's film is a **self-contained React timeline** in `src/index.html`.
No build step — React 18 + Babel standalone load from CDN, so the file opens directly in a browser.

Key architecture:
- `Stage` — drives a `requestAnimationFrame` clock (0 → duration seconds)
- `Scene` — renders children only while `time` is within `[start, end]`
- `Sprite` / `TextSprite` / `ImageSprite` — composable animated elements
- `Frame` — a fake browser window showing a screenshot (`shots/*.png`)
- `VideoFrame` — same window, but driven by a live recording (`clips/*.mp4`); `currentTime` is set deterministically from scene clock
- `MontageScene` — cycles through a list of screenshots on a fixed interval
- `CaptionPanel` — the left-side label / title / line / pill-chips layout
- `Backdrop` — animated radial gradient background

The renderer (`src/render.mjs`) seeks the timeline frame-by-frame via `window.__seek(t)` and screenshots each frame with puppeteer, then ffmpeg encodes the PNG sequence.

## Repository layout

```
v0.3/
  chmonitor-v03-design-launch.mp4   finished film (LFS)
  README.md                         scenes list + re-render instructions
  src/
    index.html     film source (open in browser to preview live)
    animations.jsx extracted source (same content, for diffing)
    render.mjs     puppeteer frame capturer
    music.mp3      ~28s music bed (LFS)
    shots/         product screenshots (LFS, PNG)
    clips/         live screen recordings at constant 30fps (LFS, MP4)
```

## Adding or changing a scene

All scenes live inside the `<Video>` component in `src/index.html` (and mirrored in `src/animations.jsx`).

1. Add a `<Scene start={X} end={Y}>` block. Time is in seconds.
2. Use `<CaptionPanel>` for the left panel and `<Frame>` or `<VideoFrame>` for the right.
3. Adjust the `duration` prop on `<Stage>` and the ffmpeg `-t` flag in the render command.
4. Shift existing scene windows to make room if inserting mid-film.

## Adding a live recording

Screen recordings from macOS are VFR (variable frame rate) and seek inaccurately. Re-encode first:

```bash
ffmpeg -i screen.mov -vf "fps=30" -c:v libx264 -crf 18 -pix_fmt yuv420p -an \
  -movflags +faststart src/clips/<name>.mp4
```

Then reference it in a `<VideoFrame src="clips/<name>.mp4" trim={0} speed={1} />`.

## Re-rendering the MP4

```bash
cd v0.3/src
bun add puppeteer-core
node render.mjs           # captures frames/ at 2× supersample
ffmpeg -y -framerate 30 -i frames/f%05d.png -i music.mp3 \
  -vf "scale=1920:1080:flags=lanczos,format=yuv420p" \
  -c:v libx264 -profile:v high -preset slow -crf 16 \
  -c:a aac -b:a 192k -af "afade=out:st=26.9:d=1" \
  -t 27.9 -movflags +faststart ../chmonitor-v03-design-launch.mp4
```

Update the `CHROME` constant in `render.mjs` to your local Chrome for Testing path.

## Known issues / TODOs

- End card still reads `github.com/duyet/clickhouse-monitoring` (pre-rebrand). Update `EndScene` in `src/index.html` to `github.com/chmonitor/chmonitor` before the next cut.
- Two scenes use placeholder screenshots (AI Agent, Topology) — replace when `agent.mov` and `topology.mov` recordings are available.
- A 9:16 portrait cut is possible: pass `orientation="portrait"` to `<Video>`.

## GitHub Pages

The site is deployed automatically on push to `main` via `.github/workflows/pages.yml`.
Live player: `https://chmonitor.github.io/launch/v0.3/src/`
