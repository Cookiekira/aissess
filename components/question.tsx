import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { RadioGroup, RadioGroupItem } from './ui/radio-group'
import { Skeleton } from './ui/skeleton'
import { Car } from 'lucide-react'
import { Label } from './ui/label'
import { cn } from '@/lib/utils'

export function Question() {
  return (
    <Card className={cn('rounded-lg bg-muted shadow-lg')}>
      {/* <h2 className="mb-4 text-2xl font-bold">Sample Question</h2> */}
      <CardHeader>
        <CardTitle>Sample Question</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="font-medium">
            What is the main purpose of the document?
          </p>
          <div className="mt-2 grid gap-2">
            <RadioGroup>
              <div className="flex items-start gap-2">
                <RadioGroupItem value="a" id="a" />
                <Label htmlFor="a" className="leading-4">
                  {'To provide an overview of the company'}
                </Label>
              </div>
              <div className="flex items-start gap-2">
                <RadioGroupItem value="b" id="b" className="mt-1" />
                <Label htmlFor="b" className="leading-5">
                  {"To outline the company's financial performance"}
                </Label>
              </div>
              <div className="flex items-start gap-2">
                <RadioGroupItem value="c" id="c" />
                <Label htmlFor="c">
                  {"To summarize the company's product offerings"}
                </Label>
              </div>
              <div className="flex items-start gap-2">
                <RadioGroupItem value="d" id="d" />
                <Label htmlFor="d">
                  {"To provide an analysis of the company's competitors"}
                </Label>
              </div>
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
