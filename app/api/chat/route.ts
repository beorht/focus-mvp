import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextRequest, NextResponse } from 'next/server'
import { findBestAnswer, getContextForAI } from '@/lib/knowledgeBase'

// Get all API keys for chat assistant from environment
function getChatApiKeys(): string[] {
  const multipleKeys = process.env.GEMINI_API_KEYS_FOR_CHAT_ASSITENT
  if (multipleKeys) {
    return multipleKeys.split(',').map(key => key.trim()).filter(key => key.length > 0)
  }
  const singleKey = process.env.GEMINI_API_KEY_FOR_CHAT_ASSITENT
  return singleKey ? [singleKey] : []
}

// Try chat request with key rotation on quota errors
async function generateChatWithKeyRotation(
  prompt: string,
  debugInfo: string[],
  attemptNumber = 0
): Promise<string> {
  const apiKeys = getChatApiKeys()

  if (apiKeys.length === 0) {
    throw new Error('No chat API keys configured')
  }

  const currentKeyIndex = attemptNumber % apiKeys.length
  const currentKey = apiKeys[currentKeyIndex]

  debugInfo.push(`Chat: Attempting with API key #${currentKeyIndex + 1} of ${apiKeys.length}`)

  const genAI = new GoogleGenerativeAI(currentKey)
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

  try {
    const result = await model.generateContent(prompt)
    const answer = result.response.text()
    debugInfo.push(`Chat: Success with key #${currentKeyIndex + 1}`)
    return answer
  } catch (error: any) {
    const errorMessage = error.message || JSON.stringify(error)
    debugInfo.push(`Chat: Error with key #${currentKeyIndex + 1}: ${errorMessage}`)

    // Check if it's a quota error (429) and we have more keys to try
    const isQuotaError = error.status === 429 || errorMessage.includes('Quota exceeded')
    const hasMoreKeys = apiKeys.length > 1 && attemptNumber < apiKeys.length - 1

    if (isQuotaError && hasMoreKeys) {
      debugInfo.push(`Chat: Quota exceeded, trying next key...`)
      return generateChatWithKeyRotation(prompt, debugInfo, attemptNumber + 1)
    }

    // If all keys failed or it's not a quota error, throw the error
    throw error
  }
}

export async function POST(request: NextRequest) {
  const startTime = Date.now()
  const requestId = `req_${Math.random().toString(36).substring(2, 15)}`

  try {
    const body = await request.json()
    const { question, profession } = body

    const debugInfo: string[] = []
    debugInfo.push('POST /api/chat')
    debugInfo.push(`Question: "${question}"`)

    // Поиск в базе знаний
    debugInfo.push('Searching in knowledge base...')
    const knowledgeAnswer = findBestAnswer(question, 0.5) // Порог 0.5 для прямого ответа

    // Если нашли точный ответ в базе знаний - возвращаем его напрямую
    if (knowledgeAnswer) {
      debugInfo.push('Found exact match in knowledge base')
      debugInfo.push(`Matched tags: ${knowledgeAnswer.tags.slice(0, 3).join(', ')}`)

      const processingTime = Date.now() - startTime

      return NextResponse.json({
        success: true,
        answer: knowledgeAnswer.answer,
        debugInfo,
        source: 'knowledge_base',
        meta: {
          request_id: requestId,
          timestamp: new Date().toISOString(),
          processing_time_ms: processingTime,
          ai_model: 'Knowledge Base (Direct Match)',
          answer_length: knowledgeAnswer.answer.length
        }
      })
    }

    // Если точного ответа нет - получаем релевантный контекст для AI
    debugInfo.push('No exact match, getting context for AI...')
    const aiContext = getContextForAI(question)

    if (aiContext) {
      debugInfo.push('Found relevant context from knowledge base')
    } else {
      debugInfo.push('No relevant context found, using pure AI generation')
    }

    debugInfo.push('Processing with Gemini AI...')

    const systemContext = profession
      ? `Пользователь получил рекомендацию: ${profession}. Отвечай на вопросы в контексте этой профессии.`
      : ''

    const prompt = `Ты AI-ассистент проекта F.O.C.U.S - навигатор карьеры для Узбекистана. ${systemContext}

ВАЖНО: Ты можешь отвечать ТОЛЬКО на вопросы, связанные с проектом F.O.C.U.S, карьерным ориентированием, профессиями, образованием и рынком труда Узбекистана.

ИСКЛЮЧЕНИЯ:
- Если пользователь приветствует (привет, здравствуйте, добрый день и т.д.) - ответь вежливым и уважительным приветствием, представься как ассистент проекта F.O.C.U.S.

Если вопрос НЕ касается этих тем И НЕ является приветствием (например: погода, еда, спорт, развлечения, общие знания и т.д.), ты ОБЯЗАН ответить ТОЧНО так:
"Ваш вопрос не теме проекта FOCUS Ai, я могу ответить только по вопроса данного проекта"

Вопрос пользователя: ${question}

Проанализируй вопрос:
1. Если это приветствие - ответь уважительным приветствием и представься
2. Если вопрос НЕ по теме - верни стандартное сообщение выше
3. Если вопрос по теме - дай краткий, полезный ответ (2-4 предложения) на русском языке

ТИПОВЫЕ ВОПРОСЫ И ОТВЕТЫ О ПРОЕКТЕ:

Q: Что делает ваш проект?
A: F.O.C.U.S - это AI-платформа для профориентации в Узбекистане. Мы анализируем ваши интересы и навыки, подбираем подходящую профессию и создаем персональный roadmap развития с учетом местного рынка труда.

Q: Для кого ваш продукт?
A: Для студентов, выпускников и людей, планирующих смену карьеры в Узбекистане. Особенно полезно тем, кто не уверен в выборе профессии или хочет узнать востребованные направления на рынке.

Q: Как это работает?
A: Вы проходите экспресс-тестирование (5-7 вопросов), наш AI анализирует ответы через Gemini и генерирует персональные рекомендации: профессию, roadmap развития, зарплатные ожидания для Узбекистана и ссылки на обучающие материалы.
${aiContext}
Теперь ответь на вопрос пользователя:`

    const answer = await generateChatWithKeyRotation(prompt, debugInfo)

    const processingTime = Date.now() - startTime

    debugInfo.push('Answer generated successfully')
    debugInfo.push(`Response length: ${answer.length} chars`)

    return NextResponse.json({
      success: true,
      answer,
      debugInfo,
      source: aiContext ? 'ai_with_knowledge_base' : 'ai_only',
      meta: {
        request_id: requestId,
        timestamp: new Date().toISOString(),
        processing_time_ms: processingTime,
        ai_model: aiContext ? 'Gemini 2.5 Flash + Knowledge Base' : 'Gemini 2.5 Flash',
        answer_length: answer.length,
        knowledge_base_used: !!aiContext
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
