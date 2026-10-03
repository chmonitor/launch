import { AbsoluteFill } from 'remotion'
import { Backdrop } from '@/components/remocn/backdrop'
import { SolidBg } from '@/components/SolidBg'
import { TrackingIn } from '@/components/remocn/tracking-in'
import { MicroScaleFade } from '@/components/remocn/micro-scale-fade'
import { VersionBadge } from '@/components/VersionBadge'
import { CHM } from '@/theme'

export function Positioning() {
  return (
    <Backdrop fill={<SolidBg color={CHM.background} />} padding={0} radius={0}>
      <AbsoluteFill style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 26 }}>
        <VersionBadge version="v0.3" date="A ground-up rebuild" />
        {/* TrackingIn / MicroScaleFade self-center via position:absolute;inset:0 —
            each needs its own sized, positioned box so siblings don't collide. */}
        <div style={{ position: 'relative', width: '100%', height: 130 }}>
          <TrackingIn text="chmonitor" fontSize={88} color={CHM.foreground} fontWeight={700} />
        </div>
        <div style={{ position: 'relative', width: '100%', height: 50 }}>
          <MicroScaleFade
            text="Rebuilt on TanStack Start — instant loads, one-command self-host."
            fontSize={24}
            color={CHM.muted}
            fontWeight={400}
          />
        </div>
      </AbsoluteFill>
    </Backdrop>
  )
}
