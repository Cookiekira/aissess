import type PDFJS from 'pdfjs-dist'

declare global {
  interface Window {
    pdfjsLib: typeof PDFJS
  }
}
