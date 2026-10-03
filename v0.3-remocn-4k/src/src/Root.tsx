import { Composition } from 'remotion'
import { Video, TOTAL_DURATION } from './Video'

// True 4K UHD. The timeline is authored at 1280×720 (where remocn components
// are tuned) and scaled 3× inside Video.tsx — see the note there. TOTAL_DURATION
// is derived from the scene/transition sums in Video.tsx; recompute if those
// change.
export const Root: React.FC = () => {
  return (
    <>
      <Composition
        id="Launch4K"
        component={Video}
        durationInFrames={TOTAL_DURATION}
        fps={30}
        width={3840}
        height={2160}
      />
    </>
  )
}
