'use client'

import { useAIState, useUIState } from 'ai/rsc'
import { QuestionSample } from './question'
import { AI } from '@/lib/actions'

export function QuestionCarousell() {
  const [uiState] = useUIState<typeof AI>()

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
