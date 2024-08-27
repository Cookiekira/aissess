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
          'bg-dot',
          'bg-[length:16px_16px]'
        )}
      >
        <div className="bg-radial absolute inset-0 -z-10" />
        {children}
      </body>
    </html>
  )
}
