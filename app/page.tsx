import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <div className="container max-w-4xl px-6 md:px-12 lg:px-16">
        <div className="grid h-dvh items-center gap-8 md:grid-cols-2">
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
                    <div className="flex items-start gap-2">
                      <RadioGroupItem value="a" id="a"  />
                      <Label htmlFor="a" className="leading-4">
                        {'To provide an overview of the company'}
                      </Label>
                    </div>
                    <div className="flex items-start gap-2">
                      <RadioGroupItem value="b" id="b" className='mt-1' />
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
