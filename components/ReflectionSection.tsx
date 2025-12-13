'use client'

import { useState, useEffect } from 'react'
import { useThemeStore } from '@/store/useThemeStore'
import { useTranslation } from '@/hooks/useTranslation'
import { Brain, Star, TrendingUp, Save, Download } from 'lucide-react'
import { motion } from 'framer-motion'

interface ReflectionData {
  understanding: number // 1-5 scale
  difficulty: number // 1-5 scale
  timeSpent: string
  keyTakeaways: string
  questionsRemaining: string
  practicalApplication: string
  confidenceLevel: number // 1-5 scale
  timestamp: string
}

interface ReflectionSectionProps {
  topicTitle: string
  onSave?: (data: ReflectionData) => void
}

export default function ReflectionSection({ topicTitle, onSave }: ReflectionSectionProps) {
  const theme = useThemeStore((state) => state.theme)
  const { t } = useTranslation()

  const [reflectionData, setReflectionData] = useState<ReflectionData>({
    understanding: 3,
    difficulty: 3,
    timeSpent: '',
    keyTakeaways: '',
    questionsRemaining: '',
    practicalApplication: '',
    confidenceLevel: 3,
    timestamp: new Date().toISOString(),
  })

  const [saved, setSaved] = useState(false)

  // Load saved reflection
  useEffect(() => {
    const savedReflection = localStorage.getItem(`reflection_${topicTitle}`)
    if (savedReflection) {
      try {
        setReflectionData(JSON.parse(savedReflection))
        setSaved(true)
      } catch (e) {
        console.error('Failed to parse saved reflection', e)
      }
    }
  }, [topicTitle])

  const handleSave = () => {
    const data = {
      ...reflectionData,
      timestamp: new Date().toISOString(),
    }
    setReflectionData(data)
    localStorage.setItem(`reflection_${topicTitle}`, JSON.stringify(data))
    setSaved(true)

    if (onSave) {
      onSave(data)
    }
  }

  const handleExport = () => {
    const exportData = {
      topicTitle,
      ...reflectionData,
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `reflection_${topicTitle.replace(/\s+/g, '_')}_${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const updateField = (field: keyof ReflectionData, value: any) => {
    setReflectionData((prev) => ({ ...prev, [field]: value }))
    setSaved(false)
  }

  const StarRating = ({ value, onChange, label }: { value: number; onChange: (v: number) => void; label: string }) => (
    <div className="space-y-2">
      <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
        {label}
      </label>
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => onChange(star)}
            className={`transition-all ${
              star <= value ? 'text-yellow-400' : theme === 'dark' ? 'text-gray-700' : 'text-gray-300'
            }`}
          >
            <Star className={`w-6 h-6 ${star <= value ? 'fill-current' : ''}`} />
          </button>
        ))}
        <span className={`ml-2 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
          {value}/5
        </span>
      </div>
    </div>
  )

  return (
    <div
      className={`rounded-xl p-6 ${
        theme === 'dark'
          ? 'bg-gradient-to-br from-pink-900/30 to-rose-900/30 border border-pink-500/30'
          : 'bg-gradient-to-br from-pink-50 to-rose-50 border border-pink-200'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-pink-900/50' : 'bg-pink-100'}`}>
            <Brain className={`w-6 h-6 ${theme === 'dark' ? 'text-pink-400' : 'text-pink-600'}`} />
          </div>
          <div>
            <h3 className={`text-xl font-bold ${theme === 'dark' ? 'text-pink-300' : 'text-pink-900'}`}>
              Рефлексия
            </h3>
            <p className={`text-sm ${theme === 'dark' ? 'text-pink-200/70' : 'text-pink-700/70'}`}>
              Оцените свой прогресс и запишите выводы
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleSave}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
              saved
                ? theme === 'dark'
                  ? 'bg-green-900/50 text-green-400'
                  : 'bg-green-100 text-green-700'
                : theme === 'dark'
                  ? 'bg-pink-800 text-pink-200 hover:bg-pink-700'
                  : 'bg-pink-200 text-pink-900 hover:bg-pink-300'
            }`}
          >
            <Save className="w-4 h-4" />
            {saved ? 'Сохранено' : 'Сохранить'}
          </button>

          <button
            onClick={handleExport}
            className={`p-2 rounded-lg transition-colors ${
              theme === 'dark'
                ? 'bg-pink-800 text-pink-200 hover:bg-pink-700'
                : 'bg-pink-200 text-pink-900 hover:bg-pink-300'
            }`}
            title="Скачать рефлексию"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-6">
        {/* Understanding Level */}
        <StarRating
          value={reflectionData.understanding}
          onChange={(v) => updateField('understanding', v)}
          label="Насколько хорошо вы поняли материал?"
        />

        {/* Difficulty */}
        <StarRating
          value={reflectionData.difficulty}
          onChange={(v) => updateField('difficulty', v)}
          label="Насколько сложной была тема? (1 - очень легко, 5 - очень сложно)"
        />

        {/* Confidence Level */}
        <StarRating
          value={reflectionData.confidenceLevel}
          onChange={(v) => updateField('confidenceLevel', v)}
          label="Насколько уверенно вы чувствуете себя с этой темой?"
        />

        {/* Time Spent */}
        <div className="space-y-2">
          <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
            Сколько времени вы потратили на изучение?
          </label>
          <input
            type="text"
            value={reflectionData.timeSpent}
            onChange={(e) => updateField('timeSpent', e.target.value)}
            placeholder="Например: 2 часа"
            className={`w-full px-4 py-2 rounded-lg border transition-colors ${
              theme === 'dark'
                ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-pink-500'
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-pink-500'
            } focus:outline-none focus:ring-2 focus:ring-pink-500/20`}
          />
        </div>

        {/* Key Takeaways */}
        <div className="space-y-2">
          <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
            Ключевые выводы (что вы узнали?)
          </label>
          <textarea
            value={reflectionData.keyTakeaways}
            onChange={(e) => updateField('keyTakeaways', e.target.value)}
            placeholder="Запишите основные идеи, которые вы усвоили..."
            rows={4}
            className={`w-full px-4 py-2 rounded-lg border transition-colors resize-none ${
              theme === 'dark'
                ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-pink-500'
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-pink-500'
            } focus:outline-none focus:ring-2 focus:ring-pink-500/20`}
          />
        </div>

        {/* Questions Remaining */}
        <div className="space-y-2">
          <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
            Какие вопросы у вас остались?
          </label>
          <textarea
            value={reflectionData.questionsRemaining}
            onChange={(e) => updateField('questionsRemaining', e.target.value)}
            placeholder="Что вы хотели бы изучить глубже или что осталось неясным..."
            rows={3}
            className={`w-full px-4 py-2 rounded-lg border transition-colors resize-none ${
              theme === 'dark'
                ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-pink-500'
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-pink-500'
            } focus:outline-none focus:ring-2 focus:ring-pink-500/20`}
          />
        </div>

        {/* Practical Application */}
        <div className="space-y-2">
          <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
            Как вы планируете применить это на практике?
          </label>
          <textarea
            value={reflectionData.practicalApplication}
            onChange={(e) => updateField('practicalApplication', e.target.value)}
            placeholder="Опишите конкретные шаги или проекты, где вы примените новые знания..."
            rows={3}
            className={`w-full px-4 py-2 rounded-lg border transition-colors resize-none ${
              theme === 'dark'
                ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-pink-500'
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-pink-500'
            } focus:outline-none focus:ring-2 focus:ring-pink-500/20`}
          />
        </div>
      </div>

      {/* Progress Summary */}
      {saved && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mt-6 p-4 rounded-lg ${
            theme === 'dark' ? 'bg-pink-900/30' : 'bg-pink-100'
          }`}
        >
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className={`w-5 h-5 ${theme === 'dark' ? 'text-pink-400' : 'text-pink-600'}`} />
            <span className={`font-semibold ${theme === 'dark' ? 'text-pink-300' : 'text-pink-900'}`}>
              Сохранено
            </span>
          </div>
          <p className={`text-sm ${theme === 'dark' ? 'text-pink-200/70' : 'text-pink-700/70'}`}>
            Последнее сохранение: {new Date(reflectionData.timestamp).toLocaleString('ru-RU')}
          </p>
        </motion.div>
      )}
    </div>
  )
}
