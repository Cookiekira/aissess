import { CoreMessage, streamObject } from 'ai'
import { mcqSchema } from '@/lib/schemas'
import { google } from '@ai-sdk/google'

export const maxDuration = 60

export const runtime = 'edge'

export type MCQMessage = CoreMessage & {
  id: string
}

export async function POST(req: Request) {
  const { context }: { context: CoreMessage[] } = await req.json()

  const result = streamObject({
    model: google('gemini-1.5-flash-002', {
      // ? Workaround for right order of the output
      structuredOutputs: false
    }),
    system: `You are about to generate a multiple-choice question based on the given text.\
               The result order should be: question, choices, answer, explanation.`,
    messages: context,
    schema: mcqSchema,
    schemaName: 'Multiple Choice Question',
    schemaDescription:
      'A multiple-choice question with 4 options, followed by the answer and explanation, in the order of: question, choices, answer, explanation.',

    onFinish: ({ object }) => {
      const res = mcqSchema.safeParse(object)
      if (res.error) {
        throw new Error(
          res.error.errors.map((e: { message: string }) => e.message).join('\n')
        )
      }
    }
  })

  return result.toTextStreamResponse()
}
