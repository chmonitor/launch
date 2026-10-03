import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion'
import { Backdrop } from '@/components/remocn/backdrop'
import { SolidBg } from '@/components/SolidBg'
import { MicroScaleFade } from '@/components/remocn/micro-scale-fade'
import { LogoLockup } from '@/components/Logo'
import { CHM } from '@/theme'

export function Outro() {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const logoSpring = spring({ frame, fps, config: { damping: 16, mass: 0.7, stiffness: 120 } })
  const logoScale = interpolate(logoSpring, [0, 1], [0.9, 1])
  const logoOpacity = interpolate(frame, [0, 14], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })

  return (
    <Backdrop fill={<SolidBg color={CHM.background} />} padding={0} radius={0}>
      <AbsoluteFill style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 26 }}>
        <div style={{ transform: `scale(${logoScale})`, opacity: logoOpacity }}>
          <LogoLockup size={48} fontSize={38} />
        </div>
        <div style={{ position: 'relative', width: '100%', height: 36 }}>
          <MicroScaleFade text="dash.chmonitor.dev" fontSize={22} color={CHM.accent} fontWeight={500} />
        </div>
        <div style={{ position: 'relative', width: '100%', height: 30 }}>
          <MicroScaleFade text="docs.chmonitor.dev · Star us on GitHub" fontSize={18} color={CHM.muted} fontWeight={400} />
        </div>
      </AbsoluteFill>
    </Backdrop>
  )
}
