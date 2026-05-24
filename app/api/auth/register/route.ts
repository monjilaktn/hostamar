import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}))
    const { name, email, password, referralCode } = body

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'সকল ফিল্ড পূরণ করুন' }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে' }, { status: 400 })
    }

    // Check existing user
    const existing = await prisma.customer.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json({ error: 'এই ইমেইল ইতিমধ্যে ব্যবহৃত হয়েছে' }, { status: 409 })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create customer
    const customer = await prisma.customer.create({
      data: {
        name,
        email,
        password: hashedPassword,
        credits: referralCode ? 8 : 3, // Bonus credits if referred
      }
    })

    // Apply referral if provided
    let referralApplied = false
    if (referralCode) {
      try {
        const referrer = await prisma.customer.findUnique({
          where: { referralCode },
        })
        if (referrer && referrer.id !== customer.id) {
          // Check no existing referral
          const existingRef = await prisma.referral.findFirst({
            where: { referredId: customer.id },
          })
          if (!existingRef) {
            await prisma.referral.create({
              data: {
                referrerId: referrer.id,
                referredId: customer.id,
                status: 'COMPLETED',
                bonusAmount: 5,
              },
            })
            // Give referrer 5 bonus credits
            await prisma.customer.update({
              where: { id: referrer.id },
              data: { 
                credits: { increment: 5 },
                referralBonus: { increment: 5 },
              },
            })
            referralApplied = true
          }
        }
      } catch (err) {
        console.error('Referral apply error:', err)
      }
    }

    return NextResponse.json({
      success: true,
      message: 'অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে!',
      userId: customer.id,
      referralApplied,
      bonusCredits: referralApplied ? 8 : 3,
    })
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json({ error: 'রেজিস্ট্রেশনে সমস্যা হয়েছে' }, { status: 500 })
  }
}