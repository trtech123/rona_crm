import Image from "next/image"
import type { Post } from "@/lib/types"

interface PostPreviewProps {
  post: Post
  size?: "small" | "medium" | "large"
}

export function PostPreview({ post, size = "medium" }: PostPreviewProps) {
  const dimensions = {
    small: { width: 40, height: 40 },
    medium: { width: 80, height: 80 },
    large: { width: 200, height: 200 },
  }

  const { width, height } = dimensions[size]

  return (
    <div className="flex items-center justify-center overflow-hidden rounded-md">
      {post.type === "image" ? (
        <Image
          src={post.content || "/placeholder.svg"}
          alt="Post preview"
          width={width}
          height={height}
          className="object-cover"
        />
      ) : post.type === "video" ? (
        <div className="relative bg-gray-200 flex items-center justify-center" style={{ width, height }}>
          <span className="text-xs">סרטון</span>
        </div>
      ) : (
        <div className="bg-gray-100 p-1 text-xs overflow-hidden" style={{ width, height }}>
          {post.content.substring(0, 20)}...
        </div>
      )}
    </div>
  )
}

