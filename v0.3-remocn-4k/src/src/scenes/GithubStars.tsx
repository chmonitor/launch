import { AbsoluteFill } from 'remotion'
import { Backdrop } from '@/components/remocn/backdrop'
import { SolidBg } from '@/components/SolidBg'
import { GitHubStars } from '@/components/remocn/github-stars'
import { CHM_STARGAZERS } from '@/lib/stargazers'
import { CHM, CHM_HEX } from '@/theme'

export const GITHUB_STARS_FRAMES = 130

// Real chmonitor/chmonitor data (see lib/stargazers.ts) — 246 stars as of
// 2026-07-05, not a placeholder count. GitHubStars paces its odometer/scroll
// off durationInFrames — pass our own local Sequence length (see
// github-stars.tsx: same root-vs-local-duration fix as number-wheel).
export function GithubStars() {
  return (
    <Backdrop fill={<SolidBg color={CHM.background} />} padding={0} radius={0}>
      <AbsoluteFill>
        <GitHubStars
          repo="chmonitor/chmonitor"
          totalStars={246}
          stargazers={CHM_STARGAZERS}
          accentColor={CHM_HEX.accent}
          theme="dark"
          durationInFrames={GITHUB_STARS_FRAMES}
        />
      </AbsoluteFill>
    </Backdrop>
  )
}
