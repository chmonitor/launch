import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion'
import { Backdrop } from '@/components/remocn/backdrop'
import { ShaderGrainGradient } from '@/components/remocn/shader-grain-gradient'
import { MicroScaleFade } from '@/components/remocn/micro-scale-fade'
import { LogoLockup } from '@/components/Logo'
import { CHM, CHM_HEX } from '@/theme'

export function Outro() {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const logoSpring = spring({ frame, fps, config: { damping: 16, mass: 0.7, stiffness: 120 } })
  const logoScale = interpolate(logoSpring, [0, 1], [0.9, 1])
  const logoOpacity = interpolate(frame, [0, 14], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })

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
      <AbsoluteFill style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 28 }}>
        <div style={{ transform: `scale(${logoScale})`, opacity: logoOpacity }}>
          <LogoLockup size={56} fontSize={44} />
        </div>
        <div style={{ position: 'relative', width: '100%', height: 48 }}>
          <MicroScaleFade text="dash.chmonitor.dev" fontSize={34} color={CHM.accent} fontWeight={500} />
        </div>
        <div style={{ position: 'relative', width: '100%', height: 34 }}>
          <MicroScaleFade text="docs.chmonitor.dev · Star us on GitHub" fontSize={22} color={CHM.muted} fontWeight={400} />
        </div>
      </AbsoluteFill>
    </Backdrop>
  )
}
