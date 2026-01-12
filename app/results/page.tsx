'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useLogStore } from '@/store/useLogStore'
import { useThemeStore } from '@/store/useThemeStore'
import { useLanguageStore } from '@/store/useLanguageStore'
import { useTranslation } from '@/hooks/useTranslation'
import { Sparkles, TrendingUp, Target, Award, Briefcase, Star, CheckCircle2 } from 'lucide-react'
import Lenis from 'lenis'
import { motion } from 'framer-motion'
import { translateCategory, translateDemand } from '@/lib/translations'

interface ProfessionData {
  id: string
  name: string
  match: number
  matchPercentage: number
  category: string
  salary_uz_sum: string
  description: string
  requiredSkills: string[]
  marketDemand: 'high' | 'medium' | 'low'
  matchDetails: {
    topStrengths: string[]
    riasecMatch: number
    bonusPoints: number
  }
}

interface ResultsData {
  professions: ProfessionData[]
}

export default function ResultsPage() {
  const router = useRouter()
  const addLog = useLogStore((state) => state.addLog)
  const theme = useThemeStore((state) => state.theme)
  const language = useLanguageStore((state) => state.language)
  const { t, tf } = useTranslation()
  const [data, setData] = useState<ResultsData | null>(null)
  const [userName, setUserName] = useState('Пользователь')

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

    let answers = null
    if (answersStr) {
      answers = JSON.parse(answersStr)
      setUserName(answers.userName || 'Пользователь')
    }

    addLog('DATA', 'Rendering profession recommendations')
    addLog('DATA', `Professions count: ${results.professions?.length || 0}`)

    // Save results to database (fire and forget)
    if (answers) {
      fetch('/api/save-results', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: answers.userId,
          userName: answers.userName,
          riasec_scores: answers.riasec_scores,
          riasec_percentages: answers.riasec_percentages,
          holland_code: answers.holland_code,
          professions: results.professions
        }),
      })
        .then(() => addLog('SYSTEM', 'Results saved to database'))
        .catch((error) => addLog('ERROR', `Failed to save results: ${error.message}`))
    }

    // Cleanup function
    return () => {
      lenis.destroy()
    }
  }, [])

  const getDemandColor = (demand: 'high' | 'medium' | 'low') => {
    if (demand === 'high') return theme === 'dark' ? 'text-green-400' : 'text-green-700'
    if (demand === 'medium') return theme === 'dark' ? 'text-yellow-400' : 'text-yellow-700'
    return theme === 'dark' ? 'text-orange-400' : 'text-orange-700'
  }

  const getDemandIcon = (demand: 'high' | 'medium' | 'low') => {
    if (demand === 'high') return '🔥'
    if (demand === 'medium') return '⚡'
    return '💼'
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center results-background">
        <div className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>{t('common.loading')}</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12 px-4 results-background">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
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
            {t('results.title')}
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, filter: "blur(10px)", y: 20 }}
            animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className={`text-4xl font-bold mb-2 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}
          >
            {tf('results.topMatches', { count: data.professions.length })}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className={`text-xl ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}
          >
            {t('results.subtitle')}
          </motion.p>
        </div>

        {/* Profession Cards */}
        <div className="space-y-6">
          {data.professions.map((profession, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, filter: "blur(10px)", y: 30 }}
              animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 + index * 0.2, ease: "easeOut" }}
              className={`rounded-2xl shadow-xl p-8 border-2 ${
                index === 0
                  ? theme === 'dark' ? 'border-blue-500' : 'border-blue-400'
                  : theme === 'dark' ? 'border-gray-700' : 'border-gray-300'
              }`}
              style={{ background: theme === 'dark' ? '#1d1d1d' : '#FFF1E6' }}
            >
              {/* Profession Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-3 flex-wrap">
                    {index === 0 && (
                      <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                        <Target className="w-3 h-3" />
                        {t('results.recommendedProfession')}
                      </div>
                    )}
                    <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                      theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'
                    }`}>
                      <Briefcase className="w-3 h-3" />
                      {translateCategory(profession.category, language)}
                    </div>
                  </div>
                  <h2 className={`text-3xl font-bold mb-2 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    {profession.name}
                  </h2>
                  <p className={`leading-relaxed mt-4 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`} style={{ lineHeight: '1.7' }}>
                    {profession.description}
                  </p>
                </div>
                <div className="bg-gradient-to-br from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl text-center ml-4 flex-shrink-0">
                  <div className="text-3xl font-bold">{profession.match}%</div>
                  <div className="text-xs opacity-90">{t('results.match')}</div>
                  {profession.matchDetails.bonusPoints > 0 && (
                    <div className="text-xs mt-1 opacity-80">+ {profession.matchDetails.bonusPoints}% IT</div>
                  )}
                </div>
              </div>

              {/* Salary and Market Demand */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className={`rounded-xl p-4 border ${
                  theme === 'dark'
                    ? 'bg-gradient-to-r from-green-900/20 to-emerald-900/20 border-green-700'
                    : 'bg-gradient-to-r from-green-100 to-emerald-100 border-green-400'
                }`}>
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUp className={`w-5 h-5 ${
                      theme === 'dark' ? 'text-green-400' : 'text-green-700'
                    }`} />
                    <span className={`font-semibold text-sm ${
                      theme === 'dark' ? 'text-green-300' : 'text-green-800'
                    }`}>{t('results.salary')}</span>
                  </div>
                  <p className={`text-xl font-bold ${
                    theme === 'dark' ? 'text-[#C1FBA4]' : 'text-green-700'
                  }`}>{profession.salary_uz_sum}</p>
                </div>

                <div className={`rounded-xl p-4 border ${
                  theme === 'dark'
                    ? 'bg-gradient-to-r from-blue-900/20 to-purple-900/20 border-blue-700'
                    : 'bg-gradient-to-r from-blue-100 to-purple-100 border-blue-400'
                }`}>
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUp className={`w-5 h-5 ${
                      theme === 'dark' ? 'text-blue-400' : 'text-blue-700'
                    }`} />
                    <span className={`font-semibold text-sm ${
                      theme === 'dark' ? 'text-blue-300' : 'text-blue-800'
                    }`}>{t('results.marketDemand')}</span>
                  </div>
                  <p className={`text-xl font-bold flex items-center gap-2 ${getDemandColor(profession.marketDemand)}`}>
                    <span>{getDemandIcon(profession.marketDemand)}</span>
                    {translateDemand(profession.marketDemand, language)}
                  </p>
                </div>
              </div>

              {/* Top Strengths */}
              <div className="mb-6">
                <h3 className={`text-lg font-bold mb-4 flex items-center gap-2 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  <Star className="w-5 h-5" />
                  {t('results.yourStrengths')}
                </h3>
                <div className="grid grid-cols-1 gap-3">
                  {profession.matchDetails.topStrengths.map((strength, idx) => (
                    <div
                      key={idx}
                      className={`flex items-center gap-3 p-3 rounded-xl border ${
                        theme === 'dark'
                          ? 'bg-gradient-to-r from-blue-900/20 to-purple-900/20 border-blue-700'
                          : 'bg-gradient-to-r from-blue-50 to-purple-50 border-blue-300'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm bg-gradient-to-br from-blue-600 to-purple-600`}>
                        {idx + 1}
                      </div>
                      <span className={`font-medium ${
                        theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
                      }`}>{strength}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Required Skills */}
              <div>
                <h3 className={`text-lg font-bold mb-4 flex items-center gap-2 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  <Award className="w-5 h-5" />
                  {t('results.requiredSkills')}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {profession.requiredSkills.map((skill, idx) => (
                    <div
                      key={idx}
                      className={`inline-flex items-center gap-1 px-3 py-2 rounded-lg border ${
                        theme === 'dark'
                          ? 'bg-gray-800 border-gray-700 text-gray-200'
                          : 'bg-white border-gray-300 text-gray-800'
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      <span className="font-medium text-sm">{skill}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.5, ease: "easeOut" }}
          className="mt-8 flex flex-col sm:flex-row gap-4"
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
            {t('results.retakeTest')}
          </motion.button>
        </motion.div>
      </div>
    </div>
  )
}
