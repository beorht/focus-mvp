'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useLogStore } from '@/store/useLogStore'
import { useThemeStore } from '@/store/useThemeStore'
import { Sparkles, TrendingUp, BookOpen, ExternalLink, CheckCircle2, Target, Clock, Lightbulb, MessageCircle } from 'lucide-react'
import Lenis from 'lenis'
import { motion } from 'framer-motion'

interface Task {
  title: string
  description: string
}

interface Topic {
  title: string
  summary: string
  examples: string[]
  tasks: Task[]
  questions: string[]
}

interface ResourceItem {
  title: string
  url: string
  type: string
}

interface ResourceGroup {
  topic: string
  items: ResourceItem[]
}

interface LearningModule {
  profession: string
  match: number
  salary_uz_sum: string
  introduction: string
  topics: Topic[]
  skill_gaps: string[]
  learning_plan: {
    order: string[]
    time_estimates: Record<string, string>
  }
  resources: ResourceGroup[]
  motivation: string
}

export default function ResultsPage() {
  const router = useRouter()
  const addLog = useLogStore((state) => state.addLog)
  const theme = useThemeStore((state) => state.theme)
  const [data, setData] = useState<LearningModule | null>(null)
  const [userName, setUserName] = useState('Пользователь')
  const [showChat, setShowChat] = useState(false)

  useEffect(() => {
    // Initialize Lenis smooth scrolling
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    })

    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    const resultsStr = sessionStorage.getItem('analysisResults')
    const answersStr = sessionStorage.getItem('userAnswers')

    if (!resultsStr) {
      addLog('ERROR', 'No results found, redirecting to test')
      router.push('/test')
      return
    }

    const results = JSON.parse(resultsStr)
    setData(results)

    if (answersStr) {
      const answers = JSON.parse(answersStr)
      setUserName(answers.userName || 'Пользователь')
    }

    addLog('DATA', 'Rendering learning module')
    addLog('DATA', `Profession: ${results.profession}`)
    addLog('DATA', `Topics: ${results.topics?.length || 0}`)

    // Cleanup function
    return () => {
      lenis.destroy()
    }
  }, [])

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center results-background">
        <div className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>Загрузка результатов...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12 px-4 results-background">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ opacity: 0, filter: "blur(10px)", scale: 0.9 }}
            animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-4 ${
              theme === 'dark'
                ? 'bg-green-100 text-green-700'
                : 'bg-green-200 text-green-800'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            Учебный модуль готов
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, filter: "blur(10px)", y: 20 }}
            animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className={`text-4xl font-bold mb-2 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}
          >
            Учебный модуль: {data.profession}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className={`text-xl ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}
          >
            Персональная программа для {userName}
          </motion.p>
        </div>

        {/* Profession Card */}
        <motion.div
          initial={{ opacity: 0, filter: "blur(10px)", y: 30 }}
          animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
          transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
          className={`rounded-2xl shadow-xl p-8 mb-8 border-2 ${
            theme === 'dark' ? 'border-blue-900' : 'border-blue-300'
          }`}
          style={{ background: theme === 'dark' ? '#1d1d1d' : '#FFF1E6' }}
        >
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className={`text-3xl font-bold mb-2 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                {data.profession}
              </h2>
              <p className={`leading-relaxed mt-4 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                {data.introduction}
              </p>
            </div>
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl text-center ml-4">
              <div className="text-3xl font-bold">{data.match}%</div>
              <div className="text-xs opacity-90">совпадение</div>
            </div>
          </div>

          <div className={`rounded-xl p-4 border ${
            theme === 'dark'
              ? 'bg-gradient-to-r from-green-900/20 to-emerald-900/20 border-green-700'
              : 'bg-gradient-to-r from-green-100 to-emerald-100 border-green-400'
          }`}>
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className={`w-5 h-5 ${
                theme === 'dark' ? 'text-green-400' : 'text-green-700'
              }`} />
              <span className={`font-semibold ${
                theme === 'dark' ? 'text-green-300' : 'text-green-800'
              }`}>Зарплата в Узбекистане</span>
            </div>
            <p className={`text-2xl font-bold ${
              theme === 'dark' ? 'text-[#C1FBA4]' : 'text-green-700'
            }`}>{data.salary_uz_sum}</p>
          </div>
        </motion.div>

        {/* Skill Gaps */}
        <motion.div
          initial={{ opacity: 0, filter: "blur(10px)", y: 30 }}
          animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
          transition={{ duration: 1, delay: 0.8, ease: "easeOut" }}
          className="rounded-2xl shadow-xl p-8 mb-8"
          style={{ background: theme === 'dark' ? '#F4C430' : '#FFF1E6' }}
        >
          <h3 className={`text-2xl font-bold mb-6 flex items-center gap-2 ${
            theme === 'dark' ? 'text-black' : 'text-gray-900'
          }`}>
            <Target className={`w-6 h-6 ${
              theme === 'dark' ? 'text-black' : 'text-gray-900'
            }`} />
            Навыки для развития
          </h3>
          <div className="space-y-3">
            {data.skill_gaps.map((skill, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 1.0 + index * 0.1 }}
                className={`flex items-start gap-3 p-4 rounded-xl border ${
                  theme === 'dark'
                    ? 'bg-black/10 border-black/20'
                    : 'bg-gray-100 border-gray-300'
                }`}
              >
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                  theme === 'dark'
                    ? 'bg-black text-yellow-400'
                    : 'bg-gray-900 text-yellow-300'
                }`}>
                  {index + 1}
                </div>
                <p className={`flex-1 pt-1 font-medium ${
                  theme === 'dark' ? 'text-black' : 'text-gray-900'
                }`}>{skill}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Topics */}
        <motion.div
          initial={{ opacity: 0, filter: "blur(10px)", y: 30 }}
          animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
          transition={{ duration: 1, delay: 1.2, ease: "easeOut" }}
          className="mb-8"
        >
          <h3 className={`text-3xl font-bold mb-6 text-center ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Учебные темы
          </h3>

          <div className="space-y-6">
            {data.topics.map((topic, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, filter: "blur(8px)", y: 30 }}
                animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                transition={{ duration: 0.8, delay: 1.4 + index * 0.2 }}
                className="rounded-2xl p-8 shadow-xl"
                style={{ background: theme === 'dark' ? '#F7F6E4' : '#FAEBD7' }}
              >
                {/* Topic Header */}
                <div className="flex items-start gap-4 mb-6">
                  <div className="flex-shrink-0">
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center ${
                      theme === 'dark' ? 'bg-black' : 'bg-gray-900'
                    }`}>
                      <span className={`text-2xl font-bold ${
                        theme === 'dark' ? 'text-yellow-400' : 'text-yellow-300'
                      }`}>
                        {String(index + 1).padStart(2, '0')}
                      </span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className={`text-2xl font-bold mb-3 ${
                      theme === 'dark' ? 'text-black' : 'text-gray-900'
                    }`}>{topic.title}</h4>
                    <p className={`leading-relaxed ${
                      theme === 'dark' ? 'text-gray-800' : 'text-gray-700'
                    }`}>{topic.summary}</p>
                  </div>
                </div>

                {/* Examples */}
                {topic.examples && topic.examples.length > 0 && (
                  <div className={`mb-6 p-4 rounded-xl ${
                    theme === 'dark' ? 'bg-black/10' : 'bg-gray-200'
                  }`}>
                    <h5 className={`text-sm font-bold mb-3 flex items-center gap-2 ${
                      theme === 'dark' ? 'text-black' : 'text-gray-900'
                    }`}>
                      <Lightbulb className="w-4 h-4" />
                      Примеры:
                    </h5>
                    <ul className="space-y-2">
                      {topic.examples.map((example, exIdx) => (
                        <li key={exIdx} className={`flex items-start gap-2 ${
                          theme === 'dark' ? 'text-gray-800' : 'text-gray-700'
                        }`}>
                          <span className={`font-bold ${
                            theme === 'dark' ? 'text-black' : 'text-gray-900'
                          }`}>•</span>
                          <span>{example}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Tasks */}
                {topic.tasks && topic.tasks.length > 0 && (
                  <div className="mb-6">
                    <h5 className={`text-sm font-bold mb-3 ${
                      theme === 'dark' ? 'text-black' : 'text-gray-900'
                    }`}>Практические задания:</h5>
                    <div className="space-y-3">
                      {topic.tasks.map((task, taskIdx) => (
                        <div key={taskIdx} className={`p-4 rounded-xl ${
                          theme === 'dark'
                            ? 'bg-black text-yellow-400'
                            : 'bg-gray-900 text-yellow-300'
                        }`}>
                          <p className="font-semibold mb-2">{task.title}</p>
                          <p className={`text-sm ${
                            theme === 'dark' ? 'text-yellow-200' : 'text-yellow-100'
                          }`}>{task.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Questions */}
                {topic.questions && topic.questions.length > 0 && (
                  <div className={`p-4 rounded-xl ${
                    theme === 'dark' ? 'bg-white/20' : 'bg-gray-200'
                  }`}>
                    <h5 className={`text-sm font-bold mb-3 ${
                      theme === 'dark' ? 'text-black' : 'text-gray-900'
                    }`}>Контрольные вопросы:</h5>
                    <ul className="space-y-2">
                      {topic.questions.map((question, qIdx) => (
                        <li key={qIdx} className={`flex items-start gap-2 ${
                          theme === 'dark' ? 'text-gray-900' : 'text-gray-800'
                        }`}>
                          <CheckCircle2 className={`w-4 h-4 flex-shrink-0 mt-0.5 ${
                            theme === 'dark' ? 'text-black' : 'text-gray-900'
                          }`} />
                          <span className="text-sm">{question}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Learning Plan */}
        <motion.div
          initial={{ opacity: 0, filter: "blur(10px)", y: 30 }}
          animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
          transition={{ duration: 1, delay: 2.0, ease: "easeOut" }}
          className="rounded-2xl shadow-xl p-8 mb-8"
          style={{ background: theme === 'dark' ? '#1d1d1d' : '#E9E7E1' }}
        >
          <h3 className={`text-2xl font-bold mb-6 flex items-center gap-2 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            <Clock className={`w-6 h-6 ${
              theme === 'dark' ? 'text-blue-500' : 'text-blue-600'
            }`} />
            Рекомендуемый порядок обучения
          </h3>
          <div className="space-y-3">
            {data.learning_plan.order.map((topicName, index) => (
              <div
                key={index}
                className={`flex items-center justify-between p-4 rounded-xl border ${
                  theme === 'dark'
                    ? 'bg-blue-900/20 border-blue-900/30'
                    : 'bg-blue-100 border-blue-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                    theme === 'dark' ? 'bg-blue-600' : 'bg-blue-700'
                  }`}>
                    {index + 1}
                  </div>
                  <span className={`font-medium ${
                    theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
                  }`}>{topicName}</span>
                </div>
                <span className={`font-semibold ${
                  theme === 'dark' ? 'text-blue-400' : 'text-blue-700'
                }`}>
                  {data.learning_plan.time_estimates[topicName] || 'N/A'}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Resources */}
        <motion.div
          initial={{ opacity: 0, filter: "blur(10px)", y: 30 }}
          animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
          transition={{ duration: 1, delay: 2.2, ease: "easeOut" }}
          className="rounded-2xl shadow-xl p-8 mb-8"
          style={{ background: theme === 'dark' ? '#1d1d1d' : '#E9E7E1' }}
        >
          <h3 className={`text-2xl font-bold mb-6 flex items-center gap-2 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            <BookOpen className={`w-6 h-6 ${
              theme === 'dark' ? 'text-purple-600' : 'text-purple-700'
            }`} />
            Рекомендуемые ресурсы
          </h3>

          <div className="space-y-6">
            {data.resources.map((resourceGroup, groupIdx) => (
              <div key={groupIdx}>
                <h4 className={`text-lg font-semibold mb-3 ${
                  theme === 'dark' ? 'text-purple-300' : 'text-purple-700'
                }`}>{resourceGroup.topic}</h4>
                <div className="space-y-3">
                  {resourceGroup.items.map((resource, resIdx) => (
                    <a
                      key={resIdx}
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => addLog('USER_ACTION', `Opened resource: ${resource.title}`)}
                      className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all group ${
                        theme === 'dark'
                          ? 'border-gray-700 hover:border-purple-500 hover:bg-purple-900/20'
                          : 'border-gray-300 hover:border-purple-400 hover:bg-purple-100'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                          theme === 'dark'
                            ? 'bg-purple-900/30 group-hover:bg-purple-800/40'
                            : 'bg-purple-200 group-hover:bg-purple-300'
                        }`}>
                          📚
                        </div>
                        <div>
                          <h5 className={`font-semibold ${
                            theme === 'dark' ? 'text-white' : 'text-gray-900'
                          }`}>{resource.title}</h5>
                          <p className={`text-sm ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                          }`}>{resource.type}</p>
                        </div>
                      </div>
                      <ExternalLink className={`w-5 h-5 transition-colors ${
                        theme === 'dark'
                          ? 'text-gray-400 group-hover:text-purple-400'
                          : 'text-gray-600 group-hover:text-purple-600'
                      }`} />
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Motivation */}
        <motion.div
          initial={{ opacity: 0, filter: "blur(10px)", y: 30 }}
          animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
          transition={{ duration: 1, delay: 2.4, ease: "easeOut" }}
          className={`rounded-2xl shadow-xl p-8 mb-8 border-2 ${
            theme === 'dark' ? 'border-yellow-600' : 'border-yellow-500'
          }`}
          style={{
            background: theme === 'dark'
              ? 'linear-gradient(135deg, #1d1d1d 0%, #2d2d1d 100%)'
              : 'linear-gradient(135deg, #FFFDD1 0%, #FFF1E6 100%)'
          }}
        >
          <h3 className={`text-2xl font-bold mb-4 ${
            theme === 'dark' ? 'text-yellow-400' : 'text-yellow-700'
          }`}>Совет для мотивации</h3>
          <p className={`leading-relaxed text-lg ${
            theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
          }`}>{data.motivation}</p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 2.6, ease: "easeOut" }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <motion.button
            onClick={() => {
              addLog('USER_ACTION', 'Restarting assessment')
              router.push('/test')
            }}
            whileHover={{ scale: 1.02, boxShadow: "0 10px 30px rgba(128, 173, 50, 0.3)" }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 py-4 rounded-xl font-semibold transition-all text-black"
            style={{ background: '#80ad32' }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#a5d64f'}
            onMouseLeave={(e) => e.currentTarget.style.background = '#80ad32'}
          >
            Пройти тест заново
          </motion.button>
          <motion.button
            onClick={() => {
              setShowChat(true)
              addLog('USER_ACTION', 'Opened chat assistant')
            }}
            whileHover={{ scale: 1.02, boxShadow: "0 10px 30px rgba(59, 130, 246, 0.3)" }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
          >
            <MessageCircle className="w-5 h-5" />
            Задать вопрос AI
          </motion.button>
        </motion.div>
      </div>
    </div>
  )
}
