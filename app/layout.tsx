// app/layout.tsx

import './globals.css'
import type { Metadata } from 'next'
import { Nunito } from 'next/font/google'
import { AuthProvider } from '@/context/AuthContext'
import { Analytics } from "@vercel/analytics/next"

const nunito = Nunito({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Idk what to name',
  description: 'side projcet.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icon-512x512.png"></link>
        <meta name="theme-color" content="#680577" />
      </head>
      <body className={nunito.className}>
        
        {/* --- THIS IS THE DEFINITIVE BACKGROUND FIX --- */}
        {/* This div is fixed to the viewport, sits behind everything, and contains our gradient. */}
        <div className="fixed top-0 left-0 -z-10 h-full w-full bg-gradient-to-b from-[#680577] to-[#0e0018]" />
        
        {/* The AuthProvider and page content now render on a transparent layer above the fixed background. */}
        <AuthProvider>
          {children}
          <Analytics/>
        </AuthProvider>
        
      </body>
    </html>
  )
}
