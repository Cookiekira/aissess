import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { RadioGroup, RadioGroupItem } from './ui/radio-group'
import { MCQContent } from '@/lib/actions'
import { Skeleton } from './ui/skeleton'
import { Label } from './ui/label'
import { cn } from '@/lib/utils'

export function Question({ content }: { content: MCQContent }) {
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
                <div key={index} className="flex items-start gap-2">
                  <RadioGroupItem value={index.toString()} id={choice} />
                  <Label htmlFor={index.toString()} className="leading-4">
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
        <Skeleton className="h-4" />
        <Skeleton className="h-4" />
        <Skeleton className="h-4" />
        <Skeleton className="h-4" />
      </CardContent>
    </Card>
  )
}
