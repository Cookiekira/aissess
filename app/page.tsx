'use client'

import { QuestionCarousell } from '@/components/question-carousell'
import { useOnLoadPdfjsLib } from '@/hooks/use-pdf-parser'
import { FileUploader } from '@/components/file-uploader'
import { noop } from '@/lib/utils'
import Script from 'next/script'

export default function Home() {
  const onLoadPdfjsLib = useOnLoadPdfjsLib()
  window.onload = noop

  return (
    <>
      <main className="flex min-h-screen flex-col items-center justify-between">
        <div className="container max-w-[60rem] px-6 md:px-12 lg:px-16">
          <div className="grid h-dvh items-center gap-4 md:grid-cols-9 md:gap-8">
            <div className="flex flex-col items-start gap-4 md:col-span-4">
              <h1 className="text-4xl font-bold">Assess Your Understanding</h1>
              <p className="text-muted-foreground">
                Upload a PDF or text file and let our AI generate
                multiple-choice questions to test your knowledge.
              </p>
              <FileUploader />
            </div>

            {/* min-w-0 fix the classic overflow issue */}
            <div className="min-w-0 md:col-span-5">
              <QuestionCarousell />
            </div>
          </div>
        </div>
      </main>
      <Script
        src="/lib/pdf.min.mjs"
        type="module"
        onLoad={onLoadPdfjsLib}
        crossOrigin={'anonymous'}
      />
    </>
  )
}
