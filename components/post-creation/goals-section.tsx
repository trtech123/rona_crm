import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { CARD_COLORS, CARD_TITLES, TABS } from "@/constants/form"
import { PostFormData } from "@/types/post"
import { Target } from "lucide-react"

const GOAL_OPTIONS = [
  {
    value: "generate-leads",
    label: "יצירת לידים",
  },
  {
    value: "build-awareness",
    label: "בניית מודעות",
  },
  {
    value: "educate-audience",
    label: "חינוך והדרכה",
  },
  {
    value: "promote-property",
    label: "קידום נכס",
  },
  {
    value: "engage-community",
    label: "הפעלת הקהילה",
  },
  {
    value: "share-expertise",
    label: "שיתוף מומחיות",
  },
] as const

interface GoalsSectionProps {
  formData: PostFormData
  onUpdate: (updates: Partial<PostFormData>) => void
}

export function GoalsSection({ formData, onUpdate }: GoalsSectionProps) {
  const handleGoalChange = (value: string) => {
    onUpdate({ contentGoal: value })
  }

  return (
    <Card className={CARD_COLORS[TABS.GOALS] + " border-t-4"}>
      <CardContent className="p-6">
        <div className="flex items-center mb-4">
          <Target className="h-6 w-6 text-yellow-600" />
          <h3 className="text-xl font-semibold text-yellow-800 ml-3">
            {CARD_TITLES[TABS.GOALS]}
          </h3>
        </div>
        <RadioGroup
          value={formData.contentGoal}
          onValueChange={handleGoalChange}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {GOAL_OPTIONS.map((option) => (
            <div
              key={option.value}
              className="flex items-center space-x-2 rtl:space-x-reverse"
            >
              <RadioGroupItem value={option.value} id={`goal-${option.value}`} />
              <Label htmlFor={`goal-${option.value}`}>{option.label}</Label>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
    </Card>
  )
} 