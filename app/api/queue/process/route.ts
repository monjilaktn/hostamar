import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { renderPreviewVideo } from '@/lib/video-renderer'

// Process queue — called by cron or manually
// Processes pending queue items one at a time
export async function POST(req: NextRequest) {
  try {
    const { secret } = await req.json().catch(() => ({ secret: '' }))
    
    // Simple auth check using env secret
    const queueSecret = process.env.QUEUE_SECRET || 'hostamar-dev-secret'
    if (secret !== queueSecret) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get next pending item
    const nextJob = await prisma.videoQueue.findFirst({
      where: { status: 'queued' },
      orderBy: [
        { priority: 'desc' },
        { createdAt: 'asc' },
      ],
    })

    if (!nextJob) {
      return NextResponse.json({ message: 'No pending jobs' })
    }

    // Mark as processing
    await prisma.videoQueue.update({
      where: { id: nextJob.id },
      data: { status: 'processing', attempts: { increment: 1 } },
    })

    try {
      // Start rendering in background — don't block the response
      renderPreviewVideo({
        prompt: nextJob.topic,
        duration: 30,
        style: 'cinematic',
        mood: 'dynamic',
      }).then(async (result) => {
        if (!result) {
          throw new Error('Render returned null')
        }
        // Create video record
        const video = await prisma.video.create({
          data: {
            customerId: nextJob.customerId,
            title: nextJob.topic,
            prompt: nextJob.topic,
            status: 'completed',
            duration: 30,
            format: 'mp4',
            resolution: '1080p',
            url: result.videoUrl || null,
            thumbnailUrl: result.thumbnailUrl || null,
          },
        })
        // Update queue item
        await prisma.videoQueue.update({
          where: { id: nextJob.id },
          data: {
            status: 'completed',
            videoId: video.id,
            processedAt: new Date(),
          },
        })
        // Notify user
        await prisma.notification.create({
          data: {
            customerId: nextJob.customerId,
            type: 'video_ready',
            title: '🎬 ভিডিও তৈরি!',
            message: `"${nextJob.topic}" ভিডিও রেডি — এখন দেখুন`,
            actionUrl: '/dashboard/videos',
          },
        })
      }).catch(async (error) => {
        // Background render failed
        await prisma.videoQueue.update({
          where: { id: nextJob.id },
          data: {
            status: nextJob.attempts >= nextJob.maxAttempts ? 'failed' : 'queued',
            error: error?.message || 'Render failed',
          },
        })
      })

      return NextResponse.json({ success: true, jobId: nextJob.id, message: 'Rendering started' })
    } catch (error: any) {
      // Mark as failed
      await prisma.videoQueue.update({
        where: { id: nextJob.id },
        data: {
          status: nextJob.attempts >= nextJob.maxAttempts ? 'failed' : 'queued',
          error: error?.message || 'Render failed',
        },
      })

      return NextResponse.json({ error: 'Render failed' }, { status: 500 })
    }
  } catch (error: any) {
    console.error('Queue worker error:', error?.message || error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
