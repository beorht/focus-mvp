'use client'

import { useEffect, useState } from 'react'
import { useThemeStore } from '@/store/useThemeStore'
import { Sun, Moon } from 'lucide-react'
import { motion } from 'framer-motion'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useThemeStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted) {
      document.documentElement.setAttribute('data-theme', theme)
    }
  }, [theme, mounted])

  if (!mounted) {
    return null
  }

  return (
    <motion.button
      onClick={toggleTheme}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all"
      style={{
        background: theme === 'dark'
          ? 'linear-gradient(135deg, #4a6660 0%, #2d4a45 100%)'
          : 'linear-gradient(135deg, #8eb69b 0%, #6a9d7d 100%)'
      }}
      aria-label="Toggle theme"
    >
      <motion.div
        initial={false}
        animate={{ rotate: theme === 'dark' ? 0 : 180 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        {theme === 'dark' ? (
          <Moon className="w-5 h-5 text-white" />
        ) : (
          <Sun className="w-5 h-5 text-white" />
        )}
      </motion.div>
    </motion.button>
  )
}
