'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useLogStore } from '@/store/useLogStore'
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
        <div className="text-gray-300">Загрузка результатов...</div>
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
            className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-4"
          >
            <Sparkles className="w-4 h-4" />
            Учебный модуль готов
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, filter: "blur(10px)", y: 20 }}
            animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-4xl font-bold text-white mb-2"
          >
            Учебный модуль: {data.profession}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="text-xl text-gray-300"
          >
            Персональная программа для {userName}
          </motion.p>
        </div>

        {/* Profession Card */}
        <motion.div
          initial={{ opacity: 0, filter: "blur(10px)", y: 30 }}
          animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
          transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
          className="rounded-2xl shadow-xl p-8 mb-8 border-2 border-blue-900"
          style={{ background: '#1d1d1d' }}
        >
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">
                {data.profession}
              </h2>
              <p className="text-gray-300 leading-relaxed mt-4">
                {data.introduction}
              </p>
            </div>
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl text-center ml-4">
              <div className="text-3xl font-bold">{data.match}%</div>
              <div className="text-xs opacity-90">совпадение</div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-900/20 to-emerald-900/20 rounded-xl p-4 border border-green-700">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-5 h-5 text-green-400" />
              <span className="font-semibold text-green-300">Зарплата в Узбекистане</span>
            </div>
            <p className="text-2xl font-bold" style={{ color: '#C1FBA4' }}>{data.salary_uz_sum}</p>
          </div>
        </motion.div>

        {/* Skill Gaps */}
        <motion.div
          initial={{ opacity: 0, filter: "blur(10px)", y: 30 }}
          animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
          transition={{ duration: 1, delay: 0.8, ease: "easeOut" }}
          className="rounded-2xl shadow-xl p-8 mb-8"
          style={{ background: '#F4C430' }}
        >
          <h3 className="text-2xl font-bold text-black mb-6 flex items-center gap-2">
            <Target className="w-6 h-6 text-black" />
            Навыки для развития
          </h3>
          <div className="space-y-3">
            {data.skill_gaps.map((skill, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 1.0 + index * 0.1 }}
                className="flex items-start gap-3 p-4 rounded-xl bg-black/10 border border-black/20"
              >
                <div className="flex-shrink-0 w-8 h-8 bg-black rounded-full flex items-center justify-center text-yellow-400 font-bold text-sm">
                  {index + 1}
                </div>
                <p className="text-black flex-1 pt-1 font-medium">{skill}</p>
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
          <h3 className="text-3xl font-bold text-white mb-6 text-center">
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
                style={{ background: '#F7F6E4' }}
              >
                {/* Topic Header */}
                <div className="flex items-start gap-4 mb-6">
                  <div className="flex-shrink-0">
                    <div className="w-14 h-14 rounded-full bg-black flex items-center justify-center">
                      <span className="text-2xl font-bold text-yellow-400">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-2xl font-bold text-black mb-3">{topic.title}</h4>
                    <p className="text-gray-800 leading-relaxed">{topic.summary}</p>
                  </div>
                </div>

                {/* Examples */}
                {topic.examples && topic.examples.length > 0 && (
                  <div className="mb-6 p-4 bg-black/10 rounded-xl">
                    <h5 className="text-sm font-bold text-black mb-3 flex items-center gap-2">
                      <Lightbulb className="w-4 h-4" />
                      Примеры:
                    </h5>
                    <ul className="space-y-2">
                      {topic.examples.map((example, exIdx) => (
                        <li key={exIdx} className="text-gray-800 flex items-start gap-2">
                          <span className="text-black font-bold">•</span>
                          <span>{example}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Tasks */}
                {topic.tasks && topic.tasks.length > 0 && (
                  <div className="mb-6">
                    <h5 className="text-sm font-bold text-black mb-3">Практические задания:</h5>
                    <div className="space-y-3">
                      {topic.tasks.map((task, taskIdx) => (
                        <div key={taskIdx} className="p-4 bg-black text-yellow-400 rounded-xl">
                          <p className="font-semibold mb-2">{task.title}</p>
                          <p className="text-sm text-yellow-200">{task.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Questions */}
                {topic.questions && topic.questions.length > 0 && (
                  <div className="p-4 bg-white/20 rounded-xl">
                    <h5 className="text-sm font-bold text-black mb-3">Контрольные вопросы:</h5>
                    <ul className="space-y-2">
                      {topic.questions.map((question, qIdx) => (
                        <li key={qIdx} className="text-gray-900 flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5 text-black" />
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
          style={{ background: '#1d1d1d' }}
        >
          <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Clock className="w-6 h-6 text-blue-500" />
            Рекомендуемый порядок обучения
          </h3>
          <div className="space-y-3">
            {data.learning_plan.order.map((topicName, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 rounded-xl bg-blue-900/20 border border-blue-900/30"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {index + 1}
                  </div>
                  <span className="text-gray-200 font-medium">{topicName}</span>
                </div>
                <span className="text-blue-400 font-semibold">
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
          style={{ background: '#1d1d1d' }}
        >
          <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-purple-600" />
            Рекомендуемые ресурсы
          </h3>

          <div className="space-y-6">
            {data.resources.map((resourceGroup, groupIdx) => (
              <div key={groupIdx}>
                <h4 className="text-lg font-semibold text-purple-300 mb-3">{resourceGroup.topic}</h4>
                <div className="space-y-3">
                  {resourceGroup.items.map((resource, resIdx) => (
                    <a
                      key={resIdx}
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => addLog('USER_ACTION', `Opened resource: ${resource.title}`)}
                      className="flex items-center justify-between p-4 rounded-xl border-2 border-gray-700 hover:border-purple-500 hover:bg-purple-900/20 transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-900/30 rounded-lg flex items-center justify-center group-hover:bg-purple-800/40 transition-colors">
                          📚
                        </div>
                        <div>
                          <h5 className="font-semibold text-white">{resource.title}</h5>
                          <p className="text-sm text-gray-400">{resource.type}</p>
                        </div>
                      </div>
                      <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-purple-400" />
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
          className="rounded-2xl shadow-xl p-8 mb-8 border-2 border-yellow-600"
          style={{ background: 'linear-gradient(135deg, #1d1d1d 0%, #2d2d1d 100%)' }}
        >
          <h3 className="text-2xl font-bold text-yellow-400 mb-4">Совет для мотивации</h3>
          <p className="text-gray-200 leading-relaxed text-lg">{data.motivation}</p>
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
