import { AbsoluteFill } from 'remotion'
import { Backdrop } from '@/components/remocn/backdrop'
import { SolidBg } from '@/components/SolidBg'
import { ScreenshotFrame } from '@/components/ScreenshotFrame'
import { CHM } from '@/theme'

export const DASHBOARD_REVEAL_FRAMES = 75

export function DashboardReveal() {
  return (
    <Backdrop fill={<SolidBg color={CHM.background} />} padding={0} radius={0}>
      <AbsoluteFill>
        <ScreenshotFrame
          src="screenshots/02-query-activity-heatmap.png"
          title="A year of query activity, at a glance"
          sub="Static shell, instant loads — data streams in live"
          holdFrames={DASHBOARD_REVEAL_FRAMES}
          pan="zoom-in"
        />
      </AbsoluteFill>
    </Backdrop>
  )
}
