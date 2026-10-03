import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion'
import { CHM } from '@/theme'

export interface VersionBadgeProps {
  version: string
  date: string
  delayInFrames?: number
}

// A small "build new" component per the remocn changelog archetype notes —
// there's no catalog component for a version chip + date pair.
export function VersionBadge({ version, date, delayInFrames = 0 }: VersionBadgeProps) {
  const frame = useCurrentFrame() - delayInFrames
  const { fps } = useVideoConfig()

  const entrance = spring({ frame, fps, config: { damping: 14, mass: 0.6, stiffness: 120 } })
  const translateY = interpolate(entrance, [0, 1], [-16, 0])
  const opacity = interpolate(frame, [0, 12], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        transform: `translateY(${translateY}px)`,
        opacity,
      }}
    >
      <div
        style={{
          padding: '6px 14px',
          borderRadius: 999,
          border: `1px solid ${CHM.accent}`,
          color: CHM.accent,
          fontSize: 20,
          fontWeight: 600,
          fontFamily: 'var(--font-geist-mono), ui-monospace, monospace',
        }}
      >
        {version}
      </div>
      <span style={{ color: CHM.muted, fontSize: 18 }}>{date}</span>
    </div>
  )
}
