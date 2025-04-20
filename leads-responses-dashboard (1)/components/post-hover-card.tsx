"use client"

import type React from "react"

import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import type { Post } from "@/lib/types"
import Image from "next/image"
import { PostAnalyticsChart } from "@/components/post-analytics-chart"

interface PostHoverCardProps {
  post: Post
  children: React.ReactNode
}

export function PostHoverCard({ post, children }: PostHoverCardProps) {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>{children}</HoverCardTrigger>
      <HoverCardContent className="w-80" align="start">
        <div className="space-y-4">
          <div className="space-y-2">
            <h4 className="text-sm font-semibold">פוסט #{post.id}</h4>
            {post.type === "image" ? (
              <Image
                src={post.content || "/placeholder.svg"}
                alt="Post preview"
                width={300}
                height={200}
                className="rounded-md object-cover"
              />
            ) : post.type === "video" ? (
              <div className="bg-gray-200 h-[150px] rounded-md flex items-center justify-center">
                <span>סרטון</span>
              </div>
            ) : (
              <div className="bg-gray-100 p-3 rounded-md text-sm">{post.content}</div>
            )}
          </div>

          <div className="space-y-2">
            <h5 className="text-sm font-medium">אנליטיקה</h5>
            <PostAnalyticsChart postId={post.id} />
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}

