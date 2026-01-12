import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'

// Путь к файлу с данными
const DATA_DIR = path.join(process.cwd(), 'data')
const USERS_FILE = path.join(DATA_DIR, 'users.json')

// Валидация телефона (Узбекистан: +998XXXXXXXXX)
const validatePhone = (phone: string): string | null => {
  const normalized = phone.replace(/[^\d+]/g, '')
  if (!/^\+998\d{9}$/.test(normalized)) {
    return 'phoneInvalid'
  }
  return null
}

// Валидация имени/фамилии (Кириллица + латиница)
const validateName = (name: string): string | null => {
  if (!/^[A-Za-zА-Яа-яЁёЎўҚқҒғҲҳ\s'-]{2,50}$/.test(name)) {
    return 'nameInvalid'
  }
  return null
}

// Валидация возраста
const validateAge = (age: number): string | null => {
  if (age < 14 || age > 100) {
    return 'ageInvalid'
  }
  return null
}

// Инициализация файла данных
async function ensureDataFile() {
  try {
    await fs.access(DATA_DIR)
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true })
  }

  try {
    await fs.access(USERS_FILE)
  } catch {
    await fs.writeFile(USERS_FILE, JSON.stringify([]), 'utf-8')
  }
}

// Чтение данных из файла
async function readUsers() {
  await ensureDataFile()
  const data = await fs.readFile(USERS_FILE, 'utf-8')
  return JSON.parse(data)
}

// Запись данных в файл
async function writeUsers(users: any[]) {
  await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2), 'utf-8')
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { fullName, age, phone, educationalInstitution, gradeOrCourse } = body

    // Валидация ФИО
    if (!fullName || fullName.trim().length < 5) {
      return NextResponse.json(
        { success: false, error: 'fullNameInvalid', field: 'fullName' },
        { status: 400 }
      )
    }

    const ageError = validateAge(parseInt(age))
    if (ageError) {
      return NextResponse.json(
        { success: false, error: ageError, field: 'age' },
        { status: 400 }
      )
    }

    const phoneError = validatePhone(phone)
    if (phoneError) {
      return NextResponse.json(
        { success: false, error: phoneError, field: 'phone' },
        { status: 400 }
      )
    }

    if (!educationalInstitution || educationalInstitution.length < 3) {
      return NextResponse.json(
        { success: false, error: 'institutionTooShort', field: 'educationalInstitution' },
        { status: 400 }
      )
    }

    if (!gradeOrCourse || gradeOrCourse.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'required', field: 'gradeOrCourse' },
        { status: 400 }
      )
    }

    // Читаем существующих пользователей
    const users = await readUsers()

    // Проверка на дубликат телефона
    const duplicatePhone = users.find((u: any) => u.phone === phone.replace(/[^\d+]/g, ''))
    if (duplicatePhone) {
      return NextResponse.json(
        { success: false, error: 'duplicate_phone' },
        { status: 409 }
      )
    }

    // Создать нового пользователя
    const userId = uuidv4()
    const newUser = {
      id: userId,
      timestamp: new Date().toISOString(),
      fullName: fullName.trim(),
      age: parseInt(age),
      phone: phone.replace(/[^\d+]/g, ''),
      educationalInstitution: educationalInstitution.trim(),
      gradeOrCourse: gradeOrCourse.trim(),
    }

    // Добавить нового пользователя в массив
    users.push(newUser)

    // Сохранить в файл
    await writeUsers(users)

    return NextResponse.json(
      {
        success: true,
        data: {
          userId: newUser.id,
          fullName: newUser.fullName,
        },
        message: 'Регистрация успешна!',
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { success: false, error: 'server_error', message: error.message },
      { status: 500 }
    )
  }
}

// Опционально: GET endpoint для получения всех пользователей (для админа)
export async function GET(request: NextRequest) {
  try {
    const users = await readUsers()

    return NextResponse.json(
      {
        success: true,
        count: users.length,
        users: users
      },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('Get users error:', error)
    return NextResponse.json(
      { success: false, error: 'server_error' },
      { status: 500 }
    )
  }
}
