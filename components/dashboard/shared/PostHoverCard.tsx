"use client";

import React from "react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Post } from "@/lib/types";
import Image from "next/image";
// TODO: Implement or import PostAnalyticsChart
// import { PostAnalyticsChart } from "@/components/post-analytics-chart"

// Placeholder for PostAnalyticsChart (assuming it's not yet implemented)
const PostAnalyticsChart = ({ postId }: { postId: number }) => (
  <div className="text-xs text-gray-500 p-2 bg-gray-50 rounded-md">Placeholder for analytics chart (Post ID: {postId})</div>
);

interface PostHoverCardProps {
  post: Post;
  children: React.ReactNode;
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
                className="rounded-md object-cover bg-gray-100"
              />
            ) : post.type === "video" ? (
              <div className="bg-gray-200 h-[150px] rounded-md flex items-center justify-center">
                <span>סרטון</span>
              </div>
            ) : (
              <div className="bg-gray-100 p-3 rounded-md text-sm max-h-24 overflow-y-auto">{post.content}</div>
            )}
          </div>

          {/* Temporarily commented out until PostAnalyticsChart is available */}
          {/* 
          <div className="space-y-2">
            <h5 className="text-sm font-medium">אנליטיקה</h5>
            <PostAnalyticsChart postId={post.id} />
          </div>
          */}
        </div>
      </HoverCardContent>
    </HoverCard>
  );
} 