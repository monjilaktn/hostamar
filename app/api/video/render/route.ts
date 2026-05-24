import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/get-auth-user';
import { prisma } from '@/lib/prisma';
import { renderPreviewVideo } from '@/lib/video-renderer';

/**
 * POST /api/video/render
 *
 * Triggers video rendering for a given Preview record.
 * Body: { previewId: string }
 * Returns: { success, videoUrl, thumbnailUrl, status }
 */
export async function POST(req: NextRequest) {
  try {
    // Authenticate
    const authUser = await getAuthUser(req);
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { previewId } = await req.json().catch(() => ({}));

    if (!previewId || typeof previewId !== 'string') {
      return NextResponse.json({ error: 'previewId is required' }, { status: 400 });
    }

    // Verify preview exists and belongs to user
    const preview = await prisma.preview.findUnique({
      where: { id: previewId },
      select: { id: true, customerId: true, renderStatus: true },
    });

    if (!preview) {
      return NextResponse.json({ error: 'Preview not found' }, { status: 404 });
    }

    if (preview.customerId !== authUser.id) {
      return NextResponse.json({ error: 'Unauthorized access to this preview' }, { status: 403 });
    }

    // Don't re-trigger if already generating
    if (preview.renderStatus === 'generating') {
      return NextResponse.json({
        success: true,
        message: 'Video is already being generated',
        status: 'generating',
      });
    }

    // If already complete, return cached result
    if (preview.renderStatus === 'complete') {
      const completePreview = await prisma.preview.findUnique({
        where: { id: previewId },
        select: { videoUrl: true, thumbnailUrl: true },
      });

      return NextResponse.json({
        success: true,
        videoUrl: completePreview?.videoUrl || null,
        thumbnailUrl: completePreview?.thumbnailUrl || null,
        status: 'complete',
        message: 'Video already rendered',
      });
    }

    // Mark as generating in DB
    await prisma.preview.update({
      where: { id: previewId },
      data: { renderStatus: 'generating' },
    });

    // Fire render in background (non-blocking)
    // We use a promise that's awaited but with a long timeout
    const result = await renderPreviewVideo(previewId);

    return NextResponse.json({
      success: true,
      videoUrl: result.videoUrl,
      thumbnailUrl: result.thumbnailUrl,
      status: 'complete',
      message: 'Video rendered successfully',
    });
  } catch (error: any) {
    console.error('[Video Render API] Error:', error?.message || error);

    // If we have a previewId, try to mark as failed
    try {
      const body = await req.json().catch(() => ({}));
      if (body?.previewId) {
        await prisma.preview.update({
          where: { id: body.previewId },
          data: {
            renderStatus: 'failed',
            renderError: error?.message || 'Render failed',
          },
        });
      }
    } catch {
      // best-effort
    }

    return NextResponse.json(
      {
        success: false,
        error: error?.message || 'Video rendering failed',
        status: 'failed',
      },
      { status: 500 }
    );
  }
}
