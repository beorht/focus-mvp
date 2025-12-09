import fs from 'fs'
import path from 'path'

export interface KnowledgeEntry {
  tags: string[]
  answer: string
}

let cachedKnowledgeBase: KnowledgeEntry[] | null = null

// Загрузка базы знаний из файла
export function loadKnowledgeBase(): KnowledgeEntry[] {
  if (cachedKnowledgeBase) {
    return cachedKnowledgeBase
  }

  try {
    const filePath = path.join(process.cwd(), 'data', 'chat.json')
    const fileContent = fs.readFileSync(filePath, 'utf-8')
    cachedKnowledgeBase = JSON.parse(fileContent)
    return cachedKnowledgeBase || []
  } catch (error) {
    console.error('Error loading knowledge base:', error)
    return []
  }
}

// Нормализация текста для поиска
function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .trim()
    // Убираем знаки препинания
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '')
    // Убираем множественные пробелы
    .replace(/\s+/g, ' ')
}

// Вычисление релевантности вопроса к тегам
function calculateRelevance(question: string, tags: string[]): number {
  const normalizedQuestion = normalizeText(question)
  const questionWords = normalizedQuestion.split(' ').filter(w => w.length > 2)

  let matchScore = 0
  let maxPossibleScore = tags.length

  for (const tag of tags) {
    const normalizedTag = normalizeText(tag)
    const tagWords = normalizedTag.split(' ')

    // Точное совпадение тега с вопросом
    if (normalizedQuestion.includes(normalizedTag)) {
      matchScore += 10
      continue
    }

    // Совпадение всех слов тега
    const allTagWordsMatch = tagWords.every(tagWord =>
      questionWords.some(qWord => qWord.includes(tagWord) || tagWord.includes(qWord))
    )

    if (allTagWordsMatch && tagWords.length > 0) {
      matchScore += 5
      continue
    }

    // Частичное совпадение слов
    const matchingWords = tagWords.filter(tagWord =>
      questionWords.some(qWord => qWord.includes(tagWord) || tagWord.includes(qWord))
    )

    if (matchingWords.length > 0) {
      matchScore += (matchingWords.length / tagWords.length) * 3
    }
  }

  // Нормализуем счет от 0 до 1
  return maxPossibleScore > 0 ? matchScore / maxPossibleScore : 0
}

// Поиск наиболее релевантного ответа из базы знаний
export function findBestAnswer(question: string, threshold: number = 0.3): KnowledgeEntry | null {
  const knowledgeBase = loadKnowledgeBase()

  if (knowledgeBase.length === 0) {
    return null
  }

  let bestMatch: { entry: KnowledgeEntry; score: number } | null = null

  for (const entry of knowledgeBase) {
    const relevance = calculateRelevance(question, entry.tags)

    if (relevance > threshold) {
      if (!bestMatch || relevance > bestMatch.score) {
        bestMatch = { entry, score: relevance }
      }
    }
  }

  return bestMatch ? bestMatch.entry : null
}

// Поиск всех релевантных ответов (топ N)
export function findRelevantAnswers(question: string, topN: number = 3, threshold: number = 0.2): KnowledgeEntry[] {
  const knowledgeBase = loadKnowledgeBase()

  if (knowledgeBase.length === 0) {
    return []
  }

  const scoredEntries = knowledgeBase
    .map(entry => ({
      entry,
      score: calculateRelevance(question, entry.tags)
    }))
    .filter(item => item.score > threshold)
    .sort((a, b) => b.score - a.score)
    .slice(0, topN)

  return scoredEntries.map(item => item.entry)
}

// Получить контекст для Gemini на основе релевантных ответов
export function getContextForAI(question: string): string {
  const relevantAnswers = findRelevantAnswers(question, 3, 0.15)

  if (relevantAnswers.length === 0) {
    return ''
  }

  const contextParts = relevantAnswers.map((entry, index) => {
    return `Релевантная информация ${index + 1}:\n${entry.answer}`
  })

  return `\n\nКонтекст из базы знаний F.O.C.U.S:\n${contextParts.join('\n\n')}\n`
}
