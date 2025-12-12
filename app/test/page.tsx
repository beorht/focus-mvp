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
    type: 'single',
    category: 'basic',
    optionsKey: 'test.basicQ1Options',
    options: [
      { value: 'beginner', labelKey: 'test.basicQ1Options.beginner' },
      { value: 'student', labelKey: 'test.basicQ1Options.student' },
      { value: 'junior', labelKey: 'test.basicQ1Options.junior' },
      { value: 'experienced', labelKey: 'test.basicQ1Options.experienced' }
    ]
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

// RIASEC психометрический тест (код Холланда)
const riasecQuestions = [
  // Realistic (R) - вопросы 4-11
  { id: 4, statementKey: 'test.riasecQ4', category: 'R' },
  { id: 5, statementKey: 'test.riasecQ5', category: 'R' },
  { id: 6, statementKey: 'test.riasecQ6', category: 'R' },
  { id: 7, statementKey: 'test.riasecQ7', category: 'R' },
  { id: 8, statementKey: 'test.riasecQ8', category: 'R' },
  { id: 9, statementKey: 'test.riasecQ9', category: 'R' },
  { id: 10, statementKey: 'test.riasecQ10', category: 'R' },
  { id: 11, statementKey: 'test.riasecQ11', category: 'R' },

  // Investigative (I) - вопросы 12-19
  { id: 12, statementKey: 'test.riasecQ12', category: 'I' },
  { id: 13, statementKey: 'test.riasecQ13', category: 'I' },
  { id: 14, statementKey: 'test.riasecQ14', category: 'I' },
  { id: 15, statementKey: 'test.riasecQ15', category: 'I' },
  { id: 16, statementKey: 'test.riasecQ16', category: 'I' },
  { id: 17, statementKey: 'test.riasecQ17', category: 'I' },
  { id: 18, statementKey: 'test.riasecQ18', category: 'I' },
  { id: 19, statementKey: 'test.riasecQ19', category: 'I' },

  // Artistic (A) - вопросы 20-27
  { id: 20, statementKey: 'test.riasecQ20', category: 'A' },
  { id: 21, statementKey: 'test.riasecQ21', category: 'A' },
  { id: 22, statementKey: 'test.riasecQ22', category: 'A' },
  { id: 23, statementKey: 'test.riasecQ23', category: 'A' },
  { id: 24, statementKey: 'test.riasecQ24', category: 'A' },
  { id: 25, statementKey: 'test.riasecQ25', category: 'A' },
  { id: 26, statementKey: 'test.riasecQ26', category: 'A' },
  { id: 27, statementKey: 'test.riasecQ27', category: 'A' },

  // Social (S) - вопросы 28-35
  { id: 28, statementKey: 'test.riasecQ28', category: 'S' },
  { id: 29, statementKey: 'test.riasecQ29', category: 'S' },
  { id: 30, statementKey: 'test.riasecQ30', category: 'S' },
  { id: 31, statementKey: 'test.riasecQ31', category: 'S' },
  { id: 32, statementKey: 'test.riasecQ32', category: 'S' },
  { id: 33, statementKey: 'test.riasecQ33', category: 'S' },
  { id: 34, statementKey: 'test.riasecQ34', category: 'S' },
  { id: 35, statementKey: 'test.riasecQ35', category: 'S' },

  // Enterprising (E) - вопросы 36-41
  { id: 36, statementKey: 'test.riasecQ36', category: 'E' },
  { id: 37, statementKey: 'test.riasecQ37', category: 'E' },
  { id: 38, statementKey: 'test.riasecQ38', category: 'E' },
  { id: 39, statementKey: 'test.riasecQ39', category: 'E' },
  { id: 40, statementKey: 'test.riasecQ40', category: 'E' },
  { id: 41, statementKey: 'test.riasecQ41', category: 'E' },

  // Conventional (C) - вопросы 42-48
  { id: 42, statementKey: 'test.riasecQ42', category: 'C' },
  { id: 43, statementKey: 'test.riasecQ43', category: 'C' },
  { id: 44, statementKey: 'test.riasecQ44', category: 'C' },
  { id: 45, statementKey: 'test.riasecQ45', category: 'C' },
  { id: 46, statementKey: 'test.riasecQ46', category: 'C' },
  { id: 47, statementKey: 'test.riasecQ47', category: 'C' },
  { id: 48, statementKey: 'test.riasecQ48', category: 'C' }
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
    const level = answers[1]?.[0] || 'beginner'
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

    const knowledgeLevelMap: Record<string, string> = {
      'beginner': 'начинающий',
      'student': 'базовый',
      'junior': 'средний',
      'experienced': 'продвинутый'
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
      level,
      knowledge_level: knowledgeLevelMap[level] || 'начинающий',
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
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              {tf('test.progressLabel', { current: currentStep + 1, total: questions.length })}
            </span>
            <span className="text-sm font-medium text-blue-400">
              {Math.round(progress)}%
            </span>
          </div>
          <div className={`h-2 rounded-full overflow-hidden ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-gray-300'
          }`}>
            <motion.div
              className="h-full bg-gradient-to-r from-blue-600 to-purple-600"
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
            style={{ background: theme === 'dark' ? '#1d1d1d' : '#EADFD7' }}
          >
          <h2 className={`text-2xl font-bold mb-2 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            {isRiasecQuestion ? t(currentQuestion.statementKey) : t(currentQuestion.questionKey)}
          </h2>

          {!isRiasecQuestion && 'type' in currentQuestion && currentQuestion.type === 'multiple' && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className={`mb-6 text-sm ${
                theme === 'dark' ? 'text-white' : 'text-gray-700'
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
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
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
                  theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
                }`}>
                  {t('test.disagree')}
                </span>
                <span className={`text-xs ${
                  theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
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
                          ? 'bg-gradient-to-br from-blue-600 to-purple-600 border-transparent text-white shadow-lg'
                          : theme === 'dark'
                            ? 'border-gray-700 hover:border-gray-600 text-gray-400 hover:text-gray-300'
                            : 'border-gray-300 hover:border-gray-400 text-gray-600 hover:text-gray-700'
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
                    theme === 'dark' ? 'text-gray-600' : 'text-gray-500'
                  }`}>
                    ({idx + 1})
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Standard Options */}
          {!isRiasecQuestion && 'options' in currentQuestion && (
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
                        ? theme === 'dark' ? 'bg-blue-900/20 border-blue-900' : 'bg-blue-100 border-blue-400'
                        : theme === 'dark' ? 'border-gray-700 hover:border-gray-600' : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`font-medium ${
                        isSelected
                          ? theme === 'dark' ? 'text-blue-300' : 'text-blue-700'
                          : theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        {t(option.labelKey)}
                      </span>
                      {isSelected && (
                        <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
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
                ? 'text-gray-600 cursor-not-allowed'
                : theme === 'dark' ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-200'
            }`}
          >
            <ArrowLeft className="w-5 h-5" />
            {t('test.backButton')}
          </motion.button>

          <motion.button
            onClick={handleNext}
            whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(59, 130, 246, 0.3)" }}
            whileTap={{ scale: 0.95 }}
            disabled={isNextDisabled()}
            className={`flex items-center gap-2 px-8 py-3 rounded-full font-semibold transition-all ${
              isNextDisabled()
                ? theme === 'dark' ? 'bg-gray-800 text-gray-600 cursor-not-allowed' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg hover:scale-105'
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
