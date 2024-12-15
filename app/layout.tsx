import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Providers } from './providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL('https://tigertap.vercel.app'),
  title: {
    default: 'TigerTap - Speed Typing Test | Check Your Typing Speed',
    template: '%s | TigerTap'
  },
  description: 'Free online typing test to check your typing speed (WPM), accuracy, and skill level. Practice typing with customizable texts and detailed analytics.',
  keywords: 'typing test, typing speed, WPM, words per minute, typing practice, typing skills, typing accuracy, online typing test, typing speed test',
  authors: [{ name: 'Rishabh Sonkar' }],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: 'TigerTap - Speed Typing Test',
    description: 'Test and improve your typing speed with our modern typing test application',
    type: 'website',
    url: 'https://tigertap.vercel.app/',
    images: [
      {
        url: '/TypingSpeed.svg',
        width: 1200,
        height: 630,
        alt: 'TigerTap Speed Typing Test',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TigerTap - Speed Typing Test',
    description: 'Test and improve your typing speed with our modern typing test application',
    images: ['/TypingSpeed.svg'],
  },
  icons: {
    icon: '/TypingSpeed.svg',
    apple: '/TypingSpeed.svg',
  },
  verification: {
    other: {
      'google-site-verification': 'drrcZuE9G-HLKwZ0XD6fM0irW3itW7yaVaOrX5W8CrQ',
    },
  },
  alternates: {
    canonical: 'https://tigertap.vercel.app',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={inter.className}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "TigerTap - Speed Typing Test",
              "description": "Free online typing test to check your typing speed (WPM), accuracy, and skill level.",
              "url": "https://tigertap.vercel.app",
              "applicationCategory": "EducationalApplication",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "author": {
                "@type": "Person",
                "name": "Rishabh Sonkar"
              }
            })
          }}
        />
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}

