import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import crypto from 'crypto'

const SSL_STORE_PASS = process.env.SSL_STORE_PASS || ''
const APP_URL = process.env.NEXTAUTH_URL || 'http://localhost:3000'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const type = searchParams.get('type') || 'success'
  const tranId = searchParams.get('tran_id') || ''

  try {
    if (type === 'success') {
      // Find the transaction by tran_id (appears in gatewayTrxId or fallback)
      let transaction = await prisma.transaction.findFirst({
        where: { gatewayTrxId: tranId },
      })

      // If not found by gatewayTrxId, find by the most recent pending transaction
      if (!transaction) {
        // Try to validate with SSLCOMMERZ API first
        const formData = new URLSearchParams()
        formData.append('store_passwd', SSL_STORE_PASS)
        formData.append('tran_id', tranId)
        formData.append('format', 'json')

        try {
          const verifyRes = await fetch('https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: formData.toString(),
          })
          const verifyData = await verifyRes.json()

          if (verifyData.status === 'VALID' || verifyData.status === 'VALIDATED') {
            // Find by sessionkey
            if (verifyData.sessionkey) {
              transaction = await prisma.transaction.findFirst({
                where: { sessionKey: verifyData.sessionkey },
              })
            }

            if (transaction) {
              const credits = transaction.creditsAdded || 0

              // Update transaction
              await prisma.transaction.update({
                where: { id: transaction.id },
                data: {
                  status: 'success',
                  gatewayTrxId: verifyData.tran_id || tranId,
                  valId: verifyData.val_id || null,
                  cardType: verifyData.card_type || null,
                  cardBrand: verifyData.card_issuer || null,
                  bankTrxId: verifyData.bank_tran_id || null,
                },
              })

              // Add credits to user
              if (credits > 0) {
                await prisma.customer.update({
                  where: { id: transaction.customerId },
                  data: { credits: { increment: credits } },
                })
              }

              return NextResponse.redirect(`${APP_URL}/payment/success?credits=${credits}`)
            }
          }
        } catch {
          // SSLCOMMERZ validation failed, try fallback
        }
      }

      if (transaction) {
        const credits = transaction.creditsAdded || 0
        await prisma.transaction.update({
          where: { id: transaction.id },
          data: { status: 'success', gatewayTrxId: transaction.gatewayTrxId || tranId },
        })
        if (credits > 0) {
          await prisma.customer.update({
            where: { id: transaction.customerId },
            data: { credits: { increment: credits } },
          })
        }
        return NextResponse.redirect(`${APP_URL}/payment/success?credits=${credits}`)
      }

      return NextResponse.redirect(`${APP_URL}/payment/success?credits=0`)
    }

    if (type === 'fail') {
      await prisma.transaction.updateMany({
        where: { gatewayTrxId: tranId, status: 'pending' },
        data: { status: 'failed' },
      })
      return NextResponse.redirect(`${APP_URL}/payment/fail`)
    }

    if (type === 'cancel') {
      await prisma.transaction.updateMany({
        where: { gatewayTrxId: tranId, status: 'pending' },
        data: { status: 'canceled' },
      })
      return NextResponse.redirect(`${APP_URL}/payment/cancel`)
    }

    return NextResponse.redirect(`${APP_URL}/payment/fail`)
  } catch (error) {
    console.error('IPN error:', error)
    return NextResponse.redirect(`${APP_URL}/payment/fail`)
  }
}
