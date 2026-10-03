import { AbsoluteFill, Sequence } from 'remotion'
import { Backdrop } from '@/components/remocn/backdrop'
import { ShaderGrainGradient } from '@/components/remocn/shader-grain-gradient'
import { KineticCenterBuild } from '@/components/remocn/kinetic-center-build'
import { PerWordCrossfade } from '@/components/remocn/per-word-crossfade'
import { CHM, CHM_HEX } from '@/theme'

// Big-text hook on an animated brand-blue grain gradient — the shader gives
// the opening beat depth and motion (the "beautiful shading"), while the two
// oversized stacked lines carry the message. Each kinetic line lives in its
// own sized box because KineticCenterBuild self-centers via position:absolute.
export function Hook() {
  return (
    <Backdrop
      fill={
        <ShaderGrainGradient
          colors={[CHM_HEX.background, CHM_HEX.accentDeep, '#101a44']}
          colorBack={CHM_HEX.background}
          softness={0.7}
          intensity={0.22}
          noise={0.12}
          speed={0.4}
        />
      }
      padding={0}
      radius={0}
    >
      <AbsoluteFill style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
        <div style={{ position: 'relative', width: '100%', height: 86 }}>
          <KineticCenterBuild text="ClickHouse monitoring," fontSize={64} color={CHM.foreground} fontWeight={600} />
        </div>
        {/* Second line lands as the first settles — keeps the beat moving. */}
        <Sequence from={18} layout="none">
          <div style={{ position: 'relative', width: '100%', height: 86 }}>
            <KineticCenterBuild text="rebuilt from scratch." fontSize={64} color={CHM.accent} fontWeight={600} />
          </div>
        </Sequence>
        <Sequence from={56} layout="none">
          <div style={{ position: 'relative', width: '100%', height: 44 }}>
            <PerWordCrossfade
              fromText=""
              toText="Live queries. AI insights. One dashboard."
              fontSize={26}
              color={CHM.muted}
              fontWeight={500}
            />
          </div>
        </Sequence>
      </AbsoluteFill>
    </Backdrop>
  )
}
