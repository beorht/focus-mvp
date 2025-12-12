import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextRequest, NextResponse } from 'next/server'
import { getResourcesForProfession } from '@/lib/resourcesHelper'

// Get all API keys from environment
function getApiKeys(): string[] {
  const multipleKeys = process.env.GEMINI_API_KEYS
  if (multipleKeys) {
    return multipleKeys.split(',').map(key => key.trim()).filter(key => key.length > 0)
  }
  const singleKey = process.env.GEMINI_API_KEY
  return singleKey ? [singleKey] : []
}

// Try API request with key rotation on quota errors
async function generateWithKeyRotation(
  prompt: string,
  debugInfo: string[],
  attemptNumber = 0
): Promise<string> {
  const apiKeys = getApiKeys()

  if (apiKeys.length === 0) {
    throw new Error('No API keys configured')
  }

  const currentKeyIndex = attemptNumber % apiKeys.length
  const currentKey = apiKeys[currentKeyIndex]

  debugInfo.push(`Attempting with API key #${currentKeyIndex + 1} of ${apiKeys.length}`)

  try {
    const genAI = new GoogleGenerativeAI(currentKey)
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })
    const result = await model.generateContent(prompt)
    return result.response.text()
  } catch (error: any) {
    const isRetryableError = error.message?.includes('quota') ||
                             error.message?.includes('429') ||
                             error.message?.includes('503') ||
                             error.message?.includes('overloaded') ||
                             error.status === 429 ||
                             error.status === 503

    if (isRetryableError && attemptNumber < apiKeys.length - 1) {
      debugInfo.push(`Key #${currentKeyIndex + 1} failed (${error.status || 'unknown'}), trying next key...`)
      return generateWithKeyRotation(prompt, debugInfo, attemptNumber + 1)
    }

    // If all keys exhausted or different error, throw
    throw error
  }
}

