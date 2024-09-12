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
import { useMediaQuery } from 'foxact/use-media-query'
import { QuestionSample } from './question'
import { useUIState } from 'ai/rsc'
import { AI } from '@/lib/actions'

export function QuestionCarousell() {
  const [uiState] = useUIState<typeof AI>()
  const [api, setApi] = useState<CarouselApi>()
  const [nextQuestionIndex, setNextQuestionIndex] = useState(0)
  const isDesktop = useMediaQuery('(min-width: 1024px)', false)

  useEffect(() => {
    if (!api) return
    api.on('slidesInView', () => {
      setNextQuestionIndex((api.slidesInView()[0] + 1) % uiState.length)
    })
    startTransition(() => {
      api.scrollTo(uiState.length - 1)
    })
  }, [uiState, api])

  useEffect(() => {
    return api?.destroy
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Carousel
      setApi={setApi}
      opts={{
        duration: 25,
        loop: true
      }}
    >
      {isDesktop && uiState.length > 1 && (
        <div
          key={uiState[nextQuestionIndex].id}
          className="pointer-events-none absolute w-full rotate-y-45 left-full -skew-y-3"
        >
          {uiState[nextQuestionIndex].display}
        </div>
      )}

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
