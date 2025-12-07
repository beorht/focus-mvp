import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextRequest, NextResponse } from 'next/server'

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
    const isQuotaError = error.message?.includes('quota') ||
                         error.message?.includes('429') ||
                         error.status === 429

    if (isQuotaError && attemptNumber < apiKeys.length - 1) {
      debugInfo.push(`Key #${currentKeyIndex + 1} quota exceeded, trying next key...`)
      return generateWithKeyRotation(prompt, debugInfo, attemptNumber + 1)
    }

    // If all keys exhausted or different error, throw
    throw error
  }
}

export async function POST(request: NextRequest) {
  const startTime = Date.now()
  const requestId = `req_${Math.random().toString(36).substring(2, 15)}`

  try {
    const body = await request.json()
    const {
      userName,
      interests,
      level,
      knowledge_level,
      priority,
      workStyle,
      psychotype,
      preferred_learning_style
    } = body

    // Create debug info for logs
    const debugInfo: string[] = []
    debugInfo.push('POST /api/generate')
    debugInfo.push(`Payload: ${JSON.stringify(body)}`)
    debugInfo.push('Connecting to Gemini API with key rotation...')

    const interestsString = interests.join(', ')

    // Generate the learning module (profession determination is done within the same prompt)
    const prompt = `Ты — профессиональный преподаватель, карьерный консультант и инженер ИИ для рынка Узбекистана. Проанализируй данные пользователя, подбери идеальную профессию и сгенерируй персонализированный учебный модуль.

Входные данные пользователя:

* Имя: ${userName || 'Пользователь'}
* Интересы: ${interestsString}
* Уровень знаний: ${knowledge_level || 'начинающий'} — «начинающий», «базовый», «средний», «продвинутый»
* Приоритет: ${priority}
* Стиль работы: ${workStyle}
* Психотип: ${psychotype}
* Стиль обучения: ${preferred_learning_style || 'смешанный'} — «визуальный», «практический», «текстовый», «смешанный»

ЗАДАЧИ:
1. Проанализируй интересы, уровень, приоритеты и психотип пользователя
2. Подбери наиболее подходящую профессию для рынка Узбекистана
3. Сгенерируй персонализированный учебный модуль

Требование к выходу — простой, структурированный JSON. Формат выдачи:

{
  "profession": "Название подобранной профессии на русском",
  "match": 95,
  "salary_uz_sum": "5,000,000 - 15,000,000 сум/месяц",
  "introduction": "2-3 предложения — почему эта профессия подходит, связать с psychotype и interests",
  "topics": [
    {
      "title": "Название темы",
      "summary": "Краткий конспект (3-6 предложений)",
      "examples": ["Пример 1", "Пример 2"],
      "tasks": [
        {
          "title": "Базовое задание",
          "description": "Описание задания с шагами"
        },
        {
          "title": "Продвинутое задание",
          "description": "Более сложное задание"
        }
      ],
      "questions": [
        "Контрольный вопрос 1?",
        "Контрольный вопрос 2?",
        "Контрольный вопрос 3?"
      ]
    }
  ],
  "skill_gaps": [
    "Навык 1 (самый важный)",
    "Навык 2",
    "Навык 3"
  ],
  "learning_plan": {
    "order": ["Тема 1", "Тема 2", "Тема 3"],
    "time_estimates": {
      "Тема 1": "2 недели",
      "Тема 2": "3 недели",
      "Тема 3": "4 недели"
    }
  },
  "resources": [
    {
      "topic": "Тема 1",
      "items": [
        {
          "title": "Название ресурса",
          "url": "https://example.com",
          "type": "YouTube/Udemy/Docs"
        }
      ]
    }
  ],
  "motivation": "2-3 предложения с советом, как удерживать мотивацию"
}

Требования к стилю и длине:

* Язык простой и дружелюбный, без академического жаргона.
* Каждый конспект не более 6 предложений.
* Практические задания чёткие, короткие инструкции (3–6 шагов).
* Максимум лаконичности: весь модуль для уровня «начинающий» — ~600–900 слов; для «средний/продвинутый» — до 1200 слов.
* Учитывай психотип: если психотип интроверт/аналитик — предлагай больше самостоятельных практик и чтения; если экстраверт/практик — включай коллаборативные задания и проекты.
* Генерируй 3-8 тем в зависимости от уровня знаний.
* Учитывай реалии рынка труда Узбекистана.

Доп. условие: если в входных данных нет interests или psychotype, действуй разумно — используй типичный профиль для выбранной профессии и пометь это в introduction: «(профиль сгенерирован на основе типичных характеристик для профессии)».

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

    const processingTime = Date.now() - startTime

    debugInfo.push(`Learning module generated for: ${parsedData.profession}`)
    debugInfo.push(`Topics count: ${parsedData.topics?.length || 0}`)
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

    // If quota exceeded or API error, return mock data for testing
    if (error.message?.includes('quota') || error.message?.includes('429')) {
      const apiKeys = getApiKeys()
      const mockData = generateMockLearningModule(body)

      debugInfo.push('MOCK MODE: All API keys quota exceeded, using fallback data')
      debugInfo.push(`Tried ${apiKeys.length} API key(s)`)
      debugInfo.push(`Generated mock module for profession: ${mockData.profession}`)

      return NextResponse.json({
        success: true,
        data: mockData,
        debugInfo,
        meta: {
          request_id: requestId,
          timestamp: new Date().toISOString(),
          processing_time_ms: Date.now() - startTime,
          ai_model: `Mock Data (All ${apiKeys.length} API keys exhausted)`,
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
  const interests = userData.interests || []
  const userName = userData.userName || 'Пользователь'
  const psychotype = userData.psychotype || 'ENFP (гибкий, адаптивный)'
  const knowledgeLevel = userData.knowledge_level || 'начинающий'

  // Determine profession based on interests
  let profession = 'Frontend-разработчик'
  if (interests.includes('design')) {
    profession = 'UI/UX дизайнер'
  } else if (interests.includes('data')) {
    profession = 'Аналитик данных'
  } else if (interests.includes('business')) {
    profession = 'Продакт-менеджер'
  } else if (interests.includes('creative')) {
    profession = 'Контент-креатор'
  }

  return {
    profession: profession,
    match: 92,
    salary_uz_sum: '5,000,000 - 12,000,000 сум/месяц',
    introduction: `Профессия ${profession} отлично подходит для вас, ${userName}! Ваш психотип ${psychotype} позволяет эффективно работать в этой области. Выбранные интересы (${interests.join(', ')}) идеально совпадают с требованиями профессии.`,
    topics: [
      {
        title: 'Основы профессии',
        summary: 'Введение в профессию. Изучение базовых концепций и терминологии. Понимание роли специалиста в команде. Знакомство с инструментами и технологиями. Первые шаги в практике.',
        examples: [
          'Изучение типичного рабочего дня специалиста',
          'Обзор популярных инструментов и платформ'
        ],
        tasks: [
          {
            title: 'Базовое задание',
            description: '1. Изучите 3 статьи о профессии. 2. Составьте список из 10 ключевых терминов. 3. Напишите краткое резюме (200 слов) о том, что делает специалист.'
          },
          {
            title: 'Продвинутое задание',
            description: '1. Проведите интервью с практикующим специалистом. 2. Создайте mind-map профессии. 3. Подготовьте презентацию на 5 минут.'
          }
        ],
        questions: [
          'Какие основные обязанности у специалиста?',
          'Какие инструменты наиболее популярны в этой сфере?',
          'В чем ключевые отличия от смежных профессий?'
        ]
      },
      {
        title: 'Технические навыки',
        summary: 'Освоение ключевых технических компетенций. Изучение современных инструментов и технологий. Практика на реальных примерах. Развитие профессиональных навыков. Подготовка к работе над проектами.',
        examples: [
          'Работа с профессиональными инструментами',
          'Создание первого учебного проекта'
        ],
        tasks: [
          {
            title: 'Базовое задание',
            description: '1. Установите необходимое ПО. 2. Пройдите вводный туториал. 3. Создайте простой проект по шаблону.'
          },
          {
            title: 'Продвинутое задание',
            description: '1. Создайте проект с нуля. 2. Добавьте 3 функции. 3. Протестируйте и задокументируйте код.'
          }
        ],
        questions: [
          'Какие технические инструменты вы освоили?',
          'Как вы решали возникающие проблемы?',
          'Что было самым сложным в процессе обучения?'
        ]
      },
      {
        title: 'Работа над проектами',
        summary: 'Применение знаний на практике. Работа с реальными кейсами. Развитие навыков планирования. Управление временем и ресурсами. Презентация результатов работы.',
        examples: [
          'Разработка pet-проекта для портфолио',
          'Участие в open-source проектах'
        ],
        tasks: [
          {
            title: 'Базовое задание',
            description: '1. Выберите простой проект. 2. Составьте план работы на неделю. 3. Реализуйте минимальную версию.'
          },
          {
            title: 'Продвинутое задание',
            description: '1. Разработайте полноценный проект. 2. Добавьте документацию. 3. Опубликуйте на GitHub и подготовьте презентацию.'
          }
        ],
        questions: [
          'Как вы планируете работу над проектом?',
          'Какие методологии разработки вы используете?',
          'Как вы тестируете свою работу?'
        ]
      },
      {
        title: 'Профессиональное развитие',
        summary: 'Построение карьеры в индустрии. Networking и сообщества. Поиск первой работы или стажировки. Подготовка портфолио. Развитие soft skills.',
        examples: [
          'Создание профессионального профиля на LinkedIn',
          'Участие в профессиональных мероприятиях'
        ],
        tasks: [
          {
            title: 'Базовое задание',
            description: '1. Создайте резюме. 2. Оформите портфолио с 3 проектами. 3. Присоединитесь к 2 профессиональным сообществам.'
          },
          {
            title: 'Продвинутое задание',
            description: '1. Подготовьте case study для интервью. 2. Пройдите mock-интервью. 3. Подайте заявки на 5 позиций.'
          }
        ],
        questions: [
          'Что включить в портфолио?',
          'Как эффективно искать работу?',
          'Какие soft skills важны для специалиста?'
        ]
      }
    ],
    skill_gaps: [
      'Практический опыт работы с инструментами (самое важное)',
      'Знание современных методологий и подходов',
      'Навыки работы в команде и коммуникации',
      'Понимание бизнес-процессов',
      'Английский язык для работы с документацией'
    ],
    learning_plan: {
      order: [
        'Основы профессии',
        'Технические навыки',
        'Работа над проектами',
        'Профессиональное развитие'
      ],
      time_estimates: {
        'Основы профессии': '2-3 недели',
        'Технические навыки': '6-8 недель',
        'Работа над проектами': '8-12 недель',
        'Профессиональное развитие': 'постоянно'
      }
    },
    resources: [
      {
        topic: 'Основы профессии',
        items: [
          {
            title: 'Введение в профессию - полный курс',
            url: 'https://www.youtube.com/watch?v=example',
            type: 'YouTube'
          },
          {
            title: 'Карьера в IT - гайд для начинающих',
            url: 'https://www.udemy.com/course/example',
            type: 'Udemy'
          }
        ]
      },
      {
        topic: 'Технические навыки',
        items: [
          {
            title: 'Официальная документация',
            url: 'https://docs.example.com',
            type: 'Docs'
          },
          {
            title: 'Практический курс для начинающих',
            url: 'https://www.coursera.org/example',
            type: 'Coursera'
          }
        ]
      },
      {
        topic: 'Работа над проектами',
        items: [
          {
            title: 'GitHub для начинающих',
            url: 'https://github.com',
            type: 'Platform'
          },
          {
            title: 'Идеи для pet-проектов',
            url: 'https://www.freecodecamp.org',
            type: 'Resource'
          }
        ]
      }
    ],
    motivation: `Помните, ${userName}, что обучение — это марафон, а не спринт. Ваш ${psychotype} означает, что вы можете находить уникальные подходы к решению задач. Связывайте новые знания с вашими интересами (${interests.join(', ')}), создавайте проекты, которые вам действительно интересны. Присоединяйтесь к сообществам, делитесь своим прогрессом, и не бойтесь ошибок — они лучший учитель!`
  }
}
