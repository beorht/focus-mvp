'use client'

import { useState, useRef, useEffect } from 'react'
import { useLogStore } from '@/store/useLogStore'
import { useThemeStore } from '@/store/useThemeStore'
import { MessageCircle, X, Send, Loader2 } from 'lucide-react'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
}

export default function ChatAssistant() {
  const theme = useThemeStore((state) => state.theme)
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Привет! Я AI-ассистент F.O.C.U.S. Задай мне любой вопрос о проекте, профориентации или карьерном развитии.'
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const addLog = useLogStore((state) => state.addLog)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    addLog('USER_ACTION', `Chat question: "${input.substring(0, 50)}..."`)

    try {
      // Get profession from session if available
      const resultsStr = sessionStorage.getItem('analysisResults')
      const profession = resultsStr ? JSON.parse(resultsStr).profession : null

      // Log REQUEST
      const requestPayload = { question: input, profession }
      addLog('API_REQ', `POST /api/chat\nContent-Type: application/json\n\n${JSON.stringify(requestPayload, null, 2)}`)

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestPayload)
      })

      const data = await response.json()

      if (data.success) {
        // Log debug info
        data.debugInfo?.forEach((info: string) => {
          if (!info.startsWith('POST') && !info.includes('Question')) {
            addLog('INFO', info)
          }
        })

        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.answer
        }

        setMessages(prev => [...prev, assistantMessage])

        // Log professional RESPONSE
        const apiResponse = {
          answer: data.answer.substring(0, 100) + (data.answer.length > 100 ? '...' : ''),
          answer_full_length: data.answer.length,
          meta: data.meta
        }
        addLog('API_RES', JSON.stringify(apiResponse, null, 2))
      } else {
        addLog('ERROR', `Chat API error: ${data.error}`)
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: 'Извините, произошла ошибка. Попробуйте еще раз.'
        }
        setMessages(prev => [...prev, errorMessage])
      }
    } catch (error: any) {
      addLog('ERROR', `Chat request failed: ${error.message}`)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Не удалось получить ответ. Проверьте подключение.'
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <>
      {/* FAB Button */}
      {!isOpen && (
        <button
          onClick={() => {
            setIsOpen(true)
            addLog('USER_ACTION', 'Opened chat assistant')
          }}
          className="fixed bottom-6 right-6 md:right-[37%] w-14 h-14 bg-gradient-to-r from-[#8eb69b] to-[#5a8f6d] text-white rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110 flex items-center justify-center z-40 group"
        >
          <MessageCircle className="w-6 h-6" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#6a9d7d] rounded-full animate-ping" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#6a9d7d] rounded-full" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          className={`fixed bottom-6 right-6 md:right-[37%] w-96 max-w-[calc(100vw-3rem)] h-[500px] rounded-2xl shadow-2xl flex flex-col z-40 border ${
            theme === 'dark' ? 'border-gray-700' : 'border-gray-300'
          }`}
          style={{ background: theme === 'dark' ? '#1d1d1d' : '#ffffff' }}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#6a9d7d] to-[#4a6660] text-white p-4 rounded-t-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold">AI Assistant</h3>
                <p className="text-xs opacity-90">F.O.C.U.S Career Guide</p>
              </div>
            </div>
            <button
              onClick={() => {
                setIsOpen(false)
                addLog('USER_ACTION', 'Closed chat assistant')
              }}
              className="w-8 h-8 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-2xl ${
                    message.role === 'user'
                      ? 'bg-gradient-to-r from-[#8eb69b] to-[#5a8f6d] text-white'
                      : theme === 'dark' ? 'bg-gray-800 text-gray-100' : 'bg-gray-200 text-gray-900'
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.content}</p>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className={theme === 'dark' ? 'bg-gray-800 p-3 rounded-2xl' : 'bg-gray-200 p-3 rounded-2xl'}>
                  <Loader2 className={`w-5 h-5 animate-spin ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`} />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className={`border-t p-4 ${
            theme === 'dark' ? 'border-gray-700' : 'border-gray-300'
          }`}>
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Задайте вопрос..."
                disabled={isLoading}
                className={`flex-1 px-4 py-2 border rounded-full focus:outline-none focus:border-blue-500 ${
                  theme === 'dark'
                    ? 'border-gray-700 disabled:bg-gray-800 bg-gray-800 text-gray-100 placeholder-gray-500'
                    : 'border-gray-300 disabled:bg-gray-200 bg-white text-gray-900 placeholder-gray-400'
                }`}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="w-10 h-10 bg-gradient-to-r from-[#8eb69b] to-[#5a8f6d] text-white rounded-full flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <p className={`text-xs mt-2 text-center ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Powered by Gemini AI
            </p>
          </div>
        </div>
      )}
    </>
  )
}
