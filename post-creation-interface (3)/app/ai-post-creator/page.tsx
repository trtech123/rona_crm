import { AIPostCreator } from "@/components/ai-post-creator"
import { Button } from "@/components/ui/button"
import { FileQuestion, ImageIcon, PenTool } from "lucide-react"

export default function AIPostCreatorPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center">
          <div className="w-full max-w-5xl mb-6">
            <div className="flex space-x-2 rtl:space-x-reverse bg-white rounded-xl shadow-sm p-4">
              <Button className="flex-1">
                <FileQuestion className="mr-2 h-4 w-4" />
                שאלון
              </Button>
              <Button className="flex-1" variant="outline">
                <ImageIcon className="mr-2 h-4 w-4" />
                מדיה
              </Button>
              <Button className="flex-1" variant="outline">
                <PenTool className="mr-2 h-4 w-4" />
                יצירת תוכן
              </Button>
            </div>
          </div>

          <div className="w-full max-w-5xl bg-white rounded-xl shadow-sm p-6">
            <AIPostCreator
              onBack={() => console.log("חזרה למסך הקודם")}
              onComplete={(post) => console.log("הפוסט הושלם:", post)}
            />
          </div>
        </div>
      </div>
    </main>
  )
}

