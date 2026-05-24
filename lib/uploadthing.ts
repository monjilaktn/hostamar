// Uploadthing file upload integration
// Sign up free at https://uploadthing.com to get keys
// Free tier: 2GB storage

import { createUploadthing, type FileRouter } from 'uploadthing/next'
import { getAuthUser } from '@/lib/get-auth-user'

const f = createUploadthing()

export const ourFileRouter = {
  // Video uploads
  videoUploader: f({ video: { maxFileSize: '256MB', maxFileCount: 5 } })
    .middleware(async () => {
      const user = await getAuthUser()
      if (!user) throw new Error('Unauthorized')
      return { userId: user.id }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log('Video uploaded by', metadata.userId, file.url)
    }),

  // Image uploads (thumbnails, profile pics)
  imageUploader: f({ image: { maxFileSize: '4MB', maxFileCount: 10 } })
    .middleware(async () => {
      const user = await getAuthUser()
      if (!user) throw new Error('Unauthorized')
      return { userId: user.id }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log('Image uploaded by', metadata.userId, file.url)
    }),

  // Subtitle files
  subtitleUploader: f({ text: { maxFileSize: '1MB', maxFileCount: 1 } })
    .middleware(async () => {
      const user = await getAuthUser()
      if (!user) throw new Error('Unauthorized')
      return { userId: user.id }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log('Subtitle uploaded by', metadata.userId, file.url)
    }),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
