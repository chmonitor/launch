# chmonitor — hero film

Motion-graphics hero film for [chmonitor.dev](https://chmonitor.dev): a 30s
showreel cut to the music, on a light canvas, built from real product UI.
It replaces the dark v0.3 hero video.

Built with [HyperFrames](https://hyperframes.heygen.com): a single HTML
composition (`index.html`) with one seekable GSAP timeline.

| File | What |
|---|---|
| `renders/chmonitor-hero-30s-v2.mp4` | **Final v2**: "studio" restyle · 1920×1080 · 60fps · 30s · new music |
| `renders/chmonitor-hero-30s.mp4` | v1b: 160 BPM showreel (source: `archive/index-30s-v1b-160bpm.html`, music `assets/audio/bgm30.mp3`) |
| `renders/chmonitor-hero-18s-v1.mp4` | First cut: 18s, landing-style (source: `archive/index-v1-18s.html`) |

## Beats (v2 · 120 BPM, kick every 0.5s)

| t | Scene | Motion |
|---|---|---|
| 0–4 | Open | Poster frame: 3D extruded logo on a lit studio wall; the camera orbits, bars pulse on the arp, then the camera dives and orange bars wipe the frame |
| 4–6 | 01 · Overview | Real dashboard cards on a tilted desk lift off on the kick |
| 6–8 | 02 · Queries | Running-queries panel; the slow query counts up and gets flagged |
| 8–10.5 | 03 · Cluster | 3D topology floor: shards, replicas and Keeper; replication pulses on the beat |
| 10.5–12 | Break | Disk gauge fills to 93.7% in the quiet bar |
| 12–14 | 04 · Alerts | On the drop: flash, shockwave, and Slack / PagerDuty / Discord / Opsgenie alerts fly in from depth |
| 14–16.5 | 05 · AI Agent | The question is typed and the answer streams in |
| 16.5–18.5 | 06 · AI Advisor | Projection, skip index, PREWHERE and MV cards flip in |
| 18.5–20.5 | 07 · CLI & MCP | `chm doctor` output next to connected MCP clients |
| 20.5–24 | Gallery | A curved wall of 12 real pages spins past: "One place for all of it." |
| 24–28 | 08 · Deploy | Platform tiles rise on the beat; `docker run` is typed |
| 28–30 | End | On the final hit: logo, chmonitor, tagline, chips, CTA |

## Assets

- `assets/ui/app-*.png`, `card-*.png`, `chart-*.png`, `pill-online*.png`:
  live 2× light captures of `dash.chmonitor.dev` (demo host).
- `assets/ui/*-light.png`: repo screenshots (`chmonitor/assets/screenshots`).
- `assets/ui/dark-painterly.jpg`: `apps/landing/public/assets/backgrounds/hero-bg-1.jpeg`.
- `assets/video/dark-insights.mp4`: 2.2s cut from the old hero (`chmonitor-v0.3.mp4`, 12.3s).
- `assets/audio/bgm-v2.mp3`: ElevenLabs Music (`music_v1`) 120 BPM keynote track,
  source `assets/audio/v2/try1.mp3` cut 4.02s → 34.02s.
- `assets/audio/bgm30.mp3` (v1b): Pixabay "monume — product launch review",
  69.024s → 99.024s (already used by the v0.3.3 launch).
- Fonts: Geist + Geist Mono (the landing's fonts).

## Edit & render

```bash
npx hyperframes preview --background   # Studio preview
npx hyperframes check                  # lint + runtime + layout + contrast
npx hyperframes render -q delivery -f 60 -o renders/chmonitor-hero-30s-v2.mp4
```

Retiming: v2 cuts sit on a fixed 0.5s grid (`B` in `index.html`) from the
music map: groove at 4.0, break 10.5–12, drop at 12.0, final hit at 28.0. If you
swap the music, find the new section onsets with a 10ms `astats` peak scan and
move the audio cut, not the animation.
