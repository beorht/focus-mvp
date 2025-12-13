'use client'

import { useState, useEffect } from 'react'
import { useThemeStore } from '@/store/useThemeStore'
import { useTranslation } from '@/hooks/useTranslation'
import { CheckCircle2, XCircle, Download, Upload, RotateCcw } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export interface QuizQuestion {
  question: string
  options: string[]
  correctAnswer: number
  explanation?: string
}

interface Quiz {
  title: string
  description?: string
  questions: QuizQuestion[]
}

interface QuizSectionProps {
  quiz: Quiz
  topicTitle: string
  onComplete?: (score: number, answers: number[]) => void
}

export default function QuizSection({ quiz, topicTitle, onComplete }: QuizSectionProps) {
  const theme = useThemeStore((state) => state.theme)
  const { t } = useTranslation()

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>(
    new Array(quiz.questions.length).fill(null)
  )
  const [submitted, setSubmitted] = useState(false)
  const [showExplanation, setShowExplanation] = useState(false)

  // Load saved answers from localStorage
  useEffect(() => {
    const savedAnswers = localStorage.getItem(`quiz_${topicTitle}`)
    if (savedAnswers) {
      try {
        const parsed = JSON.parse(savedAnswers)
        setSelectedAnswers(parsed.answers)
        setSubmitted(parsed.submitted || false)
      } catch (e) {
        console.error('Failed to parse saved answers', e)
      }
    }
  }, [topicTitle])

  // Save answers to localStorage
  useEffect(() => {
    localStorage.setItem(
      `quiz_${topicTitle}`,
      JSON.stringify({ answers: selectedAnswers, submitted })
    )
  }, [selectedAnswers, submitted, topicTitle])

  const handleAnswerSelect = (answerIndex: number) => {
    if (submitted) return

    const newAnswers = [...selectedAnswers]
    newAnswers[currentQuestionIndex] = answerIndex
    setSelectedAnswers(newAnswers)
  }

  const handleSubmit = () => {
    setSubmitted(true)
    setShowExplanation(true)

    // Calculate score
    const score = selectedAnswers.reduce((acc: number, answer, idx) => {
      return acc + (answer === quiz.questions[idx].correctAnswer ? 1 : 0)
    }, 0)

    if (onComplete) {
      onComplete(score, selectedAnswers as number[])
    }
  }

  const handleReset = () => {
    setSelectedAnswers(new Array(quiz.questions.length).fill(null))
    setSubmitted(false)
    setShowExplanation(false)
    setCurrentQuestionIndex(0)
    localStorage.removeItem(`quiz_${topicTitle}`)
  }

  const handleExportAnswers = () => {
    const data = {
      topicTitle,
      quiz: quiz.title,
      answers: selectedAnswers.map((answer, idx) => ({
        question: quiz.questions[idx].question,
        selectedOption: answer !== null ? quiz.questions[idx].options[answer] : 'Не отвечено',
        correctOption: quiz.questions[idx].options[quiz.questions[idx].correctAnswer],
        isCorrect: answer === quiz.questions[idx].correctAnswer,
      })),
      score: calculateScore(),
      timestamp: new Date().toISOString(),
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `quiz_${topicTitle.replace(/\s+/g, '_')}_${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImportAnswers = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string)
        if (data.answers && Array.isArray(data.answers)) {
          const importedAnswers = data.answers.map((item: any) => {
            const optionIndex = quiz.questions.find((q) => q.question === item.question)?.options.indexOf(item.selectedOption)
            return optionIndex !== undefined && optionIndex !== -1 ? optionIndex : null
          })
          setSelectedAnswers(importedAnswers)
        }
      } catch (error) {
        alert('Ошибка при загрузке файла')
      }
    }
    reader.readAsText(file)
  }

  const calculateScore = () => {
    return selectedAnswers.reduce((acc: number, answer, idx) => {
      return acc + (answer === quiz.questions[idx].correctAnswer ? 1 : 0)
    }, 0)
  }

  const currentQuestion = quiz.questions[currentQuestionIndex]
  const selectedAnswer = selectedAnswers[currentQuestionIndex]
  const isCorrect = selectedAnswer === currentQuestion.correctAnswer

  const allAnswered = selectedAnswers.every((a) => a !== null)
  const score = calculateScore()
  const percentage = Math.round((score / quiz.questions.length) * 100)

  return (
    <div
      className={`rounded-xl p-6 ${
        theme === 'dark'
          ? 'bg-gradient-to-br from-indigo-900/30 to-purple-900/30 border border-indigo-500/30'
          : 'bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200'
      }`}
    >
      {/* Quiz Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3
            className={`text-xl font-bold ${
              theme === 'dark' ? 'text-indigo-300' : 'text-indigo-900'
            }`}
          >
            {quiz.title}
          </h3>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={handleExportAnswers}
              disabled={!allAnswered}
              className={`p-2 rounded-lg transition-colors ${
                theme === 'dark'
                  ? 'bg-indigo-800 text-indigo-200 hover:bg-indigo-700 disabled:bg-gray-800 disabled:text-gray-600'
                  : 'bg-indigo-200 text-indigo-900 hover:bg-indigo-300 disabled:bg-gray-200 disabled:text-gray-400'
              }`}
              title="Скачать ответы"
            >
              <Download className="w-4 h-4" />
            </button>

            <label
              className={`p-2 rounded-lg transition-colors cursor-pointer ${
                theme === 'dark'
                  ? 'bg-indigo-800 text-indigo-200 hover:bg-indigo-700'
                  : 'bg-indigo-200 text-indigo-900 hover:bg-indigo-300'
              }`}
              title="Загрузить ответы"
            >
              <Upload className="w-4 h-4" />
              <input
                type="file"
                accept=".json"
                onChange={handleImportAnswers}
                className="hidden"
              />
            </label>

            <button
              onClick={handleReset}
              className={`p-2 rounded-lg transition-colors ${
                theme === 'dark'
                  ? 'bg-red-900/50 text-red-200 hover:bg-red-800/50'
                  : 'bg-red-100 text-red-700 hover:bg-red-200'
              }`}
              title="Сбросить"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {quiz.description && (
          <p className={`text-sm ${theme === 'dark' ? 'text-indigo-200' : 'text-indigo-700'}`}>
            {quiz.description}
          </p>
        )}

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex justify-between text-sm mb-2">
            <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
              Вопрос {currentQuestionIndex + 1} из {quiz.questions.length}
            </span>
            {submitted && (
              <span className="font-semibold text-indigo-500">
                Результат: {score}/{quiz.questions.length} ({percentage}%)
              </span>
            )}
          </div>
          <div
            className={`h-2 rounded-full overflow-hidden ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'
            }`}
          >
            <motion.div
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
              initial={{ width: 0 }}
              animate={{
                width: `${((currentQuestionIndex + 1) / quiz.questions.length) * 100}%`,
              }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestionIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <div className="mb-6">
            <h4
              className={`text-lg font-semibold mb-4 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}
            >
              {currentQuestion.question}
            </h4>

            {/* Options */}
            <div className="space-y-3">
              {currentQuestion.options.map((option, idx) => {
                const isSelected = selectedAnswer === idx
                const isCorrectOption = idx === currentQuestion.correctAnswer
                const showCorrect = submitted && isCorrectOption
                const showWrong = submitted && isSelected && !isCorrect

                return (
                  <button
                    key={idx}
                    onClick={() => handleAnswerSelect(idx)}
                    disabled={submitted}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                      showCorrect
                        ? 'border-green-500 bg-green-500/20'
                        : showWrong
                          ? 'border-red-500 bg-red-500/20'
                          : isSelected
                            ? theme === 'dark'
                              ? 'border-indigo-500 bg-indigo-900/30'
                              : 'border-indigo-500 bg-indigo-100'
                            : theme === 'dark'
                              ? 'border-gray-700 bg-gray-800/50 hover:bg-gray-700/50'
                              : 'border-gray-200 bg-white hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {submitted && (
                        <>
                          {showCorrect && <CheckCircle2 className="w-5 h-5 text-green-500" />}
                          {showWrong && <XCircle className="w-5 h-5 text-red-500" />}
                        </>
                      )}
                      <span
                        className={`flex-1 ${
                          theme === 'dark' ? 'text-gray-200' : 'text-gray-900'
                        }`}
                      >
                        {option}
                      </span>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Explanation */}
          {submitted && showExplanation && currentQuestion.explanation && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className={`p-4 rounded-lg mb-4 ${
                theme === 'dark'
                  ? 'bg-blue-900/30 border border-blue-500/30'
                  : 'bg-blue-50 border border-blue-200'
              }`}
            >
              <p
                className={`text-sm ${theme === 'dark' ? 'text-blue-200' : 'text-blue-900'}`}
              >
                <strong>Объяснение:</strong> {currentQuestion.explanation}
              </p>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex justify-between items-center mt-6">
        <button
          onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
          disabled={currentQuestionIndex === 0}
          className={`px-4 py-2 rounded-lg transition-colors ${
            theme === 'dark'
              ? 'bg-gray-800 text-gray-300 hover:bg-gray-700 disabled:bg-gray-900 disabled:text-gray-700'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400'
          }`}
        >
          Назад
        </button>

        <div className="flex gap-2">
          {currentQuestionIndex < quiz.questions.length - 1 ? (
            <button
              onClick={() =>
                setCurrentQuestionIndex(
                  Math.min(quiz.questions.length - 1, currentQuestionIndex + 1)
                )
              }
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-lg transition-all"
            >
              Далее
            </button>
          ) : (
            !submitted && (
              <button
                onClick={handleSubmit}
                disabled={!allAnswered}
                className={`px-6 py-2 rounded-lg transition-all ${
                  allAnswered
                    ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:shadow-lg'
                    : theme === 'dark'
                      ? 'bg-gray-800 text-gray-600 cursor-not-allowed'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                Проверить ответы
              </button>
            )
          )}
        </div>
      </div>
    </div>
  )
}
