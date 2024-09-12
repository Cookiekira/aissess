'use client'

import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { RadioGroup, RadioGroupItem } from './ui/radio-group'
import React, { memo, useState } from 'react'
import { MCQContent } from '@/lib/actions'
import { Skeleton } from './ui/skeleton'
import { Label } from './ui/label'
import { cn } from '@/lib/utils'

const ANSWER = ['A', 'B', 'C', 'D']

export const Question = memo(function Question({
  id,
  content,
  className
}: {
  id: string
  content: MCQContent
  className?: React.HTMLAttributes<'div'>['className']
}) {
  const [selected, setSelected] = useState<string>()

  const isRightAnswer = (input: string) => {
    return input === content.answer
  }

  const isSelected = (choiceIndex: number) => {
    return selected === ANSWER[choiceIndex]
  }

  return (
    <Card className={cn('rounded-lg bg-muted shadow-md', className)}>
      <CardHeader>
        <CardTitle>Question</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="font-medium">{content.question ?? 'Generating...'}</p>
          <div className="mt-2 grid gap-2">
            {content.choices && content.choices.length > 0 ? (
              <RadioGroup value={selected} onValueChange={setSelected}>
                {content.choices.map((choice, index) => (
                  <div
                    key={index}
                    className={cn(
                      `flex items-start gap-2 p-2 rounded-lg

                       hover:shadow-md hover:bg-sky-100
                       [&:has([data-state="checked"])]:shadow-md
                       `,
                      // Check if the selected answer is the correct answer
                      isSelected(index) && isRightAnswer(ANSWER[index])
                        ? `[&:has([data-state="checked"])]:bg-success`
                        : `[&:has([data-state="checked"])]:bg-destructive`,

                      selected &&
                        !isSelected(index) &&
                        isRightAnswer(ANSWER[index]) &&
                        'bg-success hover:bg-success shadow-md'
                    )}
                  >
                    <RadioGroupItem
                      value={ANSWER[index]}
                      id={`${id}-${index}`}
                      className="peer"
                    />
                    <Label
                      htmlFor={`${id}-${index}`}
                      className={cn(
                        'cursor-pointer leading-4',

                        isRightAnswer(ANSWER[index])
                          ? 'peer-data-[state=checked]:text-success-foreground'
                          : 'peer-data-[state=checked]:text-destructive-foreground',

                        selected &&
                          !isSelected(index) &&
                          isRightAnswer(ANSWER[index]) &&
                          'text-success-foreground'
                      )}
                    >
                      {choice}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            ) : (
              <>
                <Skeleton className="h-10 bg-muted-foreground" />
                <Skeleton className="h-10 bg-muted-foreground" />
                <Skeleton className="h-10 bg-muted-foreground" />
                <Skeleton className="h-10 bg-muted-foreground" />
              </>
            )}
          </div>
        </div>
        {!!selected && content.answer && (
          <div>
            <p className="font-medium">{`The answer is ${content.answer}`}</p>
            <p className="text-muted-foreground">{content.explanation}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
})

export function QuestionSkeleton() {
  return (
    <Card className={cn('rounded-lg bg-muted shadow-lg')}>
      <CardHeader>
        <CardTitle>Question</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="animate-pulse font-medium">{'Generating...'}</p>
        <Skeleton className="h-10 bg-muted-foreground" />
        <Skeleton className="h-10 bg-muted-foreground" />
        <Skeleton className="h-10 bg-muted-foreground" />
        <Skeleton className="h-10 bg-muted-foreground" />
      </CardContent>
    </Card>
  )
}

export function QuestionSample({
  className
}: {
  className?: React.HTMLAttributes<'div'>['className']
}) {
  return (
    <Question
      className={className}
      id="sample"
      content={{
        question: 'What is the capital of Australia?',
        choices: ['A. Sydney', 'B. Canberra', 'C. Melbourne', 'D. Perth'],
        answer: 'B',
        explanation:
          'Canberra is the capital of Australia. It is the largest inland city and the eighth-largest city overall. The city is located at the northern end of the Australian Capital Territory, 280 km (170 mi) south-west of Sydney and 660 km (410 mi) north-east of Melbourne.'
      }}
    />
  )
}
