import { AbsoluteFill } from 'remotion'
import { Backdrop } from '@/components/remocn/backdrop'
import { SolidBg } from '@/components/SolidBg'
import { ScreenshotFrame } from '@/components/ScreenshotFrame'
import { CHM } from '@/theme'

export const AGENT_REVEAL_FRAMES = 75

export function AgentReveal() {
  return (
    <Backdrop fill={<SolidBg color={CHM.background} />} padding={0} radius={0}>
      <AbsoluteFill>
        <ScreenshotFrame
          src="screenshots/06-ai-agent-chat.png"
          title="Ask your cluster anything"
          sub="The agent reads system tables live, over MCP"
          holdFrames={AGENT_REVEAL_FRAMES}
          pan="pan-right"
        />
      </AbsoluteFill>
    </Backdrop>
  )
}
