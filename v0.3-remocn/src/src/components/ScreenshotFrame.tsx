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
        inset: 44,
        opacity: entrance,
        borderRadius: 14,
        overflow: 'hidden',
        border: `1px solid ${CHM.border}`,
        boxShadow: '0 30px 80px rgba(0,0,0,0.55)',
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
          left: 20,
          bottom: 20,
          opacity: captionOpacity,
          background: 'rgba(10, 10, 10, 0.72)',
          border: `1px solid ${CHM.border}`,
          borderRadius: 10,
          padding: '10px 16px',
          backdropFilter: 'blur(6px)',
        }}
      >
        <div style={{ color: CHM.foreground, fontSize: 18, fontWeight: 600 }}>{title}</div>
        <div style={{ color: CHM.muted, fontSize: 14, marginTop: 2 }}>{sub}</div>
      </div>
    </div>
  )
}
