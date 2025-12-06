'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useLogStore } from '@/store/useLogStore'
import { ArrowRight, ArrowLeft, Check } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const questions = [
  {
    id: 1,
    question: 'Какие области тебя больше всего интересуют?',
    type: 'multiple',
    options: [
      { value: 'coding', label: 'Программирование' },
      { value: 'design', label: 'Дизайн и UI/UX' },
      { value: 'data', label: 'Данные и аналитика' },
      { value: 'people', label: 'Работа с людьми' },
      { value: 'business', label: 'Бизнес и менеджмент' },
      { value: 'creative', label: 'Творчество и контент' }
    ]
  },
  {
    id: 2,
    question: 'Каков твой текущий уровень?',
    type: 'single',
    options: [
      { value: 'beginner', label: 'Новичок (без опыта)' },
      { value: 'student', label: 'Студент (учусь)' },
      { value: 'junior', label: 'Есть небольшой опыт' },
      { value: 'experienced', label: 'Есть опыт работы 1+ год' }
    ]
  },
  {
    id: 3,
    question: 'Что для тебя важнее?',
    type: 'single',
    options: [
      { value: 'salary', label: 'Высокая зарплата' },
      { value: 'creative', label: 'Творческая реализация' },
      { value: 'balance', label: 'Work-Life баланс' },
      { value: 'growth', label: 'Карьерный рост' }
    ]
  },
  {
    id: 4,
    question: 'Как ты предпочитаешь работать?',
    type: 'single',
    options: [
      { value: 'alone', label: 'Один, сосредоточенно' },
      { value: 'team', label: 'В команде' },
      { value: 'flexible', label: 'По-разному, гибко' }
    ]
  },
  {
    id: 5,
    question: 'Что тебе ближе?',
    type: 'single',
    options: [
      { value: 'logic', label: 'Логика и системность' },
      { value: 'emotion', label: 'Эмоции и эмпатия' },
      { value: 'both', label: 'Баланс логики и эмоций' }
    ]
  }
]

export default function TestPage() {
  const router = useRouter()
  const addLog = useLogStore((state) => state.addLog)
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string[]>>({})

  const currentQuestion = questions[currentStep]
  const progress = ((currentStep + 1) / questions.length) * 100

  const handleSelect = (value: string) => {
    const currentAnswers = answers[currentQuestion.id] || []

    if (currentQuestion.type === 'single') {
      setAnswers({ ...answers, [currentQuestion.id]: [value] })
      addLog('USER_ACTION', `Selected: "${currentQuestion.options.find(o => o.value === value)?.label}"`)
    } else {
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
      addLog('USER_ACTION', `Toggled interest: "${currentQuestion.options.find(o => o.value === value)?.label}"`)
    }
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

    // Convert answers to format for API
    const interests = answers[1] || []
    const level = answers[2]?.[0] || 'beginner'
    const priority = answers[3]?.[0] || 'growth'
    const workStyle = answers[4]?.[0] || 'flexible'

    // Store in sessionStorage for results page
    sessionStorage.setItem('userAnswers', JSON.stringify({
      interests,
      level,
      priority,
      workStyle,
      thinking: answers[5]?.[0] || 'both'
    }))

    addLog('SYSTEM', 'Navigating to AI analysis...')
    router.push('/analyze')
  }

  const isNextDisabled = () => {
    const currentAnswers = answers[currentQuestion.id]
    return !currentAnswers || currentAnswers.length === 0
  }

  return (
    <div className="min-h-screen py-12 px-4" style={{ background: '#191919' }}>
      <div className="max-w-3xl mx-auto">
        {/* Progress Bar */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-8"
        >
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-300">
              Вопрос {currentStep + 1} из {questions.length}
            </span>
            <span className="text-sm font-medium text-blue-400">
              {Math.round(progress)}%
            </span>
          </div>
          <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
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
            style={{ background: '#1d1d1d' }}
          >
          <h2 className="text-2xl font-bold text-white mb-6">
            {currentQuestion.question}
          </h2>

          {/* Options */}
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
                      ? 'border-blue-500 bg-blue-900/20'
                      : 'border-gray-700 hover:border-gray-600 hover:bg-gray-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`font-medium ${isSelected ? 'text-blue-300' : 'text-gray-300'}`}>
                      {option.label}
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

          {currentQuestion.type === 'multiple' && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-4 text-sm text-gray-400"
            >
              Можно выбрать несколько вариантов
            </motion.p>
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
                : 'text-gray-300 hover:bg-gray-800'
            }`}
          >
            <ArrowLeft className="w-5 h-5" />
            Назад
          </motion.button>

          <motion.button
            onClick={handleNext}
            whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(59, 130, 246, 0.3)" }}
            whileTap={{ scale: 0.95 }}
            disabled={isNextDisabled()}
            className={`flex items-center gap-2 px-8 py-3 rounded-full font-semibold transition-all ${
              isNextDisabled()
                ? 'bg-gray-800 text-gray-600 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg hover:scale-105'
            }`}
          >
            {currentStep === questions.length - 1 ? 'Завершить' : 'Далее'}
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </motion.div>
      </div>
    </div>
  )
}
