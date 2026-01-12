'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useLogStore } from '@/store/useLogStore'
import { useThemeStore } from '@/store/useThemeStore'
import { useLanguageStore } from '@/store/useLanguageStore'
import { useTranslation } from '@/hooks/useTranslation'
import { Brain, Sparkles, Zap, Target } from 'lucide-react'
import { matchProfessions } from '@/lib/professionMatcher'

export default function AnalyzePage() {
  const router = useRouter()
  const addLog = useLogStore((state) => state.addLog)
  const theme = useThemeStore((state) => state.theme)
  const language = useLanguageStore((state) => state.language)
  const { t } = useTranslation()
  const [stage, setStage] = useState(0)

  const stages = [
    { icon: Brain, textKey: 'analyze.step2', duration: 2000 },
    { icon: Sparkles, textKey: 'analyze.step1', duration: 2000 },
    { icon: Target, textKey: 'analyze.step3', duration: 2000 },
    { icon: Zap, textKey: 'analyze.step4', duration: 2000 }
  ]

  useEffect(() => {
    const performAnalysis = async () => {
      try {
        // Get user answers from sessionStorage
        const answersStr = sessionStorage.getItem('userAnswers')
        if (!answersStr) {
          addLog('ERROR', 'No user answers found')
          router.push('/test')
          return
        }

        const answers = JSON.parse(answersStr)
        addLog('SYSTEM', 'Starting AI-powered analysis...')
        addLog('DATA', `RIASEC scores: ${JSON.stringify(answers.riasec_percentages)}`)

        // Animate through stages
        for (let i = 0; i < stages.length; i++) {
          setStage(i)
          addLog('INFO', `AI analysis stage ${i + 1}/${stages.length}`)
          await new Promise(resolve => setTimeout(resolve, stages[i].duration))
        }

        // Run AI-powered profession matching
        addLog('SYSTEM', 'AI analyzing profession matches...')
        const matchResults = matchProfessions(answers.riasec_percentages, language)

        addLog('DATA', `Found ${matchResults.length} matching professions`)
        addLog('INFO', `Top match: ${matchResults[0].profession.name[language]} (${matchResults[0].matchPercentage}%)`)

        // Convert match results to format expected by Results Page
        const professions = matchResults.map(result => ({
          id: result.profession.id,
          name: result.profession.name[language],
          match: result.matchPercentage,
          matchPercentage: result.matchPercentage,
          category: result.profession.category,
          salary_uz_sum: result.profession.salaryUzSum,
          description: result.profession.description[language],
          requiredSkills: result.profession.requiredSkills[language],
          marketDemand: result.profession.marketDemand,
          matchDetails: {
            topStrengths: result.matchDetails.topStrengths,
            riasecMatch: result.matchDetails.riasecMatch,
            bonusPoints: result.matchDetails.bonusPoints
          }
        }))

        const resultsData = { professions }

        // Log results summary
        addLog('DATA', `Professions: ${professions.map(p => `${p.name} (${p.match}%)`).join(', ')}`)
        addLog('SYSTEM', 'Analysis completed successfully')

        // Store results in sessionStorage
        sessionStorage.setItem('analysisResults', JSON.stringify(resultsData))

        // Navigate to results
        setTimeout(() => {
          router.push('/results')
        }, 1000)

      } catch (error: any) {
        addLog('ERROR', `Analysis failed: ${error.message}`)
        console.error('Analysis error:', error)

        // Navigate to results even on error (for demo purposes)
        setTimeout(() => {
          router.push('/results')
        }, 2000)
      }
    }

    performAnalysis()
  }, [])

  const CurrentIcon = stages[stage]?.icon || Brain

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: theme === 'dark' ? '#191919' : '#F7F6F1' }}>
      <div className="text-center">
        {/* Animated Brain/Icon */}
        <div className="relative mb-8">
          {/* Outer pulse rings */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className={`w-48 h-48 rounded-full animate-ping ${
              theme === 'dark' ? 'bg-blue-500/20' : 'bg-blue-300/30'
            }`} />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className={`w-40 h-40 rounded-full animate-ping animation-delay-300 ${
              theme === 'dark' ? 'bg-purple-500/20' : 'bg-purple-300/30'
            }`} />
          </div>

          {/* Main icon */}
          <div className="relative flex items-center justify-center">
            <div className="w-32 h-32 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-2xl">
              <CurrentIcon className="w-16 h-16 text-white animate-pulse" />
            </div>
          </div>
        </div>

        {/* Status Text */}
        <h2 className={`text-3xl font-bold mb-4 ${
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>
          {t('analyze.title')}
        </h2>
        <p className={`text-xl mb-8 ${
          theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
        }`}>
          {t(stages[stage]?.textKey || 'analyze.step1')}
        </p>

        {/* Progress Dots */}
        <div className="flex justify-center gap-2">
          {stages.map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index <= stage
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 scale-110'
                  : theme === 'dark' ? 'bg-gray-700' : 'bg-gray-400'
              }`}
            />
          ))}
        </div>

        {/* Tech info */}
        <div
          className={`mt-12 inline-flex items-center gap-2 backdrop-blur-sm px-6 py-3 rounded-full shadow-sm ${
            theme === 'dark' ? 'border border-gray-700' : 'border border-gray-300'
          }`}
          style={{ background: theme === 'dark' ? '#1d1d1d' : '#E6E8FA' }}
        >
          <Zap className="w-4 h-4 text-yellow-500 animate-pulse" />
          <span className={`text-sm font-medium ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Powered by AI Technology
          </span>
        </div>
      </div>
    </div>
  )
}
