import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { RadioGroup, RadioGroupItem } from './ui/radio-group'
import { MCQContent } from '@/lib/actions'
import { Skeleton } from './ui/skeleton'
import { Label } from './ui/label'
import { cn } from '@/lib/utils'

export function Question({ id, content }: { id: string; content: MCQContent }) {
  return (
    <Card className={cn('rounded-lg bg-muted shadow-lg')}>
      <CardHeader>
        <CardTitle>Question</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="font-medium">{content.question}</p>
          <div className="mt-2 grid gap-2">
            <RadioGroup>
              {content.choices.map((choice, index) => (
                <div
                  key={index}
                  className={cn(
                    'flex items-start gap-2  hover:shadow-md hover:bg-sky-50 p-2 rounded-lg'
                  )}
                >
                  <RadioGroupItem
                    value={index.toString()}
                    id={`${id}-${index}`}
                  />
                  <Label
                    htmlFor={`${id}-${index}`}
                    className="cursor-pointer leading-4"
                  >
                    {choice}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </div>
        <div>
          <p className="font-medium">What is the correct answer?</p>
          <p className="text-muted-foreground">
            The main purpose of the document is to provide an overview of the
            company.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

export function QuestionSkeleton() {
  return (
    <Card className={cn('rounded-lg bg-muted shadow-lg')}>
      <CardHeader>
        <CardTitle>Generating...</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <Skeleton className="h-10 bg-muted-foreground" />
        <Skeleton className="h-10 bg-muted-foreground" />
        <Skeleton className="h-10 bg-muted-foreground" />
        <Skeleton className="h-10 bg-muted-foreground" />
      </CardContent>
    </Card>
  )
}

export function QuestionSample() {
  return (
    <Question
      id="sample"
      content={{
        question: 'What is the capital of Australia?',
        choices: ['Sydney', 'Canberra', 'Melbourne', 'Perth'],
        answer_index: 1,
        explanation:
          'Canberra is the capital of Australia. It is the largest inland city and the eighth-largest city overall. The city is located at the northern end of the Australian Capital Territory, 280 km (170 mi) south-west of Sydney and 660 km (410 mi) north-east of Melbourne.'
      }}
    />
  )
}
