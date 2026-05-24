import { NextRequest, NextResponse } from 'next/server'
import { getAuthUser } from '@/lib/get-auth-user'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const authUser = await getAuthUser(req)
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status') || ''
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    const where: Record<string, any> = { customerId: authUser.id }
    if (status) where.status = status
    if (search) where.title = { contains: search, mode: 'insensitive' }

    const [videos, total] = await Promise.all([
      prisma.video.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.video.count({ where }),
    ])

    return NextResponse.json({ videos, total, page, totalPages: Math.ceil(total / limit) })
  } catch (error: any) {
    console.error('Videos fetch error:', error?.message || error)
    return NextResponse.json({ error: 'Failed to load videos' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const authUser = await getAuthUser(req)
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    if (!id) {
      return NextResponse.json({ error: 'Video ID required' }, { status: 400 })
    }

    const video = await prisma.video.findFirst({
      where: { id, customerId: authUser.id },
    })
    if (!video) {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 })
    }

    await prisma.video.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Video delete error:', error?.message || error)
    return NextResponse.json({ error: 'Failed to delete video' }, { status: 500 })
  }
}
