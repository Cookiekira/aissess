'use server'

import * as pdfjs from 'pdfjs-dist/build/pdf.min.mjs'
import { z } from 'zod'

// @ts-expect-error - See https://github.com/vercel/next.js/issues/58313
await import('pdfjs-dist/build/pdf.worker.min.mjs')

// const pdfjs = await import('pdfjs-dist')

export type State = {
  fileName: string | null
  questions: string[]
  error: string | null
}

const MAX_UPLOAD_SIZE = 5 * 1024 * 1024 // 5MB
const ACCEPTED_FILE_TYPES = ['application/pdf', 'text/plain']

const FormSchema = z.object({
  // pdf or txt file
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

export async function uploadFile(prevState: State, formData: FormData) {
  const validatedFields = FormSchema.safeParse(
    Object.fromEntries(formData.entries())
  )
  if (!validatedFields.success) {
    console.log(validatedFields.error.errors[0].message)
    return { ...prevState, error: validatedFields.error.errors[0].message }
  }

  const { file } = validatedFields.data

  // PDF
  if (pdfjs.isPdfFile(file.name)) {
    const pdf = await pdfjs.getDocument(await file.arrayBuffer()).promise

    const extractedText: string = (
      await Promise.all(
        Array.from({ length: pdf.numPages }, async (_, i) => {
          const page = await pdf.getPage(i + 1)
          const textContent = await page.getTextContent()
          // @ts-expect-error - make TS happy...
          return textContent.items.map(item => item.str ?? '').join(' ')
        })
      )
    ).join(' ')

    console.log(extractedText)
  }

  return {
    questions: ['Question 1', 'Question 2'],
    error: null,
    fileName: file.name
  }
}
