import dynamic from "next/dynamic"

// Use dynamic import to avoid SSR issues
const PostCreationForm = dynamic(() => import("@/components/post-creation-form"), {
  ssr: false,
})

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center">
          <h1 className="text-3xl font-bold text-center mb-2">יצירת פוסט חדש</h1>
          <p className="text-gray-600 text-center mb-8">ענה על השאלות כדי שנוכל ליצור תוכן מדויק עבורך</p>
          <div className="w-full max-w-4xl">
            <PostCreationForm />
          </div>
        </div>
      </div>
    </main>
  )
}

