export {}

declare global {
  interface Window {
    pdfjsLib: typeof import('pdfjs-dist/types/src/pdf')
  }
}
