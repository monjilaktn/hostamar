import { NextRequest, NextResponse } from 'next/server'
import { getAuthUser } from '@/lib/get-auth-user'
import { prisma } from '@/lib/prisma'

// Generate referral code
function generateCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = ''
  for (let i = 0; i < 8; i++) {
    code += chars[Math.floor(Math.random() * chars.length)]
  }
  return code
}

// GET: Get user's referral info
export async function GET(req: NextRequest) {
  try {
    const authUser = await getAuthUser(req)
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    let customer = await prisma.customer.findUnique({
      where: { id: authUser.id },
      select: { referralCode: true, referralBonus: true },
    })

    // Generate code if missing
    if (!customer?.referralCode) {
      const code = generateCode()
      await prisma.customer.update({
        where: { id: authUser.id },
        data: { referralCode: code },
      })
      customer = { referralCode: code, referralBonus: 0 }
    }

    // Count successful referrals
    const referralCount = await prisma.referral.count({
      where: { referrerId: authUser.id, status: 'COMPLETED' },
    })

    const referralUrl = `${process.env.NEXTAUTH_URL || 'https://hostamar.com'}/signup?ref=${customer.referralCode}`

    return NextResponse.json({
      referralCode: customer.referralCode,
      referralBonus: customer.referralBonus || 0,
      referralCount,
      referralUrl,
    })
  } catch (error: any) {
    console.error('Referral error:', error?.message || error)
    return NextResponse.json({ error: 'Failed to load referral info' }, { status: 500 })
  }
}

// POST: Apply referral code during signup
export async function POST(req: NextRequest) {
  try {
    const { referralCode, newUserId } = await req.json()

    if (!referralCode || !newUserId) {
      return NextResponse.json({ error: 'referralCode and newUserId required' }, { status: 400 })
    }

    // Find referrer
    const referrer = await prisma.customer.findUnique({
      where: { referralCode },
    })

    if (!referrer) {
      return NextResponse.json({ error: 'Invalid referral code' }, { status: 404 })
    }

    if (referrer.id === newUserId) {
      return NextResponse.json({ error: 'Cannot refer yourself' }, { status: 400 })
    }

    // Check not already referred
    const existing = await prisma.referral.findFirst({
      where: { referredId: newUserId },
    })

    if (existing) {
      return NextResponse.json({ error: 'Already referred' }, { status: 409 })
    }

    // Create referral
    await prisma.referral.create({
      data: {
        referrerId: referrer.id,
        referredId: newUserId,
        status: 'PENDING',
        bonusAmount: 5,
      },
    })

    // Give bonus credits to new user immediately
    await prisma.customer.update({
      where: { id: newUserId },
      data: { credits: { increment: 5 } },
    })

    return NextResponse.json({ success: true, bonusCredits: 5, message: 'You got 5 free credits!' })
  } catch (error: any) {
    console.error('Referral apply error:', error?.message || error)
    return NextResponse.json({ error: 'Failed to apply referral' }, { status: 500 })
  }
}
