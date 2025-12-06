'use client'

import { useRouter } from 'next/navigation'
import { Play, Rocket, Code, Sparkles, Brain, ArrowRight } from 'lucide-react'

export default function DemoPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-6 py-12 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            AI500 Hackathon - Task 2
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            F.O.C.U.S Demo
          </h1>
          <p className="text-xl text-gray-600">
            Find Optimal Career Using Science
          </p>
        </div>

        {/* Demo Video Section */}
        <section className="mb-16">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <Play className="w-5 h-5 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Демо-видео</h2>
            </div>

            {/* Video Placeholder */}
            <div className="relative aspect-video bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl overflow-hidden mb-4">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm hover:bg-white/20 transition-all cursor-pointer">
                    <div className="w-0 h-0 border-t-[15px] border-t-transparent border-l-[25px] border-l-white border-b-[15px] border-b-transparent ml-1"></div>
                  </div>
                  <p className="text-white/90 text-lg font-medium">Demo Video</p>
                  <p className="text-white/70 text-sm mt-2">
                    AI Career Analysis with Real-time Terminal Logs
                  </p>
                  <p className="text-white/50 text-xs mt-4">
                    Duration: 3-5 minutes
                  </p>
                </div>
              </div>
              <div className="absolute top-4 right-4 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl"></div>
              <div className="absolute bottom-4 left-4 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl"></div>
            </div>

            <p className="text-gray-600 text-sm">
              Видео демонстрирует полный цикл работы приложения: от прохождения экспресс-теста до получения
              персонального roadmap развития. Особое внимание уделено AI-терминалу справа, который в реальном
              времени показывает взаимодействие с Gemini AI.
            </p>
          </div>
        </section>

        {/* Project Description */}
        <section className="mb-16">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-purple-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Описание проекта</h2>
            </div>

            <div className="space-y-6">
              {/* What's shown */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3 text-lg">
                  Что показано в видео
                </h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">✓</span>
                    <span>Экспресс-тестирование (5 вопросов) для определения интересов и психотипа</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">✓</span>
                    <span>AI-анализ с анимированным процессом обработки данных</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">✓</span>
                    <span>Результаты: профессия, % совпадения, зарплатные ожидания для рынка Узбекистана</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">✓</span>
                    <span>Интерактивный roadmap (Junior → Middle → Senior) с конкретными навыками</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">✓</span>
                    <span>AI-чатбот для консультаций по карьерным вопросам</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">✓</span>
                    <span className="font-bold text-blue-700">Real-time AI Terminal показывает все JSON-запросы и ответы Gemini API</span>
                  </li>
                </ul>
              </div>

              {/* Problem & Solution */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3 text-lg">
                  Связь с проблемой (Task 1)
                </h3>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-gray-700 mb-3">
                    <span className="font-semibold text-red-600">Проблема:</span> Молодежь Узбекистана
                    испытывает трудности с выбором профессии из-за отсутствия персонализированной
                    профориентации и понимания требований местного рынка труда.
                  </p>
                  <p className="text-gray-700">
                    <span className="font-semibold text-green-600">Решение:</span> F.O.C.U.S использует
                    AI для анализа способностей пользователя и генерации персонального карьерного плана
                    с учетом специфики рынка Узбекистана (зарплаты, востребованность, доступные курсы).
                  </p>
                </div>
              </div>

              {/* Tech Stack */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3 text-lg">
                  Используемые технологии
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                    <h4 className="font-semibold text-blue-900 mb-2">Frontend</h4>
                    <ul className="space-y-1 text-sm text-blue-700">
                      <li>• Next.js 14 (App Router)</li>
                      <li>• TypeScript</li>
                      <li>• Tailwind CSS</li>
                      <li>• Zustand (State Management)</li>
                      <li>• Lucide React (Icons)</li>
                    </ul>
                  </div>
                  <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
                    <h4 className="font-semibold text-purple-900 mb-2">AI & Backend</h4>
                    <ul className="space-y-1 text-sm text-purple-700">
                      <li>• Google Gemini 2.5 Flash</li>
                      <li>• Next.js API Routes</li>
                      <li>• Real-time logging system</li>
                      <li>• JSON-based data flow</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Project Status */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3 text-lg">
                  Текущий статус проекта
                </h3>
                <div className="flex items-center gap-4">
                  <div className="flex-1 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border-2 border-green-300">
                    <div className="flex items-center gap-3">
                      <Rocket className="w-8 h-8 text-green-600" />
                      <div>
                        <p className="font-bold text-green-900 text-lg">MVP (Minimum Viable Product)</p>
                        <p className="text-sm text-green-700">Полностью функциональный прототип</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Next Steps */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3 text-lg">
                  Следующие шаги по развитию
                </h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600 mt-1">→</span>
                    <span>Интеграция с реальными вакансиями с hh.uz и других платформ</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600 mt-1">→</span>
                    <span>Добавление системы сохранения прогресса обучения</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600 mt-1">→</span>
                    <span>Расширенное тестирование (60+ вопросов) для более точного анализа</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600 mt-1">→</span>
                    <span>Партнерство с образовательными платформами Узбекистана</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600 mt-1">→</span>
                    <span>Мобильное приложение (iOS/Android)</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Launch Demo CTA */}
        <section className="mb-12">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-center text-white shadow-xl">
            <h2 className="text-3xl font-bold mb-4">Попробуйте прямо сейчас!</h2>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Протестируйте полностью рабочее приложение. Пройдите экспресс-тест и получите персональные
              рекомендации от AI. Обратите внимание на терминал справа — он показывает реальное взаимодействие с Gemini API.
            </p>
            <button
              onClick={() => router.push('/')}
              className="bg-white text-blue-600 px-8 py-4 rounded-full font-bold text-lg hover:shadow-2xl transition-all hover:scale-105 inline-flex items-center gap-2"
            >
              <Rocket className="w-5 h-5" />
              Launch Demo
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </section>

        {/* Bonus Features */}
        <section>
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Code className="w-5 h-5 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Бонусные функции</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="border-2 border-green-200 rounded-xl p-6 bg-green-50">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">💬</span>
                  <h3 className="font-bold text-green-900">BONUS 1: AI-Чатбот</h3>
                </div>
                <p className="text-gray-700 text-sm mb-3">
                  Интеллектуальный ассистент на базе Gemini AI отвечает на вопросы о проекте,
                  профессиях и карьерном развитии. Доступен на всех страницах.
                </p>
                <p className="text-xs text-green-700 font-medium">
                  API: POST /api/chat
                </p>
              </div>

              <div className="border-2 border-blue-200 rounded-xl p-6 bg-blue-50">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">🔌</span>
                  <h3 className="font-bold text-blue-900">BONUS 2: API Access</h3>
                </div>
                <p className="text-gray-700 text-sm mb-3">
                  Real-time терминал демонстрирует все API-запросы и ответы. Видны JSON payload,
                  статусы обработки и результаты работы AI.
                </p>
                <p className="text-xs text-blue-700 font-medium">
                  APIs: POST /api/generate, POST /api/chat
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <div className="mt-12 text-center text-gray-500 text-sm">
          <p>F.O.C.U.S — AI500 Hackathon 2024</p>
          <p className="mt-1">Deadline: 7 декабря, 23:59 (GMT+5)</p>
        </div>
      </div>
    </div>
  )
}
