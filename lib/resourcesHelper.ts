import fs from 'fs'
import path from 'path'

// Типы для ресурсов
export interface LearningResource {
  id: number
  direction: string
  title: string
  url: string
  content_type: 'video' | 'article' | 'book' | 'course'
  difficulty_level: 'beginner' | 'intermediate' | 'advanced'
  duration_minutes: number | string
  tags: string[]
  description: string
}

// Маппинг профессий из Gemini на направления в базе данных
const PROFESSION_MAPPING: Record<string, string[]> = {
  // Python
  'Python-разработчик': ['Python-разработчик'],
  'Backend-разработчик': ['Python-разработчик'],
  'Django разработчик': ['Python-разработчик'],
  'Flask разработчик': ['Python-разработчик'],

  // Frontend
  'Frontend-разработчик': ['Frontend-разработчик'],
  'React-разработчик': ['Frontend-разработчик'],
  'Vue-разработчик': ['Frontend-разработчик'],
  'JavaScript-разработчик': ['Frontend-разработчик'],
  'Web-разработчик': ['Frontend-разработчик', 'Fullstack-разработчик'],

  // Data
  'Data Analyst': ['Data Analyst'],
  'Аналитик данных': ['Data Analyst'],
  'Дата-аналитик': ['Data Analyst'],
  'Бизнес-аналитик': ['Data Analyst'],

  // QA
  'QA-инженер': ['QA-инженер'],
  'Тестировщик': ['QA-инженер'],
  'QA Engineer': ['QA-инженер'],
  'Инженер по тестированию': ['QA-инженер'],

  // Design
  'UI/UX Designer': ['UI/UX Designer'],
  'UI/UX дизайнер': ['UI/UX Designer'],
  'Дизайнер интерфейсов': ['UI/UX Designer'],
  'Продуктовый дизайнер': ['UI/UX Designer'],

  // AI/Prompt
  'Prompt Engineer': ['Prompt Engineer'],
  'Prompt-инженер': ['Prompt Engineer'],
  'AI-специалист': ['Prompt Engineer', 'Machine Learning Engineer'],

  // DevOps
  'DevOps Engineer': ['DevOps Engineer'],
  'DevOps-инженер': ['DevOps Engineer'],
  'Системный администратор': ['DevOps Engineer'],

  // Mobile
  'Mobile Developer (Kotlin)': ['Mobile Developer (Kotlin)'],
  'Android-разработчик': ['Mobile Developer (Kotlin)'],
  'Kotlin-разработчик': ['Mobile Developer (Kotlin)'],

  // Game Dev
  'Game Developer (Unity/C#)': ['Game Developer (Unity/C#)'],
  'Разработчик игр': ['Game Developer (Unity/C#)'],
  'Unity-разработчик': ['Game Developer (Unity/C#)'],

  // Architecture
  'System Architect': ['System Architect'],
  'Системный архитектор': ['System Architect'],
  'Архитектор ПО': ['System Architect'],
  'Software Architect': ['System Architect'],

  // Fullstack
  'Fullstack-разработчик': ['Fullstack-разработчик'],
  'Full-stack Developer': ['Fullstack-разработчик'],
  'Full Stack разработчик': ['Fullstack-разработчик'],

  // Blockchain
  'Blockchain Developer': ['Blockchain Developer'],
  'Blockchain-разработчик': ['Blockchain Developer'],
  'Web3-разработчик': ['Blockchain Developer'],

  // ML
  'Machine Learning Engineer': ['Machine Learning Engineer'],
  'ML-инженер': ['Machine Learning Engineer'],
  'Инженер машинного обучения': ['Machine Learning Engineer'],
  'Data Scientist': ['Machine Learning Engineer', 'Data Analyst'],

  // iOS
  'iOS Developer (Swift)': ['iOS Developer (Swift)'],
  'iOS-разработчик': ['iOS Developer (Swift)'],
  'Swift-разработчик': ['iOS Developer (Swift)'],
}

// Загрузка базы данных ресурсов
function loadResourcesDatabase(): LearningResource[] {
  try {
    const filePath = path.join(process.cwd(), 'data', 'deep-json')
    const fileContent = fs.readFileSync(filePath, 'utf-8')
    return JSON.parse(fileContent)
  } catch (error) {
    console.error('Error loading resources database:', error)
    return []
  }
}

