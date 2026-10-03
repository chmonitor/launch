import { Composition } from 'remotion'
import { Video } from './Video'

// Total frames = sum(sequence durations, 1417) - sum(transition overlaps, 244).
// Recompute this whenever a Sequence/Transition duration in Video.tsx changes
// — a mismatch truncates the tail or freezes on the last frame.
export const TOTAL_DURATION = 1173

export const Root: React.FC = () => {
  return (
    <>
      <Composition
        id="Launch16x9"
        component={Video}
        durationInFrames={TOTAL_DURATION}
        fps={30}
        width={1280}
        height={720}
      />
    </>
  )
}
