'use client'

import { createContextState } from 'foxact/context-state'
import { useCallback } from 'react'

const [PdfParserProvider, usePdfParser, useSetPdfParser] = createContextState<
  ((file: File) => Promise<string>) | null
>(null)

export function useOnLoadPdfjsLib() {
  const setPdfParser = useSetPdfParser()

  return useCallback(() => {
    if (!window.pdfjsLib) {
      throw new Error('PDFJS not loaded.')
    }

    window.pdfjsLib.GlobalWorkerOptions.workerSrc = '/lib/pdf.worker.min.mjs'

    setPdfParser(() => async (file: File) => {
      if (!window.pdfjsLib) throw new Error('PDFJS not loaded.')
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
  }, [setPdfParser])
}

export { PdfParserProvider, usePdfParser, useSetPdfParser }
