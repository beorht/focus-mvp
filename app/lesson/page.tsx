'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useLogStore } from '@/store/useLogStore'
import { useThemeStore } from '@/store/useThemeStore'
import { useTranslation } from '@/hooks/useTranslation'
import { useLanguageStore } from '@/store/useLanguageStore'
import QuizSection, { QuizQuestion } from '@/components/QuizSection'
import ReflectionSection from '@/components/ReflectionSection'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import {
  BookOpen,
  Clock,
  CheckCircle2,
  Circle,
  ArrowLeft,
  ChevronRight,
  ChevronDown,
  Target,
  Lightbulb,
  Code,
  FileText,
  Languages,
  Loader2
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface Quiz {
  title: string
  description?: string
  questions: QuizQuestion[]
}

interface Topic {
  title: string
  summary: string
  hours: number
  examples?: string[]
  tasks?: any[]
  quiz?: Quiz
  completed?: boolean
}

interface LessonData {
  profession: string
  topics: Topic[]
  totalHours: number
}

export default function LessonPage() {
  const router = useRouter()
  const addLog = useLogStore((state) => state.addLog)
  const theme = useThemeStore((state) => state.theme)
  const { t, language } = useTranslation()

  const [lessonData, setLessonData] = useState<LessonData | null>(null)
  const [originalLessonData, setOriginalLessonData] = useState<LessonData | null>(null)
  const [selectedTopicIndex, setSelectedTopicIndex] = useState(0)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [completedTopics, setCompletedTopics] = useState<Set<number>>(new Set())
  const [translating, setTranslating] = useState(false)
  const [translatedLanguage, setTranslatedLanguage] = useState('ru')

  useEffect(() => {
    // Load lesson data from sessionStorage
    const savedLesson = sessionStorage.getItem('selectedLesson')
    if (!savedLesson) {
      addLog('ERROR', 'No lesson data found')
      router.push('/results')
      return
    }

    const data = JSON.parse(savedLesson)
    setLessonData(data)
    setOriginalLessonData(data)
    addLog('SYSTEM', `Loaded lesson: ${data.profession}`)

    // Load progress
    const savedProgress = localStorage.getItem(`progress_${data.profession}`)
    if (savedProgress) {
      setCompletedTopics(new Set(JSON.parse(savedProgress)))
    }
  }, [])

  // Auto-translate when language changes
  useEffect(() => {
    if (!originalLessonData) return

    // Skip if already in target language
    if (language === translatedLanguage) return

    // Translate content
    translateContent(language)
  }, [language, originalLessonData])

  const translateContent = async (targetLang: string) => {
    if (!originalLessonData) return

    setTranslating(true)
    addLog('API_REQ', `Translating to ${targetLang}`)

    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: {
            profession: originalLessonData.profession,
            topics: originalLessonData.topics.map(t => ({
              title: t.title,
              summary: t.summary,
              examples: t.examples || [],
              tasks: t.tasks || [],
              quiz: t.quiz || null
            }))
          },
          targetLanguage: targetLang
        })
      })

      const result = await response.json()

      if (result.translatedContent) {
        const translatedData: LessonData = {
          ...originalLessonData,
          profession: result.translatedContent.profession,
          topics: originalLessonData.topics.map((topic, idx) => ({
            ...topic,
            title: result.translatedContent.topics[idx]?.title || topic.title,
            summary: result.translatedContent.topics[idx]?.summary || topic.summary,
            examples: result.translatedContent.topics[idx]?.examples || topic.examples,
            tasks: result.translatedContent.topics[idx]?.tasks || topic.tasks,
            quiz: result.translatedContent.topics[idx]?.quiz || topic.quiz
          }))
        }

        setLessonData(translatedData)
        setTranslatedLanguage(targetLang)
        addLog('API_RES', 'Translation successful')
      } else {
        addLog('ERROR', 'Translation failed')
      }
    } catch (error: any) {
      addLog('ERROR', `Translation error: ${error.message}`)
      console.error('Translation error:', error)
    } finally {
      setTranslating(false)
    }
  }

  const toggleTopicComplete = (index: number) => {
    const newCompleted = new Set(completedTopics)
    if (newCompleted.has(index)) {
      newCompleted.delete(index)
    } else {
      newCompleted.add(index)
    }
    setCompletedTopics(newCompleted)

    // Save progress
    if (lessonData) {
      localStorage.setItem(
        `progress_${lessonData.profession}`,
        JSON.stringify(Array.from(newCompleted))
      )
    }
  }

  const progress = lessonData
    ? Math.round((completedTopics.size / lessonData.topics.length) * 100)
    : 0

  if (!lessonData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
            {t('common.loading')}
          </p>
        </div>
      </div>
    )
  }

  const currentTopic = lessonData.topics[selectedTopicIndex]

  return (
    <div className="min-h-screen flex" style={{
      background: theme === 'dark' ? '#0f0f0f' : '#fafafa'
    }}>
      {/* Sidebar */}
      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: sidebarOpen ? 0 : -300 }}
        transition={{ duration: 0.3 }}
        className="fixed left-0 top-0 h-full w-80 z-40 overflow-y-auto border-r"
        style={{
          background: theme === 'dark' ? '#1a1a1a' : '#ffffff',
          borderColor: theme === 'dark' ? '#2a2a2a' : '#e5e5e5'
        }}
      >
        {/* Sidebar Header */}
        <div className="p-6 border-b" style={{
          borderColor: theme === 'dark' ? '#2a2a2a' : '#e5e5e5'
        }}>
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => router.push('/results')}
              className={`flex items-center gap-2 text-sm transition-colors ${
                theme === 'dark'
                  ? 'text-gray-400 hover:text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              {t('lesson.navigation.backToResults')}
            </button>

            {/* Language Switcher */}
            <LanguageSwitcher />
          </div>

          <h2 className={`text-lg font-bold mb-2 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            {lessonData.profession}
          </h2>

          {/* Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                {t('lesson.sidebar.totalProgress')}
              </span>
              <span className="font-semibold text-blue-500">{progress}%</span>
            </div>
            <div className={`h-2 rounded-full overflow-hidden ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'
            }`}>
              <motion.div
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <div className="flex justify-between text-xs">
              <span className={theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}>
                {completedTopics.size} / {lessonData.topics.length} {t('lesson.content.topics')}
              </span>
              <span className={theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}>
                {t('results.totalTime')}: {lessonData.totalHours}ч
              </span>
            </div>
          </div>
        </div>

        {/* Topics List */}
        <div className="p-4">
          <h3 className={`text-sm font-semibold mb-3 px-2 ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            {t('lesson.sidebar.allTopics')}
          </h3>

          <div className="space-y-1">
            {lessonData.topics.map((topic, index) => {
              const isSelected = selectedTopicIndex === index
              const isCompleted = completedTopics.has(index)

              return (
                <motion.button
                  key={index}
                  onClick={() => setSelectedTopicIndex(index)}
                  whileHover={{ x: 4 }}
                  className={`w-full text-left p-3 rounded-lg transition-all ${
                    isSelected
                      ? theme === 'dark'
                        ? 'bg-blue-900/30 border-l-4 border-blue-500'
                        : 'bg-blue-50 border-l-4 border-blue-500'
                      : theme === 'dark'
                        ? 'hover:bg-gray-800 border-l-4 border-transparent'
                        : 'hover:bg-gray-50 border-l-4 border-transparent'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    ) : (
                      <Circle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                        theme === 'dark' ? 'text-gray-600' : 'text-gray-400'
                      }`} />
                    )}

                    <div className="flex-1 min-w-0">
                      <div className={`font-medium text-sm mb-1 ${
                        isSelected
                          ? theme === 'dark' ? 'text-blue-400' : 'text-blue-700'
                          : theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        {topic.title}
                      </div>
                      <div className={`flex items-center gap-2 text-xs ${
                        theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                      }`}>
                        <Clock className="w-3 h-3" />
                        {topic.hours}ч
                      </div>
                    </div>
                  </div>
                </motion.button>
              )
            })}
          </div>
        </div>
      </motion.aside>

      {/* Toggle Sidebar Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className={`fixed left-80 top-4 z-50 p-2 rounded-r-lg shadow-lg transition-all ${
          theme === 'dark'
            ? 'bg-gray-800 text-white hover:bg-gray-700'
            : 'bg-white text-gray-900 hover:bg-gray-50 border border-l-0'
        }`}
        style={{
          transform: sidebarOpen ? 'translateX(0)' : 'translateX(-320px)'
        }}
      >
        <ChevronRight className={`w-5 h-5 transition-transform ${
          sidebarOpen ? 'rotate-180' : ''
        }`} />
      </button>

      {/* Main Content */}
      <main
        className="flex-1 overflow-y-auto"
        style={{
          marginLeft: sidebarOpen ? '320px' : '0',
          transition: 'margin-left 0.3s'
        }}
      >
        <div className="max-w-4xl mx-auto p-8 py-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedTopicIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Topic Header */}
              <div className="mb-8">
                <div className="flex items-center justify-between gap-2 mb-4">
                  <div className="flex items-center gap-2">
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                      theme === 'dark'
                        ? 'bg-blue-900/30 text-blue-400'
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {t('lesson.content.topics')} {selectedTopicIndex + 1} / {lessonData.topics.length}
                    </div>
                    <div className={`flex items-center gap-1 text-xs ${
                      theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                    }`}>
                      <Clock className="w-3 h-3" />
                      {currentTopic.hours}ч
                    </div>
                  </div>

                  {/* Translation Indicator */}
                  {translating && (
                    <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs ${
                      theme === 'dark'
                        ? 'bg-indigo-900/30 text-indigo-400'
                        : 'bg-indigo-100 text-indigo-700'
                    }`}>
                      <Loader2 className="w-3 h-3 animate-spin" />
                      Перевод...
                    </div>
                  )}
                </div>

                <h1 className={`text-4xl font-bold mb-4 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  {currentTopic.title}
                </h1>

                <p className={`text-lg leading-relaxed ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`} style={{ lineHeight: '1.8' }}>
                  {currentTopic.summary}
                </p>
              </div>

              {/* Examples Section */}
              {currentTopic.examples && currentTopic.examples.length > 0 && (
                <div className={`rounded-xl p-6 mb-8 ${
                  theme === 'dark' ? 'bg-purple-900/20 border border-purple-500/30' : 'bg-purple-50 border border-purple-200'
                }`}>
                  <div className="flex items-center gap-2 mb-4">
                    <Lightbulb className={`w-5 h-5 ${
                      theme === 'dark' ? 'text-purple-400' : 'text-purple-600'
                    }`} />
                    <h3 className={`font-semibold ${
                      theme === 'dark' ? 'text-purple-300' : 'text-purple-900'
                    }`}>
                      {t('lesson.content.examples')}
                    </h3>
                  </div>
                  <div className="space-y-3">
                    {currentTopic.examples.map((example, idx) => (
                      <div key={idx} className={`text-sm leading-relaxed ${
                        theme === 'dark' ? 'text-purple-200' : 'text-purple-800'
                      }`} style={{ lineHeight: '1.7' }}>
                        • {example}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tasks Section */}
              {currentTopic.tasks && currentTopic.tasks.length > 0 && (
                <div className={`rounded-xl p-6 mb-8 ${
                  theme === 'dark' ? 'bg-green-900/20 border border-green-500/30' : 'bg-green-50 border border-green-200'
                }`}>
                  <div className="flex items-center gap-2 mb-4">
                    <Target className={`w-5 h-5 ${
                      theme === 'dark' ? 'text-green-400' : 'text-green-600'
                    }`} />
                    <h3 className={`font-semibold ${
                      theme === 'dark' ? 'text-green-300' : 'text-green-900'
                    }`}>
                      {t('lesson.content.tasks')}
                    </h3>
                  </div>
                  <div className="space-y-4">
                    {currentTopic.tasks.map((task: any, idx) => (
                      <div key={idx} className={`p-4 rounded-lg ${
                        theme === 'dark' ? 'bg-green-900/30' : 'bg-white'
                      }`}>
                        <div className={`font-medium mb-2 ${
                          theme === 'dark' ? 'text-green-200' : 'text-green-900'
                        }`}>
                          {task.title}
                        </div>
                        <div className={`text-sm ${
                          theme === 'dark' ? 'text-green-300/80' : 'text-green-700'
                        }`} style={{ lineHeight: '1.7' }}>
                          {task.description}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Quiz Section */}
              {currentTopic.quiz && (
                <div className="mb-8">
                  <QuizSection
                    quiz={currentTopic.quiz}
                    topicTitle={currentTopic.title}
                    onComplete={(score, answers) => {
                      addLog('USER_ACTION', `Quiz completed: ${score}/${currentTopic.quiz?.questions.length || 0}`)
                    }}
                  />
                </div>
              )}

              {/* Reflection Section */}
              <div className="mb-8">
                <ReflectionSection
                  topicTitle={currentTopic.title}
                  onSave={(data) => {
                    addLog('USER_ACTION', `Reflection saved for: ${currentTopic.title}`)
                  }}
                />
              </div>

              {/* Mark Complete Button */}
              <div className="flex items-center justify-between pt-8 border-t" style={{
                borderColor: theme === 'dark' ? '#2a2a2a' : '#e5e5e5'
              }}>
                <button
                  onClick={() => toggleTopicComplete(selectedTopicIndex)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                    completedTopics.has(selectedTopicIndex)
                      ? theme === 'dark'
                        ? 'bg-green-900/30 text-green-400 hover:bg-green-900/40'
                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                      : theme === 'dark'
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {completedTopics.has(selectedTopicIndex) ? (
                    <>
                      <CheckCircle2 className="w-5 h-5" />
                      {t('lesson.sidebar.completed')}
                    </>
                  ) : (
                    <>
                      <Circle className="w-5 h-5" />
                      {t('lesson.content.markComplete')}
                    </>
                  )}
                </button>

                {/* Navigation */}
                <div className="flex gap-2">
                  {selectedTopicIndex > 0 && (
                    <button
                      onClick={() => setSelectedTopicIndex(selectedTopicIndex - 1)}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        theme === 'dark'
                          ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {t('lesson.content.previousTopic')}
                    </button>
                  )}
                  {selectedTopicIndex < lessonData.topics.length - 1 && (
                    <button
                      onClick={() => setSelectedTopicIndex(selectedTopicIndex + 1)}
                      className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg transition-all"
                    >
                      {t('lesson.content.nextTopic')}
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  )
}
