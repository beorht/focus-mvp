import { professionsDatabase, Profession, RiasecProfile } from './professionsDatabase'

export interface RiasecScores {
  R: number
  I: number
  A: number
  S: number
  E: number
  C: number
}

export interface MatchDetails {
  riasecMatch: number // базовое совпадение (0-100%)
  bonusPoints: number // IT-бонус
  topStrengths: string[] // топ-3 совпадающих категорий RIASEC
}

export interface MatchResult {
  profession: Profession
  matchPercentage: number // итоговый match% с бонусами
  matchDetails: MatchDetails
}

// Названия категорий RIASEC для отображения
const riasecNames: Record<keyof RiasecScores, { ru: string; 'uz-cyrl': string; 'uz-latn': string }> = {
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

/**
 * Вычисление косинусного сходства между двумя RIASEC векторами
 * Формула: cosine_similarity = (A · B) / (||A|| × ||B||)
 */
function cosineSimilarity(userProfile: RiasecScores, professionProfile: RiasecProfile): number {
  const keys: (keyof RiasecScores)[] = ['R', 'I', 'A', 'S', 'E', 'C']

  // Скалярное произведение (dot product)
  let dotProduct = 0
  for (const key of keys) {
    dotProduct += userProfile[key] * professionProfile[key]
  }

  // Длина векторов (magnitude)
  let userMagnitude = 0
  let professionMagnitude = 0
  for (const key of keys) {
    userMagnitude += userProfile[key] ** 2
    professionMagnitude += professionProfile[key] ** 2
  }
  userMagnitude = Math.sqrt(userMagnitude)
  professionMagnitude = Math.sqrt(professionMagnitude)

  // Избегаем деления на ноль
  if (userMagnitude === 0 || professionMagnitude === 0) {
    return 0
  }

  // Косинусное сходство (от -1 до 1, но в нашем случае всегда от 0 до 1)
  return dotProduct / (userMagnitude * professionMagnitude)
}

/**
 * Определение топ-3 категорий RIASEC, где пользователь показал наилучшее совпадение
 */
function getTopStrengths(
  userProfile: RiasecScores,
  professionProfile: RiasecProfile,
  language: 'ru' | 'uz-cyrl' | 'uz-latn' = 'ru'
): string[] {
  const keys: (keyof RiasecScores)[] = ['R', 'I', 'A', 'S', 'E', 'C']

  // Вычисляем вклад каждой категории в совпадение
  const contributions = keys.map(key => ({
    key,
    contribution: userProfile[key] * professionProfile[key],
    name: riasecNames[key][language]
  }))

  // Сортируем по убыванию вклада и берем топ-3
  contributions.sort((a, b) => b.contribution - a.contribution)

  return contributions.slice(0, 3).map(c => c.name)
}

/**
 * Главная функция подбора профессий
 * Возвращает 3-6 наиболее подходящих профессий с процентами совпадения
 */
export function matchProfessions(
  userRiasecPercentages: RiasecScores,
  language: 'ru' | 'uz-cyrl' | 'uz-latn' = 'ru'
): MatchResult[] {
  const IT_BONUS = 5 // бонус для IT профессий
  const results: MatchResult[] = []

  // Для каждой профессии вычисляем совпадение
  for (const profession of professionsDatabase) {
    // 1. Вычисляем базовое совпадение через косинусное сходство
    const similarity = cosineSimilarity(userRiasecPercentages, profession.riasecProfile)

    // 2. Конвертируем в процент (0-100%)
    const baseMatch = Math.round(similarity * 100)

    // 3. Добавляем бонус для IT профессий
    const bonus = profession.category === 'IT' ? IT_BONUS : 0

    // 4. Итоговый match% (максимум 100%)
    const finalMatch = Math.min(100, baseMatch + bonus)

    // 5. Определяем топ-3 сильных сторон
    const topStrengths = getTopStrengths(userRiasecPercentages, profession.riasecProfile, language)

    results.push({
      profession,
      matchPercentage: finalMatch,
      matchDetails: {
        riasecMatch: baseMatch,
        bonusPoints: bonus,
        topStrengths
      }
    })
  }

  // Сортируем по убыванию match%
  results.sort((a, b) => b.matchPercentage - a.matchPercentage)

  // Определяем, сколько профессий вернуть (3-6)
  const topResults = selectTopProfessions(results)

  return topResults
}

/**
 * Логика отбора топ-N профессий (от 3 до 6)
 * Правила:
 * - Если разница между 3-й и 4-й профессией > 10% → вернуть 3
 * - Если 4-я профессия match > 60% → вернуть 4-6
 * - Максимум 6 профессий
 */
function selectTopProfessions(results: MatchResult[]): MatchResult[] {
  if (results.length <= 3) {
    return results
  }

  const third = results[2].matchPercentage
  const fourth = results[3].matchPercentage

  // Если большой разрыв между 3-й и 4-й профессией, возвращаем только топ-3
  if (third - fourth > 10) {
    return results.slice(0, 3)
  }

  // Если 4-я профессия имеет хороший match (>60%), включаем больше профессий
  if (fourth > 60) {
    // Возвращаем до 6 профессий, которые имеют match > 60%
    const filtered = results.filter(r => r.matchPercentage > 60).slice(0, 6)
    return filtered
  }

  // В остальных случаях возвращаем топ-4
  return results.slice(0, 4)
}

/**
 * Helper функция для получения названия категории RIASEC на нужном языке
 */
export function getRiasecCategoryName(
  category: keyof RiasecScores,
  language: 'ru' | 'uz-cyrl' | 'uz-latn' = 'ru'
): string {
  return riasecNames[category][language]
}

/**
 * Helper функция для форматирования match% с учетом бонусов
 */
export function formatMatchPercentage(matchResult: MatchResult): string {
  const { matchPercentage, matchDetails } = matchResult

  if (matchDetails.bonusPoints > 0) {
    return `${matchPercentage}% (базовый ${matchDetails.riasecMatch}% + IT-бонус ${matchDetails.bonusPoints}%)`
  }

  return `${matchPercentage}%`
}

/**
 * Статистика совпадения для debugging
 */
export function getMatchStatistics(results: MatchResult[]): {
  totalProfessions: number
  averageMatch: number
  topMatch: number
  bottomMatch: number
  itProfessionsCount: number
} {
  if (results.length === 0) {
    return {
      totalProfessions: 0,
      averageMatch: 0,
      topMatch: 0,
      bottomMatch: 0,
      itProfessionsCount: 0
    }
  }

  const matches = results.map(r => r.matchPercentage)
  const averageMatch = Math.round(matches.reduce((a, b) => a + b, 0) / matches.length)
  const topMatch = Math.max(...matches)
  const bottomMatch = Math.min(...matches)
  const itProfessionsCount = results.filter(r => r.profession.category === 'IT').length

  return {
    totalProfessions: results.length,
    averageMatch,
    topMatch,
    bottomMatch,
    itProfessionsCount
  }
}
