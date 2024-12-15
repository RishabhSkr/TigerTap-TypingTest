'use client'

import { useEffect, useState } from 'react'
import TypingTest from '../components/TypingTest'
import ThemeSwitcher from '../components/ThemeSwitcher'
import Footer from '../components/Footer'
import { initAnimations } from '../lib/initAnimations'

// Add metadata configuration
export const fetchCache = 'force-no-store'
export const dynamic = 'force-dynamic'

export default function Home() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (mounted) {
      const cleanup = initAnimations()
      return () => cleanup()
    }
  }, [mounted])

  if (!mounted) {
    return null // or a loading skeleton
  }

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      <div className="fixed inset-0 z-0" suppressHydrationWarning>
        <div className="typing-animation-bg" aria-hidden="true" />
        <div className="typing-symbols" id="typing-symbols" aria-hidden="true" />
        <div className="matrix-rain" id="matrix-rain" aria-hidden="true" />
      </div>
      
      <main className="container mx-auto p-4 relative z-10">
        <h1 className="text-4xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-emerald-500">
          TigerTap-Speed Typing Test
        </h1>
        <div suppressHydrationWarning>
          <ThemeSwitcher />
        </div>
        <TypingTest />
        <Footer />
      </main>
    </div>
  )
}

