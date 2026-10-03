import type { RemocnTheme } from '@/lib/remocn-ui'

// Pulled 1:1 from chmonitor's own dark-mode tokens
// (apps/dashboard/src/styles.css .dark block) so the video is brand-accurate.
export const CHM_THEME: RemocnTheme = {
  background: 'oklch(0.145 0 0)',
  foreground: 'oklch(0.985 0 0)',
  card: 'oklch(0.205 0 0)',
  cardForeground: 'oklch(0.985 0 0)',
  popover: 'oklch(0.269 0 0)',
  popoverForeground: 'oklch(0.985 0 0)',
  primary: 'oklch(0.55 0.22 265.638)',
  primaryForeground: 'oklch(0.97 0.014 254.604)',
  secondary: 'oklch(0.274 0.006 286.033)',
  secondaryForeground: 'oklch(0.985 0 0)',
  muted: 'oklch(0.269 0 0)',
  mutedForeground: 'oklch(0.708 0 0)',
  accent: 'oklch(0.269 0 0)',
  accentForeground: 'oklch(0.985 0 0)',
  destructive: 'oklch(0.704 0.191 22.216)',
  destructiveForeground: 'oklch(0.985 0 0)',
  border: 'oklch(1 0 0 / 10%)',
  input: 'oklch(1 0 0 / 15%)',
  ring: 'oklch(0.556 0 0)',
  radius: 10,
}

// Flat CSS-color-string constants for components outside the remocn-ui
// theme system (text animations, custom scene chrome).
export const CHM = {
  background: 'oklch(0.145 0 0)',
  backgroundSoft: 'oklch(0.205 0 0)',
  foreground: 'oklch(0.985 0 0)',
  muted: 'oklch(0.708 0 0)',
  border: 'oklch(1 0 0 / 10%)',
  // The ONE accent for the whole video — chmonitor's brand blue.
  accent: 'oklch(0.55 0.22 265.638)',
  // Logo-mark-only colors (never used as the video accent).
  logoOrange: '#f97316',
  logoGreen: '#10b981',
  success: '#22c55e',
} as const

// Hex equivalents of the oklch tokens above, for the handful of remocn
// components that do JS-side color math (Remotion's interpolateColors())
// rather than letting the browser parse a literal CSS color string —
// oklch() breaks those. Plain `style.color`/`background` props are fine
// with the oklch strings in CHM above; only pass CHM_HEX into components
// that animate between two colors (grep: interpolateColors).
export const CHM_HEX = {
  background: '#0a0a0a',
  foreground: '#fafafa',
  accent: '#3361ef',
  accentDeep: '#1a2650',
  accentSoft: '#7c93ff',
  muted: '#a1a1a1',
} as const
