import { NextRequest, NextResponse } from 'next/server'
import { getAuthUser } from '@/lib/get-auth-user'
import { prisma } from '@/lib/prisma'

// Admin endpoint to verify bKash payments manually
export async function POST(req: NextRequest) {
  try {
    const authUser = await getAuthUser(req)
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Simple admin check: user must have credits management access
    // Any logged-in user can verify (for now — in production, add admin role check)
    const { transactionId, action } = await req.json()

    if (!transactionId || !action) {
      return NextResponse.json({ error: 'transactionId and action required' }, { status: 400 })
    }

    const transaction = await prisma.transaction.findUnique({
      where: { id: transactionId },
    })

    if (!transaction) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 })
    }

    if (action === 'approve') {
      if (transaction.status !== 'pending_verification') {
        return NextResponse.json({ error: 'Transaction is not pending' }, { status: 400 })
      }

      // Update transaction
      await prisma.transaction.update({
        where: { id: transactionId },
        data: { status: 'success' },
      })

      // Add credits
      if (transaction.creditsAdded > 0) {
        await prisma.customer.update({
          where: { id: transaction.customerId },
          data: { credits: { increment: transaction.creditsAdded } },
        })
      }

      // Notify user
      await prisma.notification.create({
        data: {
          customerId: transaction.customerId,
          type: 'payment_verified',
          title: 'পেমেন্ট নিশ্চিত!',
          message: `${transaction.creditsAdded} ক্রেডিট আপনার অ্যাকাউন্টে যোগ হয়েছে।`,
          actionUrl: '/dashboard',
        },
      })

      return NextResponse.json({ success: true, message: 'Payment verified, credits added' })
    }

    if (action === 'reject') {
      await prisma.transaction.update({
        where: { id: transactionId },
        data: { status: 'failed' },
      })

      await prisma.notification.create({
        data: {
          customerId: transaction.customerId,
          type: 'payment_rejected',
          title: 'পেমেন্ট প্রত্যাখ্যান',
          message: `TrxID: ${transaction.gatewayTrxId} — যাচাই করা যায়নি। পুনরায় চেষ্টা করুন।`,
          actionUrl: '/payment',
        },
      })

      return NextResponse.json({ success: true, message: 'Payment rejected' })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error: any) {
    console.error('Payment verify error:', error?.message || error)
    return NextResponse.json({ error: 'Failed to process' }, { status: 500 })
  }
}

// GET: List pending payments for admin
export async function GET(req: NextRequest) {
  try {
    const authUser = await getAuthUser(req)
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const pending = await prisma.transaction.findMany({
      where: { status: 'pending_verification' },
      orderBy: { createdAt: 'desc' },
      include: {
        customer: { select: { id: true, name: true, email: true, phone: true } },
      },
    })

    return NextResponse.json({ transactions: pending })
  } catch (error: any) {
    console.error('Pending payments error:', error?.message || error)
    return NextResponse.json({ error: 'Failed to load' }, { status: 500 })
  }
}
