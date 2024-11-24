'use client'

import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from './ui/carousel'
import { Question, QuestionSample, QuestionSkeleton } from './question'
import { useEffect, useMemo, useState } from 'react'
import { toast, useToast } from '@/hooks/use-toast'
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
  const { toast } = useToast()

  const questions = useQuestions()

  const showSkeleton = isLoading && !currentMCQ
  const showCurrentMCQ = !!currentMCQ

  const mcqs = useMemo(
    () =>
      questions.reduce(
        (acc: { id: string; content: DeepPartial<MCQContent> }[], mcq) => {
          if (mcq.role === 'assistant') {
            let content
            try {
              content =
                typeof mcq.content === 'string'
                  ? JSON.parse(mcq.content)
                  : mcq.content
            } catch (error) {
              toast({
                title: 'Error',
                description: 'Failed to parse the question.',
                variant: 'destructive'
              })
              return acc
            }

            // Check if the question is already in the list
            if (content?.question && content.question !== currentMCQ?.question) {
              acc.push({
                id: mcq.id,
                content
              })
            }
          }
          return acc
        },
        []
      ),
    [currentMCQ?.question, questions, toast]
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
        duration: 35
      }}
    >
      <CarouselContent className="items-center">
        {mcqs.length > 0 || showSkeleton || showCurrentMCQ ? (
          <>
            {mcqs.map(mcq => (
              <CarouselItem key={mcq.id}>
                <div className="w-full p-2">
                  <Question id={mcq.id} content={mcq.content} />
                </div>
              </CarouselItem>
            ))}
            {showCurrentMCQ && (
              <CarouselItem>
                <div className="w-full p-2">
                  <Question id="streaming" content={currentMCQ} />
                </div>
              </CarouselItem>
            )}
            {showSkeleton && (
              <CarouselItem key="skeleton">
                <div className="w-full p-2">
                  <QuestionSkeleton />
                </div>
              </CarouselItem>
            )}
          </>
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
