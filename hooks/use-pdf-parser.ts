'use client'

import { createResolvablePromise } from '@/lib/utils'
import * as PDFJS from 'pdfjs-dist/types/src/pdf'
import { useEffect, useState } from 'react'

export function usePdfParser() {
  // Dirty tricky way to make pdfjs work
  const [pdfjs, setPdfjs] = useState<typeof PDFJS>()

  const { promise, resolve } =
    createResolvablePromise<(file: File) => Promise<string>>()

  useEffect(() => {
    if (window.pdfjsLib) {
      setPdfjs(window.pdfjsLib)
    }
    // @ts-expect-error
    import('pdfjs-dist/build/pdf.worker.min.mjs').then(pdfjsWorker => {
      window.pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs'

      resolve(async (file: File) => {
        if (!window.pdfjsLib.isPdfFile(file.name))
          throw new Error('Invalid PDF file.')

        const pdf = await window.pdfjsLib.getDocument(await file.arrayBuffer())
          .promise

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
    })
  }, [resolve])

  return promise
}
