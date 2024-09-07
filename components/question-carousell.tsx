'use client'

import { AI } from '@/lib/actions'
import { useUIState } from 'ai/rsc'
import { QuestionSample } from './question'

export function QuestionCarousell() {
  const [uiState] = useUIState<typeof AI>()
  console.log(uiState)
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
