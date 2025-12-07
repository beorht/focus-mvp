'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useLogStore } from '@/store/useLogStore'
import { ArrowRight, Sparkles, Brain, Target, Rocket } from 'lucide-react'
import { motion } from 'framer-motion'

export default function Home() {
  const router = useRouter()
  const addLog = useLogStore((state) => state.addLog)

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
            className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6"
          >
            <Sparkles className="w-4 h-4" />
            AI-Powered Career Guidance
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
            className="text-xl text-gray-300 mb-4"
          >
            Find Optimal Career Using Science
          </motion.p>
          <motion.p
            initial={{ opacity: 0, filter: "blur(10px)", y: 20 }}
            animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
            className="text-lg text-gray-400 max-w-2xl mx-auto"
          >
            AI-навигатор профессий для рынка Узбекистана. Персональный roadmap карьерного роста на основе анализа ваших интересов и способностей.
          </motion.p>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
          <motion.div
            initial={{ opacity: 0, filter: "blur(10px)", y: 30 }}
            animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
            transition={{ duration: 1, delay: 0.8, ease: "easeOut" }}
            whileHover={{ scale: 1.05, y: -5 }}
            style={{ background: '#1d1d1d' }}
            className="p-6 rounded-xl shadow-sm border border-gray-800 cursor-pointer"
          >
            <div className="w-12 h-12 bg-blue-900/30 rounded-lg flex items-center justify-center mb-4">
              <Brain className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="font-semibold text-white mb-2">AI-Анализ</h3>
            <p className="text-gray-400 text-sm">Gemini 2.5 Flash анализирует ваш психотип и интересы</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, filter: "blur(10px)", y: 30 }}
            animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
            transition={{ duration: 1, delay: 1.0, ease: "easeOut" }}
            whileHover={{ scale: 1.05, y: -5 }}
            style={{ background: '#1d1d1d' }}
            className="p-6 rounded-xl shadow-sm border border-gray-800 cursor-pointer"
          >
            <div className="w-12 h-12 bg-purple-900/30 rounded-lg flex items-center justify-center mb-4">
              <Target className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="font-semibold text-white mb-2">Персональный Roadmap</h3>
            <p className="text-gray-400 text-sm">Junior → Middle → Senior с конкретными навыками</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, filter: "blur(10px)", y: 30 }}
            animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
            transition={{ duration: 1, delay: 1.2, ease: "easeOut" }}
            whileHover={{ scale: 1.05, y: -5 }}
            style={{ background: '#1d1d1d' }}
            className="p-6 rounded-xl shadow-sm border border-gray-800 cursor-pointer"
          >
            <div className="w-12 h-12 bg-green-900/30 rounded-lg flex items-center justify-center mb-4">
              <Rocket className="w-6 h-6 text-green-400" />
            </div>
            <h3 className="font-semibold text-white mb-2">Рынок Узбекистана</h3>
            <p className="text-gray-400 text-sm">Зарплаты, курсы и вакансии актуальные для UZ</p>
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
            Start Journey
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
          <p className="text-sm text-gray-400 mb-3">Powered by</p>
          <div className="flex flex-wrap justify-center gap-4 text-xs text-gray-300">
            <span className="bg-gray-800 px-3 py-1 rounded-full">Next.js 14</span>
            <span className="bg-gray-800 px-3 py-1 rounded-full">Gemini 2.5 Flash</span>
            <span className="bg-gray-800 px-3 py-1 rounded-full">Tailwind CSS</span>
            <span className="bg-gray-800 px-3 py-1 rounded-full">TypeScript</span>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
