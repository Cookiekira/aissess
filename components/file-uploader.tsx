'use client'

import { readStreamableValue, useActions, useUIState } from 'ai/rsc'
import { Question, QuestionSkeleton } from './question'
import { extractTextFromFile } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { AI, MCQContent } from '@/lib/actions'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useActionState } from 'react'
import { z } from 'zod'

const ACCEPTED_FILE_TYPES = ['application/pdf', 'text/plain']
const MAX_UPLOAD_SIZE = 5 * 1024 * 1024 // 5MB

export type FileState = {
  context: string | null
  fileName: string | null
  error: string | null
}

const FormSchema = z.object({
  file: z
    .instanceof(File)
    .refine(
      file => file && file.size !== 0 && file.size <= MAX_UPLOAD_SIZE,
      'Max file size is 5MB.'
    )
    .refine(
      file => file && ACCEPTED_FILE_TYPES.includes(file.type),
      'Invalid file type. Please upload a PDF or text file.'
    )
})

async function parseFile(
  prevState: FileState,
  formData: FormData
): Promise<FileState> {
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
  const [uiState, setUiState] = useUIState<typeof AI>()

  const submit = async (prevState: FileState, formData: FormData) => {
    const state = await parseFile(prevState, formData)
    if (state.context) {
      setUiState([
        {
          id: 'skeleton',
          display: <QuestionSkeleton />
        }
      ])
      const { mcqId, mcqStream } = await submitUserContext(state.context)
      for await (const mcq of readStreamableValue<MCQContent>(mcqStream)) {
        if (mcq && Object.keys(mcq).length > 0) {
          setUiState([
            ...uiState,
            {
              id: mcqId,
              display: <Question id={mcqId} content={mcq} />
            }
          ])
        }
      }
    }
    return state
  }

  const [state, formAction, isPending] = useActionState(submit, {
    context: null,
    fileName: null,
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
        <Button type="submit" disabled={isPending} className="mt-4 w-full">
          Generate Questions
        </Button>
      </form>
    </>
  )
}
