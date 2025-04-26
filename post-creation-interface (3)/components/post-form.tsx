"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

export function PostForm() {
  const [step, setStep] = useState(1)
  const [progress, setProgress] = useState(25)

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1)
      setProgress((step + 1) * 25)
    }
  }

  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1)
      setProgress(step * 25 - 25)
    }
  }

  return (
    <div className="space-y-8">
      <div className="mb-6">
        <Progress value={progress} className="h-2" />
        <div className="flex justify-between mt-2 text-sm text-gray-500">
          <span>בחירת רשת</span>
          <span>יצירת תוכן</span>
          <span>יצירת מדיה</span>
          <span>סיום</span>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6">
        <p className="text-blue-800">שלב {step} מתוך 4</p>
      </div>

      <div className="flex justify-between">
        <Button onClick={handlePrevious} disabled={step === 1}>
          הקודם
        </Button>
        <Button onClick={handleNext} disabled={step === 4}>
          הבא
        </Button>
      </div>
    </div>
  )
}

