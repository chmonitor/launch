import { AbsoluteFill, OffthreadVideo, staticFile } from 'remotion'
import { HEIGHT, SOURCE_H, SOURCE_W, VIDEO_SRC, WIDTH } from '@/constants'

// Native 3680×2160, centered in the 3840×2160 4K canvas. No cover, no scale.
export function MainVideo() {
  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      <OffthreadVideo
        src={staticFile(VIDEO_SRC)}
        muted
        style={{
          position: 'absolute',
          left: (WIDTH - SOURCE_W) / 2,
          top: (HEIGHT - SOURCE_H) / 2,
          width: SOURCE_W,
          height: SOURCE_H,
          objectFit: 'fill',
        }}
      />
    </AbsoluteFill>
  )
}
