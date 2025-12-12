'use client'

import { useLanguageStore, Language } from '@/store/useLanguageStore'
import { useThemeStore } from '@/store/useThemeStore'
import { Languages } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const languages: { code: Language; name: string; nativeName: string }[] = [
  { code: 'ru', name: 'Russian', nativeName: 'Русский' },
  { code: 'uz-cyrl', name: 'Uzbek (Cyrillic)', nativeName: 'Ўзбекча' },
  { code: 'uz-latn', name: 'Uzbek (Latin)', nativeName: "O'zbekcha" },
]

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguageStore()
  const theme = useThemeStore((state) => state.theme)
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const currentLanguage = languages.find((lang) => lang.code === language) || languages[0]

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const handleLanguageChange = (langCode: Language) => {
    setLanguage(langCode)
    setIsOpen(false)
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
          theme === 'dark'
            ? 'bg-gray-800 hover:bg-gray-700 text-white'
            : 'bg-white hover:bg-gray-100 text-gray-900 border border-gray-300'
        }`}
      >
        <Languages className="w-5 h-5" />
        <span className="font-medium">{currentLanguage.nativeName}</span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className={`absolute right-0 mt-2 w-56 rounded-lg shadow-lg z-50 ${
              theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
            }`}
          >
            <div className="py-1">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
                  className={`w-full text-left px-4 py-3 transition-colors flex items-center justify-between ${
                    language === lang.code
                      ? theme === 'dark'
                        ? 'bg-blue-900/30 text-blue-400'
                        : 'bg-blue-100 text-blue-700'
                      : theme === 'dark'
                      ? 'text-white hover:bg-gray-700'
                      : 'text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <div>
                    <div className="font-medium">{lang.nativeName}</div>
                    <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      {lang.name}
                    </div>
                  </div>
                  {language === lang.code && (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
