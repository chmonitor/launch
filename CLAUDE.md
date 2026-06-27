# chmonitor/launch — Claude context

This repo holds launch films for each chmonitor release.
Each version gets its own folder (`v0.3/`, `v0.4/`, …) with a finished MP4 and the full source to re-render or edit it.

---

## Making a launch film for the next release

### Step 1 — Read the CHANGELOG

The source of truth for what changed is the chmonitor repo at `github.com/chmonitor/chmonitor`.

```bash
# Clone or pull the latest main
git -C ~/project/chmonitor/chmonitor pull --ff-only

# Read the changelog
cat ~/project/chmonitor/chmonitor/CHANGELOG.md | head -200
```

The CHANGELOG follows [Keep a Changelog](https://keepachangelog.com) with semantic version headers:

```
## [0.4.0] - 2026-xx-xx
### Added
- ...
### Changed / Fixed / Removed
- ...
```

Extract the `## [X.Y.Z]` block for the target version. That block is the raw material for the film script.

Also check the GitHub release notes for a polished summary:
```bash
gh release view v0.4.0 --repo chmonitor/chmonitor
```

### Step 2 — Distil into scenes

A launch film has 10–14 scenes, ~2s each, totalling 20–30s. Each scene = one headline feature.

Rules of thumb:
- **Pick 4–6 flagship features** — the ones that would headline a tweet.
- **Keep 2–3 "live recording" scenes** for the most interactive features (the most impressive things to watch happen).
- **Montage scene** for everything else ("15+ pages, 71 charts").
- Always start with Intro + stats and end with Self-host + End card.
- Never cut what's already there without a reason — carry forward scenes that are still true.

Map CHANGELOG entries to scenes like this:

| CHANGELOG entry | Scene type | Label |
|-----------------|-----------|-------|
| New page / major UI | `Frame` + `CaptionPanel` | Feature name |
| Core workflow (live) | `VideoFrame` + `CaptionPanel` | Feature name |
| AI / agent feature | `Frame` or `VideoFrame` | "NEW" chip |
| Performance win | Mention in Intro stats or chip | — |
| Bug fixes / infra | Intro stats counter only | — |

Update the Intro stats block with real numbers from the CHANGELOG:
- **features** = count of "Added" headlines
- **fixes** = count of "Fixed" entries
- **perf wins** = count of "Performance" or speed entries
- **breaking** = count of "Breaking" entries

### Step 3 — Copy the previous version's folder

```bash
cp -r v0.3 v0.4
cd v0.4
```

Rename the output file:
```bash
mv chmonitor-v03-design-launch.mp4 chmonitor-v04-design-launch.mp4
```

Update `README.md` — change the version, duration, scene list, and re-render command.

### Step 4 — Edit the film script

All scenes live in **`src/index.html`** (and mirrored in `src/animations.jsx`).
Open `src/index.html` in an editor. The structure is:

```jsx
function Video({ orientation }) {
  return (
    <Stage width={1920} height={1080} duration={27.9} ...>
      <Backdrop />
      <ScreenClock />

      <Scene start={0} end={3.0}>
        {(lt) => <IntroScene lt={lt} L={L} />}
      </Scene>

      <Scene start={2.85} end={5.0}>
        {(lt) => (
          <>
            <CaptionPanel label="THE DASHBOARD" title="..." line="..." chips={[...]} />
            <VideoFrame src="clips/overview.mp4" ... />
          </>
        )}
      </Scene>
      ...
    </Stage>
  )
}
```

**To update copy for an existing scene**, find its `<CaptionPanel>` and edit `label`, `title`, `line`, and `chips`.

**To add a new scene** for a new feature:

```jsx
<Scene start={X} end={X + 2.1}>
  {(lt) => (
    <>
      <CaptionPanel
        lt={lt} L={L}
        label="FEATURE NAME · NEW"
        title="Headline in ~4 words."
        line="One sentence describing what it does and why it matters."
        chips={[
          { text: 'Chip 1', color: ORANGE },
          { text: 'Chip 2', color: GREEN },
          { text: 'Chip 3', color: ORANGE },
        ]}
      />
      <Frame
        lt={lt} L={L}
        url="dash.chmonitor.dev/your-route"
        src={R('shotKey', 'shots/your-shot.png')}
      />
    </>
  )}
</Scene>
```

Time windows must be contiguous with 0.15s overlaps for cross-fades (e.g. scene A ends at 5.0, scene B starts at 4.85).

**After adding/removing scenes**, update the `<Stage duration={...}>` prop and the ffmpeg `-t` flag to match the new total length.

**To add a live recording**, see the *Adding a live recording* section below.

### Step 5 — Collect assets

**Screenshots** — take from a live chmonitor instance at `dash.chmonitor.dev` or locally. Crop to the content area. Drop in `src/shots/`. The v0.3 shots live at `apps/landing/public/landing-assets/` in the main repo; copy and rename as needed.

**Screen recordings** — record the feature in action. macOS recordings are VFR; re-encode:
```bash
ffmpeg -i screen.mov -vf "fps=30" -c:v libx264 -crf 18 -pix_fmt yuv420p -an \
  -movflags +faststart src/clips/<name>.mp4
```
Reference in a `<VideoFrame src="clips/<name>.mp4" trim={0} speed={1} />`.

### Step 6 — Preview in browser

Open `src/index.html` directly in Chrome. The film plays in a Stage player with play/pause/scrub. Use this to verify every scene before rendering.

```bash
open src/index.html
```

### Step 7 — Render the MP4

```bash
cd src
bun add puppeteer-core        # first time only
# Update the CHROME path in render.mjs to your Chrome for Testing install
node render.mjs               # captures frames/ (30fps × duration)
ffmpeg -y -framerate 30 -i frames/f%05d.png -i music.mp3 \
  -vf "scale=1920:1080:flags=lanczos,format=yuv420p" \
  -c:v libx264 -profile:v high -preset slow -crf 16 \
  -c:a aac -b:a 192k -af "afade=out:st=<duration-1>:d=1" \
  -t <duration> -movflags +faststart ../chmonitor-v<XY>-design-launch.mp4
```

Replace `<duration>` with the `<Stage duration={...}>` value.

### Step 8 — Commit and push

```bash
git add v0.4/
git commit -m "feat(v0.4): chmonitor v0.4 launch film"
git push
```

GitHub Actions deploys to Pages automatically. The new version appears at `https://chmonitor.github.io/launch/` — add a card to `index.html` following the existing pattern.

---

## Film architecture reference

Each version's film is a **self-contained React timeline** in `src/index.html`.
No build step — React 18 + Babel standalone load from CDN.

| Component | Role |
|-----------|------|
| `Stage` | `requestAnimationFrame` clock, play/pause, scrub bar |
| `Scene` | renders children only while `time ∈ [start, end]`; fades at edges |
| `Backdrop` | animated radial gradient background |
| `CaptionPanel` | left panel: label / title / body line / pill chips |
| `Frame` | fake browser window around a screenshot |
| `VideoFrame` | same, but plays a clip — `currentTime` driven by scene clock |
| `MontageScene` | rapid-cycles a list of screenshots (0.5s each) |
| `IntroScene` | logo + version badge + 4-stat row |
| `HostScene` | self-host platforms (Cloudflare / Docker / Kubernetes) |
| `EndScene` | logo + domain + version badge |

The renderer (`render.mjs`) drives the timeline via `window.__seek(t)` and screenshots every frame with Puppeteer, then ffmpeg encodes the PNG sequence + music.

## Timing rules

- Scene windows overlap by **0.15s** on each edge for cross-fades: scene A `[X, Y]`, scene B `[Y-0.15, Z]`.
- `<Stage duration>` = last scene's `end` time.
- ffmpeg `-t` = `<Stage duration>`.
- ffmpeg `-af "afade=out:st=<duration-1>:d=1"` — 1s music fade at the end.
- The render captures `Math.ceil(duration × 30)` frames at 30fps.

## Portrait cut (9:16)

Pass `orientation="portrait"` to `<Video>` and render at 1080×1920. All layout constants switch automatically via the `PORT` config object. Useful for Instagram Reels / TikTok / YouTube Shorts.

## Adding a live recording

macOS `.mov` screen captures are VFR and seek inaccurately. Always re-encode to CFR first:

```bash
ffmpeg -i screen.mov -vf "fps=30" -c:v libx264 -crf 18 -pix_fmt yuv420p -an \
  -movflags +faststart src/clips/<name>.mp4
```

Then use in a scene:
```jsx
<VideoFrame lt={lt} L={L} url="dash.chmonitor.dev/route" src="clips/<name>.mp4" trim={0} speed={1} />
```

`trim` = start offset in seconds into the clip.
`speed` = playback rate (1 = real-time, 0.5 = half speed for slow reveals).

## Music

`src/music.mp3` is a ~30s instrumental bed. Replace it to change the feel.
Fade is applied by ffmpeg at render time — the file itself does not need to fade.
Target: 128–192 kbps MP3, slightly longer than `<Stage duration>` so ffmpeg can trim cleanly.

## Repository layout

```
launch/
  index.html             GitHub Pages landing (video grid, one card per release)
  CLAUDE.md              this file
  .github/workflows/
    pages.yml            deploy on push (lfs: true so shots/clips serve correctly)
  v0.3/
    chmonitor-v03-design-launch.mp4   finished film (Git LFS)
    README.md            scenes list, re-render command, notes
    src/
      index.html         film source — open in browser to preview
      animations.jsx     same source mirrored for diffing
      render.mjs         Puppeteer frame capturer
      music.mp3          music bed (Git LFS)
      shots/             screenshots (Git LFS, PNG)
      clips/             CFR 30fps recordings (Git LFS, MP4)
  v0.4/                  (next release, same structure)
```

## GitHub Pages

Auto-deployed on every push to `main` via `.github/workflows/pages.yml`.

- Landing: `https://chmonitor.github.io/launch/`
- Player: `https://chmonitor.github.io/launch/v0.3/src/`

To add a new release to the landing page, copy the `.vcard` block in `index.html` and update `data-src`, `href`, version chip, title, and description.

## Known outstanding items (v0.3)

- End card reads `github.com/duyet/clickhouse-monitoring` (pre-rebrand). Fix in `EndScene` in `v0.3/src/index.html` before next render.
- AI Agent and Topology scenes use static screenshots — replace with live recordings when `agent.mov` and `topology.mov` are available.
