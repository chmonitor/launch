import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion'
import { Backdrop } from '@/components/remocn/backdrop'
import { ShaderGrainGradient } from '@/components/remocn/shader-grain-gradient'
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
// Cta duration in Video.tsx. InlineHighlight and the chip fade both pace off
// this (inline-highlight.tsx used to read the root composition duration and
// never highlighted within the scene — same class of bug as number-wheel).
const SCENE_FRAMES = 112

export function Cta() {
  const frame = useCurrentFrame()
  const chipsOpacity = interpolate(frame, [82, 96], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  return (
    <Backdrop
      fill={
        <ShaderGrainGradient
          colors={[CHM_HEX.background, CHM_HEX.accentDeep, '#0e1a3e']}
          colorBack={CHM_HEX.background}
          softness={0.7}
          intensity={0.2}
          noise={0.12}
          speed={0.32}
        />
      }
      padding={0}
      radius={0}
    >
      <AbsoluteFill style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 30 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            fontSize: 20,
            color: CHM.muted,
            fontFamily: 'var(--font-geist-mono), ui-monospace, monospace',
          }}
        >
          <span>$ one command, three targets</span>
          <Caret color={CHM.muted} width={2} height={22} blink blinkPerSecond={1.6} />
        </div>
        <div style={{ position: 'relative', width: '100%', height: 76 }}>
          <InlineHighlight
            before="Self-host "
            highlight="anywhere"
            baseColor={CHM_HEX.foreground}
            highlightColor={CHM_HEX.accent}
            fontSize={60}
            fontWeight={600}
            durationInFrames={SCENE_FRAMES}
          />
        </div>
        {/* TerminalSimulator hardcodes its own 900×480 window internally — size
            this wrapper to match so its position:absolute;inset:0 self-centering
            isn't clipped against a mismatched box. */}
        <div style={{ position: 'relative', width: 900, height: 480 }}>
          <TerminalSimulator lines={LINES} title="~/chmonitor" prompt="$" charsPerFrame={2} />
        </div>
        <div style={{ display: 'flex', gap: 14, opacity: chipsOpacity }}>
          {TARGETS.map((t) => (
            <div
              key={t}
              style={{
                padding: '8px 18px',
                borderRadius: 999,
                border: `1px solid ${CHM.border}`,
                color: CHM.muted,
                fontSize: 17,
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
