'use client'

import type { MCQMessage } from '@/app/api/generate-question/route'
import { useQuestions, useSetQuestions } from '@/lib/questions'
import { usePdfParser } from '@/hooks/use-pdf-parser'
import { useActionState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { nanoid } from 'nanoid'
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
      file => file.size !== 0 && file.size <= MAX_UPLOAD_SIZE,
      'Max file size is 5MB.'
    )
    .refine(
      file => ACCEPTED_FILE_TYPES.includes(file.type),
      'Invalid file type. Please upload a PDF or text file.'
    )
})

async function parseFile(
  prevState: FileState,
  formData: FormData,
  parser: ReturnType<typeof usePdfParser>
) {
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
    if (parser === null) throw new Error('PDFJS not loaded.')
    let context = ''
    if (file.type === 'application/pdf') {
      context = await parser(file)
    } else {
      context = await file.text()
    }

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

export type FileUploaderProps = {
  readonly isLoading: boolean
  readonly onSubmit: (data: { context: MCQMessage[] }) => void
}

export function FileUploader({ isLoading, onSubmit }: FileUploaderProps) {
  const { toast } = useToast()
  const parser = usePdfParser()

  const setQuestions = useSetQuestions()
  const questions = useQuestions()

  const handleGenerate = useCallback(
    async (prevState: FileState, formData: FormData) => {
      const state = await parseFile(prevState, formData, parser)

      if (state.error) {
        toast({
          title: 'Error',
          description: state.error,
          variant: 'destructive',
          duration: 2000
        })
      } else {
        const initialContext: MCQMessage = {
          id: nanoid(),
          content: state.context,
          role: 'user'
        }

        setQuestions([initialContext])

        onSubmit({
          context: [initialContext]
        })
      }

      return state
    },
    [onSubmit, parser, setQuestions, toast]
  )

  const [state, formAction, isPending] = useActionState(handleGenerate, {
    context: '',
    fileName: '',
    error: null
  })

  const handleRegenerate = useCallback(() => {
    const context: MCQMessage[] = [
      ...questions,
      {
        id: nanoid(),
        content: 'Next question',
        role: 'user'
      }
    ]
    setQuestions(context)
    onSubmit({ context })
  }, [questions, setQuestions, onSubmit])

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
            onClick={handleRegenerate}
            disabled={isLoading || isPending}
            className="mt-4 w-full"
          >
            Re-generate Question
          </Button>
        )}
      </form>
    </>
  )
}
