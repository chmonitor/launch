import { AbsoluteFill, Sequence } from 'remotion'
import { Backdrop } from '@/components/remocn/backdrop'
import { ShaderGrainGradient } from '@/components/remocn/shader-grain-gradient'
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
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'baseline' }}>
          <div style={{ position: 'relative', width: 150, height: 108 }}>
            <NumberWheel from={0} to={to} fontSize={88} color={CHM.accent} durationInFrames={45} />
          </div>
          {suffix && <span style={{ fontSize: 60, fontWeight: 600, color: CHM.accent }}>{suffix}</span>}
        </div>
        <span style={{ fontSize: 22, color: CHM.muted }}>{label}</span>
      </div>
    </Sequence>
  )
}

export function Proof() {
  return (
    <Backdrop
      fill={
        <ShaderGrainGradient
          colors={[CHM_HEX.background, CHM_HEX.accentDeep, '#0c1336']}
          colorBack={CHM_HEX.background}
          softness={0.7}
          intensity={0.2}
          noise={0.12}
          speed={0.3}
        />
      }
      padding={0}
      radius={0}
    >
      <AbsoluteFill style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 24 }}>
        <div style={{ position: 'relative', width: '100%', height: 64 }}>
          <StaggeredFadeUp text="v0.3 by the numbers" fontSize={44} color={CHM.foreground} fontWeight={600} />
        </div>
        <Sequence from={14} layout="none">
          <div style={{ position: 'relative', width: '100%', height: 36 }}>
            <SoftBlurIn text="Every number, real." fontSize={24} color={CHM.muted} fontWeight={400} />
          </div>
        </Sequence>
        <div style={{ display: 'flex', gap: 80, marginTop: 16 }}>
          {STATS.map((s, i) => (
            <Stat key={s.label} to={s.to} suffix={s.suffix} label={s.label} delay={30 + i * 6} />
          ))}
        </div>
      </AbsoluteFill>
      {/* Ambient flourish — chmonitor's own chart language echoing the "71
          charts" stat, tucked in the corner. AnimatedBarChart hardcodes a
          60px internal padding — a box smaller than ~300×200 makes its bars
          silently disappear, so don't shrink past that floor. */}
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
