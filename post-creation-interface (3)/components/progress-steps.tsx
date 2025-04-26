import { Progress } from "@/components/ui/progress"

interface ProgressStepsProps {
  currentStep: number
  totalSteps: number
  stepLabels?: string[]
}

export function ProgressSteps({ currentStep, totalSteps, stepLabels }: ProgressStepsProps) {
  const progress = (currentStep / totalSteps) * 100

  return (
    <div className="mb-6">
      <Progress value={progress} className="h-2" />
      {stepLabels && (
        <div className="flex justify-between mt-2 text-sm text-gray-500">
          {stepLabels.map((label, index) => (
            <span key={index} className={index < currentStep ? "font-medium text-purple-600" : ""}>
              {label}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

