"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Lead } from "@/lib/types"
import Image from "next/image"
import { Trophy, Eye, MessageSquare, ThumbsUp, TrendingUp } from "lucide-react"
import { useRouter } from "next/navigation"

interface TopPerformersProps {
  leads: Lead[]
}

export function TopPerformers({ leads }: TopPerformersProps) {
  const router = useRouter()

  // Sort leads by postId to find top performers
  const sortedLeads = [...leads].sort((a, b) => b.postId - a.postId)
  const topThree = sortedLeads.slice(0, 3)

  const handlePostClick = (postId: number) => {
    // Navigate to leads page with filter for this post
    router.push(`/leads?postId=${postId}`)
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      {topThree.map((lead, index) => (
        <Card
          key={lead.id}
          className={`${index === 0 ? "border-amber-400" : ""} cursor-pointer hover:shadow-md transition-shadow`}
          onClick={() => handlePostClick(lead.post.id)}
        >
          <CardContent className="p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1">
                {index === 0 && <Trophy className="h-4 w-4 text-amber-500" />}
                <h3 className="font-bold text-sm">פוסט #{lead.post.id}</h3>
              </div>
              <Badge variant="outline" className="text-xs">
                {lead.post.date}
              </Badge>
            </div>

            {/* תמונת הפוסט */}
            <div className="mb-2 relative h-[100px] w-full overflow-hidden rounded-md">
              {lead.post.type === "image" ? (
                <Image src={lead.post.content || "/placeholder.svg"} alt="Post preview" fill className="object-cover" />
              ) : lead.post.type === "video" ? (
                <div className="bg-gray-200 h-full w-full flex items-center justify-center">
                  <span className="text-xs">סרטון</span>
                </div>
              ) : (
                <div className="bg-gray-100 p-2 h-full w-full overflow-auto text-xs">
                  {lead.post.content.substring(0, 100)}...
                </div>
              )}
            </div>

            {/* נתוני הפוסט */}
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-xs">
                    <MessageSquare className="h-3 w-3 text-blue-500" />
                    <span>תגובות</span>
                  </div>
                  <span className="text-sm font-bold">{42 - index * 8}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-xs">
                    <Eye className="h-3 w-3 text-green-500" />
                    <span>צפיות</span>
                  </div>
                  <span className="text-sm font-bold">{156 - index * 20}</span>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-xs">
                    <TrendingUp className="h-3 w-3 text-purple-500" />
                    <span>לידים</span>
                  </div>
                  <div className="text-sm font-bold">
                    <span className="text-green-600">{12 - index * 3}</span>
                    <span className="text-xs text-muted-foreground mx-1">/</span>
                    <span>{24 - index * 5}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-xs">
                    <ThumbsUp className="h-3 w-3 text-amber-500" />
                    <span>לייקים</span>
                  </div>
                  <span className="text-sm font-bold">{85 - index * 15}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

