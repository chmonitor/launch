import { AbsoluteFill } from 'remotion'
import { Backdrop } from '@/components/remocn/backdrop'
import { SolidBg } from '@/components/SolidBg'
import { MicroScaleFade } from '@/components/remocn/micro-scale-fade'
import { AiPromptFlow } from '@/components/remocn/ai-prompt-flow'
import { CHM, CHM_THEME } from '@/theme'

export const AGENT_INTRO_FRAMES = 145

// A live simulated interaction, not just a screenshot — proves the agent is
// an actual conversational flow (type -> submit -> load -> answer -> toast)
// before AgentReveal shows the real product doing the same thing.
export function AgentIntro() {
  return (
    <Backdrop fill={<SolidBg color={CHM.background} />} padding={0} radius={0}>
      <AbsoluteFill>
        {/* AbsoluteFill defaults to display:flex;flexDirection:column — pull
            both children out of flow so AiPromptFlow's height:100% div isn't
            flex-shrunk to make room for the label above it. */}
        <div style={{ position: 'absolute', left: 0, right: 0, top: 30, height: 60 }}>
          <MicroScaleFade text="Ask your cluster anything" fontSize={30} color={CHM.foreground} fontWeight={600} />
        </div>
        <div style={{ position: 'absolute', inset: 0 }}>
          <AiPromptFlow
            prompt="Why did p99 latency spike at 2am?"
            buttonLabel="Ask the agent"
            answerLines={[
              'A background merge on `events_local` hit 3 shards at once,',
              'starved I/O, and pushed query queueing past the timeout —',
              'no schema or query changed.',
            ]}
            toastTitle="Answered in 1.2s"
            theme={CHM_THEME}
          />
        </div>
      </AbsoluteFill>
    </Backdrop>
  )
}
