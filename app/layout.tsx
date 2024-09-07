import { Inter } from 'next/font/google'
import type { Metadata } from 'next'
import { AI } from '@/lib/actions'
import { cn } from '@/lib/utils'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter'
})

export const metadata: Metadata = {
  title: 'Aissess',
  description: 'Assess Your Understanding'
}

export const viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' }
  ]
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          inter.variable,
          'antialiased',
          'font-inter',
          'bg-dot',
          'bg-[length:16px_16px]'
        )}
      >
        <div className="absolute inset-0 -z-10 bg-radial" />
        <AI>{children}</AI>
      </body>
    </html>
  )
}
