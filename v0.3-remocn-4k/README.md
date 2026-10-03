# chmonitor v0.3 — remocn 4K rebuild

`chmonitor-v03-remocn-4k-launch.mp4` — ~29.7s · **3840×2160 (4K UHD)** · H.264 · 30fps.

A from-scratch rebuild of the v0.3 launch film — same brand and story as
[`../v0.3-remocn`](../v0.3-remocn) (the 720p remocn cut), rebuilt to use
**every piece of source material**: all 13 product screenshots **and** the 3
live screen recordings **and** the music bed, at full 4K, with oversized type
and shader-gradient shading on the text beats.

Built with [remocn](https://remocn.dev) — a shadcn-style registry of
copy-paste Remotion animation components — as a declarative
`<TransitionSeries>` composition.

## What changed vs. the 720p `v0.3-remocn` cut

| | `v0.3-remocn` (720p) | `v0.3-remocn-4k` (this) |
|---|---|---|
| Resolution | 1280×720 | **3840×2160** |
| Duration | ~39s (1173f) | ~29.7s (890f) — fits the 30s music bed |
| Video clips | none | **3 live recordings** (overview, queries, explorer) |
| Music | none | **v0.3 music bed**, 1s fade-out |
| Screenshots | 13 | **13** (same set; 2 now replaced by their live clips) |
| Type scale | standard remocn | **~1.5× larger** headlines, numbers, captions |
| Text-beat backgrounds | flat `SolidBg` | **shader grain-gradient** (Hook, Proof, CTA, Outro) |
| AgentIntro sim / Positioning / GithubStars | included | cut (real clips + full music prioritized) |

The 720p cut remains the canonical "everything incl. social proof" version;
this 4K cut is the tighter, higher-fidelity hero film.

## Scenes (19 beats)

1. **Logo bumper** — mark + wordmark + `v0.3` badge on the moving dark grid
2. **Hook** — "ClickHouse monitoring, / rebuilt from scratch." (two oversized
   stacked lines, second in brand blue) over a shader grain gradient
3. **The dashboard** — *live recording* (`overview.mp4`) in a floating browser
   card
4. **Ask your cluster anything** — real `06-ai-agent-chat` screenshot
5. **Running queries** — *live recording* (`queries.mp4`)
6. **Data explorer** — *live recording* (`explorer.mp4`)
7–16. **Feature montage** — 10 real screenshots, ~1.27s each, quick fades:
   AI insights · Cluster topology · Metrics & profiler · Storage overview ·
   Configure the agent · Record breakers · Slow queries · EXPLAIN as a tree ·
   PeerDB mirrors · Query activity
17. **Proof** — "v0.3 by the numbers" (8 features · 70+ fixes · 13 perf wins ·
    71 charts), big odometer numbers over a shader gradient + a small
    `AnimatedBarChart` flourish
18. **Self-host anywhere** — `docker compose up -d` terminal sim + deploy
    target chips, over a shader gradient
19. **Outro** — logo lockup + `dash.chmonitor.dev` over a shader gradient

## Transitions

The big structural cuts each use a distinct **shader-based** remocn transition
(`@remocn/*-dissolve`, themed to the one-accent brand blue); montage-internal
cuts stay quick 6-frame `fade`s.

| Cut | Transition |
|---|---|
| Logo → Hook | `swirlDissolve` |
| Hook → Dashboard | `rippleZoom` |
| Dashboard → Agent | `warpDissolve` |
| Agent → Queries | `smokeDissolve` |
| Queries → Explorer | `whipPan` |
| Explorer → Montage | `ditherDissolve` |
| Montage cards | `fade` (6f) |
| Last card → Proof | `perlinDissolve` |
| Proof → CTA | `grainDissolve` |
| CTA → Outro | `waveWipe` |

## The 4K trick: author at 720p, scale 3×

remocn components are tuned for the 1280×720 canvas. Rather than retune every
component's pixel size, the whole timeline is authored at 1280×720 and the
entire tree is wrapped in a `scale(3)` container (`Video.tsx`), with the
composition declared as 3840×2160 (`Root.tsx`):

```tsx
<Composition id="Launch4K" width={3840} height={2160} fps={30} ... />
// Video.tsx
<AbsoluteFill style={{ transform: 'scale(3)', transformOrigin: 'top left', width: 1280, height: 720 }}>
  ...all scenes...
</AbsoluteFill>
```

Vector text and the WebGL shaders render crisply at the 4K backbuffer. The
screenshots (1846–2732px wide) cover their ~2500px display size with minimal
upscale; the recordings (2886×2018) are downscaled, so they stay sharp.

## Music

The original `v0.3/src/music.mp3` (30.0s) is wired in as an `<Audio>` track at
the composition root, with a 1s volume fade over the final 30 frames. The cut
is timed to 890 frames (29.67s) so the music bed fits cleanly.

## Source layout

```
src/                         Remotion project root (package.json, remotion.config.ts)
  src/
    Video.tsx                TransitionSeries orchestrator + scale(3) 4K wrapper + <Audio>
    Root.tsx                 registers the Launch4K composition (3840×2160, 890f)
    theme.ts                 chmonitor dark-mode OKLCH tokens + hex equivalents
    lib/fonts.ts             Geist/GeistMono via @remotion/google-fonts
    scenes/                  one file per beat
    components/
      LiveClip.tsx           NEW — floating browser-card hero for the 3 video clips
      ScreenshotFrame.tsx    full-bleed screenshot beat (Ken Burns + big caption)
      remocn/                vendored remocn components (shadcn add @remocn/<name>)
  public/
    clips/                   overview.mp4, queries.mp4, explorer.mp4 (CFR 30fps)
    screenshots/             13 real v0.3 dashboard screenshots
    music.mp3                30s instrumental bed
```

## Re-rendering

```bash
cd src
bun install
node_modules/.bin/remotion render src/index.ts Launch4K out/chmonitor-v0.3-remocn-4k.mp4
```

`remotion.config.ts` pins the full Chrome-for-Testing build, `chromeMode:
'chrome-for-testing'`, the `swangle` GL renderer, and **concurrency 1** — this
combination is load-bearing (see `../v0.3-remocn/README.md` "Known issues":
concurrency ≥2 corrupts frames into 2×2 tiles; the headless-shell build has no
WebGL so every shader transition throws). 4K at concurrency 1 renders in
~10–15 min on an M-series Mac.

## Known issues (4K-specific)

- **`OffthreadVideo` crashed on `explorer.mp4` mid-render at 4K.** The
  compositor binary that extracts video frames (`@remotion/renderer`'s offthread
  compositor) quit with `SIGTERM` when seeking into the middle of the 14.8s
  `explorer.mp4` (`startFrom={30}`), taking the render down at frame 325. The
  other two clips (played from `startFrom=0`) were fine. **Fix:** every clip in
  `public/clips/` is pre-trimmed to exactly the segment shown and re-encoded
  clean — `-an -c:v libx264 -crf 18 -pix_fmt yuv420p -g 30 -bf 0 -movflags
  +faststart` — so the compositor reads sequentially from 0 with cheap
  keyframe seeks, no B-frame seeking. All `LiveClip` calls now use
  `startFrom=0`. If you swap in a fresh recording, re-trim/re-encode it the
  same way (see `v0.3/src/clips/` for the originals) or it may crash the
  render at the video beat.

## Notes

- One accent throughout: chmonitor's brand blue (`oklch(0.55 0.22 265.638)`,
  hex `#3361ef` for shader/JS-color-math components).
- `Video.tsx` wraps the tree in `RemocnUIProvider theme={CHM_THEME} mode="dark"`
  for the components that read colors via `useRemocnTheme()`.
- All upstream remocn bug fixes from the 720p cut (Geist CSS vars,
  `durationInFrames` overrides on `number-wheel`, transparent backgrounds on
  `tracking-in`/`inline-highlight`/`staggered-fade-up`, etc.) are carried over
  in the vendored `components/remocn/` copies.
