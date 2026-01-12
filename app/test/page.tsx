'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useLogStore } from '@/store/useLogStore'
import { useThemeStore } from '@/store/useThemeStore'
import { useTranslation } from '@/hooks/useTranslation'
import { ArrowRight, ArrowLeft, Check } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

// RIASEC психометрический тест (код Холланда) - ОПТИМИЗИРОВАННАЯ ВЕРСИЯ
// По 2 самых показательных вопроса для каждой категории (всего 12 вопросов)
const riasecQuestions = [
  // Realistic (R) - 2 вопроса (практические навыки, работа руками)
  { id: 1, statementKey: 'test.riasecQ4', category: 'R' },   // работа руками
  { id: 2, statementKey: 'test.riasecQ6', category: 'R' },   // работа с техникой

  // Investigative (I) - 2 вопроса (анализ, исследования)
  { id: 3, statementKey: 'test.riasecQ13', category: 'I' }, // анализ данных
  { id: 4, statementKey: 'test.riasecQ15', category: 'I' }, // логические задачи

  // Artistic (A) - 2 вопроса (креативность, эстетика)
  { id: 5, statementKey: 'test.riasecQ20', category: 'A' }, // создание нового
  { id: 6, statementKey: 'test.riasecQ22', category: 'A' }, // эстетика

  // Social (S) - 2 вопроса (работа с людьми, помощь)
  { id: 7, statementKey: 'test.riasecQ28', category: 'S' }, // помощь людям
  { id: 8, statementKey: 'test.riasecQ29', category: 'S' }, // легко контактирую

  // Enterprising (E) - 2 вопроса (лидерство, амбиции)
  { id: 9, statementKey: 'test.riasecQ36', category: 'E' }, // влияние, ответственность
  { id: 10, statementKey: 'test.riasecQ40', category: 'E' }, // амбициозные цели

  // Conventional (C) - 2 вопроса (организация, структура)
  { id: 11, statementKey: 'test.riasecQ42', category: 'C' }, // порядок и структура
  { id: 12, statementKey: 'test.riasecQ46', category: 'C' }  // систематизация
]

const questions = riasecQuestions

export default function TestPage() {
  const router = useRouter()
  const addLog = useLogStore((state) => state.addLog)
  const theme = useThemeStore((state) => state.theme)
  const { t, tf } = useTranslation()
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string[]>>({})

  const currentQuestion = questions[currentStep]
  const progress = ((currentStep + 1) / questions.length) * 100

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

    // All categories now have 2 questions, so max score = 10 (2 questions * 5 points)
    const maxScore = 10

    const riasecPercentages = {
      R: Math.round((riasecScores.R / maxScore) * 100),
      I: Math.round((riasecScores.I / maxScore) * 100),
      A: Math.round((riasecScores.A / maxScore) * 100),
      S: Math.round((riasecScores.S / maxScore) * 100),
      E: Math.round((riasecScores.E / maxScore) * 100),
      C: Math.round((riasecScores.C / maxScore) * 100)
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

    addLog('DATA', `RIASEC Scores - R:${riasecScores.R} I:${riasecScores.I} A:${riasecScores.A} S:${riasecScores.S} E:${riasecScores.E} C:${riasecScores.C}`)
    addLog('DATA', `RIASEC Percentages - R:${riasecPercentages.R}% I:${riasecPercentages.I}% A:${riasecPercentages.A}% S:${riasecPercentages.S}% E:${riasecPercentages.E}% C:${riasecPercentages.C}%`)
    addLog('DATA', `Holland Code: ${hollandCode}`)

    // Get user data from registration (if exists)
    const userDataStr = sessionStorage.getItem('userData')
    const userData = userDataStr ? JSON.parse(userDataStr) : { userId: null, fullName: 'Пользователь' }

    // Store simplified data - only RIASEC data matters for matching
    sessionStorage.setItem('userAnswers', JSON.stringify({
      userId: userData.userId,
      userName: userData.fullName || 'Пользователь',
      interests,
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
            {t(currentQuestion.statementKey)}
          </h2>

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

          {/* RIASEC Likert Scale */}
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
            <div className="flex justify-between text-sm mt-3 gap-2 font-medium">
              {[
                t('test.likertScale1'),
                t('test.likertScale2'),
                t('test.likertScale3'),
                t('test.likertScale4'),
                t('test.likertScale5')
              ].map((label, idx) => (
                <div key={idx} className={`flex-1 text-center leading-tight ${
                  theme === 'dark' ? 'text-gray-300' : 'text-white'
                }`}>
                  {label}
                </div>
              ))}
            </div>
          </div>
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
