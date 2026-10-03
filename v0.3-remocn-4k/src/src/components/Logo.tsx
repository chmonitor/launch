import { CHM } from '@/theme'

// chmonitor's real brand mark (apps/landing/public/brand/logo-mark.svg),
// inlined so it renders deterministically without a static-file fetch.
export function LogoMark({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" role="img" aria-label="chmonitor">
      <rect x="3.3" y="13.05" width="3.8" height="15.45" fill={CHM.logoOrange} />
      <rect x="8.7" y="3.5" width="3.8" height="25" fill={CHM.logoOrange} />
      <rect x="14.1" y="13.25" width="3.8" height="15.25" fill={CHM.logoOrange} />
      <rect x="19.5" y="6.25" width="3.8" height="22.25" fill={CHM.logoOrange} />
      <rect x="24.9" y="16.8" width="3.8" height="11.7" fill={CHM.logoOrange} />
      <rect x="3.3" y="9.75" width="3.8" height="3.3" fill={CHM.logoGreen} />
    </svg>
  )
}

export function LogoLockup({ size = 40, fontSize = 32 }: { size?: number; fontSize?: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      <LogoMark size={size} />
      <span
        style={{
          fontSize,
          fontWeight: 600,
          color: CHM.foreground,
          fontFamily: 'var(--font-geist-sans), -apple-system, BlinkMacSystemFont, sans-serif',
        }}
      >
        chmonitor
      </span>
    </div>
  )
}
