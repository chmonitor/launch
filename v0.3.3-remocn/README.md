# chmonitor v0.3.3 — remocn launch wrap

`chmonitor-v033-remocn-4k-launch.mp4` — **3840×2160 (4K UHD) · 60fps** · original audio.

The main film is `chmonitor-v0.3-audio.mp4` (3680×2160), centered in the 4K
canvas with 80px black sides. remocn cards render at full 3840×2160. No crop.

Built with [remocn](https://remocn.dev) as a `<TransitionSeries>`.

## Beats

1. **Intro** — Soft Blur In `chmonitor.dev` on `bg.jpeg` + dithering; hold; Matrix Decode injects `v0.3`
3. **Main video** — the source file, full frame, original audio
4. **GitHub Stars** — `chmonitor/chmonitor` · 256 stars
5. **End** — Soft Blur In `chmonitor.dev`

## 4K canvas

The source recording is 3680×2160. Export is standard 4K UHD (3840×2160).
The recording is padded, not scaled or cropped. remocn open/close cards
render at 3840×2160. Source audio is copied through (`-c:a copy`).

## Re-render

```bash
cd src
bun install
node render.mjs
```

Writes `../chmonitor-v033-remocn-4k-launch.mp4`.

Studio preview of the full timeline (re-encodes the main video — preview
only):

```bash
bun run dev
# remotion studio → Launch
```
