'use client'

import { useUIState } from 'ai/rsc'
import { AI, getUIStateFromAIState } from '@/lib/actions'

export function QuestionCarousell() {
  const [messages] = useUIState<typeof AI>()
  const [aiState] = useUIState<typeof AI>()
  console.log(aiState,messages)

  return (
    <div>
      {messages.map(message => (
        <div key={message.id}>{message.display}</div>
      ))}
    </div>
  )
}
