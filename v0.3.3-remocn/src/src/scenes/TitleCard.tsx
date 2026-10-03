import { AbsoluteFill, Img, Sequence, staticFile, useVideoConfig } from 'remotion'
import { SoftBlurIn } from '@/components/remocn/soft-blur-in'
import { MatrixDecode } from '@/components/remocn/matrix-decode'
import { ShaderDithering } from '@/components/remocn/shader-dithering'
import { ShaderWarp } from '@/components/remocn/shader-warp'
import { VERSION_AT } from '@/constants'

const DITHER_BACK = '#f2d4b0'
const DITHER_FRONT = '#2aa8d8'
export const TITLE_INK = '#fafafa'
export const TITLE_ACCENT = '#fafafa'
export const DITHER = { back: DITHER_BACK, front: DITHER_FRONT }

function HalftoneBg() {
  return (
    <>
      <Img
        src={staticFile('bg.jpeg')}
        style={{
          position: 'absolute',
          inset: '-6%',
          width: '112%',
          height: '112%',
          objectFit: 'cover',
          filter: 'blur(24px)',
        }}
      />
      <AbsoluteFill style={{ mixBlendMode: 'overlay', opacity: 0.55 }}>
        <ShaderWarp
          colors={['#f2d4b0', '#e07a4a', '#2aa8d8', '#f0c9a0']}
          softness={1}
          distortion={0.18}
          swirl={0.35}
          speed={0.45}
        />
      </AbsoluteFill>
      <AbsoluteFill style={{ mixBlendMode: 'multiply', opacity: 0.2 }}>
        <ShaderDithering
          colorBack="#f8e6d0"
          colorFront="#9ad4ee"
          shape="wave"
          type="4x4"
          size={3}
          speed={0.5}
        />
      </AbsoluteFill>
      <AbsoluteFill style={{ backgroundColor: 'rgba(0,0,0,0.16)' }} />
    </>
  )
}

export function IntroLockup() {
  const { width, fps } = useVideoConfig()
  // Sized to the glyphs, not the canvas — 0.78+0.24 boxes overflowed.
  const fontSize = Math.round(width * 0.072)
  const domainW = Math.round(fontSize * 8.05)
  const versionW = Math.round(fontSize * 3.55)
  const rowH = Math.round(fontSize * 1.4)
  const blurSpeed = 30 / fps
  const versionAt = Math.round((VERSION_AT / 60) * fps)
  const revealDuration = Math.max(8, Math.round((18 / 60) * fps))

  return (
    <AbsoluteFill>
      <HalftoneBg />
      <AbsoluteFill
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          paddingLeft: Math.round(width * 0.05),
          paddingRight: Math.round(width * 0.05),
          gap: Math.round(fontSize * 0.28),
        }}
      >
        <div style={{ position: 'relative', width: domainW, height: rowH, flexShrink: 0 }}>
          <SoftBlurIn
            text="chmonitor.dev"
            blur={16}
            fontSize={fontSize}
            color={TITLE_INK}
            fontWeight={600}
            speed={blurSpeed}
          />
        </div>
        <Sequence from={versionAt} layout="none">
          <div style={{ position: 'relative', width: versionW, height: rowH, flexShrink: 0 }}>
            <MatrixDecode
              text="v0.3"
              charset="v0123456789.#*<>+-=/\\"
              fontSize={fontSize}
              color={TITLE_ACCENT}
              fontWeight={600}
              revealDuration={revealDuration}
              speed={2}
            />
          </div>
        </Sequence>
      </AbsoluteFill>
    </AbsoluteFill>
  )
}

export function TitleCard({
  text,
  color = TITLE_INK,
  fontSize,
}: {
  text: string
  color?: string
  fontSize?: number
}) {
  const { width, fps } = useVideoConfig()
  const size = fontSize ?? Math.round(width * 0.072)

  return (
    <AbsoluteFill>
      <HalftoneBg />
      <SoftBlurIn
        text={text}
        blur={16}
        fontSize={size}
        color={color}
        fontWeight={600}
        speed={30 / fps}
      />
    </AbsoluteFill>
  )
}
