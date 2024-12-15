import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Providers } from './providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'TigerTap-Speed Typing Test',
  description: 'Free online typing test to check your typing speed (WPM), accuracy, and skill level. Practice typing with customizable texts and detailed analytics.',
  keywords: 'typing test, typing speed, WPM, words per minute, typing practice, typing skills, typing accuracy, online typing test',
  authors: [{ name: 'Rishabh Sonkar' }],
  openGraph: {
    title: 'Speed Typing Test | Improve Your Typing Skills',
    description: 'Test and improve your typing speed with our modern typing test application',
    type: 'website',
    url: process.env.NEXT_PUBLIC_APP_URL,
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_APP_URL}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: 'Speed Typing Test',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Speed Typing Test | Improve Your Typing Skills',
    description: 'Test and improve your typing speed with our modern typing test application',
    images: [`${process.env.NEXT_PUBLIC_APP_URL}/og-image.jpg`],
  },
  verification: {
    google: 'YOUR_GOOGLE_VERIFICATION_ID', // Replace with your Google Search Console verification ID
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/TypingSpeed.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" sizes="180x180" href="/TypingSpeed.svg" />
      </head>
      <body className={inter.className}>  
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}

