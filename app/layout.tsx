import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Navbar } from '@/components/layout/Navbar'
import { Toaster } from 'react-hot-toast'
import { auth } from '@/lib/auth'
import { SessionProvider } from '@/components/layout/SessionProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Promptly — Build in Public Community',
  description: 'A community for builders, indie developers, and creators. Share wins, discover tools, and grow together.',
  openGraph: {
    title: 'Promptly Community',
    description: 'Build in public with builders, creators, and indie hackers.',
  },
  twitter: {
    card: 'summary',
    title: 'Promptly Community',
    description: 'Build in public with builders, creators, and indie hackers.',
  },
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider session={session}>
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Toaster position="bottom-right" />
        </SessionProvider>
      </body>
    </html>
  )
}
