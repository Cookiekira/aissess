'use client'

import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from './ui/carousel'
import { Question, QuestionSample } from './question'
import { useEffect, useMemo, useState } from 'react'
import { useQuestions } from '@/lib/questions'
import { MCQContent } from '@/lib/schemas'
import { DeepPartial } from 'ai'

export type QuestionCarousellProps = {
  isLoading: boolean
  currentMCQ: DeepPartial<MCQContent> | undefined
}

export function QuestionCarousell({
  isLoading,
  currentMCQ
}: QuestionCarousellProps) {
  const [api, setApi] = useState<CarouselApi>()

  const questions = useQuestions()

  const mcqs = useMemo(
    () =>
      questions.reduce(
        (acc: { id: string; content: DeepPartial<MCQContent> }[], mcq) => {
          if (mcq.role === 'assistant') {
            acc.push({
              id: mcq.id,
              content:
                typeof mcq.content === 'string'
                  ? JSON.parse(mcq.content)
                  : mcq.content
            })
          }
          return acc
        },
        []
      ),
    [questions]
  )

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
      <CarouselContent className="items-center">
        {mcqs.length > 0 ? (
          mcqs.map(mcq => (
            <CarouselItem key={mcq.id}>
              <div className="w-full p-2">
                <Question id={mcq.id} content={mcq.content} />
              </div>
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