export async function POST(request: NextRequest) {
  const startTime = Date.now()
  const requestId = `req_${Math.random().toString(36).substring(2, 15)}`
  let body: any = {}
  const debugInfo: string[] = []

  try {
    body = await request.json()
    const {
      userName,
      interests,
      level,
      knowledge_level,
      priority,
      workStyle,
      psychotype,
      preferred_learning_style,
      riasec_scores,
      riasec_percentages,
      holland_code
    } = body

    // Create debug info for logs
    debugInfo.push('POST /api/generate')
    debugInfo.push(`Payload: ${JSON.stringify(body)}`)
    debugInfo.push('Connecting to Gemini API with key rotation...')

    const interestsString = interests.join(', ')

    // Format RIASEC data for prompt
    const riasecInfo = riasec_scores ? `
* RIASEC профиль (код Холланда):
  - Holland Code: ${holland_code}
  - Realistic (Реалистичный): ${riasec_scores.R}/40 (${riasec_percentages.R}%)
  - Investigative (Исследовательский): ${riasec_scores.I}/40 (${riasec_percentages.I}%)
  - Artistic (Артистический): ${riasec_scores.A}/40 (${riasec_percentages.A}%)
  - Social (Социальный): ${riasec_scores.S}/40 (${riasec_percentages.S}%)
  - Enterprising (Предприимчивый): ${riasec_scores.E}/30 (${riasec_percentages.E}%)
  - Conventional (Стандартный): ${riasec_scores.C}/35 (${riasec_percentages.C}%)

ВАЖНО: Используй RIASEC профиль как ГЛАВНЫЙ фактор при подборе профессии. Код Холланда показывает наиболее подходящие типы профессий для человека.` : ''

    // Generate multiple profession recommendations
    const prompt = `Ты — профессиональный преподаватель, карьерный консультант и инженер ИИ для рынка Узбекистана. Проанализируй данные пользователя, используя RIASEC психометрический тест (код Холланда), подбери 3-5 наиболее подходящих профессий и сгенерируй краткую информацию для каждой.

Входные данные пользователя:

* Имя: ${userName || 'Пользователь'}
* Интересы: ${interestsString}
* Уровень знаний: ${knowledge_level || 'начинающий'} — «начинающий», «базовый», «средний», «продвинутый»
* Приоритет: ${priority}
* Стиль работы: ${workStyle}
* Психотип: ${psychotype}
* Стиль обучения: ${preferred_learning_style || 'смешанный'} — «визуальный», «практический», «текстовый», «смешанный»${riasecInfo}

ЗАДАЧИ:
1. ГЛАВНОЕ: Проанализируй RIASEC профиль (Holland Code) - это САМЫЙ ВАЖНЫЙ критерий для подбора профессий
   - Используй топ-3 категории (Holland Code) для определения подходящих профессий
   - Realistic (R) → технические, практические профессии (инженер, программист, механик)
   - Investigative (I) → научные, аналитические профессии (аналитик данных, исследователь, ученый)
   - Artistic (A) → творческие профессии (дизайнер, художник, контент-креатор)
   - Social (S) → работа с людьми (учитель, HR, психолог, менеджер по работе с клиентами)
   - Enterprising (E) → бизнес, лидерство (предприниматель, менеджер, продажи)
   - Conventional (C) → организация, администрирование (бухгалтер, администратор, аналитик)
2. Учти уровень знаний, приоритеты и стиль обучения для персонализации
3. Подбери 3-5 наиболее подходящих профессий для рынка Узбекистана
4. Для каждой профессии сгенерируй краткую roadmap с указанием времени в ЧАСАХ

Требование к выходу — простой, структурированный JSON. Формат выдачи:

{
  "professions": [
    {
      "profession": "Название профессии на русском",
      "match": 95,
      "salary_uz_sum": "5,000,000 - 15,000,000 сум/месяц",
      "introduction": "2-3 предложения — почему эта профессия подходит, ОБЯЗАТЕЛЬНО упомяни Holland Code и топ RIASEC категории",
      "topics": [
        {
          "title": "Название темы",
          "summary": "Краткий конспект (2-3 предложения)",
          "hours": 20,
          "examples": ["Пример 1", "Пример 2"],
          "tasks": [
            {
              "title": "Задание",
              "description": "Описание"
            }
          ]
        }
      ],
      "totalHours": 120
    }
  ]
}

ВАЖНЫЕ ТРЕБОВАНИЯ:
* Генерируй 3-5 профессий, отсортированных по убыванию match (самая подходящая первая)
* Каждое поле "hours" должно содержать ЧИСЛО (не строку!) - количество часов на изучение темы
* Поле "totalHours" - ЧИСЛО, сумма всех hours для всех topics
* НЕ используй слова "недели", "месяцы" - только ЧАСЫ в числовом формате
* Для начинающих: 80-150 часов общее время, 10-25 часов на тему
* Для среднего уровня: 150-250 часов общее время, 20-40 часов на тему
* Для продвинутых: 250-400 часов общее время, 30-60 часов на тему
* Генерируй 4-6 тем в зависимости от уровня знаний
* Учитывай реалии рынка труда Узбекистана
* Язык простой и дружелюбный

Выдай результат ТОЛЬКО в виде валидного JSON, без дополнительного текста, кода или markdown разметки.`

    debugInfo.push('Generating learning module...')

    const responseText = await generateWithKeyRotation(prompt, debugInfo)

    debugInfo.push('Response received from Gemini')

    // Clean the response - remove markdown code blocks if present
    let cleanedResponse = responseText
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim()

    debugInfo.push('Parsing JSON response...')

    const parsedData = JSON.parse(cleanedResponse)

    // Process each profession and add real resources
    debugInfo.push('Processing multiple profession recommendations...')

    if (parsedData.professions && Array.isArray(parsedData.professions)) {
      parsedData.professions = parsedData.professions.map((profession: any, index: number) => {
        debugInfo.push(`Processing profession ${index + 1}: ${profession.profession}`)

        // Add real resources from database
        const realResources = getResourcesForProfession(
          profession.profession,
          knowledge_level || 'начинающий',
          profession.topics?.length || 4
        )

        if (realResources.length > 0) {
          profession.resources = realResources.map((resourceGroup: any, idx: number) => {
            const topicTitle = profession.topics?.[idx]?.title || resourceGroup.topic
            return {
              ...resourceGroup,
              topic: topicTitle
            }
          })
          debugInfo.push(`  - Loaded ${realResources.length} resource groups`)
        } else {
          profession.resources = []
          debugInfo.push(`  - Warning: No resources found for ${profession.profession}`)
        }

        return profession
      })
    }

    const processingTime = Date.now() - startTime

    debugInfo.push(`Generated ${parsedData.professions?.length || 0} profession recommendations`)
    debugInfo.push('Analysis completed successfully')

    const apiKeys = getApiKeys()

    return NextResponse.json({
      success: true,
      data: parsedData,
      debugInfo,
      meta: {
        request_id: requestId,
        timestamp: new Date().toISOString(),
        processing_time_ms: processingTime,
        ai_model: 'Gemini 2.5 Flash',
        api_keys_available: apiKeys.length,
        user_name: userName || 'Пользователь',
        psychotype: psychotype,
        learning_style: preferred_learning_style
      }
    })

  } catch (error: any) {
    console.error('API Error:', error)

    // If quota exceeded, overloaded, or any API error, return mock data for testing
    const shouldUseMock = error.message?.includes('quota') ||
                          error.message?.includes('429') ||
                          error.message?.includes('503') ||
                          error.message?.includes('overloaded') ||
                          error.message?.includes('Service Unavailable')

    if (shouldUseMock) {
      const apiKeys = getApiKeys()
      const mockData = generateMockLearningModule(body)

      // Process each profession and add real resources
      if (mockData.professions && Array.isArray(mockData.professions)) {
        mockData.professions = mockData.professions.map((profession: any) => {
          const realResources = getResourcesForProfession(
            profession.profession,
            body.knowledge_level || 'начинающий',
            profession.topics?.length || 4
          )

          if (realResources.length > 0) {
            profession.resources = realResources.map((resourceGroup: any, idx: number) => {
              const topicTitle = profession.topics?.[idx]?.title || resourceGroup.topic
              return {
                ...resourceGroup,
                topic: topicTitle
              }
            })
          } else {
            profession.resources = []
          }

          return profession
        })
      }

      debugInfo.push('MOCK MODE: API unavailable or quota exceeded, using fallback data')
      debugInfo.push(`Error: ${error.message}`)
      debugInfo.push(`Tried ${apiKeys.length} API key(s)`)
      debugInfo.push(`Generated ${mockData.professions?.length || 0} mock profession recommendations`)

      return NextResponse.json({
        success: true,
        data: mockData,
        debugInfo,
        meta: {
          request_id: requestId,
          timestamp: new Date().toISOString(),
          processing_time_ms: Date.now() - startTime,
          ai_model: `Mock Data (API Error: ${error.message?.substring(0, 50) || 'Unknown'})`,
          api_keys_available: apiKeys.length,
          user_name: body.userName || 'Пользователь',
          psychotype: body.psychotype,
          learning_style: body.preferred_learning_style
        }
      })
    }

    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to generate analysis',
      debugInfo: ['ERROR: ' + (error.message || 'Unknown error')]
    }, { status: 500 })
  }
}

