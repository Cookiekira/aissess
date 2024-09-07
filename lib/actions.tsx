import 'server-only'

import { Question, QuestionSkeleton } from '@/components/question'
import { createAI, getMutableAIState, streamUI } from 'ai/rsc'
import { CoreMessage, generateId } from 'ai'
import { google } from '@ai-sdk/google'
import { z } from 'zod'

const MCQ_CONTENT = z.object({
  question: z.string().describe('Generated question based on the text.'),
  choices: z.array(z.string()).describe('An array of choices for the question.')
  // answer_index: z.number().describe('The index of the correct answer.'),
  // explanation: z.string().describe('Explanation for the correct answer.')
})

export type MCQContent = z.infer<typeof MCQ_CONTENT>

async function submitUserContext(content: string) {
  'use server'

  const aiState = getMutableAIState<typeof AI>()

  aiState.update({
    ...aiState.get(),
    messages: [
      ...aiState.get().messages,
      {
        id: generateId(),
        role: 'user',
        content
      }
    ]
  })

  const result = await streamUI({
    model: google('gemini-1.5-flash'),
    initial: <QuestionSkeleton />,
    system: `\
    You are about to generate a multiple-choice question by calling \`generate_mcq\` based on the text you provided.`,
    messages: aiState.get().messages,
    tools: {
      generate_mcq: {
        description: 'Generate a multiple-choice question based on the text.',
        parameters: MCQ_CONTENT,
        generate: function* (mcq) {
          const toolCallId = generateId()

          aiState.done({
            ...aiState.get(),
            messages: [
              ...aiState.get().messages,
              {
                id: generateId(),
                role: 'tool',
                content: [
                  {
                    toolName: 'generate_mcq',
                    type: 'tool-result',
                    toolCallId,
                    result: mcq
                  }
                ]
              }
            ]
          })

          return <Question id={toolCallId} content={mcq} />
        }
      }
    }
  })

  return {
    id: generateId(),
    display: result.value
  }
}

export type Message = CoreMessage & {
  id: string
}

export type AIState = {
  assessId: string
  messages: Message[]
}

export type UIState = {
  id: string
  display: React.ReactNode
}[]

export const AI = createAI<AIState, UIState>({
  actions: {
    submitUserContext
  },
  initialAIState: {
    assessId: generateId(),
    messages: []
  },
  initialUIState: []
})

export const getUIStateFromAIState = (aiState: AIState): UIState => {
  return aiState.messages
    .filter(message => message.role === 'tool')
    .map((message, index) => ({
      id: `${aiState.assessId}-${index}`,
      display: message.content.map(tool => {
        return tool.toolName === 'generate_mcq' ? (
          <>
            {/* @ts-expect-error */}
            <Question id={tool.toolCallId} content={tool.result} />
          </>
        ) : (
          <div>Sample</div>
        )
      })
    }))
}
