import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/Providers'
import { Header } from '@/components/layout/Header'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Promptly — Build in Public',
  description: 'A community platform for builders, creators, and indie hackers. Follow Karthi\'s apps, tools, and aviation/travel content.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-[#0e0e0e] text-[#e8e4dc] min-h-screen`}>
        <Providers>
          <Header />
          <main className="max-w-6xl mx-auto px-4 py-6">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  )
}