// Получить направления для профессии
function getDirectionsForProfession(profession: string): string[] {
  // Прямое совпадение
  if (PROFESSION_MAPPING[profession]) {
    return PROFESSION_MAPPING[profession]
  }

  // Нечеткий поиск по ключевым словам
  const professionLower = profession.toLowerCase()

  if (professionLower.includes('python') || professionLower.includes('backend')) {
    return ['Python-разработчик']
  }
  if (professionLower.includes('frontend') || professionLower.includes('react') || professionLower.includes('javascript')) {
    return ['Frontend-разработчик']
  }
  if (professionLower.includes('дата') || professionLower.includes('data') || professionLower.includes('аналит')) {
    return ['Data Analyst']
  }
  if (professionLower.includes('qa') || professionLower.includes('тест')) {
    return ['QA-инженер']
  }
  if (professionLower.includes('дизайн') || professionLower.includes('design') || professionLower.includes('ui') || professionLower.includes('ux')) {
    return ['UI/UX Designer']
  }
  if (professionLower.includes('prompt') || professionLower.includes('ai')) {
    return ['Prompt Engineer']
  }
  if (professionLower.includes('devops')) {
    return ['DevOps Engineer']
  }
  if (professionLower.includes('android') || professionLower.includes('kotlin')) {
    return ['Mobile Developer (Kotlin)']
  }
  if (professionLower.includes('игр') || professionLower.includes('game') || professionLower.includes('unity')) {
    return ['Game Developer (Unity/C#)']
  }
  if (professionLower.includes('архитект')) {
    return ['System Architect']
  }
  if (professionLower.includes('fullstack') || professionLower.includes('full stack')) {
    return ['Fullstack-разработчик']
  }
  if (professionLower.includes('blockchain') || professionLower.includes('web3')) {
    return ['Blockchain Developer']
  }
  if (professionLower.includes('machine learning') || professionLower.includes('ml') || professionLower.includes('машинн')) {
    return ['Machine Learning Engineer']
  }
  if (professionLower.includes('ios') || professionLower.includes('swift')) {
    return ['iOS Developer (Swift)']
  }

  // Если не нашли - возвращаем Frontend как дефолт
  return ['Frontend-разработчик']
}

// Получить ресурсы для профессии
export function getResourcesForProfession(
  profession: string,
  knowledgeLevel: 'начинающий' | 'базовый' | 'средний' | 'продвинутый' = 'начинающий',
  topicsCount: number = 3
): any[] {
  const allResources = loadResourcesDatabase()
  const directions = getDirectionsForProfession(profession)

  // Фильтруем ресурсы по направлениям
  const filteredResources = allResources.filter(resource =>
    directions.includes(resource.direction)
  )

  if (filteredResources.length === 0) {
    return []
  }

  // Определяем уровень сложности
  let difficultyLevels: ('beginner' | 'intermediate' | 'advanced')[] = ['beginner']

  if (knowledgeLevel === 'начинающий' || knowledgeLevel === 'базовый') {
    difficultyLevels = ['beginner', 'intermediate']
  } else if (knowledgeLevel === 'средний') {
    difficultyLevels = ['beginner', 'intermediate', 'advanced']
  } else if (knowledgeLevel === 'продвинутый') {
    difficultyLevels = ['intermediate', 'advanced']
  }

  // Фильтруем по уровню сложности
  const levelFiltered = filteredResources.filter(resource =>
    difficultyLevels.includes(resource.difficulty_level)
  )

  // Если после фильтрации пусто, берем все ресурсы направления
  const resourcesToUse = levelFiltered.length > 0 ? levelFiltered : filteredResources

  // Группируем ресурсы по типу контента для разнообразия
  const videos = resourcesToUse.filter(r => r.content_type === 'video')
  const articles = resourcesToUse.filter(r => r.content_type === 'article')
  const books = resourcesToUse.filter(r => r.content_type === 'book')
  const courses = resourcesToUse.filter(r => r.content_type === 'course')

  // Создаем разнообразный набор ресурсов
  const selectedResources: LearningResource[] = []
  const resourcesPerTopic = Math.ceil(5 / topicsCount) // ~2 ресурса на тему

  // Берем по 1-2 ресурса каждого типа
  if (videos.length > 0) selectedResources.push(...videos.slice(0, resourcesPerTopic))
  if (courses.length > 0) selectedResources.push(...courses.slice(0, resourcesPerTopic))
  if (articles.length > 0) selectedResources.push(...articles.slice(0, resourcesPerTopic))
  if (books.length > 0) selectedResources.push(...books.slice(0, 1))

  // Если мало ресурсов, добавляем еще
  if (selectedResources.length < 5) {
    const remaining = resourcesToUse.filter(r => !selectedResources.includes(r))
    selectedResources.push(...remaining.slice(0, 5 - selectedResources.length))
  }

  // Преобразуем в формат API
  const resourcesByTopic: any[] = []

  // Группируем по темам (примерно)
  const resourcesPerGroup = Math.ceil(selectedResources.length / topicsCount)

  for (let i = 0; i < topicsCount; i++) {
    const start = i * resourcesPerGroup
    const end = start + resourcesPerGroup
    const groupResources = selectedResources.slice(start, end)

    if (groupResources.length > 0) {
      resourcesByTopic.push({
        topic: `Тема ${i + 1}`,
        items: groupResources.map(resource => ({
          title: resource.title,
          url: resource.url,
          type: getTypeLabel(resource.content_type),
          description: resource.description,
          difficulty: resource.difficulty_level,
          duration: resource.duration_minutes,
          tags: resource.tags
        }))
      })
    }
  }

  return resourcesByTopic
}

// Преобразование типа контента в читаемую метку
function getTypeLabel(contentType: string): string {
  const labels: Record<string, string> = {
    'video': 'YouTube',
    'article': 'Статья',
    'book': 'Книга',
    'course': 'Курс'
  }
  return labels[contentType] || contentType
}

// Получить все доступные направления
export function getAllDirections(): string[] {
  const allResources = loadResourcesDatabase()
  const directions = new Set(allResources.map(r => r.direction))
  return Array.from(directions)
}
