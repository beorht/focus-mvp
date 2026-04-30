import { NextRequest, NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

// Валидация телефона (Узбекистан: +998XXXXXXXXX)
const validatePhone = (phone: string): string | null => {
  const normalized = phone.replace(/[^\d+]/g, '')
  if (!/^\+998\d{9}$/.test(normalized)) {
    return 'phoneInvalid'
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

    // Нормализация номера телефона
    const normalizedPhone = phone.replace(/[^\d+]/g, '')

    // Проверка на дубликат телефона
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE phone = $1',
      [normalizedPhone]
    )

    if (existingUser.rows.length > 0) {
      return NextResponse.json(
        { success: false, error: 'duplicate_phone' },
        { status: 409 }
      )
    }

    // Разделить полное имя на имя и фамилию
    const nameParts = fullName.trim().split(/\s+/)
    const firstName = nameParts[0]
    const lastName = nameParts.slice(1).join(' ') || nameParts[0]

    // Создать нового пользователя в БД
    const userId = uuidv4()
    await pool.query(
      'INSERT INTO users (id, "firstName", "lastName", age, phone, "educationalInstitution", "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())',
      [userId, firstName, lastName, parseInt(age), normalizedPhone, educationalInstitution.trim()]
    )

    return NextResponse.json(
      {
        success: true,
        data: {
          userId,
          fullName: `${firstName} ${lastName}`,
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

// GET endpoint для получения всех пользователей (для админа)
export async function GET(request: NextRequest) {
  try {
    const result = await pool.query('SELECT id, "firstName", "lastName", age, phone, "educationalInstitution", "createdAt", "updatedAt" FROM users')

    return NextResponse.json(
      {
        success: true,
        count: result.rows.length,
        users: result.rows
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
