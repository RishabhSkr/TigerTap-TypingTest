'use client'

import { useTheme } from 'next-themes'
import { Button } from '../components/ui/button'
import { Moon, Sun } from 'lucide-react'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Wait until mounted on client-side
  useEffect(() => {
    setMounted(true)
  }, [])

  // Don't render anything until mounted
  if (!mounted) {
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Button
        variant="outline"
        size="icon"
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        className="fixed top-4 right-4 z-50"
      >
        <motion.div
          key={theme} // Add key to force re-render on theme change
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.2 }}
        >
          {theme === 'dark' ? (
            <Sun className="h-[1.2rem] w-[1.2rem] text-yellow-400" />
          ) : (
            <Moon className="h-[1.2rem] w-[1.2rem] text-slate-800" />
          )}
        </motion.div>
        <span className="sr-only">Toggle theme</span>
      </Button>
    </motion.div>
  )
}

