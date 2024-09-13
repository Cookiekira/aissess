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
import { useEffect, useState } from 'react'
import { useUIState } from 'ai/rsc'
import { AI } from '@/lib/actions'

export function QuestionCarousell() {
  const [uiState] = useUIState<typeof AI>()
  const [api, setApi] = useState<CarouselApi>()

  useEffect(() => {
    if (!api) return

    const updateNextIndex = () => {
      const numNodes = api.slideNodes().length
      api.scrollTo(numNodes - 1)
    }

    api.on('slidesChanged', updateNextIndex)

    return () => {
      api.off('slidesChanged', updateNextIndex)
    }
  }, [api])

  return (
    <Carousel
      setApi={setApi}
      opts={{
        duration: 35,
        loop: true
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
