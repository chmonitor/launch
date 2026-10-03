import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion'
import { Backdrop } from '@/components/remocn/backdrop'
import { SolidBg } from '@/components/SolidBg'
import { InlineHighlight } from '@/components/remocn/inline-highlight'
import { Caret } from '@/components/remocn/caret'
import { TerminalSimulator, type TerminalLine } from '@/components/remocn/terminal-simulator'
import { CHM, CHM_HEX } from '@/theme'

const LINES: TerminalLine[] = [
  { text: 'docker compose up -d', type: 'command', delay: 0 },
  { text: 'Creating chmonitor_dashboard_1 ... done', type: 'log', delay: 8 },
  { text: '✓ dashboard running on :3000', type: 'success', delay: 10 },
]

const TARGETS = ['Cloudflare Workers', 'Docker', 'Kubernetes']

// This scene's own TransitionSeries.Sequence length — keep in sync with the
// Cta duration in Video.tsx. InlineHighlight and the chip fade below both
// pace off this (see inline-highlight.tsx: it used to read the *root*
// composition's duration and so never actually highlighted within the
// scene — same class of bug the README documents for number-wheel).
const SCENE_FRAMES = 120

export function Cta() {
  const frame = useCurrentFrame()
  const chipsOpacity = interpolate(frame, [82, 96], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  return (
    <Backdrop fill={<SolidBg color={CHM.background} />} padding={0} radius={0}>
      <AbsoluteFill style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 18, color: CHM.muted, fontFamily: 'var(--font-geist-mono), ui-monospace, monospace' }}>
          <span>$ one command, three targets</span>
          <Caret color={CHM.muted} width={2} height={20} blink blinkPerSecond={1.6} />
        </div>
        <div style={{ position: 'relative', width: '100%', height: 60 }}>
          <InlineHighlight
            before="Self-host "
            highlight="anywhere"
            baseColor={CHM_HEX.foreground}
            highlightColor={CHM_HEX.accent}
            fontSize={42}
            fontWeight={600}
            durationInFrames={SCENE_FRAMES}
          />
        </div>
        {/* TerminalSimulator hardcodes its own 900x480 window internally
            (windowWidth/windowHeight aren't props) — size this wrapper to
            match so its position:absolute;inset:0 self-centering isn't
            clipped or offset against a mismatched box. */}
        <div style={{ position: 'relative', width: 900, height: 480 }}>
          <TerminalSimulator lines={LINES} title="~/chmonitor" prompt="$" charsPerFrame={2} />
        </div>
        <div style={{ display: 'flex', gap: 14, opacity: chipsOpacity }}>
          {TARGETS.map((t) => (
            <div
              key={t}
              style={{
                padding: '8px 16px',
                borderRadius: 999,
                border: `1px solid ${CHM.border}`,
                color: CHM.muted,
                fontSize: 16,
              }}
            >
              {t}
            </div>
          ))}
        </div>
      </AbsoluteFill>
    </Backdrop>
  )
}
