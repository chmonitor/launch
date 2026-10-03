import type { CSSProperties } from 'react'
import { AbsoluteFill } from 'remotion'
import { TransitionSeries, linearTiming } from '@remotion/transitions'
import { fade } from '@remotion/transitions/fade'
import { whipPan } from '@/components/remocn/whip-pan'
import { swirlDissolve } from '@/components/remocn/swirl-dissolve'
import { ditherDissolve } from '@/components/remocn/dither-dissolve'
import { rippleZoom } from '@/components/remocn/ripple-zoom'
import { warpDissolve } from '@/components/remocn/warp-dissolve'
import { smokeDissolve } from '@/components/remocn/smoke-dissolve'
import { perlinDissolve } from '@/components/remocn/perlin-dissolve'
import { grainDissolve } from '@/components/remocn/grain-dissolve'
import { waveWipe } from '@/components/remocn/wave-wipe'
import { RemocnUIProvider } from '@/lib/remocn-ui'
import { LogoBumper } from '@/scenes/LogoBumper'
import { Hook } from '@/scenes/Hook'
import { Positioning } from '@/scenes/Positioning'
import { DashboardReveal, DASHBOARD_REVEAL_FRAMES } from '@/scenes/DashboardReveal'
import { AgentIntro, AGENT_INTRO_FRAMES } from '@/scenes/AgentIntro'
import { AgentReveal, AGENT_REVEAL_FRAMES } from '@/scenes/AgentReveal'
import { Proof } from '@/scenes/Proof'
import { Cta } from '@/scenes/Cta'
import { GithubStars, GITHUB_STARS_FRAMES } from '@/scenes/GithubStars'
import { Outro } from '@/scenes/Outro'
import { ScreenshotFrame } from '@/components/ScreenshotFrame'
import { CHM, CHM_THEME, CHM_HEX } from '@/theme'
import { GEIST_SANS, GEIST_MONO } from '@/lib/fonts'

// Fast-cut pace: every card holds ~1.4s instead of ~2.3s in the previous cut.
const FEATURE_FRAMES = 42

// All 13 real v0.3 screenshots now appear somewhere in the film — the 5 that
// were previously held back for "a longer cut" (see README) are folded in
// here. pan is always 'zoom-in': these screenshots have real UI chrome flush
// to the left/right edges (nav bars, top-bar buttons) — a horizontal pan-left/
// pan-right crops that content off-frame. Zoom-in only scales from center, so
// nothing at the edges is ever lost.
const FEATURES: { src: string; title: string; sub: string; pan: 'zoom-in' }[] = [
  {
    src: 'screenshots/07-ai-agent-settings.png',
    title: 'Configure the agent',
    sub: 'Any MCP-compatible model, your own API keys.',
    pan: 'zoom-in',
  },
  {
    src: 'screenshots/09-running-queries-live.png',
    title: 'Live query monitoring',
    sub: 'Watch every running query, sort by cost, drill in.',
    pan: 'zoom-in',
  },
  {
    src: 'screenshots/10-slow-queries.png',
    title: 'Slow queries',
    sub: 'Every regression, caught before your users notice.',
    pan: 'zoom-in',
  },
  {
    src: 'screenshots/12-data-explorer-dependency-graph.png',
    title: 'Data query explorer',
    sub: 'Browse databases, follow the dependency graph.',
    pan: 'zoom-in',
  },
  {
    src: 'screenshots/05-storage-overview.png',
    title: 'Storage overview',
    sub: 'Compression ratios and disk usage, per table.',
    pan: 'zoom-in',
  },
  {
    src: 'screenshots/01-overview-ai-insights.png',
    title: 'AI insights',
    sub: 'Anomalies and regressions, ranked by severity.',
    pan: 'zoom-in',
  },
  {
    src: 'screenshots/04-queries-memory-peak.png',
    title: 'Metrics & profiler',
    sub: 'CPU, memory and IO alongside profiler events.',
    pan: 'zoom-in',
  },
  {
    src: 'screenshots/11-explain-plan-tree.png',
    title: 'EXPLAIN as a tree',
    sub: 'The query plan, rendered as a tree — not a wall of text.',
    pan: 'zoom-in',
  },
  {
    src: 'screenshots/08-record-breakers-stats.png',
    title: 'Record breakers',
    sub: 'Biggest tables, slowest queries, hottest partitions.',
    pan: 'zoom-in',
  },
  {
    src: 'screenshots/03-cluster-topology.png',
    title: 'Cluster topology',
    sub: 'Nodes, shards, replicas and Keeper quorum, live.',
    pan: 'zoom-in',
  },
  {
    src: 'screenshots/13-peerdb-mirrors-replication.png',
    title: 'PeerDB mirrors',
    sub: 'Live replication status, mirror lag at a glance.',
    pan: 'zoom-in',
  },
]

