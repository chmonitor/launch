import { loadFont as loadGeistSans } from '@remotion/google-fonts/Geist'
import { loadFont as loadGeistMono } from '@remotion/google-fonts/GeistMono'

// Every vendored remocn text component references `var(--font-geist-sans)` /
// `var(--font-geist-mono)` — the CSS custom properties Next.js's `next/font`
// would normally define. This is a bare Remotion app with no Next.js runtime,
// so those variables were undefined and every text component was silently
// falling back to the system font (`-apple-system, BlinkMacSystemFont`).
// Geist ships in `@remotion/google-fonts`, so we load it here and expose the
// resolved family names as the same CSS variables on the video root
// (see Video.tsx) — every component resolves correctly with zero edits.
const { fontFamily: geistSansFamily } = loadGeistSans('normal', {
  weights: ['400', '500', '600', '700'],
})
const { fontFamily: geistMonoFamily } = loadGeistMono('normal', {
  weights: ['400', '500'],
})

export const GEIST_SANS = geistSansFamily
export const GEIST_MONO = geistMonoFamily
