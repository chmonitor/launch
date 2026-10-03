import { Composition } from 'remotion'
import { Close, Open, PreviewCards, Video } from './Video'
import {
  CLOSE_DURATION,
  FPS,
  HEIGHT,
  OPEN_DURATION,
  PREVIEW_DURATION,
  TOTAL_DURATION,
  WIDTH,
} from './constants'

export const Root: React.FC = () => {
  return (
    <>
      <Composition
        id="Launch"
        component={Video}
        durationInFrames={TOTAL_DURATION}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="Open"
        component={Open}
        durationInFrames={OPEN_DURATION}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="Close"
        component={Close}
        durationInFrames={CLOSE_DURATION}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="Preview"
        component={PreviewCards}
        durationInFrames={PREVIEW_DURATION}
        fps={30}
        width={640}
        height={360}
      />
    </>
  )
}
