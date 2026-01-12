'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { useLogStore } from '@/store/useLogStore'
import { useThemeStore } from '@/store/useThemeStore'
import { useUserStore } from '@/store/useUserStore'
import { useTranslation } from '@/hooks/useTranslation'
import { motion } from 'framer-motion'
import { User, Phone, School, ArrowRight, Calendar } from 'lucide-react'

export default function RegisterPage() {
  const router = useRouter()
  const addLog = useLogStore((state) => state.addLog)
  const theme = useThemeStore((state) => state.theme)
  const { t } = useTranslation()

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    age: '',
    phone: '',
    educationalInstitution: '',
  })

  const [errors, setErrors] = useState<Record<string, string | null>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Валидация поля
  const validateField = (field: string, value: string | number): string | null => {
    switch (field) {
      case 'firstName':
      case 'lastName':
        if (!/^[A-Za-zА-Яа-яЁё\s-]{2,50}$/.test(value as string)) {
          return 'nameInvalid'
        }
        break
      case 'age':
        const ageNum = Number(value)
        if (isNaN(ageNum) || ageNum < 14 || ageNum > 100) {
          return 'ageInvalid'
        }
        break
      case 'phone':
        const normalized = (value as string).replace(/[^\d+]/g, '')
        if (!/^\+998\d{9}$/.test(normalized)) {
          return 'phoneInvalid'
        }
        break
      case 'educationalInstitution':
        if ((value as string).length < 3) {
          return 'institutionTooShort'
        }
        break
    }
    return null
  }

  // Обработчик изменения
  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value })
    if (errors[field]) {
      setErrors({ ...errors, [field]: null })
    }
  }

  // Обработчик blur
  const handleBlur = (field: string, value: string) => {
    const error = validateField(field, value)
    setErrors({ ...errors, [field]: error })
  }

  // Форматирование телефона
  const formatPhone = (value: string): string => {
    let cleaned = value.replace(/[^\d+]/g, '')
    if (!cleaned.startsWith('+998')) {
      cleaned = '+998' + cleaned.replace(/^\+?998?/, '')
    }
    return cleaned
  }

  // Отправка формы
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    // Финальная валидация
    const newErrors: Record<string, string | null> = {}
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key as keyof typeof formData])
      if (error) newErrors[key] = error
    })

    if (Object.values(newErrors).some((e) => e !== null)) {
      setErrors(newErrors)
      return
    }

    setIsSubmitting(true)
    addLog('USER_ACTION', 'Submitting registration form')

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          age: parseInt(formData.age),
          phone: formatPhone(formData.phone),
        }),
      })

      const data = await response.json()

      if (data.success) {
        useUserStore.getState().setUserData(
          data.data.userId,
          data.data.firstName,
          data.data.lastName
        )

        addLog('SYSTEM', 'Registration successful, navigating to test...')
        setTimeout(() => router.push('/test'), 500)
      } else {
        setErrors({ ...errors, form: data.error })
        addLog('ERROR', `Registration failed: ${data.error}`)
      }
    } catch (error) {
      console.error('Registration error:', error)
      setErrors({ ...errors, form: 'server_error' })
      addLog('ERROR', 'Server error during registration')
    } finally {
      setIsSubmitting(false)
    }
  }

  const isFormValid =
    formData.firstName &&
    formData.lastName &&
    formData.age &&
    formData.phone &&
    formData.educationalInstitution &&
    Object.values(errors).every((e) => e === null)

  return (
    <div className="min-h-screen main-background flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="w-full max-w-md"
      >
        <div
          className={`rounded-2xl shadow-lg p-8 ${
            theme === 'dark' ? 'bg-[#191919] border border-gray-800' : 'bg-white border border-gray-200'
          }`}
        >
          <div className="text-center mb-8">
            <h1 className={`text-3xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {t('register.title')}
            </h1>
            <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
              {t('register.subtitle')}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Имя */}
            <div>
              <label className={`block mb-2 text-sm font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                {t('register.firstName')}
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => handleChange('firstName', e.target.value)}
                  onBlur={(e) => handleBlur('firstName', e.target.value)}
                  placeholder={t('register.firstNamePlaceholder')}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border-2 transition-all ${
                    errors.firstName
                      ? 'border-red-500 focus:border-red-600'
                      : theme === 'dark'
                      ? 'bg-gray-800 border-gray-700 text-white focus:border-blue-500'
                      : 'bg-white border-[#8eb69b] text-gray-900 focus:border-[#6a9d7d]'
                  } focus:outline-none focus:ring-2 focus:ring-[#8eb69b]/20`}
                />
              </div>
              {errors.firstName && (
                <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-red-500 text-sm mt-1">
                  {t(`register.errors.${errors.firstName}`)}
                </motion.p>
              )}
            </div>

            {/* Фамилия */}
            <div>
              <label className={`block mb-2 text-sm font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                {t('register.lastName')}
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => handleChange('lastName', e.target.value)}
                  onBlur={(e) => handleBlur('lastName', e.target.value)}
                  placeholder={t('register.lastNamePlaceholder')}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border-2 transition-all ${
                    errors.lastName
                      ? 'border-red-500 focus:border-red-600'
                      : theme === 'dark'
                      ? 'bg-gray-800 border-gray-700 text-white focus:border-blue-500'
                      : 'bg-white border-[#8eb69b] text-gray-900 focus:border-[#6a9d7d]'
                  } focus:outline-none focus:ring-2 focus:ring-[#8eb69b]/20`}
                />
              </div>
              {errors.lastName && (
                <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-red-500 text-sm mt-1">
                  {t(`register.errors.${errors.lastName}`)}
                </motion.p>
              )}
            </div>

            {/* Возраст */}
            <div>
              <label className={`block mb-2 text-sm font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                {t('register.age')}
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="number"
                  value={formData.age}
                  onChange={(e) => handleChange('age', e.target.value)}
                  onBlur={(e) => handleBlur('age', e.target.value)}
                  placeholder={t('register.agePlaceholder')}
                  min="14"
                  max="100"
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border-2 transition-all ${
                    errors.age
                      ? 'border-red-500 focus:border-red-600'
                      : theme === 'dark'
                      ? 'bg-gray-800 border-gray-700 text-white focus:border-blue-500'
                      : 'bg-white border-[#8eb69b] text-gray-900 focus:border-[#6a9d7d]'
                  } focus:outline-none focus:ring-2 focus:ring-[#8eb69b]/20`}
                />
              </div>
              {errors.age && (
                <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-red-500 text-sm mt-1">
                  {t(`register.errors.${errors.age}`)}
                </motion.p>
              )}
            </div>

            {/* Телефон */}
            <div>
              <label className={`block mb-2 text-sm font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                {t('register.phone')}
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  onBlur={(e) => handleBlur('phone', e.target.value)}
                  placeholder={t('register.phonePlaceholder')}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border-2 transition-all ${
                    errors.phone
                      ? 'border-red-500 focus:border-red-600'
                      : theme === 'dark'
                      ? 'bg-gray-800 border-gray-700 text-white focus:border-blue-500'
                      : 'bg-white border-[#8eb69b] text-gray-900 focus:border-[#6a9d7d]'
                  } focus:outline-none focus:ring-2 focus:ring-[#8eb69b]/20`}
                />
              </div>
              <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-600'}`}>
                {t('register.phoneHint')}
              </p>
              {errors.phone && (
                <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-red-500 text-sm mt-1">
                  {t(`register.errors.${errors.phone}`)}
                </motion.p>
              )}
            </div>

            {/* Учебное заведение */}
            <div>
              <label className={`block mb-2 text-sm font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                {t('register.educationalInstitution')}
              </label>
              <div className="relative">
                <School className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={formData.educationalInstitution}
                  onChange={(e) => handleChange('educationalInstitution', e.target.value)}
                  onBlur={(e) => handleBlur('educationalInstitution', e.target.value)}
                  placeholder={t('register.educationalInstitutionPlaceholder')}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border-2 transition-all ${
                    errors.educationalInstitution
                      ? 'border-red-500 focus:border-red-600'
                      : theme === 'dark'
                      ? 'bg-gray-800 border-gray-700 text-white focus:border-blue-500'
                      : 'bg-white border-[#8eb69b] text-gray-900 focus:border-[#6a9d7d]'
                  } focus:outline-none focus:ring-2 focus:ring-[#8eb69b]/20`}
                />
              </div>
              {errors.educationalInstitution && (
                <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-red-500 text-sm mt-1">
                  {t(`register.errors.${errors.educationalInstitution}`)}
                </motion.p>
              )}
            </div>

            {/* Общая ошибка */}
            {errors.form && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-3 rounded-lg bg-red-50 border border-red-200"
              >
                <p className="text-red-600 text-sm">{t(`register.errors.${errors.form}`)}</p>
              </motion.div>
            )}

            {/* Кнопка отправки */}
            <motion.button
              type="submit"
              disabled={!isFormValid || isSubmitting}
              whileHover={isFormValid && !isSubmitting ? { scale: 1.02 } : {}}
              whileTap={isFormValid && !isSubmitting ? { scale: 0.98 } : {}}
              className={`w-full flex items-center justify-center gap-2 px-8 py-4 rounded-full font-semibold transition-all ${
                !isFormValid || isSubmitting
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-[#8eb69b] to-[#5a8f6d] text-white hover:shadow-lg'
              }`}
            >
              {isSubmitting ? t('register.submitting') : t('register.submit')}
              {!isSubmitting && <ArrowRight className="w-5 h-5" />}
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  )
}
