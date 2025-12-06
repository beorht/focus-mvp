'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useLogStore } from '@/store/useLogStore'
import { Sparkles, TrendingUp, BookOpen, ExternalLink, MessageCircle } from 'lucide-react'
import Lenis from 'lenis'
import { motion } from 'framer-motion'

interface RoadmapStage {
  stage: string
  duration: string
  topics: string[]
}

interface Resource {
  title: string
  url: string
  type: string
}

interface AnalysisData {
  profession: string
  profession_en: string
  match: number
  salary_uz_sum: string
  description: string
  roadmap: RoadmapStage[]
  resources: Resource[]
}

export default function ResultsPage() {
  const router = useRouter()
  const addLog = useLogStore((state) => state.addLog)
  const [data, setData] = useState<AnalysisData | null>(null)
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
    if (!resultsStr) {
      addLog('ERROR', 'No results found, redirecting to test')
      router.push('/test')
      return
    }

    const results = JSON.parse(resultsStr)
    setData(results)
    addLog('DATA', 'Rendering results page')
    addLog('DATA', `Profession: ${results.profession}`)

    // Cleanup function
    return () => {
      lenis.destroy()
    }
  }, [])

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#191919' }}>
        <div className="text-gray-300">Загрузка результатов...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12 px-4" style={{ background: '#191919' }}>
      <div className="max-w-4xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ opacity: 0, filter: "blur(10px)", scale: 0.9 }}
            animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-4"
          >
            <Sparkles className="w-4 h-4" />
            Анализ завершен
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, filter: "blur(10px)", y: 20 }}
            animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-4xl font-bold text-white mb-2"
          >
            Ваша идеальная профессия
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="text-gray-300"
          >
            На основе ИИ-анализа ваших интересов и способностей
          </motion.p>
        </div>

        {/* Profession Card */}
        <motion.div
          initial={{ opacity: 0, filter: "blur(10px)", y: 30 }}
          animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
          transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
          whileHover={{ scale: 1.02, y: -5 }}
          className="rounded-2xl shadow-xl p-8 mb-8 border-2 border-blue-900"
          style={{ background: '#1d1d1d' }}
        >
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">
                {data.profession}
              </h2>
              <p className="text-gray-400">{data.profession_en}</p>
            </div>
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl text-center">
              <div className="text-3xl font-bold">{data.match}%</div>
              <div className="text-xs opacity-90">совпадение</div>
            </div>
          </div>

          <p className="text-gray-300 mb-6 leading-relaxed">
            {data.description}
          </p>

          <div className="bg-gradient-to-r from-green-900/20 to-emerald-900/20 rounded-xl p-4 border border-green-700">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-5 h-5 text-green-400" />
              <span className="font-semibold text-green-300">Зарплата в Узбекистане</span>
            </div>
            <p className="text-2xl font-bold" style={{ color: '#C1FBA4' }}>{data.salary_uz_sum}</p>
          </div>
        </motion.div>

        {/* Roadmap */}
        <motion.div
          initial={{ opacity: 0, filter: "blur(10px)", y: 30 }}
          animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
          transition={{ duration: 1, delay: 0.9, ease: "easeOut" }}
          className="rounded-2xl shadow-xl p-8 mb-8"
          style={{ background: '#1d1d1d' }}
        >
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.1, ease: "easeOut" }}
            className="text-2xl font-bold text-white mb-8 text-center"
          >
            {data.roadmap.length} ШАГОВ К ОСВОЕНИЮ ПРОФЕССИИ
          </motion.h3>

          <div className="space-y-6">
            {data.roadmap.map((stage, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, filter: "blur(8px)", x: -20 }}
                animate={{ opacity: 1, filter: "blur(0px)", x: 0 }}
                transition={{ duration: 0.8, delay: 1.3 + index * 0.1, ease: "easeOut" }}
                whileHover={{ scale: 1.02, x: 5 }}
                className="rounded-2xl p-6 shadow-lg"
                style={{ background: '#F4C430' }}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center">
                      <span className="text-xl font-bold text-yellow-400">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                    </div>
                  </div>

                  <div className="flex-1">
                    <h4 className="text-xl font-bold text-black mb-2">
                      {stage.stage}
                    </h4>

                    <p className="text-sm text-gray-800 mb-4 font-medium">
                      Длительность: {stage.duration}
                    </p>

                    <div className="space-y-2">
                      <p className="text-sm text-gray-800 font-semibold">Навыки для изучения:</p>
                      <div className="flex flex-wrap gap-2">
                        {stage.topics.map((topic, topicIndex) => (
                          <span
                            key={topicIndex}
                            className="bg-black text-yellow-400 px-3 py-1.5 rounded-full text-sm font-medium"
                          >
                            {topic}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Learning Resources */}
        <motion.div
          initial={{ opacity: 0, filter: "blur(10px)", y: 30 }}
          animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
          transition={{ duration: 1, delay: 1.8, ease: "easeOut" }}
          className="rounded-2xl shadow-xl p-8 mb-8"
          style={{ background: '#1d1d1d' }}
        >
          <motion.h3
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 2.0, ease: "easeOut" }}
            className="text-2xl font-bold text-white mb-6 flex items-center gap-2"
          >
            <BookOpen className="w-6 h-6 text-purple-600" />
            Рекомендуемые ресурсы
          </motion.h3>

          <div className="space-y-3">
            {data.resources.map((resource, index) => (
              <motion.a
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 2.2 + index * 0.1, ease: "easeOut" }}
                whileHover={{ scale: 1.02, x: 5 }}
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
                    <h4 className="font-semibold text-white">{resource.title}</h4>
                    <p className="text-sm text-gray-400">{resource.type}</p>
                  </div>
                </div>
                <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-purple-400" />
              </motion.a>
            ))}
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 2.5, ease: "easeOut" }}
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

      {/* Chat button will be implemented next */}
    </div>
  )
}
