import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

// Путь к файлу с результатами
const DATA_DIR = path.join(process.cwd(), 'data')
const RESULTS_FILE = path.join(DATA_DIR, 'test-results.json')

// Инициализация файла данных
async function ensureDataFile() {
  try {
    await fs.access(DATA_DIR)
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true })
  }

  try {
    await fs.access(RESULTS_FILE)
  } catch {
    await fs.writeFile(RESULTS_FILE, JSON.stringify([]), 'utf-8')
  }
}

// Чтение результатов из файла
async function readResults() {
  await ensureDataFile()
  const data = await fs.readFile(RESULTS_FILE, 'utf-8')
  return JSON.parse(data)
}

// Запись результатов в файл
async function writeResults(results: any[]) {
  await fs.writeFile(RESULTS_FILE, JSON.stringify(results, null, 2), 'utf-8')
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      userId,
      userName,
      riasec_scores,
      riasec_percentages,
      holland_code,
      professions
    } = body

    // Читаем существующие результаты
    const results = await readResults()

    // Создать новую запись результатов
    const newResult = {
      userId: userId || 'anonymous',
      userName: userName || 'Пользователь',
      timestamp: new Date().toISOString(),
      riasec_scores,
      riasec_percentages,
      holland_code,
      professions: professions.map((p: any) => ({
        name: p.name,
        match: p.match,
        category: p.category
      }))
    }

    // Добавить новый результат в массив
    results.push(newResult)

    // Сохранить в файл
    await writeResults(results)

    return NextResponse.json(
      {
        success: true,
        message: 'Результаты сохранены успешно',
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Save results error:', error)
    return NextResponse.json(
      { success: false, error: 'server_error', message: error.message },
      { status: 500 }
    )
  }
}

// Опционально: GET endpoint для получения всех результатов (для админа)
export async function GET(request: NextRequest) {
  try {
    const results = await readResults()

    return NextResponse.json(
      {
        success: true,
        count: results.length,
        results: results
      },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('Get results error:', error)
    return NextResponse.json(
      { success: false, error: 'server_error' },
      { status: 500 }
    )
  }
}
