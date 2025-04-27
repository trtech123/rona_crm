"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PostFormData } from "@/types/post"
import { Image as ImageIcon, Upload, X, Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { uploadPostMedia } from "@/lib/supabase/storage"
import { useUser } from "@/hooks/use-user"

interface MediaCreationSectionProps {
  formData: PostFormData
  onUpdate: (updates: Partial<PostFormData>) => void
}

export function MediaCreationSection({ formData, onUpdate }: MediaCreationSectionProps) {
  const [isUploading, setIsUploading] = useState(false)
  const { toast } = useToast()
  const { user } = useUser()

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0 || !user) return

    setIsUploading(true)
    try {
      const newImages = Array.from(files)
      
      // Upload images to Supabase storage
      const { imageUrls } = await uploadPostMedia(newImages, null, user.id)
      
      onUpdate({ 
        mediaType: "image",
        images: [...(formData.images || []), ...imageUrls],
        videoFile: null,
        videoLink: "",
      })

      toast({
        title: "Success",
        description: "Images uploaded successfully",
      })
    } catch (error) {
      console.error("Error uploading images:", error)
      toast({
        title: "Error",
        description: "Failed to upload images. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemoveImage = (index: number) => {
    const newImages = [...(formData.images || [])]
    newImages.splice(index, 1)
    onUpdate({ 
      mediaType: newImages.length > 0 ? "image" : "none",
      images: newImages,
    })
  }

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !user) return

    setIsUploading(true)
    try {
      // Upload video to Supabase storage
      const { videoUrl } = await uploadPostMedia([], file, user.id)
      
      onUpdate({ 
        mediaType: "video",
        videoFile: videoUrl,
        images: [],
        videoLink: "",
      })

      toast({
        title: "Success",
        description: "Video uploaded successfully",
      })
    } catch (error) {
      console.error("Error uploading video:", error)
      toast({
        title: "Error",
        description: "Failed to upload video. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const handleVideoLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const link = e.target.value
    onUpdate({ 
      mediaType: link ? "video" : "none",
      videoLink: link,
      images: [],
      videoFile: null,
    })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div>
              <Label>תמונות</Label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                {formData.images?.map((image, index) => (
                  <div key={index} className="relative">
                    <img 
                      src={image}
                      alt={`Uploaded ${index + 1}`} 
                      className="w-full h-40 object-cover rounded-md" 
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 h-6 w-6"
                      onClick={() => handleRemoveImage(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={handleImageUpload}
                    disabled={isUploading}
                  />
                  <Button
                    variant="outline"
                    className="h-40 w-full flex flex-col items-center justify-center"
                    disabled={isUploading}
                  >
                    {isUploading ? (
                      <Loader2 className="h-6 w-6 animate-spin" />
                    ) : (
                      <>
                        <Upload className="h-8 w-8 mb-2" />
                        <span>העלאת תמונה</span>
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>

            <div>
              <Label>וידאו</Label>
              <div className="mt-2">
                <div className="relative">
                  <input
                    type="file"
                    accept="video/*"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={handleVideoUpload}
                    disabled={isUploading}
                  />
                  <Button variant="outline" className="w-full" disabled={isUploading}>
                    {isUploading ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <>
                        <ImageIcon className="mr-2 h-4 w-4" />
                        העלאת וידאו
                      </>
                    )}
                  </Button>
                </div>
                {formData.videoFile && (
                  <div className="mt-2 flex items-center justify-between bg-gray-100 p-2 rounded">
                    <video src={formData.videoFile} controls className="w-full max-h-40" />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onUpdate({ mediaType: "none", videoFile: null })}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <div>
              <Label>קישור לוידאו</Label>
              <div className="mt-2">
                <Input
                  type="text"
                  placeholder="הדבק קישור לוידאו (YouTube, Vimeo, וכו')"
                  value={formData.videoLink || ""}
                  onChange={handleVideoLinkChange}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 