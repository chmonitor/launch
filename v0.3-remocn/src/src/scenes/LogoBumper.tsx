import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion'
import { Backdrop } from '@/components/remocn/backdrop'
import { DynamicGrid } from '@/components/remocn/dynamic-grid'
import { LogoMark } from '@/components/Logo'
import { BottomUpLetters } from '@/components/remocn/bottom-up-letters'
import { CHM } from '@/theme'

export function LogoBumper() {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const markSpring = spring({ frame, fps, config: { damping: 12, mass: 0.6, stiffness: 140 } })
  const markScale = interpolate(markSpring, [0, 1], [0.6, 1])
  const markOpacity = interpolate(frame, [0, 12], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })

  return (
    <Backdrop
      fill={<DynamicGrid cellSize={44} lineColor="oklch(0.269 0 0)" background={CHM.background} speed={0.4} />}
      padding={0}
      radius={0}
    >
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 22 }}>
        <div style={{ transform: `scale(${markScale})`, opacity: markOpacity }}>
          <LogoMark size={72} />
        </div>
        {/* BottomUpLetters self-centers via position:absolute;inset:0 — give it
            its own sized, positioned box so it doesn't span the whole frame. */}
        <div style={{ position: 'relative', width: 420, height: 100 }}>
          <BottomUpLetters text="chmonitor" fontSize={72} color={CHM.foreground} fontWeight={600} />
        </div>
      </AbsoluteFill>
    </Backdrop>
  )
}
