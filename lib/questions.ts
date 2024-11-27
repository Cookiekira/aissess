import type { MCQMessage } from '@/app/api/generate-question/route'
import { createContextState } from 'foxact/context-state'

export const [QuestionsProvider, useQuestions, useSetQuestions] =
  createContextState<MCQMessage[]>([])
