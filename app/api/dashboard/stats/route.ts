import { NextRequest, NextResponse } from 'next/server'
import { getAuthUser } from '@/lib/get-auth-user'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const authUser = await getAuthUser(req)
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const [totalVideos, totalPreviews, customer] = await Promise.all([
      prisma.video.count({ where: { customerId: authUser.id } }),
      prisma.preview.count({ where: { customerId: authUser.id } }),
      prisma.customer.findUnique({
        where: { id: authUser.id },
        select: { credits: true, balance: true },
      }),
    ])

    return NextResponse.json({
      totalVideos,
      totalPreviews,
      creditsRemaining: customer?.credits || 0,
      balance: customer?.balance || 0,
    })
  } catch (error: any) {
    console.error('Stats error:', error?.message || error)
    return NextResponse.json({ error: 'Failed to load stats' }, { status: 500 })
  }
}
