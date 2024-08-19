import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { cn } from '@/lib/utils'

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
          'bg-[radial-gradient(#e5e7eb_1.2px,transparent_1px)] [background-size:16px_16px]'
        )}
      >
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_700px_at_50%_300px,#C9EBFF,transparent)]"></div>
        {children}
      </body>
    </html>
  )
}
