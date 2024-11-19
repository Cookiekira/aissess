'use client'

import { PdfParserProvider } from '@/hooks/use-pdf-parser'
import { QuestionsProvider } from '@/lib/questions'
import { LazyMotion, m } from 'framer-motion'

const loadFramerFeatures = () =>
  import('./framer-features').then(res => res.default)

export type LayoutProps = React.PropsWithChildren

export function Provider({ children }: LayoutProps) {
  return (
    <>
      <LazyMotion features={loadFramerFeatures}>
        <m.div layout className="size-full min-h-0 min-w-0">
          <PdfParserProvider>
            <QuestionsProvider>{children}</QuestionsProvider>
          </PdfParserProvider>
        </m.div>
      </LazyMotion>
    </>
  )
}
