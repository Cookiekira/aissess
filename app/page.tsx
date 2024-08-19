import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="w-full max-w-4xl px-6 py-12 md:px-12 lg:px-16">
        <div className="grid gap-8 md:grid-cols-2">
          <div className="flex flex-col items-start gap-4">
            <h1 className="text-4xl font-bold">Assess Your Understanding</h1>
            <p className="text-muted-foreground">
              Upload a PDF or text file and let our AI generate multiple-choice
              questions to test your knowledge.
            </p>
            <div className="flex w-full flex-col gap-2">
              <Label htmlFor="file">Upload File</Label>
              <Input id="file" type="file" accept=".pdf,.txt" />
            </div>
            <Button type="submit" className="w-full">
              Generate Questions
            </Button>
          </div>
          <div className="rounded-lg bg-muted p-6 shadow-lg">
            <h2 className="mb-4 text-2xl font-bold">Sample Question</h2>
            <div className="space-y-4">
              <div>
                <p className="font-medium">
                  What is the main purpose of the document?
                </p>
                <div className="mt-2 grid gap-2">
                  <RadioGroup>
                    <RadioGroupItem value="a" id="a">
                      <div />
                      To provide an overview of the company
                    </RadioGroupItem>
                    <RadioGroupItem value="b" id="b">
                      <div />
                      To explain the product features
                    </RadioGroupItem>
                    <RadioGroupItem value="c" id="c">
                      <div />
                      To introduce the team members
                    </RadioGroupItem>
                    <RadioGroupItem value="d" id="d">
                      <div />
                      To summarize the financial performance
                    </RadioGroupItem>
                  </RadioGroup>
                </div>
              </div>
              <div>
                <p className="font-medium">What is the correct answer?</p>
                <p className="text-muted-foreground">
                  The main purpose of the document is to provide an overview of
                  the company.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
