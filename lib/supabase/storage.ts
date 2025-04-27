import { supabase } from './client'

/**
 * Uploads a file to Supabase storage and returns the public URL
 */
async function uploadFile(
  file: File,
  bucket: string,
  path: string,
): Promise<string> {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      cacheControl: '3600',
      upsert: false,
    })

  if (error) {
    console.error('Error uploading file:', error)
    throw new Error(`Error uploading file: ${error.message}`)
  }

  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(path)

  return publicUrl
}

/**
 * Uploads multiple files to Supabase storage and returns their public URLs
 */
async function uploadFiles(
  files: File[],
  bucket: string,
  basePath: string,
): Promise<string[]> {
  const uploadPromises = files.map((file) => {
    const fileExt = file.name.split('.').pop()
    const path = `${basePath}/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`
    return uploadFile(file, bucket, path)
  })

  return Promise.all(uploadPromises)
}

/**
 * Uploads post media files (images and video) to Supabase storage
 */
export async function uploadPostMedia(
  images: File[],
  videoFile: File | null,
  userId: string,
): Promise<{
  imageUrls: string[]
  videoUrl: string | null
}> {
  const results = {
    imageUrls: [] as string[],
    videoUrl: null as string | null,
  }

  // Upload images if any
  if (images.length > 0) {
    results.imageUrls = await uploadFiles(images, 'post_media', `${userId}/images`)
  }

  // Upload video if any
  if (videoFile) {
    const fileExt = videoFile.name.split('.').pop()
    const path = `${userId}/videos/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`
    results.videoUrl = await uploadFile(videoFile, 'post_media', path)
  }

  return results
}

/**
 * Deletes a file from Supabase storage
 */
export async function deleteFile(
  bucket: string,
  path: string,
): Promise<void> {
  const { error } = await supabase.storage
    .from(bucket)
    .remove([path])

  if (error) {
    console.error('Error deleting file:', error)
    throw new Error(`Error deleting file: ${error.message}`)
  }
} 