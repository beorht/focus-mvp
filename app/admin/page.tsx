'use client'

import { useState, useEffect } from 'react'
import { useThemeStore } from '@/store/useThemeStore'
import { Download, RefreshCw, Users, FileText } from 'lucide-react'

interface User {
  id: string
  timestamp: string
  fullName: string
  age: number
  phone: string
  educationalInstitution: string
  gradeOrCourse: string
}

interface TestResult {
  userId: string
  userName: string
  timestamp: string
  riasec_scores: any
  riasec_percentages: any
  holland_code: string
  professions: any[]
}

export default function AdminPage() {
  const theme = useThemeStore((state) => state.theme)
  const [users, setUsers] = useState<User[]>([])
  const [results, setResults] = useState<TestResult[]>([])
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    setLoading(true)
    try {
      // Fetch users
      const usersRes = await fetch('/api/register')
      const usersData = await usersRes.json()
      if (usersData.success) {
        setUsers(usersData.users)
      }

      // Fetch results
      const resultsRes = await fetch('/api/save-results')
      const resultsData = await resultsRes.json()
      if (resultsData.success) {
        setResults(resultsData.results)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const downloadJSON = (data: any, filename: string) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const downloadCSV = (data: any[], filename: string) => {
    if (data.length === 0) return

    // Get headers
    const headers = Object.keys(data[0])

    // Create CSV content
    const csvContent = [
      headers.join(','),
      ...data.map(row =>
        headers.map(header => {
          const value = row[header]
          // Handle nested objects
          if (typeof value === 'object' && value !== null) {
            return `"${JSON.stringify(value).replace(/"/g, '""')}"`
          }
          // Escape commas and quotes
          return `"${String(value).replace(/"/g, '""')}"`
        }).join(',')
      )
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center main-background">
        <div className={`text-xl ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          Загрузка данных...
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12 px-4 main-background">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className={`text-4xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Панель администратора
          </h1>
          <p className={`text-lg ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
            Просмотр и экспорт данных регистрации и результатов тестов
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className={`p-6 rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-500 rounded-lg">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div>
                <div className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {users.length}
                </div>
                <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Зарегистрированных пользователей
                </div>
              </div>
            </div>
          </div>

          <div className={`p-6 rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-500 rounded-lg">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <div>
                <div className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {results.length}
                </div>
                <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Результатов тестов
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Users Section */}
        <div className={`mb-8 p-6 rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
          <div className="flex justify-between items-center mb-4">
            <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              👥 Пользователи ({users.length})
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() => fetchData()}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                <RefreshCw className="w-4 h-4" />
                Обновить
              </button>
              <button
                onClick={() => downloadJSON(users, 'users.json')}
                className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
              >
                <Download className="w-4 h-4" />
                JSON
              </button>
              <button
                onClick={() => downloadCSV(users, 'users.csv')}
                className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
              >
                <Download className="w-4 h-4" />
                CSV
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={`border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                  <th className={`text-left p-3 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>ФИО</th>
                  <th className={`text-left p-3 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Возраст</th>
                  <th className={`text-left p-3 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Телефон</th>
                  <th className={`text-left p-3 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Учебное заведение</th>
                  <th className={`text-left p-3 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Класс/Курс</th>
                  <th className={`text-left p-3 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Дата</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className={`border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                    <td className={`p-3 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>{user.fullName}</td>
                    <td className={`p-3 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>{user.age}</td>
                    <td className={`p-3 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>{user.phone}</td>
                    <td className={`p-3 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>{user.educationalInstitution}</td>
                    <td className={`p-3 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>{user.gradeOrCourse}</td>
                    <td className={`p-3 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
                      {new Date(user.timestamp).toLocaleString('ru-RU')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Results Section */}
        <div className={`p-6 rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
          <div className="flex justify-between items-center mb-4">
            <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              📊 Результаты тестов ({results.length})
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() => downloadJSON(results, 'test-results.json')}
                className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
              >
                <Download className="w-4 h-4" />
                JSON
              </button>
              <button
                onClick={() => downloadCSV(results, 'test-results.csv')}
                className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
              >
                <Download className="w-4 h-4" />
                CSV
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={`border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                  <th className={`text-left p-3 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Пользователь</th>
                  <th className={`text-left p-3 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Holland Code</th>
                  <th className={`text-left p-3 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Топ профессия</th>
                  <th className={`text-left p-3 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Match %</th>
                  <th className={`text-left p-3 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Дата</th>
                </tr>
              </thead>
              <tbody>
                {results.map((result, idx) => (
                  <tr key={idx} className={`border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                    <td className={`p-3 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>{result.userName}</td>
                    <td className={`p-3 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>{result.holland_code}</td>
                    <td className={`p-3 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                      {result.professions[0]?.name || 'N/A'}
                    </td>
                    <td className={`p-3 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                      {result.professions[0]?.match || 'N/A'}%
                    </td>
                    <td className={`p-3 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
                      {new Date(result.timestamp).toLocaleString('ru-RU')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
