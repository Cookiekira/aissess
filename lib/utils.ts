import * as pdfjs from 'pdfjs-dist/webpack.mjs'
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function extractTextFromFile(file: File) {
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

    return extractedText

  }
  else {
    return 'Not implemented'
  }
}
