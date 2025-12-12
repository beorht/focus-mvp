'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useLogStore } from '@/store/useLogStore'
import { useThemeStore } from '@/store/useThemeStore'
import { useTranslation } from '@/hooks/useTranslation'
import { ArrowRight, Sparkles, Brain, Target, Rocket } from 'lucide-react'
import { motion } from 'framer-motion'

export default function Home() {
  const router = useRouter()
  const addLog = useLogStore((state) => state.addLog)
  const theme = useThemeStore((state) => state.theme)
  const { t } = useTranslation()

  const handleStartJourney = () => {
    addLog('USER_ACTION', 'User clicked "Start Journey" button')
    addLog('SYSTEM', 'Navigating to assessment page...')
    setTimeout(() => {
      router.push('/test')
    }, 500)
  }

  return (
    <div className="min-h-screen main-background">
      {/* Hero Section */}
      <div className="container mx-auto px-6 py-20">
        {/* Header */}
        <div className="mb-16 text-center">
          <motion.div
            initial={{ opacity: 0, filter: "blur(10px)", y: 20 }}
            animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6 ${
              theme === 'dark'
                ? 'bg-blue-100 text-blue-700'
                : 'bg-blue-200 text-blue-900'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            {t('home.badge')}
          </motion.div>
          <motion.div
            initial={{ opacity: 0, filter: "blur(10px)", y: 20 }}
            animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="flex justify-center mb-6"
          >
            <Image
              src="/images/intro-salat.png"
              alt="F.O.C.U.S Logo"
              width={550}
              height={140}
              priority
            />
          </motion.div>
          <motion.p
            initial={{ opacity: 0, filter: "blur(10px)", y: 20 }}
            animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className={`text-xl mb-4 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}
          >
            {t('home.tagline')}
          </motion.p>
          <motion.p
            initial={{ opacity: 0, filter: "blur(10px)", y: 20 }}
            animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
            className={`text-lg max-w-2xl mx-auto ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}
          >
            {t('home.description')}
          </motion.p>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
          <motion.div
            initial={{ opacity: 0, filter: "blur(10px)", y: 30 }}
            animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
            transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
            whileHover={{ scale: 1.05, y: -5 }}
            style={{ background: theme === 'dark' ? '#1d1d1d' : '#EFF4D8' }}
            className={`p-6 rounded-xl shadow-sm cursor-pointer ${
              theme === 'dark' ? 'border border-gray-800' : 'border border-gray-300'
            }`}
          >
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${
              theme === 'dark' ? 'bg-blue-900/30' : 'bg-blue-200'
            }`}>
              <Brain className={`w-6 h-6 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-700'}`} />
            </div>
            <h3 className={`font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{t('home.feature1Title')}</h3>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{t('home.feature1Description')}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, filter: "blur(10px)", y: 30 }}
            animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
            transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
            whileHover={{ scale: 1.05, y: -5 }}
            style={{ background: theme === 'dark' ? '#1d1d1d' : '#EFF4D8' }}
            className={`p-6 rounded-xl shadow-sm cursor-pointer ${
              theme === 'dark' ? 'border border-gray-800' : 'border border-gray-300'
            }`}
          >
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${
              theme === 'dark' ? 'bg-purple-900/30' : 'bg-purple-200'
            }`}>
              <Target className={`w-6 h-6 ${theme === 'dark' ? 'text-purple-400' : 'text-purple-700'}`} />
            </div>
            <h3 className={`font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{t('home.feature2Title')}</h3>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{t('home.feature2Description')}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, filter: "blur(10px)", y: 30 }}
            animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
            transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
            whileHover={{ scale: 1.05, y: -5 }}
            style={{ background: theme === 'dark' ? '#1d1d1d' : '#EFF4D8' }}
            className={`p-6 rounded-xl shadow-sm cursor-pointer ${
              theme === 'dark' ? 'border border-gray-800' : 'border border-gray-300'
            }`}
          >
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${
              theme === 'dark' ? 'bg-green-900/30' : 'bg-green-200'
            }`}>
              <Rocket className={`w-6 h-6 ${theme === 'dark' ? 'text-green-400' : 'text-green-700'}`} />
            </div>
            <h3 className={`font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{t('home.feature3Title')}</h3>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{t('home.feature3Description')}</p>
          </motion.div>
        </div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, filter: "blur(10px)", scale: 0.9 }}
          animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
          transition={{ duration: 1, delay: 1.4, ease: "easeOut" }}
          className="flex justify-center items-center"
        >
          <motion.button
            onClick={handleStartJourney}
            whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(59, 130, 246, 0.3)" }}
            whileTap={{ scale: 0.98 }}
            className="group bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-lg flex items-center gap-2"
          >
            {t('home.startButton')}
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </motion.div>

        {/* Tech Stack Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.6, ease: "easeOut" }}
          className="mt-16 text-center"
        >
          <p className={`text-sm mb-3 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{t('home.poweredBy')}</p>
          <div className={`flex flex-wrap justify-center gap-4 text-xs ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
          }`}>
            <span className={theme === 'dark' ? 'bg-gray-800 px-3 py-1 rounded-full' : 'bg-gray-200 px-3 py-1 rounded-full'}>Next.js 14</span>
            <span className={theme === 'dark' ? 'bg-gray-800 px-3 py-1 rounded-full' : 'bg-gray-200 px-3 py-1 rounded-full'}>Gemini 2.5 Flash</span>
            <span className={theme === 'dark' ? 'bg-gray-800 px-3 py-1 rounded-full' : 'bg-gray-200 px-3 py-1 rounded-full'}>Tailwind CSS</span>
            <span className={theme === 'dark' ? 'bg-gray-800 px-3 py-1 rounded-full' : 'bg-gray-200 px-3 py-1 rounded-full'}>TypeScript</span>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
