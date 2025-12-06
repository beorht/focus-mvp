import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextRequest, NextResponse } from 'next/server'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

export async function POST(request: NextRequest) {
  const startTime = Date.now()
  const requestId = `req_${Math.random().toString(36).substring(2, 15)}`

  try {
    const body = await request.json()
    const { interests, level, priority, workStyle } = body

    // Create debug info for logs
    const debugInfo: string[] = []
    debugInfo.push('POST /api/generate')
    debugInfo.push(`Payload: ${JSON.stringify({ interests, level, priority, workStyle })}`)
    debugInfo.push('Connecting to Gemini API...')

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

    const prompt = `Ты карьерный консультант для рынка Узбекистана. Проанализируй данные пользователя и подбери идеальную профессию.

ДАННЫЕ ПОЛЬЗОВАТЕЛЯ:
- Интересы: ${interests.join(', ')}
- Уровень: ${level}
- Приоритет: ${priority}
- Стиль работы: ${workStyle}

ВАЖНО: Верни ТОЛЬКО валидный JSON без дополнительного текста в следующем формате:
{
  "profession": "Название профессии на русском",
  "profession_en": "Profession name in English",
  "match": 98,
  "salary_uz_sum": "5,000,000 - 15,000,000 сум/месяц",
  "description": "Краткое описание профессии (2-3 предложения)",
  "roadmap": [
    {
      "stage": "Junior Developer",
      "duration": "6-12 месяцев",
      "topics": ["HTML/CSS", "JavaScript", "Git", "React"]
    },
    {
      "stage": "Middle Developer",
      "duration": "1-2 года",
      "topics": ["Node.js", "TypeScript", "SQL/NoSQL", "REST API"]
    },
    {
      "stage": "Senior Developer",
      "duration": "2-3 года",
      "topics": ["System Design", "Microservices", "DevOps", "Team Leadership"]
    }
  ],
  "resources": [
    {
      "title": "JavaScript для начинающих",
      "url": "https://www.youtube.com/watch?v=...",
      "type": "YouTube"
    },
    {
      "title": "Полный курс Web Development",
      "url": "https://www.udemy.com/course/...",
      "type": "Udemy"
    },
    {
      "title": "Официальная документация React",
      "url": "https://react.dev",
      "type": "Docs"
    }
  ]
}

Учитывай реалии рынка труда Узбекистана при подборе зарплаты и востребованности профессии.`

    debugInfo.push('Generating AI response...')

    const result = await model.generateContent(prompt)
    const responseText = result.response.text()

    debugInfo.push('Response received from Gemini')

    // Clean the response - remove markdown code blocks if present
    let cleanedResponse = responseText
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim()

    debugInfo.push('Parsing JSON response...')

    const parsedData = JSON.parse(cleanedResponse)

    const processingTime = Date.now() - startTime

    debugInfo.push(`Profession matched: ${parsedData.profession} (${parsedData.match}% match)`)
    debugInfo.push('Analysis completed successfully')

    return NextResponse.json({
      success: true,
      data: parsedData,
      debugInfo,
      meta: {
        request_id: requestId,
        timestamp: new Date().toISOString(),
        processing_time_ms: processingTime,
        ai_model: 'Gemini 2.5 Flash',
        confidence: parsedData.match / 100
      }
    })

  } catch (error: any) {
    console.error('API Error:', error)

    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to generate analysis',
      debugInfo: ['ERROR: ' + (error.message || 'Unknown error')]
    }, { status: 500 })
  }
}
