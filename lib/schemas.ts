import { CoreMessage, DeepPartial } from 'ai'
import { z } from 'zod'

export const mcqSchema = z.object({
  question: z.string().describe('Generated question based on the text.'),
  choices: z
    .array(z.string())
    .describe(
      'An array of 4 choices for the question. e.g. ["A. Sydney", "B Melbourne", "C. Canberra", "D. Perth"]'
    ),
  answer: z.enum(['A', 'B', 'C', 'D']).describe('The correct answer.'),
  explanation: z.string().describe('Explanation for the correct answer.')
})

export type MCQContent = DeepPartial<z.infer<typeof mcqSchema>>
