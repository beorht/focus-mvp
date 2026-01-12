/**
 * Централизованные переводы для профессий
 * Используется в Translation API и других компонентах
 */

export type Language = 'ru' | 'uz-cyrl' | 'uz-latn'

export interface TranslatedText {
  ru: string
  'uz-cyrl': string
  'uz-latn': string
}

// Категории профессий
export const professionCategories: Record<string, TranslatedText> = {
  IT: {
    ru: 'Информационные технологии',
    'uz-cyrl': 'Ахборот технологиялари',
    'uz-latn': 'Axborot texnologiyalari'
  },
  Medicine: {
    ru: 'Медицина',
    'uz-cyrl': 'Тиббиёт',
    'uz-latn': 'Tibbiyot'
  },
  Engineering: {
    ru: 'Инженерия',
    'uz-cyrl': 'Муҳандислик',
    'uz-latn': 'Muhandislik'
  },
  Psychology: {
    ru: 'Психология',
    'uz-cyrl': 'Психология',
    'uz-latn': 'Psixologiya'
  },
  Finance: {
    ru: 'Финансы',
    'uz-cyrl': 'Молия',
    'uz-latn': 'Moliya'
  },
  Education: {
    ru: 'Образование',
    'uz-cyrl': 'Таълим',
    'uz-latn': 'Ta\'lim'
  },
  Art: {
    ru: 'Искусство',
    'uz-cyrl': 'Санъат',
    'uz-latn': 'San\'at'
  },
  Business: {
    ru: 'Бизнес',
    'uz-cyrl': 'Бизнес',
    'uz-latn': 'Biznes'
  }
}

// Уровни востребованности
export const demandLevels: Record<string, TranslatedText> = {
  high: {
    ru: 'Высокая',
    'uz-cyrl': 'Юқори',
    'uz-latn': 'Yuqori'
  },
  medium: {
    ru: 'Средняя',
    'uz-cyrl': 'Ўрта',
    'uz-latn': 'O\'rta'
  },
  low: {
    ru: 'Низкая',
    'uz-cyrl': 'Паст',
    'uz-latn': 'Past'
  }
}

// RIASEC категории
export const riasecCategories: Record<string, TranslatedText> = {
  R: {
    ru: 'Практические навыки',
    'uz-cyrl': 'Амалий кўникмалар',
    'uz-latn': 'Amaliy ko\'nikmalar'
  },
  I: {
    ru: 'Исследовательский подход',
    'uz-cyrl': 'Тадқиқот ёндашуви',
    'uz-latn': 'Tadqiqot yondashuvi'
  },
  A: {
    ru: 'Творческое мышление',
    'uz-cyrl': 'Ижодий фикрлаш',
    'uz-latn': 'Ijodiy fikrlash'
  },
  S: {
    ru: 'Работа с людьми',
    'uz-cyrl': 'Одамлар билан ишлаш',
    'uz-latn': 'Odamlar bilan ishlash'
  },
  E: {
    ru: 'Лидерство',
    'uz-cyrl': 'Етакчилик',
    'uz-latn': 'Yetakchilik'
  },
  C: {
    ru: 'Организованность',
    'uz-cyrl': 'Ташкилотчилик',
    'uz-latn': 'Tashkilotchilik'
  }
}

// Общие фразы для Results Page
export const resultsPageTranslations: Record<string, TranslatedText> = {
  yourTopProfessions: {
    ru: 'Ваши подходящие профессии',
    'uz-cyrl': 'Сизга мос касблар',
    'uz-latn': 'Sizga mos kasblar'
  },
  matchPercentage: {
    ru: 'Совпадение',
    'uz-cyrl': 'Мос келиш',
    'uz-latn': 'Mos kelish'
  },
  category: {
    ru: 'Категория',
    'uz-cyrl': 'Категория',
    'uz-latn': 'Kategoriya'
  },
  salary: {
    ru: 'Зарплата',
    'uz-cyrl': 'Иш ҳақи',
    'uz-latn': 'Ish haqi'
  },
  yourStrengths: {
    ru: 'Ваши сильные стороны',
    'uz-cyrl': 'Сизнинг кучли томонларингиз',
    'uz-latn': 'Sizning kuchli tomonlaringiz'
  },
  description: {
    ru: 'Описание',
    'uz-cyrl': 'Таърифи',
    'uz-latn': 'Ta\'rifi'
  },
  requiredSkills: {
    ru: 'Необходимые навыки',
    'uz-cyrl': 'Зарур кўникмалар',
    'uz-latn': 'Zarur ko\'nikmalar'
  },
  marketDemand: {
    ru: 'Востребованность',
    'uz-cyrl': 'Талаб даражаси',
    'uz-latn': 'Talab darajasi'
  },
  retakeTest: {
    ru: 'Пройти тест заново',
    'uz-cyrl': 'Тестни қайтадан ўтиш',
    'uz-latn': 'Testni qaytadan o\'tish'
  },
  basedOnYourRiasec: {
    ru: 'На основе вашего RIASEC-профиля',
    'uz-cyrl': 'Сизнинг RIASEC-профилингиз асосида',
    'uz-latn': 'Sizning RIASEC-profilingiz asosida'
  },
  itBonus: {
    ru: 'IT-бонус',
    'uz-cyrl': 'IT-бонус',
    'uz-latn': 'IT-bonus'
  }
}

// Helper функция для получения перевода
export function getTranslation(
  translations: TranslatedText,
  language: Language
): string {
  return translations[language] || translations.ru
}

// Helper функция для перевода категории
export function translateCategory(
  category: string,
  language: Language
): string {
  return getTranslation(professionCategories[category] || professionCategories.IT, language)
}

// Helper функция для перевода уровня востребованности
export function translateDemand(
  demand: string,
  language: Language
): string {
  return getTranslation(demandLevels[demand] || demandLevels.medium, language)
}

// Helper функция для перевода RIASEC категории
export function translateRiasec(
  riasec: string,
  language: Language
): string {
  return getTranslation(riasecCategories[riasec] || riasecCategories.R, language)
}
