# chmonitor v0.3 — remocn redesign

`chmonitor-v03-remocn-launch.mp4` — ~39s · 1280×720 · H.264.

A from-scratch redesign of the v0.3 launch film using [remocn](https://remocn.dev)
— a shadcn-style component registry of copy-paste Remotion animation
components — instead of the original hand-rolled Puppeteer/seek-and-screenshot
pipeline in [`../v0.3`](../v0.3). Same story, real product screenshots, built
as a declarative Remotion `<TransitionSeries>` composition.

## Scenes (19 beats)

1. **Logo bumper** — mark + wordmark on a moving dark grid
2. **Hook** — "ClickHouse monitoring, rebuilt from scratch." + a second
   crossfading line ("Live queries. AI insights. One dashboard.")
3. **Positioning** — `v0.3` badge + wordmark + tagline
4. **Dashboard reveal** — real screenshot, query activity heatmap
5. **Agent intro** — a *live simulated interaction*, not a screenshot: type a
   question, submit, load, get an answer, a "Answered in 1.2s" toast — built
   entirely from `AiPromptFlow` (`Input` + `Button` + `Skeleton` +
   `SkeletonBlock` + `Toast`)
6. **AI agent** — real screenshot, "Ask your cluster anything" (over MCP)
7. **Configure the agent** — real screenshot, MCP model + API key settings
8. **Live query monitoring** — real screenshot
9. **Slow queries** — real screenshot
10. **Data query explorer** — real screenshot, dependency graph
11. **Storage overview** — real screenshot, compression & disk usage
12. **AI insights** — real screenshot, severity-ranked findings
13. **Metrics & profiler** — real screenshot, memory peak view
14. **EXPLAIN as a tree** — real screenshot, execution plan
15. **Record breakers** — real screenshot, biggest tables & slowest queries
16. **Cluster topology** — real screenshot, Keeper quorum diagram
17. **PeerDB mirrors** — real screenshot, live replication status
18. **Proof** — "v0.3 by the numbers" (8 features · 70+ fixes · 13 perf wins ·
    71 charts) + a small `AnimatedBarChart` flourish
19. **Self-host anywhere** — monospace kicker with a blinking `Caret`,
    `docker compose up -d` terminal sim, deploy target chips
20. **GitHub stars** — real `chmonitor/chmonitor` star count (246) and recent
    stargazers, live-fetched via the GitHub API, via `GitHubStars`
21. **Outro** — logo lockup + `dash.chmonitor.dev`

## Transitions

Camera-motion presets (`whipPan`) are used sparingly for continuity; the
rest of the big structural cuts each use a distinct **shader-based** remocn
transition (`@remocn/*-dissolve`, built on `@paper-design/shaders-react`),
themed to the video's one-accent brand blue instead of their default
palettes:

| Cut | Transition | Why |
|---|---|---|
| Logo → Hook | `swirlDissolve` | mysterious build-up into the hook |
| Hook → Positioning | `ditherDissolve` | retro-tech texture for "rebuilt from scratch" |
| Positioning → Dashboard | `rippleZoom` | diving into the product |
| Dashboard → Agent intro | `warpDissolve` | bending space into the AI demo |
| Agent intro → Agent reveal | `smokeDissolve` | ethereal, matches the AI/agent theme |
| Agent reveal → feature run | `whipPan` | energetic kickoff (unchanged from before) |
| Last feature → Proof | `perlinDissolve` | organic noise-flash payoff into the numbers |
| Proof → CTA | `grainDissolve` | filmic push into self-host |
| CTA → GitHub stars | `waveWipe` | rising wave into the social-proof beat |
| GitHub stars → Outro | `fade` | calm close |

The 10 cuts *within* the feature-card montage stay plain `fade`s (6 frames) —
shader transitions are heavier to render and, at a rapid-fire ~1.4s-per-card
pace, would be visually noisy rather than "awesome." They're reserved for the
~10 big structural beat changes.

## Pacing

This cut is built for a fast-cut trailer feel rather than a slow product
walkthrough:

- Feature cards hold for **42 frames (~1.4s)** each, down from 68 (~2.3s).
- Transitions between feature cards are **6 frames**, down from 10.
- Every other scene (logo, hook, positioning, dashboard, agent, proof, CTA,
  outro) had its hold time cut by 30-45%, and every `@remotion/transitions`
  timing shortened to match.
- `AiPromptFlow`'s internal step timeline (see `components/remocn/ai-prompt-flow.tsx`)
  was compressed ~0.55x — the original type → submit → load → answer → toast
  arc took 234 frames (7.8s) just for that one micro-demo; compressed it
  resolves in ~138 frames.
- Despite adding 8 new beats (all 5 previously-unused screenshots, the new
  Agent intro, and the GitHub stars beat), total runtime (1173 frames / ~39s)
  is close to the original cut (1192 / ~40s) — much more content and far more
  motion, no bloat.

## Source layout

```
src/
  src/
    Video.tsx           TransitionSeries orchestrator — all scenes + transitions
    Root.tsx            registers the Launch16x9 composition
    theme.ts             chmonitor's real dark-mode OKLCH tokens + hex equivalents
                         for shader/JS-color-math components (one accent: brand blue)
    lib/
      fonts.ts           loads Geist/GeistMono and exposes them as the
                         --font-geist-sans/--font-geist-mono CSS vars every
                         remocn text component expects (see "Known issues")
      stargazers.ts      real chmonitor/chmonitor stargazer data (see below)
      remocn-ui/         RemocnUIProvider/useRemocnTheme + shared motion utils
    scenes/              one file per beat
    components/
      remocn/            installed remocn components (shadcn add @remocn/<name>) — you own this code
      ScreenshotFrame.tsx  real-screenshot beat: bordered frame + Ken Burns zoom + caption
      Logo.tsx, VersionBadge.tsx, SolidBg.tsx   small chmonitor-specific chrome
  public/screenshots/    13 real v0.3 dashboard screenshots (see below)
```

## Screenshots

All 13 real chmonitor v0.3 UI screenshots (captured 2026-07-05) are used in
this cut — nothing is held back. The 5 that were reserved for "a longer cut"
in the previous build (`05-storage-overview`, `07-ai-agent-settings`,
`08-record-breakers-stats`, `10-slow-queries`, `13-peerdb-mirrors-replication`)
are now folded into the feature-card run.

## GitHub stars data

`lib/stargazers.ts` holds all 246 real stargazers of `chmonitor/chmonitor`
(login, avatar URL, starred-at date), fetched once via the GitHub API and
committed as static data — not a placeholder count, and not a live network
call at render time. To refresh before the next re-render:

```bash
gh api -H "Accept: application/vnd.github.star+json" \
  "repos/chmonitor/chmonitor/stargazers?per_page=100" --paginate
```

then re-sort ascending by `starred_at` and regenerate the `CHM_STARGAZERS`
array. `GitHubStars` downsamples internally (`downsampleStargazers`, max 60),
so passing the full list is safe and gives the most accurate growth curve.

## Adding new remocn components

This project has a real `components.json` (registry alias `@remocn` →
`https://remocn.dev/r/{name}.json`), so components can be pulled with the
actual shadcn CLI instead of hand-copying from the docs site:

```bash
bunx shadcn@latest add @remocn/<component-name>
```

(`npx` doesn't work in every shell here — see "Known issues"; `bunx` is the
reliable one.) **Always run with `--dry-run` or `--diff` first** if the
component might share a dependency file with something already vendored and
patched — `@remocn/github-stars` ships its own copy of `number-wheel.tsx`
and would have silently reverted our `durationInFrames` fix (see below) had
we accepted the overwrite prompt without checking.

## Re-rendering

```bash
cd src
bun install
node_modules/.bin/remotion render src/index.ts Launch16x9 out/chmonitor-v0.3-remocn.mp4
```

`remotion.config.ts` pins a local Chrome-for-Testing browser, `chromeMode`,
GL renderer, and **concurrency 1** (see "Known issues" — this combination is
load-bearing, not arbitrary) and a webpack `@` alias to `src/` — update the
browser executable path for your machine if Remotion's own auto-download
misbehaves. Concurrency 1 makes this a genuinely slow render (~15 min for
the full ~39s video on this machine, vs. ~2 min before shader transitions
existed) — budget for that before iterating on timing.

## Known issues fixed in this build (upstream remocn bugs)

- **Every vendored text/UI component silently rendered the system font.**
  Every one of them references `var(--font-geist-sans)` / `var(--font-geist-mono)`
  — the CSS custom properties Next.js's `next/font` normally defines — but
  this is a bare Remotion app with no Next.js runtime, so those variables
  were never set and every component fell back to its `-apple-system,
  BlinkMacSystemFont` fallback. Fixed by loading Geist + GeistMono via
  `@remotion/google-fonts` (already installed, already used by
  `number-wheel`'s JetBrains Mono) and setting the two CSS vars once on the
  video root in `Video.tsx` (see `lib/fonts.ts`) — every component resolves
  correctly with zero edits to the 20 vendored files.
- **The pinned `chrome-headless-shell` browser can't run any shader
  transition.** All 8 `@remocn/*-dissolve` transitions are built on
  `@paper-design/shaders-react`, which needs a real WebGL2 context —
  `chrome-headless-shell` returns `null` from
  `canvasElement.getContext("webgl2")` and every shader transition throws
  `"Paper Shaders: WebGL is not supported in this browser"`. Fixed by
  pointing `Config.setBrowserExecutable` at the full Chrome-for-Testing
  build (same cached version, just not the stripped-down shell) and adding
  `Config.setChromiumOpenGlRenderer('swangle')` in `remotion.config.ts`.
- **Switching to the full Chrome build without also setting `chromeMode`
  silently launched it in legacy `--headless=old` mode.** `chromeMode`
  defaults to `'headless-shell'` regardless of what `setBrowserExecutable`
  points at, and Remotion picks `--headless=old` vs `--headless=new` from
  *that* setting, not from the actual binary. Old headless mode on the full
  Chrome-for-Testing build corrupted every frame into a faint partial
  double-exposure — subtle enough to miss in a quick glance, caught by
  diffing extracted frames against the `remotion still` versions. Fixed
  with `Config.setChromeMode('chrome-for-testing')`.
- **Concurrency 2 (or higher) with the full Chrome-for-Testing build
  silently corrupted every screenshot into a 2x2 tiled composite of
  itself** — 4 shrunk, cropped copies of the same frame content composited
  into one image, with no error or warning anywhere. `remotion still` never
  showed it (single page, always correct); only extracting frames from an
  actual `remotion render` output revealed it. Root-caused by rendering a
  cheap 21-frame range (`--frames=1055-1075`) at concurrency 2 (reproduced)
  vs. concurrency 1 (clean) before committing to a 15-minute full render —
  don't skip that step if you're tempted to bump concurrency back up.
  `Config.setConcurrency(1)` is the fix; it's genuinely slower but correct.
  If you need the speed back, the next thing to try is a newer/older Chrome-
  for-Testing version at concurrency 2, not this exact 1228 build.
- **`inline-highlight` and `github-stars` both had the same "root
  duration, not local Sequence" bug already documented below for
  `number-wheel`, but unpatched.** `inline-highlight` read
  `useVideoConfig().durationInFrames` (the *entire* composition's length) to
  schedule its color sweep at 20%–70% of that duration — inside a ~100-190
  frame `TransitionSeries.Sequence`, `frame` never got anywhere close to
  those thresholds, so the highlighted word never actually changed color.
  `github-stars` did the same for its odometer count-up and stargazer-list
  scroll — inside our ~130-frame scene it would have barely counted past 0.
  Added the same `durationInFrames` override prop pattern as `number-wheel`
  to both (see `Cta.tsx` and `GithubStars.tsx` usage) — confirmed via
  rendered stills that both now animate fully within their own scene.
- `tracking-in`, `inline-highlight`, and `staggered-fade-up` shipped with a
  hardcoded `background: "white"` on their root element instead of
  `"transparent"` (violates remocn's own "components render transparent"
  rule) — patched in the vendored copies under `components/remocn/`.
- `number-wheel` reads `useVideoConfig().durationInFrames` for its count-up
  pacing, which is the *root composition's* duration, not the local
  `TransitionSeries.Sequence` slice — added an optional `durationInFrames`
  prop override (see `Proof.tsx` usage).
- Several remocn text components (`TrackingIn`, `MicroScaleFade`,
  `InlineHighlight`, `StaggeredFadeUp`, `BottomUpLetters`) self-center via
  `position: absolute; inset: 0`, so stacking more than one as flex siblings
  makes them all overlap at frame center regardless of gap — wrap each in its
  own `position: relative` (or `absolute`, if a sibling needs `height: 100%`
  and would otherwise be flex-shrunk — see `AgentIntro.tsx`) sized box.
- `animated-bar-chart` hardcodes 60px of internal padding on every side —
  it isn't a prop. A box smaller than roughly 300×200 gives it a *negative*
  inner height and the bars silently fail to render at all (found this by
  rendering a still of `Proof.tsx` and seeing an empty chart) — don't shrink
  it past that floor.
- `npx` is broken in some non-interactive shells on this machine (a stale
  lazy-nvm shell function referencing `_load_nvm`, which isn't defined
  outside an interactive login shell) — use `bunx` instead for any
  `shadcn@latest add ...` command.
- `github-stars.tsx`'s numbered star badges (`#57`, `#58`, ...) count
  position *within the downsampled/animated list*, not the stargazer's true
  chronological rank out of all 246 — a minor labeling nuance of the
  upstream component, not something we patched.

## Notes

- One accent throughout: chmonitor's real brand blue (`oklch(0.55 0.22 265.638)`
  in `theme.ts`, hex fallback `#3361ef` for the remocn components that do
  JS-side color math — canvas/WebGL shaders, `interpolateColors()` — rather
  than letting the browser parse `oklch()` natively).
- `Video.tsx` wraps the whole tree in `RemocnUIProvider theme={CHM_THEME}
  mode="dark"` — needed for the handful of components (`AiPromptFlow`'s
  `Input`/`Button`/`Skeleton`/`Toast`) that read colors via `useRemocnTheme()`
  instead of taking explicit `CHM` color props; without a provider they
  default to remocn's light theme.
- No music bed yet (the original `v0.3/src/music.mp3` could be re-used via an
  `<Audio>` track in `Video.tsx`).
- Vertical (9:16) and square (1:1) social cuts are not yet built — the plan is
  a shorter highlight reel reusing `ScreenshotFrame` at different composition
  dimensions, tracked as follow-up work.
