import { Img, interpolate, staticFile, useCurrentFrame } from 'remotion'
import { CHM } from '@/theme'

export interface ScreenshotFrameProps {
  src: string
  title: string
  sub: string
  /** This scene's own TransitionSeries.Sequence duration — Ken Burns paces
   * off this, not the root composition length (see number-wheel.tsx fix). */
  holdFrames: number
  pan?: 'zoom-in' | 'pan-left' | 'pan-right'
}

// The real product, not a mockup (anatomy.md: "show the product big and
// legible — the product is the hero"). A slow Ken Burns move gives a static
// PNG motion without faking interactivity that isn't there.
//
// Captions are intentionally large for the 4K cut — at 1280×720 authored
// coords scaled 3×, a 30px title reads as ~90px on the 4K canvas.
export function ScreenshotFrame({ src, title, sub, holdFrames, pan = 'zoom-in' }: ScreenshotFrameProps) {
  const frame = useCurrentFrame()
  const progress = interpolate(frame, [0, holdFrames], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  const scale =
    pan === 'zoom-in' ? interpolate(progress, [0, 1], [1, 1.06]) : interpolate(progress, [0, 1], [1.04, 1.08])
  const translateX =
    pan === 'pan-left'
      ? interpolate(progress, [0, 1], [10, -10])
      : pan === 'pan-right'
        ? interpolate(progress, [0, 1], [-10, 10])
        : 0

  const entrance = interpolate(frame, [0, 14], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
  const captionOpacity = interpolate(frame, [8, 22], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })

  return (
    <div
      style={{
        position: 'absolute',
        inset: 40,
        opacity: entrance,
        borderRadius: 16,
        overflow: 'hidden',
        border: `1px solid ${CHM.border}`,
        boxShadow: '0 40px 120px rgba(0,0,0,0.6)',
        background: CHM.backgroundSoft,
      }}
    >
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
        <Img
          src={staticFile(src)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'top',
            transform: `scale(${scale}) translateX(${translateX}px)`,
            transformOrigin: 'top center',
          }}
        />
      </div>
      <div
        style={{
          position: 'absolute',
          left: 24,
          bottom: 24,
          opacity: captionOpacity,
          background: 'rgba(10, 10, 10, 0.74)',
          border: `1px solid ${CHM.border}`,
          borderRadius: 12,
          padding: '14px 22px',
          backdropFilter: 'blur(8px)',
          maxWidth: 520,
        }}
      >
        <div style={{ color: CHM.foreground, fontSize: 30, fontWeight: 600, letterSpacing: -0.01 }}>{title}</div>
        <div style={{ color: CHM.muted, fontSize: 19, marginTop: 3 }}>{sub}</div>
      </div>
    </div>
  )
}
