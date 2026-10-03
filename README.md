# chmonitor — launch

Launch videos and release assets for [chmonitor](https://chmonitor.dev), versioned by release.

<video src="v0.3/chmonitor-v03-design-launch.mp4" controls width="100%"></video>

Each release gets its own folder containing the finished video(s) and the full
source needed to re-render or edit them.

| Version | Folder | Highlights |
|---------|--------|------------|
| Hero film | [`hero-film/`](hero-film/) | 30s light-canvas motion showreel for the chmonitor.dev hero, cut to the music: real 2× dash captures, 3D camera dives, drill-down chart, alerts, light/dark reveal, AI agent, deploy hub. Built with HyperFrames. |
| v0.3.3 (remocn wrap) | [`v0.3.3-remocn/`](v0.3.3-remocn/) | Native 3680×2160 main film, remocn Soft Blur In `chmonitor.dev` / `v0.3` intro, GitHub Stars, Soft Blur In end card. Source video is stream-copied. |
| v0.3 | [`v0.3/`](v0.3/) | Full rebuild launch film — TanStack Start dashboard, AI agent, query monitoring, data explorer, topology & health, self-host. |
| v0.3 (remocn redesign) | [`v0.3-remocn/`](v0.3-remocn/) | Same v0.3 story, rebuilt with [remocn](https://remocn.dev) (Remotion component registry) instead of the Puppeteer/screenshot pipeline — real product screenshots, declarative `<TransitionSeries>`. |

## Conventions

- One folder per release (`v0.3/`, `v0.4/`, …).
- The finished MP4 lives at the folder root; reproducible source under `src/`.
- See each version's `README.md` for render instructions and notes.
