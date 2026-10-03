import { AbsoluteFill, Sequence } from 'remotion'
import { Backdrop } from '@/components/remocn/backdrop'
import { DynamicGrid } from '@/components/remocn/dynamic-grid'
import { KineticCenterBuild } from '@/components/remocn/kinetic-center-build'
import { PerWordCrossfade } from '@/components/remocn/per-word-crossfade'
import { CHM } from '@/theme'

export function Hook() {
  return (
    <Backdrop
      fill={<DynamicGrid cellSize={44} lineColor="oklch(0.269 0 0)" background={CHM.background} speed={0.3} />}
      padding={0}
      radius={0}
    >
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', gap: 22 }}>
        <div style={{ position: 'relative', width: '100%', height: 90 }}>
          <KineticCenterBuild
            text="ClickHouse monitoring, rebuilt from scratch."
            fontSize={56}
            color={CHM.foreground}
            fontWeight={600}
          />
        </div>
        {/* The kinetic build settles ~frame 62 — start the sub-line right as
            it lands so the beat keeps moving instead of going idle. */}
        <Sequence from={48} layout="none">
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
