'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useLogStore } from '@/store/useLogStore'
import { useThemeStore } from '@/store/useThemeStore'
import { useTranslation } from '@/hooks/useTranslation'
import { Brain, Sparkles, Zap, Target } from 'lucide-react'

export default function AnalyzePage() {
  const router = useRouter()
  const addLog = useLogStore((state) => state.addLog)
  const theme = useThemeStore((state) => state.theme)
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
        addLog('SYSTEM', 'Starting AI analysis...')

        // Animate through stages
        for (let i = 0; i < stages.length; i++) {
          setStage(i)
          addLog('INFO', `Stage ${i + 1}/${stages.length}`)
          await new Promise(resolve => setTimeout(resolve, stages[i].duration))
        }

        // Call AI API
        const requestPayload = JSON.stringify(answers, null, 2)
        addLog('API_REQ', `POST /api/generate\nContent-Type: application/json\n\n${requestPayload}`)

        const response = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(answers)
        })

        const result = await response.json()

        if (result.success) {
          // Log debug info from API
          result.debugInfo?.forEach((info: string) => {
            if (info.startsWith('POST') || info.includes('Payload')) {
              addLog('API_REQ', info)
            } else if (info.includes('Response') || info.includes('received')) {
              addLog('API_RES', info)
            } else if (info.includes('ERROR')) {
              addLog('ERROR', info)
            } else {
              addLog('INFO', info)
            }
          })

          // Log professional API response with metadata
          const apiResponse = {
            profession: result.data.profession,
            match_percentage: result.data.match,
            salary_range: result.data.salary_uz_sum,
            topics_count: result.data.topics?.length || 0,
            resources_count: result.data.resources?.length || 0,
            skill_gaps_count: result.data.skill_gaps?.length || 0,
            meta: result.meta
          }

          addLog('API_RES', JSON.stringify(apiResponse))
          addLog('SYSTEM', 'Analysis completed successfully')

          // Store results
          sessionStorage.setItem('analysisResults', JSON.stringify(result.data))

          // Navigate to results
          setTimeout(() => {
            router.push('/results')
          }, 1000)
        } else {
          addLog('ERROR', `API Error: ${result.error}`)
          // Still try to navigate after error
          setTimeout(() => {
            router.push('/results')
          }, 2000)
        }

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
            Powered by Gemini 2.5 Flash
          </span>
        </div>
      </div>
    </div>
  )
}
