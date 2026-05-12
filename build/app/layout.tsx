import type { Metadata } from 'next'
import './globals.css'
import { Providers } from '@/components/Providers'

export const metadata: Metadata = {
  title: 'Promptly — Build in Public Community',
  description: 'A community for builders, indie developers, and creators. Share wins, discover tools, and grow together.',
  openGraph: {
    title: 'Promptly Community',
    description: 'Build in public with builders, creators, and indie hackers.',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
