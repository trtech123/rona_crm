"use client"

import dynamic from "next/dynamic"

// Use dynamic import to avoid SSR issues
const PostCreationForm = dynamic(() => import("@/components/post-creation-form"), {
  ssr: false,
})

export default function PostCreationPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="w-full max-w-7xl">
        <PostCreationForm />
      </div>
    </div>
  )
} 