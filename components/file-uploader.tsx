'use client'

import { readStreamableValue, useActions, useUIState } from 'ai/rsc'
import { AI, MCQContent, UIState } from '@/lib/actions'
import { Question, QuestionSkeleton } from './question'
import { useActionState, useCallback } from 'react'
import { extractTextFromFile } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import useSWRMutation from 'swr/mutation'
import { z } from 'zod'

const ACCEPTED_FILE_TYPES = ['application/pdf', 'text/plain']
const MAX_UPLOAD_SIZE = 5 * 1024 * 1024 // 5MB

export type FileState = {
  error: string | null
  context: string
  fileName: string
}

const FormSchema = z.object({
  file: z
    .instanceof(File)
    .refine(file => file.name !== '', 'Please select a file to upload.')
    .refine(
      file => file && file.size !== 0 && file.size <= MAX_UPLOAD_SIZE,
      'Max file size is 5MB.'
    )
    .refine(
      file => file && ACCEPTED_FILE_TYPES.includes(file.type),
      'Invalid file type. Please upload a PDF or text file.'
    )
})

async function parseFile(prevState: FileState, formData: FormData) {
  const validatedFields = FormSchema.safeParse(
    Object.fromEntries(formData.entries())
  )
  if (!validatedFields.success) {
    return {
      ...prevState,
      error: validatedFields.error.errors[0].message
    }
  }

  const { file } = validatedFields.data

  try {
    const context = await extractTextFromFile(file)
    if (context.length === 0) {
      return {
        ...prevState,
        error: 'No text found in the file.'
      }
    }
    return {
      context: context,
      fileName: file.name,
      error: null
    }
  } catch (e) {
    return {
      ...prevState,
      error:
        e instanceof Error
          ? e.message
          : 'An error occurred while processing the file.'
    }
  }
}

export function FileUploader() {
  const { submitUserContext } = useActions()
  const { toast } = useToast()
  const [uiState, setUiState] = useUIState<typeof AI>()

  const updateQuestionUI = useCallback(
    async (input: string) => {
      console.log('Trigger...')
      setUiState(prevState => [
        ...prevState,
        {
          id: 'skeleton',
          display: <QuestionSkeleton />
        }
      ])
      const { mcqId, mcqStream } = await submitUserContext(input)
      for await (const mcq of readStreamableValue<MCQContent>(mcqStream)) {
        if (mcq && Object.keys(mcq).length > 0) {
          setUiState(prevState =>
            prevState.reduce(
              (acc: UIState, curr: UIState[number]) => {
                if (curr.id === mcqId || curr.id === 'skeleton') {
                  // Refreshing the question currently being generated
                  return acc
                }
                return [curr, ...acc]
              },
              [
                {
                  id: mcqId,
                  display: <Question id={mcqId} content={mcq} />
                }
              ]
            )
          )
        }
      }
    },
    [setUiState, submitUserContext]
  )

  const submit = useCallback(
    async (prevState: FileState, formData: FormData) => {
      const state = await parseFile(prevState, formData)

      if (!state.error) {
        updateQuestionUI(state.context)
      } else {
        toast({
          title: 'Error',
          description: state.error,
          variant: 'destructive'
        })
      }
      return state
    },
    [toast, updateQuestionUI]
  )

  const { trigger, isMutating: isReGenerating } = useSWRMutation(
    're-generate-question',
    async () => await updateQuestionUI('Next Question')
  )

  const [state, formAction, isPending] = useActionState(submit, {
    context: '',
    fileName: '',
    error: null
  })

  return (
    <>
      <form action={formAction} className="w-full">
        <div className="flex flex-col gap-2">
          <Label htmlFor="file">Upload File</Label>
          {!state.fileName ? (
            <Input id="file" name="file" type="file" accept=".pdf,.txt" />
          ) : (
            <Input
              id="fileName"
              name="fileName"
              type="text"
              defaultValue={state.fileName}
              readOnly
              disabled
            />
          )}
          {state.error && <p className="text-sm text-red-500">{state.error}</p>}
        </div>
        {!state.fileName ? (
          <Button type="submit" disabled={isPending} className="mt-4 w-full">
            Generate Question
          </Button>
        ) : (
          <Button
            type="button"
            onClick={() => {
              trigger()
            }}
            disabled={isReGenerating || isPending}
            className="mt-4 w-full"
          >
            Re-generate Question
          </Button>
        )}
      </form>
    </>
  )
}