// Every vendored remocn text component reads `var(--font-geist-sans)` /
// `var(--font-geist-mono)` — set once here (see lib/fonts.ts) so the whole
// tree resolves the real Geist family instead of silently falling back to
// the system font. RemocnUIProvider does the same job for the handful of
// components (AiPromptFlow's Input/Button/Skeleton/Toast) that read theme
// colors via useRemocnTheme() instead of explicit CHM props — without it
// they default to remocn's light theme, which reads as broken on this dark
// video.
const rootStyle: CSSProperties & Record<string, string> = {
  backgroundColor: CHM.background,
  '--font-geist-sans': GEIST_SANS,
  '--font-geist-mono': GEIST_MONO,
}

export function Video() {
  return (
    <AbsoluteFill style={rootStyle}>
      <RemocnUIProvider theme={CHM_THEME} mode="dark">
        <TransitionSeries>
          <TransitionSeries.Sequence durationInFrames={55}>
            <LogoBumper />
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition
            presentation={swirlDissolve({ colors: [CHM_HEX.background, CHM_HEX.accentDeep, CHM_HEX.accent], colorBack: CHM_HEX.background })}
            timing={linearTiming({ durationInFrames: 18 })}
          />

          <TransitionSeries.Sequence durationInFrames={100}>
            <Hook />
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition
            presentation={ditherDissolve({ colorBack: CHM_HEX.background, colorFront: CHM_HEX.accent })}
            timing={linearTiming({ durationInFrames: 16 })}
          />

          <TransitionSeries.Sequence durationInFrames={65}>
            <Positioning />
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition
            presentation={rippleZoom({ colors: [CHM_HEX.background, CHM_HEX.accent], colorBack: CHM_HEX.background })}
            timing={linearTiming({ durationInFrames: 20 })}
          />

          <TransitionSeries.Sequence durationInFrames={DASHBOARD_REVEAL_FRAMES}>
            <DashboardReveal />
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition
            presentation={warpDissolve({ colors: [CHM_HEX.background, CHM_HEX.accentDeep, CHM_HEX.accent] })}
            timing={linearTiming({ durationInFrames: 22 })}
          />

          <TransitionSeries.Sequence durationInFrames={AGENT_INTRO_FRAMES}>
            <AgentIntro />
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition
            presentation={smokeDissolve({ colorBack: CHM_HEX.background, colors: [CHM_HEX.accentDeep, CHM_HEX.accent, CHM_HEX.accentSoft] })}
            timing={linearTiming({ durationInFrames: 20 })}
          />

          <TransitionSeries.Sequence durationInFrames={AGENT_REVEAL_FRAMES}>
            <AgentReveal />
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition presentation={whipPan()} timing={linearTiming({ durationInFrames: 18 })} />

          {FEATURES.flatMap((f, i) => {
            const isLast = i === FEATURES.length - 1
            return [
              <TransitionSeries.Sequence key={`${f.title}-scene`} durationInFrames={FEATURE_FRAMES}>
                <ScreenshotFrame src={f.src} title={f.title} sub={f.sub} holdFrames={FEATURE_FRAMES} pan={f.pan} />
              </TransitionSeries.Sequence>,
              // Every card cut is a quick fade to keep the montage snappy — the
              // last one gets perlinDissolve as the payoff into "the numbers".
              isLast ? (
                <TransitionSeries.Transition
                  key={`${f.title}-transition`}
                  presentation={perlinDissolve({ colorBack: CHM_HEX.background, colorFront: CHM_HEX.accent })}
                  timing={linearTiming({ durationInFrames: 18 })}
                />
              ) : (
                <TransitionSeries.Transition
                  key={`${f.title}-transition`}
                  presentation={fade()}
                  timing={linearTiming({ durationInFrames: 6 })}
                />
              ),
            ]
          })}

          <TransitionSeries.Sequence durationInFrames={110}>
            <Proof />
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition
            presentation={grainDissolve({ colors: [CHM_HEX.background, CHM_HEX.accentDeep, CHM_HEX.accent], colorBack: CHM_HEX.background })}
            timing={linearTiming({ durationInFrames: 22 })}
          />

          <TransitionSeries.Sequence durationInFrames={120}>
            <Cta />
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition
            presentation={waveWipe({ colors: [CHM_HEX.background, CHM_HEX.accent], colorBack: CHM_HEX.background })}
            timing={linearTiming({ durationInFrames: 18 })}
          />

          <TransitionSeries.Sequence durationInFrames={GITHUB_STARS_FRAMES}>
            <GithubStars />
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: 12 })} />

          <TransitionSeries.Sequence durationInFrames={80}>
            <Outro />
          </TransitionSeries.Sequence>
        </TransitionSeries>
      </RemocnUIProvider>
    </AbsoluteFill>
  )
}
