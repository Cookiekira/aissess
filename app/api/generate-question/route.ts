import { CoreMessage, streamObject } from 'ai'
import { mcqSchema } from '@/lib/schemas'
import { groq } from '@ai-sdk/groq'

export const maxDuration = 60

export type MCQMessage = CoreMessage & {
  id: string
}

export async function POST(req: Request) {
  const { context }: { context: CoreMessage[] } = await req.json()

  const result = streamObject({
    model: groq('llama-3.1-70b-versatile'),
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
