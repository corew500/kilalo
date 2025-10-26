import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Kilalo',
  description: 'Marketing website with member portal',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
