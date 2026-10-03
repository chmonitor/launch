import type { CSSProperties } from 'react'
import { AbsoluteFill } from 'remotion'
import { TransitionSeries, linearTiming } from '@remotion/transitions'
import { fade } from '@remotion/transitions/fade'
import { ditherDissolve } from '@/components/remocn/dither-dissolve'
import { DITHER, IntroLockup, TITLE_INK, TitleCard } from '@/scenes/TitleCard'
import { MainVideo } from '@/scenes/MainVideo'
import { Stars } from '@/scenes/Stars'
import {
  END_FRAMES,
  STARS_FRAMES,
  T_DITHER,
  T_FADE,
  VIDEO_FRAMES,
} from '@/constants'
import { CHM_HEX } from '@/theme'
import { GEIST_SANS, GEIST_MONO } from '@/lib/fonts'

const fadeTiming = linearTiming({ durationInFrames: T_FADE })
const ditherTiming = linearTiming({ durationInFrames: T_DITHER })
const dither = ditherDissolve({
  colorBack: DITHER.back,
  colorFront: DITHER.front,
  speed: 0.8,
})

const rootStyle: CSSProperties & Record<string, string> = {
  backgroundColor: CHM_HEX.background,
  '--font-geist-sans': GEIST_SANS,
  '--font-geist-mono': GEIST_MONO,
}

export function Video() {
  return (
    <AbsoluteFill style={rootStyle}>
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={VIDEO_FRAMES}>
          <MainVideo />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={fadeTiming} />

        <TransitionSeries.Sequence durationInFrames={STARS_FRAMES}>
          <Stars />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={dither} timing={ditherTiming} />

        <TransitionSeries.Sequence durationInFrames={END_FRAMES}>
          <TitleCard text="chmonitor.dev" color={TITLE_INK} />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  )
}

// 30fps, no main video — for a fast look at remocn cards only.
const P_STARS = 36
const P_END = 90
const P_DITHER = 12

export function PreviewCards() {
  return (
    <AbsoluteFill style={rootStyle}>
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={P_STARS}>
          <Stars durationInFrames={P_STARS} compact />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={dither}
          timing={linearTiming({ durationInFrames: P_DITHER })}
        />

        <TransitionSeries.Sequence durationInFrames={P_END}>
          <TitleCard text="chmonitor.dev" color={TITLE_INK} />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  )
}

export function Open() {
  return (
    <AbsoluteFill style={rootStyle}>
      <IntroLockup />
    </AbsoluteFill>
  )
}

export function Close() {
  return (
    <AbsoluteFill style={rootStyle}>
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={STARS_FRAMES}>
          <Stars />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={dither} timing={ditherTiming} />
        <TransitionSeries.Sequence durationInFrames={END_FRAMES}>
          <TitleCard text="chmonitor.dev" color={TITLE_INK} />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  )
}
