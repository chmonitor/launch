import type { CSSProperties } from 'react'
import { AbsoluteFill, Audio, interpolate, staticFile } from 'remotion'
import { TransitionSeries, linearTiming } from '@remotion/transitions'
import { fade } from '@remotion/transitions/fade'
import { whipPan } from '@/components/remocn/whip-pan'
import { swirlDissolve } from '@/components/remocn/swirl-dissolve'
import { rippleZoom } from '@/components/remocn/ripple-zoom'
import { warpDissolve } from '@/components/remocn/warp-dissolve'
import { smokeDissolve } from '@/components/remocn/smoke-dissolve'
import { ditherDissolve } from '@/components/remocn/dither-dissolve'
import { perlinDissolve } from '@/components/remocn/perlin-dissolve'
import { grainDissolve } from '@/components/remocn/grain-dissolve'
import { waveWipe } from '@/components/remocn/wave-wipe'
import { RemocnUIProvider } from '@/lib/remocn-ui'
import { LogoBumper } from '@/scenes/LogoBumper'
import { Hook } from '@/scenes/Hook'
import { AgentReveal, AGENT_REVEAL_FRAMES } from '@/scenes/AgentReveal'
import { Proof } from '@/scenes/Proof'
import { Cta } from '@/scenes/Cta'
import { Outro } from '@/scenes/Outro'
import { ScreenshotFrame } from '@/components/ScreenshotFrame'
import { LiveClip } from '@/components/LiveClip'
import { CHM, CHM_THEME, CHM_HEX } from '@/theme'
import { GEIST_SANS, GEIST_MONO } from '@/lib/fonts'

// ---------------------------------------------------------------------------
// 4K via a 3× scale wrapper.
//
// remocn components are tuned for the 1280×720 canvas. Authoring the whole
// timeline at 1280×720 and scaling the tree 3× → 3840×2160 keeps every
// component's proportions correct while outputting true 4K. Vector text and
// the WebGL shaders render crisply at the higher backbuffer; the screenshots
// (1846–2732px wide) cover their ~2500px display size with minimal upscale.
// ---------------------------------------------------------------------------
const DESIGN_W = 1280
const DESIGN_H = 720
const SCALE = 3 // 1280×3 = 3840, 720×3 = 2160

// --- Scene durations (frames @ 30fps) -------------------------------------
const LOGO = 52
const HOOK = 92
const OVERVIEW = 78
const AGENT = AGENT_REVEAL_FRAMES // 56
const QUERIES = 64
const EXPLORER = 78
const FEATURE = 38 // ~1.27s per screenshot — fast-cut montage
const PROOF = 108
const CTA = 112
const OUTRO = 88

// --- Transition durations -------------------------------------------------
const T_SWIRL = 18
const T_RIPPLE = 20
const T_WARP = 20
const T_SMOKE = 18
const T_WHIP = 16
const T_DITHER = 16
const T_FADE = 6 // quick fades between montage cards
const T_PERLIN = 18
const T_GRAIN = 20
const T_WAVE = 18

const MONTAGE: { src: string; title: string; sub: string }[] = [
  { src: 'screenshots/01-overview-ai-insights.png', title: 'AI insights', sub: 'Anomalies & regressions, ranked by severity.' },
  { src: 'screenshots/03-cluster-topology.png', title: 'Cluster topology', sub: 'Nodes, shards, replicas, Keeper quorum.' },
  { src: 'screenshots/04-queries-memory-peak.png', title: 'Metrics & profiler', sub: 'CPU, memory, IO alongside profiler events.' },
  { src: 'screenshots/05-storage-overview.png', title: 'Storage overview', sub: 'Compression ratios and disk usage, per table.' },
  { src: 'screenshots/07-ai-agent-settings.png', title: 'Configure the agent', sub: 'Any MCP-compatible model, your own API keys.' },
  { src: 'screenshots/08-record-breakers-stats.png', title: 'Record breakers', sub: 'Biggest tables, slowest queries, hottest partitions.' },
  { src: 'screenshots/10-slow-queries.png', title: 'Slow queries', sub: 'Every regression, caught before your users notice.' },
  { src: 'screenshots/11-explain-plan-tree.png', title: 'EXPLAIN as a tree', sub: 'The query plan, rendered as a tree.' },
  { src: 'screenshots/13-peerdb-mirrors-replication.png', title: 'PeerDB mirrors', sub: 'Live replication status, mirror lag at a glance.' },
  { src: 'screenshots/02-query-activity-heatmap.png', title: 'Query activity', sub: 'A full year of queries, at a glance.' },
]

