import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

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
  if (!/^[A-Za-zА-Яа-яЁё\s-]{2,50}$/.test(name)) {
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { firstName, lastName, age, phone, educationalInstitution } = body

    // Валидация
    const firstNameError = validateName(firstName)
    if (firstNameError) {
      return NextResponse.json(
        { success: false, error: firstNameError, field: 'firstName' },
        { status: 400 }
      )
    }

    const lastNameError = validateName(lastName)
    if (lastNameError) {
      return NextResponse.json(
        { success: false, error: lastNameError, field: 'lastName' },
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

    // Создать пользователя
    const user = await prisma.user.create({
      data: {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        age: parseInt(age),
        phone: phone.replace(/[^\d+]/g, ''),
        educationalInstitution: educationalInstitution.trim(),
      },
    })

    return NextResponse.json(
      {
        success: true,
        data: {
          userId: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
        },
        message: 'Регистрация успешна!',
      },
      { status: 201 }
    )
  } catch (error: any) {
    // Дубликат телефона
    if (error.code === 'P2002' && error.meta?.target?.includes('phone')) {
      return NextResponse.json(
        { success: false, error: 'duplicate_phone' },
        { status: 409 }
      )
    }

    console.error('Registration error:', error)
    return NextResponse.json(
      { success: false, error: 'server_error' },
      { status: 500 }
    )
  }
}
