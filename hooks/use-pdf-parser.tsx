'use client'

import { createResolvablePromise } from '@/lib/utils'
import * as PDFJS from 'pdfjs-dist/types/src/pdf'
import { use, useEffect, useState } from 'react'

export function usePdfParser() {
  // Dirty tricky way to make pdfjs work
  const [pdfjs, setPdfjs] = useState<typeof PDFJS | null>(null)

  const { promise, resolve } =
    createResolvablePromise<(file: File) => Promise<string>>()

  useEffect(() => {
    if (window.pdfjsLib) {
      setPdfjs(window.pdfjsLib)
      window.pdfjsLib.GlobalWorkerOptions.workerSrc = '/lib/pdf.worker.min.mjs'
    }
  }, [])

  useEffect(() => {
    // Return the parser function
    resolve(async (file: File) => {
      if (!pdfjs) throw new Error('PDFJS not loaded.')
      if (!pdfjs.isPdfFile(file.name)) throw new Error('Invalid PDF file.')

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

      return extractedText
    })
  }, [resolve, pdfjs])
  return { parser: promise, pdfjs }
}
