'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useLogStore } from '@/store/useLogStore'
import { useThemeStore } from '@/store/useThemeStore'
import { useTranslation } from '@/hooks/useTranslation'
import { ArrowRight, ArrowLeft, Check } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

// Базовые вопросы о пользователе
const basicQuestions = [
  {
    id: 1,
    questionKey: 'test.basicQ1',
    type: 'text',
    category: 'basic',
    placeholderKey: 'test.basicQ1Placeholder'
  },
  {
    id: 2,
    questionKey: 'test.basicQ2',
    type: 'single',
    category: 'basic',
    optionsKey: 'test.basicQ2Options',
    options: [
      { value: 'salary', labelKey: 'test.basicQ2Options.salary' },
      { value: 'creative', labelKey: 'test.basicQ2Options.creative' },
      { value: 'balance', labelKey: 'test.basicQ2Options.balance' },
      { value: 'growth', labelKey: 'test.basicQ2Options.growth' }
    ]
  },
  {
    id: 3,
    questionKey: 'test.basicQ3',
    type: 'single',
    category: 'basic',
    optionsKey: 'test.basicQ3Options',
    options: [
      { value: 'visual', labelKey: 'test.basicQ3Options.visual' },
      { value: 'practical', labelKey: 'test.basicQ3Options.practical' },
      { value: 'textual', labelKey: 'test.basicQ3Options.textual' },
      { value: 'mixed', labelKey: 'test.basicQ3Options.mixed' }
    ]
  }
]

// RIASEC психометрический тест (код Холланда) - СОКРАЩЕННАЯ ВЕРСИЯ
// Отобраны самые показательные вопросы для каждой категории
const riasecQuestions = [
  // Realistic (R) - 3 вопроса (практические навыки, работа руками)
  { id: 4, statementKey: 'test.riasecQ4', category: 'R' },   // работа руками
  { id: 6, statementKey: 'test.riasecQ6', category: 'R' },   // работа с техникой
  { id: 7, statementKey: 'test.riasecQ7', category: 'R' },   // прикладные решения

  // Investigative (I) - 3 вопроса (анализ, исследования)
  { id: 13, statementKey: 'test.riasecQ13', category: 'I' }, // анализ данных
  { id: 15, statementKey: 'test.riasecQ15', category: 'I' }, // логические задачи
  { id: 16, statementKey: 'test.riasecQ16', category: 'I' }, // вопрос "почему?"

  // Artistic (A) - 2 вопроса (креативность, эстетика)
  { id: 20, statementKey: 'test.riasecQ20', category: 'A' }, // создание нового
  { id: 22, statementKey: 'test.riasecQ22', category: 'A' }, // эстетика

  // Social (S) - 3 вопроса (работа с людьми, помощь)
  { id: 28, statementKey: 'test.riasecQ28', category: 'S' }, // помощь людям
  { id: 29, statementKey: 'test.riasecQ29', category: 'S' }, // легко контактирую
  { id: 31, statementKey: 'test.riasecQ31', category: 'S' }, // обучение других

  // Enterprising (E) - 2 вопроса (лидерство, амбиции)
  { id: 36, statementKey: 'test.riasecQ36', category: 'E' }, // влияние, ответственность
  { id: 40, statementKey: 'test.riasecQ40', category: 'E' }, // амбициозные цели

  // Conventional (C) - 2 вопроса (организация, структура)
  { id: 42, statementKey: 'test.riasecQ42', category: 'C' }, // порядок и структура
  { id: 46, statementKey: 'test.riasecQ46', category: 'C' }  // систематизация
]

const questions = [...basicQuestions, ...riasecQuestions]

