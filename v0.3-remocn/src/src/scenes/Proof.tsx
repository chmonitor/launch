import { AbsoluteFill, Sequence } from 'remotion'
import { Backdrop } from '@/components/remocn/backdrop'
import { SolidBg } from '@/components/SolidBg'
import { StaggeredFadeUp } from '@/components/remocn/staggered-fade-up'
import { SoftBlurIn } from '@/components/remocn/soft-blur-in'
import { NumberWheel } from '@/components/remocn/number-wheel'
import { AnimatedBarChart } from '@/components/remocn/animated-bar-chart'
import { CHM, CHM_HEX } from '@/theme'

const STATS: { to: number; suffix: string; label: string }[] = [
  { to: 8, suffix: '', label: 'new features' },
  { to: 70, suffix: '+', label: 'fixes' },
  { to: 13, suffix: '', label: 'perf wins' },
  { to: 71, suffix: '', label: 'charts' },
]

function Stat({ to, suffix, label, delay }: { to: number; suffix: string; label: string; delay: number }) {
  return (
    <Sequence from={delay} layout="none">
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
        <div style={{ display: 'flex', alignItems: 'baseline' }}>
          <div style={{ position: 'relative', width: 110, height: 76 }}>
            <NumberWheel from={0} to={to} fontSize={64} color={CHM.accent} durationInFrames={45} />
          </div>
          {suffix && <span style={{ fontSize: 44, fontWeight: 600, color: CHM.accent }}>{suffix}</span>}
        </div>
        <span style={{ fontSize: 18, color: CHM.muted }}>{label}</span>
      </div>
    </Sequence>
  )
}

export function Proof() {
  return (
    <Backdrop fill={<SolidBg color={CHM.background} />} padding={0} radius={0}>
      <AbsoluteFill style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20 }}>
        <div style={{ position: 'relative', width: '100%', height: 56 }}>
          <StaggeredFadeUp text="v0.3 by the numbers" fontSize={36} color={CHM.foreground} fontWeight={600} />
        </div>
        <Sequence from={14} layout="none">
          <div style={{ position: 'relative', width: '100%', height: 32 }}>
            <SoftBlurIn text="Every number, real." fontSize={20} color={CHM.muted} fontWeight={400} />
          </div>
        </Sequence>
        <div style={{ display: 'flex', gap: 72, marginTop: 12 }}>
          {STATS.map((s, i) => (
            <Stat key={s.label} to={s.to} suffix={s.suffix} label={s.label} delay={30 + i * 6} />
          ))}
        </div>
      </AbsoluteFill>
      {/* Ambient flourish — chmonitor's own chart language echoing the "71
          charts" stat, tucked in the corner so it doesn't compete with the
          numbers for attention. AnimatedBarChart hardcodes a 60px internal
          padding on every side (not a prop) — a box much smaller than
          ~300x200 gives it a negative inner height and the bars silently
          disappear, so this can't be shrunk further than this. */}
      <Sequence from={40} layout="none">
        <div style={{ position: 'absolute', right: 10, bottom: 4, width: 320, height: 210, opacity: 0.85 }}>
          <AnimatedBarChart
            data={[40, 70, 50, 85, 60, 95]}
            width={320}
            height={210}
            barColor={CHM_HEX.accent}
            gap={10}
            staggerFrames={4}
          />
        </div>
      </Sequence>
    </Backdrop>
  )
}
