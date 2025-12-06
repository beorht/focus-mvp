import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextRequest, NextResponse } from 'next/server'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

export async function POST(request: NextRequest) {
  const startTime = Date.now()
  const requestId = `req_${Math.random().toString(36).substring(2, 15)}`

  try {
    const body = await request.json()
    const { question, profession } = body

    const debugInfo: string[] = []
    debugInfo.push('POST /api/chat')
    debugInfo.push(`Question: "${question}"`)
    debugInfo.push('Processing with Gemini AI...')

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

    const systemContext = profession
      ? `Пользователь получил рекомендацию: ${profession}. Отвечай на вопросы в контексте этой профессии.`
      : ''

    const prompt = `Ты AI-ассистент проекта F.O.C.U.S - навигатор карьеры для Узбекистана. ${systemContext}

Вопрос пользователя: ${question}

Дай краткий, полезный ответ (2-4 предложения) на русском языке. Фокусируйся на практических советах для рынка труда Узбекистана.

ТИПОВЫЕ ВОПРОСЫ И ОТВЕТЫ:

Q: Что делает ваш проект?
A: F.O.C.U.S - это AI-платформа для профориентации в Узбекистане. Мы анализируем ваши интересы и навыки, подбираем подходящую профессию и создаем персональный roadmap развития с учетом местного рынка труда.

Q: Для кого ваш продукт?
A: Для студентов, выпускников и людей, планирующих смену карьеры в Узбекистане. Особенно полезно тем, кто не уверен в выборе профессии или хочет узнать востребованные направления на рынке.

Q: Как это работает?
A: Вы проходите экспресс-тестирование (5-7 вопросов), наш AI анализирует ответы через Gemini и генерирует персональные рекомендации: профессию, roadmap развития, зарплатные ожидания для Узбекистана и ссылки на обучающие материалы.

Теперь ответь на вопрос пользователя:`

    const result = await model.generateContent(prompt)
    const answer = result.response.text()

    const processingTime = Date.now() - startTime

    debugInfo.push('Answer generated successfully')
    debugInfo.push(`Response length: ${answer.length} chars`)

    return NextResponse.json({
      success: true,
      answer,
      debugInfo,
      meta: {
        request_id: requestId,
        timestamp: new Date().toISOString(),
        processing_time_ms: processingTime,
        ai_model: 'Gemini 2.5 Flash',
        answer_length: answer.length
      }
    })

  } catch (error: any) {
    console.error('Chat API Error:', error)

    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to generate response',
      debugInfo: ['ERROR: ' + (error.message || 'Unknown error')]
    }, { status: 500 })
  }
}
