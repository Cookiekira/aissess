'use client'

import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from './ui/carousel'
import { startTransition, useEffect, useState } from 'react'
import { QuestionSample } from './question'
import { useUIState } from 'ai/rsc'
import { AI } from '@/lib/actions'

export function QuestionCarousell() {
  const [uiState] = useUIState<typeof AI>()
  const [api, setApi] = useState<CarouselApi>()

  useEffect(() => {
    if (!api) return
    startTransition(() => {
      api.scrollTo(uiState.length - 1)
    })
  }, [uiState, api])

  return (
    <Carousel
      setApi={setApi}
      opts={{
        duration: 25
      }}
    >
      <CarouselContent>
        {uiState.length > 0 ? (
          uiState.map(ui => (
            <CarouselItem key={ui.id}>
              <div className="w-full p-2">{ui.display}</div>
            </CarouselItem>
          ))
        ) : (
          <CarouselItem key="sample">
            <div className="w-full p-2">
              <QuestionSample />
            </div>
          </CarouselItem>
        )}
      </CarouselContent>
      <CarouselPrevious className="max-md:-left-6" />
      <CarouselNext className="max-md:-right-6" />
    </Carousel>
  )
}