export default function TestPage() {
  const router = useRouter()
  const addLog = useLogStore((state) => state.addLog)
  const theme = useThemeStore((state) => state.theme)
  const { t, tf } = useTranslation()
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string[]>>({})

  const currentQuestion = questions[currentStep]
  const progress = ((currentStep + 1) / questions.length) * 100
  const isRiasecQuestion = 'statementKey' in currentQuestion

  const handleSelect = (value: string) => {
    const currentAnswers = answers[currentQuestion.id] || []

    if ('options' in currentQuestion && currentQuestion.type === 'single') {
      setAnswers({ ...answers, [currentQuestion.id]: [value] })
      addLog('USER_ACTION', `Selected: "${value}"`)
    } else if ('options' in currentQuestion) {
      if (currentAnswers.includes(value)) {
        setAnswers({
          ...answers,
          [currentQuestion.id]: currentAnswers.filter(v => v !== value)
        })
      } else {
        setAnswers({
          ...answers,
          [currentQuestion.id]: [...currentAnswers, value]
        })
      }
      addLog('USER_ACTION', `Toggled: "${value}"`)
    }
  }

  const handleLikertSelect = (questionId: number, value: number) => {
    setAnswers({ ...answers, [questionId]: [value.toString()] })
    addLog('USER_ACTION', `RIASEC Q${questionId}: Score ${value}`)
  }

  const handleTextInput = (questionId: number, value: string) => {
    setAnswers({ ...answers, [questionId]: [value] })
    addLog('USER_ACTION', `Text input Q${questionId}: ${value.substring(0, 50)}${value.length > 50 ? '...' : ''}`)
  }

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1)
      addLog('SYSTEM', `Progress: ${currentStep + 2}/${questions.length}`)
    } else {
      handleSubmit()
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = () => {
    addLog('SYSTEM', 'Assessment completed')
    addLog('DATA', `Collected answers: ${Object.keys(answers).length} questions`)

    // Basic questions answers
    const experienceText = answers[1]?.[0] || 'Опыт не указан'
    const priority = answers[2]?.[0] || 'growth'
    const learningStyle = answers[3]?.[0] || 'mixed'

    // Calculate RIASEC scores
    const riasecScores = {
      R: 0, I: 0, A: 0, S: 0, E: 0, C: 0
    }

    riasecQuestions.forEach((q) => {
      const answer = answers[q.id]?.[0]
      if (answer) {
        const score = parseInt(answer)
        riasecScores[q.category as keyof typeof riasecScores] += score
      }
    })

    const maxScores = { R: 40, I: 40, A: 40, S: 40, E: 30, C: 35 }

    const riasecPercentages = {
      R: Math.round((riasecScores.R / maxScores.R) * 100),
      I: Math.round((riasecScores.I / maxScores.I) * 100),
      A: Math.round((riasecScores.A / maxScores.A) * 100),
      S: Math.round((riasecScores.S / maxScores.S) * 100),
      E: Math.round((riasecScores.E / maxScores.E) * 100),
      C: Math.round((riasecScores.C / maxScores.C) * 100)
    }

    const sortedCategories = Object.entries(riasecScores)
      .sort(([, a], [, b]) => b - a)
      .map(([cat]) => cat)

    const hollandCode = sortedCategories.slice(0, 3).join('')

    const categoryNames = {
      R: 'Реалистичный (практические, технические навыки)',
      I: 'Исследовательский (анализ, наука)',
      A: 'Артистический (творчество, дизайн)',
      S: 'Социальный (работа с людьми)',
      E: 'Предприимчивый (лидерство, бизнес)',
      C: 'Стандартный (организация, порядок)'
    }

    const interests = sortedCategories.slice(0, 3).map(cat =>
      categoryNames[cat as keyof typeof categoryNames]
    )

    let psychotype = ''
    const topCategory = sortedCategories[0]

    if (topCategory === 'I' || topCategory === 'R') {
      psychotype = 'INTJ (аналитический, независимый)'
    } else if (topCategory === 'S') {
      psychotype = 'ESFJ (коммуникабельный, эмпатичный)'
    } else if (topCategory === 'A') {
      psychotype = 'INFP (творческий, вдумчивый)'
    } else if (topCategory === 'E') {
      psychotype = 'ENTJ (лидерский, стратегический)'
    } else {
      psychotype = 'ISTJ (систематичный, надёжный)'
    }

    const learningStyleMap: Record<string, string> = {
      'visual': 'визуальный',
      'practical': 'практический',
      'textual': 'текстовый',
      'mixed': 'смешанный'
    }

    addLog('DATA', `RIASEC Scores - R:${riasecScores.R} I:${riasecScores.I} A:${riasecScores.A} S:${riasecScores.S} E:${riasecScores.E} C:${riasecScores.C}`)
    addLog('DATA', `Holland Code: ${hollandCode}`)

    sessionStorage.setItem('userAnswers', JSON.stringify({
      userName: 'Пользователь',
      interests,
      experience: experienceText,
      knowledge_level: 'пользовательский ответ',
      priority,
      workStyle: sortedCategories[0] === 'S' ? 'team' : sortedCategories[0] === 'E' ? 'team' : 'flexible',
      thinking: sortedCategories[0] === 'I' || sortedCategories[0] === 'R' ? 'logic' : sortedCategories[0] === 'A' ? 'emotion' : 'both',
      psychotype,
      learningStyle,
      preferred_learning_style: learningStyleMap[learningStyle] || 'смешанный',
      riasec_scores: riasecScores,
      riasec_percentages: riasecPercentages,
      holland_code: hollandCode
    }))

    addLog('SYSTEM', 'Navigating to AI analysis...')
    router.push('/analyze')
  }

  const isNextDisabled = () => {
    const currentAnswers = answers[currentQuestion.id]
    return !currentAnswers || currentAnswers.length === 0
  }

  return (
    <div className="min-h-screen py-12 px-4 test-background">
      <div className="max-w-3xl mx-auto">
        {/* Progress Bar */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-8"
        >
          <div className="flex justify-between items-center mb-2">
            <span className={`text-sm font-medium ${
              theme === 'dark' ? 'text-gray-100' : 'text-white'
            }`}>
              {tf('test.progressLabel', { current: currentStep + 1, total: questions.length })}
            </span>
            <span className={`text-sm font-medium ${
              theme === 'dark' ? 'text-blue-400' : 'text-[#8eb69b]'
            }`}>
              {Math.round(progress)}%
            </span>
          </div>
          <div className={`h-2 rounded-full overflow-hidden ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-[#4a6660]'
          }`}>
            <motion.div
              className="h-full bg-gradient-to-r from-[#8eb69b] to-[#5a8f6d]"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </div>
        </motion.div>

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, filter: "blur(10px)", x: 50 }}
            animate={{ opacity: 1, filter: "blur(0px)", x: 0 }}
            exit={{ opacity: 0, filter: "blur(10px)", x: -50 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="rounded-2xl shadow-lg p-8 mb-6"
            style={{ background: theme === 'dark' ? '#1d1d1d' : '#405952' }}
          >
          <h2 className={`text-2xl font-bold mb-2 ${
            theme === 'dark' ? 'text-white' : 'text-white'
          }`}>
            {isRiasecQuestion ? t(currentQuestion.statementKey) : t(currentQuestion.questionKey)}
          </h2>

          {!isRiasecQuestion && 'type' in currentQuestion && currentQuestion.type === 'multiple' && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className={`mb-6 text-sm ${
                theme === 'dark' ? 'text-white' : 'text-white'
              }`}
            >
              {t('test.multipleChoice')}
            </motion.p>
          )}

          {isRiasecQuestion && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className={`mb-6 text-sm ${
                theme === 'dark' ? 'text-gray-400' : 'text-white'
              }`}
            >
              {t('test.likertInstruction')}
            </motion.p>
          )}

          {/* RIASEC Likert Scale */}
          {isRiasecQuestion && (
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-2">
                <span className={`text-xs ${
                  theme === 'dark' ? 'text-gray-500' : 'text-white'
                }`}>
                  {t('test.disagree')}
                </span>
                <span className={`text-xs ${
                  theme === 'dark' ? 'text-gray-500' : 'text-white'
                }`}>
                  {t('test.fullyAgree')}
                </span>
              </div>
              <div className="flex justify-between gap-2">
                {[1, 2, 3, 4, 5].map((value) => {
                  const isSelected = answers[currentQuestion.id]?.[0] === value.toString()
                  return (
                    <motion.button
                      key={value}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: value * 0.05 }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleLikertSelect(currentQuestion.id, value)}
                      className={`flex-1 aspect-square rounded-xl border-2 font-bold text-xl transition-all ${
                        isSelected
                          ? 'bg-gradient-to-br from-[#8eb69b] to-[#5a8f6d] border-transparent text-white shadow-lg'
                          : theme === 'dark'
                            ? 'border-gray-700 hover:border-gray-600 text-gray-400 hover:text-gray-300'
                            : 'border-white hover:border-[#8eb69b] text-white hover:text-[#8eb69b]'
                      }`}
                    >
                      {value}
                    </motion.button>
                  )
                })}
              </div>
              <div className="flex justify-between text-xs mt-2">
                {['1', '2', '3', '4', '5'].map((label, idx) => (
                  <div key={idx} className={`flex-1 text-center ${
                    theme === 'dark' ? 'text-gray-600' : 'text-white/70'
                  }`}>
                    ({idx + 1})
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Text Input */}
          {!isRiasecQuestion && 'type' in currentQuestion && currentQuestion.type === 'text' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <textarea
                value={answers[currentQuestion.id]?.[0] || ''}
                onChange={(e) => handleTextInput(currentQuestion.id, e.target.value)}
                placeholder={'placeholderKey' in currentQuestion && currentQuestion.placeholderKey ? t(currentQuestion.placeholderKey) : ''}
                rows={5}
                className={`w-full px-4 py-3 rounded-xl border-2 transition-all resize-none ${
                  theme === 'dark'
                    ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-blue-500'
                    : 'bg-white border-[#8eb69b] text-gray-900 placeholder-gray-400 focus:border-[#6a9d7d]'
                } focus:outline-none focus:ring-2 focus:ring-[#8eb69b]/20`}
              />
              <p className={`mt-2 text-xs ${
                theme === 'dark' ? 'text-gray-500' : 'text-white/70'
              }`}>
                {answers[currentQuestion.id]?.[0]?.length || 0} символов
              </p>
            </motion.div>
          )}

          {/* Standard Options */}
          {!isRiasecQuestion && 'options' in currentQuestion && currentQuestion.options && (
            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => {
                const isSelected = answers[currentQuestion.id]?.includes(option.value)

                return (
                  <motion.button
                    key={option.value}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05, ease: "easeOut" }}
                    whileHover={{ scale: 1.02, x: 5 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSelect(option.value)}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                      isSelected
                        ? theme === 'dark' ? 'bg-blue-900/20 border-blue-900' : 'bg-[#6a9d7d]/30 border-[#8eb69b]'
                        : theme === 'dark' ? 'border-gray-700 hover:border-gray-600' : 'border-white hover:border-[#8eb69b]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`font-medium ${
                        isSelected
                          ? theme === 'dark' ? 'text-blue-300' : 'text-white'
                          : theme === 'dark' ? 'text-gray-300' : 'text-white'
                      }`}>
                        {t(option.labelKey)}
                      </span>
                      {isSelected && (
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                          theme === 'dark' ? 'bg-blue-600' : 'bg-[#8eb69b]'
                        }`}>
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>
                  </motion.button>
                )
              })}
            </div>
          )}
        </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
          className="flex justify-between items-center"
        >
          <motion.button
            onClick={handleBack}
            disabled={currentStep === 0}
            whileHover={currentStep !== 0 ? { scale: 1.05 } : {}}
            whileTap={currentStep !== 0 ? { scale: 0.95 } : {}}
            className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all ${
              currentStep === 0
                ? theme === 'dark' ? 'text-gray-600 cursor-not-allowed' : 'text-white/40 cursor-not-allowed'
                : theme === 'dark' ? 'text-gray-300 hover:bg-gray-800' : 'text-white hover:bg-[#4a6660]'
            }`}
          >
            <ArrowLeft className="w-5 h-5" />
            {t('test.backButton')}
          </motion.button>

          <motion.button
            onClick={handleNext}
            whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(142, 182, 155, 0.3)" }}
            whileTap={{ scale: 0.95 }}
            disabled={isNextDisabled()}
            className={`flex items-center gap-2 px-8 py-3 rounded-full font-semibold transition-all ${
              isNextDisabled()
                ? theme === 'dark' ? 'bg-gray-800 text-gray-600 cursor-not-allowed' : 'bg-[#4a6660] text-white/40 cursor-not-allowed'
                : 'bg-gradient-to-r from-[#8eb69b] to-[#5a8f6d] text-white hover:shadow-lg hover:scale-105'
            }`}
          >
            {currentStep === questions.length - 1 ? t('test.finishButton') : t('test.nextButton')}
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </motion.div>
      </div>
    </div>
  )
}
