import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      userId,
      userName,
      riasecScores,
      riasecPercentages,
      hollandCode,
      professions
    } = body

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'userId_required' },
        { status: 400 }
      )
    }

    // Проверить, существует ли пользователь
    const user = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'user_not_found' },
        { status: 404 }
      )
    }

    // Создать новую запись результата теста
    const testResult = await prisma.testResult.create({
      data: {
        userId,
        riasecScores,
        riasecPercentages,
        hollandCode,
        professions: professions.map((p: any) => ({
          name: p.name,
          match: p.match,
          matchPercentage: p.matchPercentage,
          category: p.category
        }))
      }
    })

    return NextResponse.json(
      {
        success: true,
        message: 'Результаты сохранены успешно',
        data: {
          testResultId: testResult.id
        }
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

// GET endpoint для получения результатов пользователя
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (userId) {
      // Получить результаты конкретного пользователя
      const results = await prisma.testResult.findMany({
        where: { userId }
      })

      return NextResponse.json(
        {
          success: true,
          count: results.length,
          results
        },
        { status: 200 }
      )
    } else {
      // Получить все результаты (для админа)
      const results = await prisma.testResult.findMany({
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true,
              phone: true
            }
          }
        }
      })

      return NextResponse.json(
        {
          success: true,
          count: results.length,
          results
        },
        { status: 200 }
      )
    }
  } catch (error: any) {
    console.error('Get results error:', error)
    return NextResponse.json(
      { success: false, error: 'server_error' },
      { status: 500 }
    )
  }
}
