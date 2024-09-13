'use client'

import { LazyMotion, m } from 'framer-motion'
import { PropsWithChildren } from 'react'

const loadFramerFeatures = () =>
  import('./framer-features').then(res => res.default)

export type LayoutProps = PropsWithChildren

export function Provider({ children }: LayoutProps) {
  return (
    <LazyMotion features={loadFramerFeatures}>
      <m.div layout className="size-full min-h-0 min-w-0">
        {children}
      </m.div>
    </LazyMotion>
  )
}
