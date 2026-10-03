import { AbsoluteFill, OffthreadVideo, interpolate, staticFile, useCurrentFrame } from 'remotion'
import { CHM } from '@/theme'

export interface LiveClipProps {
  src: string
  title: string
  sub: string
  /** This scene's own TransitionSeries.Sequence duration — the slow zoom
   * paces off this, not the root composition length. */
  holdFrames: number
  /** Frames into the source clip to start playback (lets us skip a dull
   * lead-in and land on the action). */
  startFrom?: number
  /** Playback rate (1 = real time). Screen recordings look best at 1. */
  playbackRate?: number
  /** Browser address-bar URL shown in the fake chrome. */
  url?: string
}

// The "live recording" hero — a real screen capture in a floating browser
// window, not a static screenshot. Pairs with ScreenshotFrame (static PNGs):
// the floating-card treatment + traffic-light chrome differentiates the live
// beats from the full-bleed screenshot montage so the rhythm reads.
//
// The card matches the clips' native 1.43:1 aspect (2886×2018) so
// objectFit:'cover' crops nothing — the whole UI stays legible, which matters
// for a hero shot (anatomy.md: "show the product big and legible").
export function LiveClip({
  src,
  title,
  sub,
  holdFrames,
  startFrom = 0,
  playbackRate = 1,
  url = 'dash.chmonitor.dev',
}: LiveClipProps) {
  const frame = useCurrentFrame()

  // Gentle continuous push-in — gives the static-y recording life without
  // faking interaction. Smaller range than ScreenshotFrame: a real recording
  // already has motion, so the camera move stays subordinate.
  const zoom = interpolate(frame, [0, holdFrames], [1.0, 1.05], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  const entrance = interpolate(frame, [0, 16], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
  const captionOpacity = interpolate(frame, [10, 26], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })

  // 1.43:1 card, centered in the 1280×720 authoring frame.
  const cardW = 990
  const cardH = 693

  return (
    <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
      <div
        style={{
          width: cardW,
          height: cardH,
          opacity: entrance,
          borderRadius: 16,
          overflow: 'hidden',
          border: `1px solid ${CHM.border}`,
          boxShadow: '0 40px 120px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)',
          background: CHM.backgroundSoft,
        }}
      >
        {/* Browser chrome */}
        <div
          style={{
            height: 38,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '0 14px',
            background: 'oklch(0.18 0 0)',
            borderBottom: `1px solid ${CHM.border}`,
          }}
        >
          <span style={{ width: 11, height: 11, borderRadius: 999, background: '#ff5f57' }} />
          <span style={{ width: 11, height: 11, borderRadius: 999, background: '#febc2e' }} />
          <span style={{ width: 11, height: 11, borderRadius: 999, background: '#28c840' }} />
          <div
            style={{
              marginLeft: 18,
              flex: 1,
              height: 22,
              borderRadius: 6,
              background: 'oklch(0.13 0 0)',
              border: `1px solid ${CHM.border}`,
              color: CHM.muted,
              fontSize: 12,
              fontFamily: 'var(--font-geist-mono), ui-monospace, monospace',
              display: 'flex',
              alignItems: 'center',
              paddingLeft: 10,
            }}
          >
            {url}
          </div>
        </div>
        {/* Video body */}
        <div style={{ position: 'relative', width: cardW, height: cardH - 38, overflow: 'hidden' }}>
          <OffthreadVideo
            src={staticFile(src)}
            startFrom={startFrom}
            playbackRate={playbackRate}
            muted
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center',
              transform: `scale(${zoom})`,
              transformOrigin: 'center',
            }}
          />
          {/* Caption */}
          <div
            style={{
              position: 'absolute',
              left: 22,
              bottom: 22,
              opacity: captionOpacity,
              background: 'rgba(10, 10, 10, 0.74)',
              border: `1px solid ${CHM.border}`,
              borderRadius: 12,
              padding: '14px 22px',
              backdropFilter: 'blur(8px)',
              maxWidth: 460,
            }}
          >
            <div style={{ color: CHM.foreground, fontSize: 30, fontWeight: 600, letterSpacing: -0.01 }}>{title}</div>
            <div style={{ color: CHM.muted, fontSize: 19, marginTop: 3 }}>{sub}</div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  )
}
