import 'server-only'

import { createAI, createStreamableValue, getMutableAIState } from 'ai/rsc'
import { CoreMessage, DeepPartial, generateId, streamObject } from 'ai'
import { runAsyncFnWithoutBlocking } from './utils'
import { Question } from '@/components/question'
import { google } from '@ai-sdk/google'
import { z } from 'zod'

const MCQ_CONTENT = z.object({
  question: z.string().describe('Generated question based on the text.'),
  choices: z
    .array(z.string())
    .describe(
      'An array of 4 choices for the question. e.g. ["A. Sydney", "B Melbourne", "C. Canberra", "D. Perth"]'
    ),
  answer: z.enum(['A', 'B', 'C', 'D']).describe('The correct answer.'),
  explanation: z.string().describe('Explanation for the correct answer.')
})

export type MCQContent = DeepPartial<z.infer<typeof MCQ_CONTENT>>

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

  const stream = createStreamableValue<MCQContent>({
    question: 'Generating...'
  })

  const mcqId = generateId()

  runAsyncFnWithoutBlocking(async () => {
    const { partialObjectStream } = await streamObject({
      model: google('gemini-1.5-flash'),
      system: `\
    You are about to generate a multiple-choice question by calling \`generate_mcq\` based on the text you provided.`,
      messages: aiState.get().messages,
      schema: MCQ_CONTENT
    })

    let finalObject: DeepPartial<MCQContent> = {}
    for await (const partialObject of partialObjectStream) {
      stream.update(partialObject)
      finalObject = partialObject
    }

    aiState.done({
      ...aiState.get(),
      messages: [
        ...aiState.get().messages,
        {
          id: generateId(),
          role: 'assistant',
          content: JSON.stringify(finalObject)
        }
      ]
    })
    stream.done()
  })

  return { mcqId, mcqStream: stream.value }
}
export type Message = CoreMessage & {
  id: string
  isMCQ?: boolean
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
