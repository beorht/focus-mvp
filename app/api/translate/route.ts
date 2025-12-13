import { NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

// API Keys setup
const API_KEYS = process.env.GEMINI_API_KEYS
  ? process.env.GEMINI_API_KEYS.split(',').map((k) => k.trim())
  : process.env.GEMINI_API_KEY
    ? [process.env.GEMINI_API_KEY]
    : []

let currentKeyIndex = 0

function getNextApiKey(): string {
  if (API_KEYS.length === 0) {
    throw new Error('No API keys configured')
  }
  const key = API_KEYS[currentKeyIndex]
  currentKeyIndex = (currentKeyIndex + 1) % API_KEYS.length
  return key
}

const languageNames: Record<string, string> = {
  ru: 'Russian',
  'uz-cyrl': 'Uzbek (Cyrillic)',
  'uz-latn': 'Uzbek (Latin)',
}

export async function POST(request: Request) {
  const debugInfo: string[] = []

  try {
    const body = await request.json()
    const { content, targetLanguage } = body

    debugInfo.push(`Translation request for language: ${targetLanguage}`)

    if (!content || !targetLanguage) {
      return NextResponse.json(
        { error: 'Missing content or targetLanguage', debugInfo },
        { status: 400 }
      )
    }

    const apiKey = getNextApiKey()
    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' })

    const targetLangName = languageNames[targetLanguage] || targetLanguage

    const prompt = `You are a professional translator. Translate the following JSON content to ${targetLangName}.

CRITICAL RULES:
1. Return ONLY valid JSON with the same structure
2. Translate all text values, keep keys unchanged
3. Preserve all formatting, line breaks, and special characters
4. Keep technical terms accurate and relevant to the IT/education field
5. Do NOT add any explanations, comments, or markdown formatting

Input JSON:
${JSON.stringify(content, null, 2)}

Return the translated JSON:`

    debugInfo.push('Sending translation request to Gemini...')

    const result = await model.generateContent(prompt)
    const response = result.response
    let text = response.text()

    debugInfo.push('Received response from Gemini')

    // Clean up response - remove markdown formatting if present
    text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()

    let translatedContent
    try {
      translatedContent = JSON.parse(text)
      debugInfo.push('Successfully parsed translated JSON')
    } catch (parseError) {
      debugInfo.push('Failed to parse response as JSON')
      throw new Error('Invalid JSON response from translator')
    }

    return NextResponse.json({
      translatedContent,
      debugInfo,
    })
  } catch (error: any) {
    debugInfo.push(`Error: ${error.message}`)

    // Handle quota errors
    if (error.message?.includes('429') || error.message?.includes('quota')) {
      debugInfo.push('API quota exceeded, rotating to next key...')

      // Try with next key
      if (API_KEYS.length > 1) {
        const nextKey = getNextApiKey()
        debugInfo.push(`Retrying with key #${currentKeyIndex}`)

        try {
          const genAI = new GoogleGenerativeAI(nextKey)
          const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' })

          const body = await request.json()
          const { content, targetLanguage } = body
          const targetLangName = languageNames[targetLanguage] || targetLanguage

          const prompt = `Translate the following JSON to ${targetLangName}. Return ONLY valid JSON:\n${JSON.stringify(content)}`

          const result = await model.generateContent(prompt)
          let text = result.response.text().replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()

          const translatedContent = JSON.parse(text)

          return NextResponse.json({ translatedContent, debugInfo })
        } catch (retryError: any) {
          debugInfo.push(`Retry failed: ${retryError.message}`)
        }
      }
    }

    return NextResponse.json(
      {
        error: error.message || 'Translation failed',
        debugInfo,
      },
      { status: 500 }
    )
  }
}
