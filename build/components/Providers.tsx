'use client'
import { SessionProvider } from 'next-auth/react'
import { Toaster } from 'react-hot-toast'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      {children}
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: { borderRadius: '10px', fontSize: '14px' },
          success: { iconTheme: { primary: '#16a34a', secondary: 'white' } },
        }}
      />
    </SessionProvider>
  )
}
