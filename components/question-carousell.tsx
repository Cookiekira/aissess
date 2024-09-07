'use client'

import { AI } from '@/lib/actions'
import { useAIState, useUIState } from 'ai/rsc'
import { QuestionSample, QuestionSkeleton } from './question'

export function QuestionCarousell() {
  const [aiState] = useAIState<typeof AI>()
  const [uiState] = useUIState<typeof AI>()
  // const aiState = getAIState()
  // const uiState = getUIStateFromAIState(aiState)
  console.log(aiState)

  return (
    <div>
      {uiState.length > 0 ? (
        uiState.map(ui => <div key={ui.id}>{ui.display}</div>)
      ) : (
        <QuestionSample />
      )}
    </div>
  )
}
