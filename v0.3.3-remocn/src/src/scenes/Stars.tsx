import { AbsoluteFill } from 'remotion'
import { GitHubStars } from '@/components/remocn/github-stars'
import { CHM_STARGAZERS } from '@/lib/stargazers'
import { STARS_FRAMES } from '@/constants'
import { CHM_HEX } from '@/theme'

export function Stars({
  durationInFrames = STARS_FRAMES,
  compact = false,
}: {
  durationInFrames?: number
  compact?: boolean
}) {
  return (
    <AbsoluteFill style={{ backgroundColor: CHM_HEX.background }}>
      <GitHubStars
        repo="chmonitor/chmonitor"
        totalStars={256}
        stargazers={compact ? CHM_STARGAZERS.slice(0, 16) : CHM_STARGAZERS}
        accentColor={CHM_HEX.accent}
        theme="dark"
        durationInFrames={durationInFrames}
        speed={1.8}
      />
    </AbsoluteFill>
  )
}
