// import * as pdfjs from 'pdfjs-dist/webpack.mjs'
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const runAsyncFnWithoutBlocking = (
  fn: (...args: any) => Promise<any>
) => {
  fn()
}

export function createResolvablePromise<T = any>(): {
  promise: Promise<T>
  resolve: (value: T) => void
  reject: (error: unknown) => void
} {
  let resolve: (value: T) => void
  let reject: (error: unknown) => void

  const promise = new Promise<T>((res, rej) => {
    resolve = res
    reject = rej
  })

  return {
    promise,
    resolve: resolve!,
    reject: reject!
  }
}

// export function extractTextFromFile(
//   file: File,
//   parser: PDFParser
// ): Promise<string> {

//   const pdf = await pdfjs.getDocument(await file.arrayBuffer()).promise

//   const extractedText: string = (
//     await Promise.all(
//       Array.from({ length: pdf.numPages }, async (_, i) => {
//         const page = await pdf.getPage(i + 1)
//         const textContent = await page.getTextContent()
//         // @ts-expect-error - make TS happy...
//         return textContent.items.map(item => item.str ?? '').join(' ')
//       })
//     )
//   ).join(' ')

//   return extractedText
// }
