import type { ReactNode } from 'react'
import { interpolate, useCurrentFrame } from 'remotion'
import { LogoMark } from '@/components/Logo'
import { CHM } from '@/theme'

const NAV_ITEMS = ['Overview', 'Queries', 'Explorer', 'Insights', 'Health', 'Cluster', 'Assistant']

export interface UiFrameProps {
  activeItem?: string
  children: ReactNode
}

// A lightweight reusable dashboard-shell mockup (anatomy §1 "build new") —
// the catalog has no generic app-shell frame. Reused across the dashboard
// and AI-agent beats so the video reads as one continuous product, not two.
export function UiFrame({ activeItem = 'Overview', children }: UiFrameProps) {
  const frame = useCurrentFrame()
  const opacity = interpolate(frame, [0, 14], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })

  return (
    <div
      style={{
        position: 'absolute',
        inset: 60,
        opacity,
        display: 'flex',
        borderRadius: 14,
        overflow: 'hidden',
        border: `1px solid ${CHM.border}`,
        boxShadow: '0 30px 80px rgba(0,0,0,0.5)',
        background: CHM.backgroundSoft,
      }}
    >
      <div
        style={{
          width: 168,
          flexShrink: 0,
          background: CHM.background,
          borderRight: `1px solid ${CHM.border}`,
          padding: '20px 14px',
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0 8px 18px' }}>
          <LogoMark size={18} />
          <span style={{ color: CHM.foreground, fontSize: 13, fontWeight: 600 }}>chmonitor</span>
        </div>
        {NAV_ITEMS.map((item) => {
          const active = item === activeItem
          return (
            <div
              key={item}
              style={{
                padding: '7px 10px',
                borderRadius: 6,
                fontSize: 12.5,
                color: active ? CHM.foreground : CHM.muted,
                background: active ? 'oklch(1 0 0 / 8%)' : 'transparent',
                fontWeight: active ? 600 : 400,
              }}
            >
              {item}
            </div>
          )
        })}
      </div>
      <div style={{ flex: 1, position: 'relative', padding: 28 }}>{children}</div>
    </div>
  )
}
