'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useLogStore } from '@/store/useLogStore'
import { useThemeStore } from '@/store/useThemeStore'
import { useTranslation } from '@/hooks/useTranslation'
import { ArrowRight, User, Phone, School, GraduationCap } from 'lucide-react'
import { motion } from 'framer-motion'

export default function RegisterPage() {
  const router = useRouter()
  const addLog = useLogStore((state) => state.addLog)
  const theme = useThemeStore((state) => state.theme)
  const { t } = useTranslation()

  const [formData, setFormData] = useState({
    fullName: '',
    age: '',
    phone: '',
    educationalInstitution: '',
    gradeOrCourse: ''
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    // ФИО (обязательно)
    if (!formData.fullName.trim()) {
      newErrors.fullName = t('register.errors.required')
    } else if (formData.fullName.trim().length < 5) {
      newErrors.fullName = t('register.errors.fullNameInvalid')
    }

    // Возраст (обязательно)
    const age = parseInt(formData.age)
    if (!formData.age) {
      newErrors.age = t('register.errors.required')
    } else if (isNaN(age) || age < 14 || age > 100) {
      newErrors.age = t('register.errors.ageInvalid')
    }

    // Телефон (обязательно, формат +998XXXXXXXXX)
    const phoneRegex = /^\+998\d{9}$/
    const cleanPhone = formData.phone.replace(/[\s\-()]/g, '')
    if (!formData.phone.trim()) {
      newErrors.phone = t('register.errors.required')
    } else if (!phoneRegex.test(cleanPhone)) {
      newErrors.phone = t('register.errors.phoneInvalid')
    }

    // Учебное заведение (обязательно)
    if (!formData.educationalInstitution.trim()) {
      newErrors.educationalInstitution = t('register.errors.required')
    } else if (formData.educationalInstitution.trim().length < 3) {
      newErrors.educationalInstitution = t('register.errors.institutionTooShort')
    }

    // Класс/курс (обязательно)
    if (!formData.gradeOrCourse.trim()) {
      newErrors.gradeOrCourse = t('register.errors.required')
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      addLog('ERROR', 'Form validation failed')
      return
    }

    setIsSubmitting(true)
    addLog('SYSTEM', 'Submitting registration...')

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          phone: formData.phone.replace(/[\s\-()]/g, '') // Clean phone format
        }),
      })

      const data = await response.json()

      if (response.ok) {
        addLog('SYSTEM', 'Registration successful')
        addLog('DATA', `User ID: ${data.data.userId}`)

        // Сохранить данные пользователя в sessionStorage для связки с результатами
        sessionStorage.setItem('userData', JSON.stringify({
          userId: data.data.userId,
          fullName: formData.fullName
        }))

        // Перейти к тесту
        setTimeout(() => {
          router.push('/test')
        }, 500)
      } else {
        addLog('ERROR', `Registration failed: ${data.error}`)
        if (data.error === 'duplicate_phone') {
          setErrors({ phone: t('register.errors.duplicate_phone') })
        } else {
          setErrors({ general: t('register.errors.server_error') })
        }
      }
    } catch (error: any) {
      addLog('ERROR', `Network error: ${error.message}`)
      setErrors({ general: t('register.errors.server_error') })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value })
    // Очистить ошибку при изменении поля
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' })
    }
  }

  return (
    <div className="min-h-screen py-12 px-4 register-background">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className={`text-4xl font-bold mb-2 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            {t('register.title')}
          </h1>
          <p className={`text-lg ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
          }`}>
            {t('register.subtitle')}
          </p>
        </motion.div>

        {/* Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          onSubmit={handleSubmit}
          className="rounded-2xl shadow-lg p-8"
          style={{ background: theme === 'dark' ? '#1d1d1d' : '#FFF1E6' }}
        >
          {/* Общая ошибка */}
          {errors.general && (
            <div className="mb-6 p-4 rounded-lg bg-red-100 text-red-700 text-sm">
              {errors.general}
            </div>
          )}

          <div className="space-y-6">
            {/* ФИО */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
              }`}>
                {t('register.fullName')} <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`} />
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => handleChange('fullName', e.target.value)}
                  placeholder={t('register.fullNamePlaceholder')}
                  className={`w-full pl-12 pr-4 py-3 rounded-lg border ${
                    errors.fullName
                      ? 'border-red-500'
                      : theme === 'dark' ? 'border-gray-700' : 'border-gray-300'
                  } ${
                    theme === 'dark'
                      ? 'bg-gray-800 text-white placeholder-gray-500'
                      : 'bg-white text-gray-900 placeholder-gray-400'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
              </div>
              {errors.fullName && (
                <p className="mt-1 text-sm text-red-500">{errors.fullName}</p>
              )}
            </div>

            {/* Возраст и Телефон в одной строке */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Возраст */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
                }`}>
                  {t('register.age')} <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="14"
                  max="100"
                  value={formData.age}
                  onChange={(e) => handleChange('age', e.target.value)}
                  placeholder={t('register.agePlaceholder')}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    errors.age
                      ? 'border-red-500'
                      : theme === 'dark' ? 'border-gray-700' : 'border-gray-300'
                  } ${
                    theme === 'dark'
                      ? 'bg-gray-800 text-white placeholder-gray-500'
                      : 'bg-white text-gray-900 placeholder-gray-400'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                {errors.age && (
                  <p className="mt-1 text-sm text-red-500">{errors.age}</p>
                )}
              </div>

              {/* Телефон */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
                }`}>
                  {t('register.phone')} <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`} />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    placeholder={t('register.phonePlaceholder')}
                    className={`w-full pl-12 pr-4 py-3 rounded-lg border ${
                      errors.phone
                        ? 'border-red-500'
                        : theme === 'dark' ? 'border-gray-700' : 'border-gray-300'
                    } ${
                      theme === 'dark'
                        ? 'bg-gray-800 text-white placeholder-gray-500'
                        : 'bg-white text-gray-900 placeholder-gray-400'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                </div>
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
                )}
                <p className={`mt-1 text-xs ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {t('register.phoneHint')}
                </p>
              </div>
            </div>

            {/* Учебное заведение */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
              }`}>
                {t('register.educationalInstitution')} <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <School className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`} />
                <input
                  type="text"
                  value={formData.educationalInstitution}
                  onChange={(e) => handleChange('educationalInstitution', e.target.value)}
                  placeholder={t('register.educationalInstitutionPlaceholder')}
                  className={`w-full pl-12 pr-4 py-3 rounded-lg border ${
                    errors.educationalInstitution
                      ? 'border-red-500'
                      : theme === 'dark' ? 'border-gray-700' : 'border-gray-300'
                  } ${
                    theme === 'dark'
                      ? 'bg-gray-800 text-white placeholder-gray-500'
                      : 'bg-white text-gray-900 placeholder-gray-400'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
              </div>
              {errors.educationalInstitution && (
                <p className="mt-1 text-sm text-red-500">{errors.educationalInstitution}</p>
              )}
            </div>

            {/* Класс или курс */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
              }`}>
                {t('register.gradeOrCourse')} <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <GraduationCap className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`} />
                <input
                  type="text"
                  value={formData.gradeOrCourse}
                  onChange={(e) => handleChange('gradeOrCourse', e.target.value)}
                  placeholder={t('register.gradeOrCoursePlaceholder')}
                  className={`w-full pl-12 pr-4 py-3 rounded-lg border ${
                    errors.gradeOrCourse
                      ? 'border-red-500'
                      : theme === 'dark' ? 'border-gray-700' : 'border-gray-300'
                  } ${
                    theme === 'dark'
                      ? 'bg-gray-800 text-white placeholder-gray-500'
                      : 'bg-white text-gray-900 placeholder-gray-400'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
              </div>
              {errors.gradeOrCourse && (
                <p className="mt-1 text-sm text-red-500">{errors.gradeOrCourse}</p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={isSubmitting}
            whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
            whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
            className={`w-full mt-8 py-4 rounded-xl font-semibold text-white flex items-center justify-center gap-2 ${
              isSubmitting
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-[#8eb69b] to-[#5a8f6d] hover:shadow-lg'
            }`}
          >
            {isSubmitting ? t('register.submitting') : t('register.submit')}
            {!isSubmitting && <ArrowRight className="w-5 h-5" />}
          </motion.button>
        </motion.form>
      </div>
    </div>
  )
}
