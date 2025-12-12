import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Language = 'ru' | 'uz-cyrl' | 'uz-latn'

interface LanguageState {
  language: Language
  setLanguage: (language: Language) => void
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      language: 'ru',
      setLanguage: (language) => set({ language }),
    }),
    {
      name: 'focus-language-storage',
    }
  )
)
