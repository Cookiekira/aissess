'use client'

import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from './ui/carousel'
import { QuestionSample } from './question'
import { useUIState } from 'ai/rsc'
import { AI } from '@/lib/actions'
import { useState } from 'react'

export function QuestionCarousell() {
  const [uiState] = useUIState<typeof AI>()
  const [api, setApi] = useState<CarouselApi>()

  api?.scrollTo(uiState.length - 1)

  return (
    <Carousel setApi={setApi} className="w-full">
      <CarouselContent>
        {uiState.length > 0 ? (
          uiState.map(ui => (
            <CarouselItem key={ui.id}>{ui.display}</CarouselItem>
          ))
        ) : (
          <CarouselItem key="sample">
            <QuestionSample />
          </CarouselItem>
        )}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  )
}
