import { QuestionCarousell } from '@/components/question-carousell'
import { FileUploader } from '@/components/file-uploader'
import { AI } from '@/lib/actions'
import { generateId } from 'ai'

export default function Home() {
  const id = generateId()
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
            <FileUploader />
          </div>

          <AI
            initialAIState={{
              assessId: id,
              messages: [
                {
                  id: generateId(),
                  role: 'tool',
                  content: [
                    {
                      toolName: 'generate_mcq',
                      type: 'tool-result',
                      toolCallId: id,
                      result: {
                        question: 'What is the capital of France?',
                        choices: ['Paris', 'London', 'Berlin', 'Madrid']
                      }
                    }
                  ]
                }
              ]
            }}
          >
            <QuestionCarousell />
          </AI>
        </div>
      </div>
    </main>
  )
}
