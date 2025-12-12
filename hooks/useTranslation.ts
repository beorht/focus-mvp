import { useLanguageStore } from '@/store/useLanguageStore'
import ru from '@/locales/ru.json'
import uzCyrl from '@/locales/uz-cyrl.json'
import uzLatn from '@/locales/uz-latn.json'

const translations = {
  ru,
  'uz-cyrl': uzCyrl,
  'uz-latn': uzLatn,
}

export function useTranslation() {
  const language = useLanguageStore((state) => state.language)

  const t = (key: string): string => {
    const keys = key.split('.')
    let value: any = translations[language]

    for (const k of keys) {
      if (value && typeof value === 'object') {
        value = value[k]
      } else {
        return key // Return key if translation not found
      }
    }

    return typeof value === 'string' ? value : key
  }

  const tf = (key: string, params: Record<string, string | number>): string => {
    let translation = t(key)

    // Replace placeholders like {min}, {max} with actual values
    Object.keys(params).forEach((param) => {
      translation = translation.replace(`{${param}}`, String(params[param]))
    })

    return translation
  }

  return { t, tf, language }
}