function generateMockLearningModule(userData: any) {
  const userName = userData.userName || 'Пользователь'
  const psychotype = userData.psychotype || 'ENFP (гибкий, адаптивный)'

  return {
    professions: [
      {
        profession: 'Frontend-разработчик',
        match: 92,
        salary_uz_sum: '5,000,000 - 12,000,000 сум/месяц',
        introduction: `Профессия Frontend-разработчик отлично подходит для вас! Ваш Holland Code показывает высокие результаты в категориях Realistic и Investigative, что идеально совпадает с техническими и аналитическими требованиями профессии.`,
        topics: [
          {
            title: 'HTML и CSS основы',
            summary: 'Изучение структуры веб-страниц с HTML и стилизации с CSS.',
            hours: 25,
            examples: ['Создание простой страницы-визитки', 'Верстка блога'],
            tasks: [{ title: 'Сверстать лендинг', description: 'Создайте простую лендинг-страницу с навигацией' }]
          },
          {
            title: 'JavaScript основы',
            summary: 'Программирование интерактивности на JavaScript.',
            hours: 30,
            examples: ['Калькулятор', 'To-Do список'],
            tasks: [{ title: 'Создать калькулятор', description: 'Реализуйте базовый калькулятор' }]
          },
          {
            title: 'React.js',
            summary: 'Разработка современных веб-приложений с React.',
            hours: 40,
            examples: ['SPA приложение', 'Интернет-магазин'],
            tasks: [{ title: 'Pet-проект на React', description: 'Создайте приложение для управления задачами' }]
          },
          {
            title: 'Git и работа в команде',
            summary: 'Версионный контроль и совместная разработка.',
            hours: 15,
            examples: ['Работа с GitHub', 'Pull requests'],
            tasks: [{ title: 'Внести вклад в open-source', description: 'Сделайте PR в открытый проект' }]
          }
        ],
        totalHours: 110,
        resources: []
      },
      {
        profession: 'UI/UX дизайнер',
        match: 88,
        salary_uz_sum: '4,000,000 - 10,000,000 сум/месяц',
        introduction: `UI/UX дизайн прекрасно подходит для вашего профиля! Высокие показатели в категориях Artistic и Social указывают на творческие способности и понимание потребностей пользователей.`,
        topics: [
          {
            title: 'Основы дизайна',
            summary: 'Изучение принципов композиции, цвета и типографики.',
            hours: 20,
            examples: ['Анализ популярных приложений', 'Создание мудбордов'],
            tasks: [{ title: 'Дизайн логотипа', description: 'Создайте логотип для вымышленной компании' }]
          },
          {
            title: 'Figma',
            summary: 'Работа в профессиональном инструменте для дизайна интерфейсов.',
            hours: 25,
            examples: ['Дизайн мобильного приложения', 'Веб-дизайн'],
            tasks: [{ title: 'Макет приложения', description: 'Создайте макет для приложения доставки еды' }]
          },
          {
            title: 'UX исследования',
            summary: 'Методы исследования пользователей и создание user flow.',
            hours: 30,
            examples: ['Проведение интервью', 'Создание персон'],
            tasks: [{ title: 'User research', description: 'Проведите исследование для реального продукта' }]
          },
          {
            title: 'Прототипирование',
            summary: 'Создание интерактивных прототипов и тестирование.',
            hours: 20,
            examples: ['Интерактивный прототип', 'A/B тестирование'],
            tasks: [{ title: 'Прототип в Figma', description: 'Создайте кликабельный прототип' }]
          }
        ],
        totalHours: 95,
        resources: []
      },
      {
        profession: 'Аналитик данных',
        match: 85,
        salary_uz_sum: '6,000,000 - 14,000,000 сум/месяц',
        introduction: `Аналитика данных соответствует вашему профилю RIASEC! Сильные стороны в категориях Investigative и Conventional говорят о склонности к исследованиям и систематической работе с информацией.`,
        topics: [
          {
            title: 'Excel и Google Sheets',
            summary: 'Работа с таблицами, формулы и визуализация данных.',
            hours: 20,
            examples: ['Анализ продаж', 'Создание дашбордов'],
            tasks: [{ title: 'Анализ данных в Excel', description: 'Проанализируйте датасет продаж' }]
          },
          {
            title: 'SQL',
            summary: 'Язык запросов для работы с базами данных.',
            hours: 30,
            examples: ['Запросы к базе данных', 'Аггрегация данных'],
            tasks: [{ title: 'SQL запросы', description: 'Напишите 10 сложных SQL запросов' }]
          },
          {
            title: 'Python для анализа данных',
            summary: 'Pandas, NumPy и визуализация с Matplotlib.',
            hours: 35,
            examples: ['Анализ датасета с Pandas', 'Визуализация трендов'],
            tasks: [{ title: 'Pet-проект на Python', description: 'Проанализируйте открытый датасет' }]
          },
          {
            title: 'Визуализация данных',
            summary: 'Power BI, Tableau для создания отчетов и дашбордов.',
            hours: 25,
            examples: ['Интерактивный дашборд', 'Презентация инсайтов'],
            tasks: [{ title: 'Дашборд в Power BI', description: 'Создайте бизнес-дашборд' }]
          }
        ],
        totalHours: 110,
        resources: []
      }
    ]
  }
}