// total = Σ sequences − Σ transition overlaps. Recompute if any duration
// above changes — a mismatch truncates the tail or freezes on the last frame.
const SEQUENCE_SUM =
  LOGO + HOOK + OVERVIEW + AGENT + QUERIES + EXPLORER + MONTAGE.length * FEATURE + PROOF + CTA + OUTRO
const TRANSITION_SUM =
  T_SWIRL + T_RIPPLE + T_WARP + T_SMOKE + T_WHIP + T_DITHER + // 6 structural cuts before the montage
  (MONTAGE.length - 1) * T_FADE + // quick fades between cards
  T_PERLIN + T_GRAIN + T_WAVE // montage→proof→cta→outro
export const TOTAL_DURATION = SEQUENCE_SUM - TRANSITION_SUM

// Every vendored remocn text component reads `var(--font-geist-sans)` /
// `var(--font-geist-mono)` — set once here (see lib/fonts.ts) so the whole
// tree resolves the real Geist family instead of silently falling back.
// RemocnUIProvider does the same job for the handful of components that read
// theme colors via useRemocnTheme() instead of explicit CHM props.
const rootStyle: CSSProperties & Record<string, string> = {
  backgroundColor: CHM.background,
  '--font-geist-sans': GEIST_SANS,
  '--font-geist-mono': GEIST_MONO,
}

export function Video() {
  return (
    <AbsoluteFill style={rootStyle}>
      <AbsoluteFill
        style={{
          transform: `scale(${SCALE})`,
          transformOrigin: 'top left',
          width: DESIGN_W,
          height: DESIGN_H,
        }}
      >
        <RemocnUIProvider theme={CHM_THEME} mode="dark">
          <TransitionSeries>
            <TransitionSeries.Sequence durationInFrames={LOGO}>
              <LogoBumper />
            </TransitionSeries.Sequence>
            <TransitionSeries.Transition
              presentation={swirlDissolve({ colors: [CHM_HEX.background, CHM_HEX.accentDeep, CHM_HEX.accent], colorBack: CHM_HEX.background })}
              timing={linearTiming({ durationInFrames: T_SWIRL })}
            />

            <TransitionSeries.Sequence durationInFrames={HOOK}>
              <Hook />
            </TransitionSeries.Sequence>
            <TransitionSeries.Transition
              presentation={rippleZoom({ colors: [CHM_HEX.background, CHM_HEX.accent], colorBack: CHM_HEX.background })}
              timing={linearTiming({ durationInFrames: T_RIPPLE })}
            />

            {/* Live recording hero: the dashboard overview. */}
            <TransitionSeries.Sequence durationInFrames={OVERVIEW}>
              <LiveClip
                src="clips/overview.mp4"
                title="The dashboard"
                sub="Everything you run, in one glance."
                holdFrames={OVERVIEW}
                startFrom={0}
                url="dash.chmonitor.dev"
              />
            </TransitionSeries.Sequence>
            <TransitionSeries.Transition
              presentation={warpDissolve({ colors: [CHM_HEX.background, CHM_HEX.accentDeep, CHM_HEX.accent] })}
              timing={linearTiming({ durationInFrames: T_WARP })}
            />

            <TransitionSeries.Sequence durationInFrames={AGENT}>
              <AgentReveal />
            </TransitionSeries.Sequence>
            <TransitionSeries.Transition
              presentation={smokeDissolve({ colorBack: CHM_HEX.background, colors: [CHM_HEX.accentDeep, CHM_HEX.accent, CHM_HEX.accentSoft] })}
              timing={linearTiming({ durationInFrames: T_SMOKE })}
            />

            {/* Live recording: running queries. */}
            <TransitionSeries.Sequence durationInFrames={QUERIES}>
              <LiveClip
                src="clips/queries.mp4"
                title="Running queries"
                sub="Watch every query, sort by cost, drill in."
                holdFrames={QUERIES}
                startFrom={0}
                url="dash.chmonitor.dev/queries"
              />
            </TransitionSeries.Sequence>
            <TransitionSeries.Transition presentation={whipPan()} timing={linearTiming({ durationInFrames: T_WHIP })} />

            {/* Live recording: the data explorer. */}
            <TransitionSeries.Sequence durationInFrames={EXPLORER}>
              <LiveClip
                src="clips/explorer.mp4"
                title="Data explorer"
                sub="Browse databases, follow the dependency graph."
                holdFrames={EXPLORER}
                startFrom={0}
                url="dash.chmonitor.dev/explorer"
              />
            </TransitionSeries.Sequence>
            <TransitionSeries.Transition
              presentation={ditherDissolve({ colorBack: CHM_HEX.background, colorFront: CHM_HEX.accent })}
              timing={linearTiming({ durationInFrames: T_DITHER })}
            />

            {MONTAGE.flatMap((f, i) => {
              const isLast = i === MONTAGE.length - 1
              return [
                <TransitionSeries.Sequence key={`${f.title}-scene`} durationInFrames={FEATURE}>
                  <ScreenshotFrame src={f.src} title={f.title} sub={f.sub} holdFrames={FEATURE} pan="zoom-in" />
                </TransitionSeries.Sequence>,
                // Quick fades keep the montage snappy; the last card gets
                // perlinDissolve as the payoff into "the numbers".
                isLast ? (
                  <TransitionSeries.Transition
                    key={`${f.title}-transition`}
                    presentation={perlinDissolve({ colorBack: CHM_HEX.background, colorFront: CHM_HEX.accent })}
                    timing={linearTiming({ durationInFrames: T_PERLIN })}
                  />
                ) : (
                  <TransitionSeries.Transition
                    key={`${f.title}-transition`}
                    presentation={fade()}
                    timing={linearTiming({ durationInFrames: T_FADE })}
                  />
                ),
              ]
            })}

            <TransitionSeries.Sequence durationInFrames={PROOF}>
              <Proof />
            </TransitionSeries.Sequence>
            <TransitionSeries.Transition
              presentation={grainDissolve({ colors: [CHM_HEX.background, CHM_HEX.accentDeep, CHM_HEX.accent], colorBack: CHM_HEX.background })}
              timing={linearTiming({ durationInFrames: T_GRAIN })}
            />

            <TransitionSeries.Sequence durationInFrames={CTA}>
              <Cta />
            </TransitionSeries.Sequence>
            <TransitionSeries.Transition
              presentation={waveWipe({ colors: [CHM_HEX.background, CHM_HEX.accent], colorBack: CHM_HEX.background })}
              timing={linearTiming({ durationInFrames: T_WAVE })}
            />

            <TransitionSeries.Sequence durationInFrames={OUTRO}>
              <Outro />
            </TransitionSeries.Sequence>
          </TransitionSeries>
        </RemocnUIProvider>
      </AbsoluteFill>

      {/* Music bed — the v0.3 track, ~30s. 1s fade-out at the end so the cut
          lands clean under the outro regardless of exact composition length. */}
      <Audio
        src={staticFile('music.mp3')}
        volume={(f) =>
          interpolate(f, [TOTAL_DURATION - 30, TOTAL_DURATION], [1, 0], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          })
        }
      />
    </AbsoluteFill>
  )
}
