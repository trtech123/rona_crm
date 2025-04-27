import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { CARD_COLORS, CARD_TITLES, POST_PROBLEM_OPTIONS, TABS } from "@/constants/form"
import { PostFormData, PostProblem } from "@/types/post"
import { HelpCircle } from "lucide-react"

interface PostProblemSectionProps {
  formData: PostFormData
  onUpdate: (updates: Partial<PostFormData>) => void
}

export function PostProblemSection({ formData, onUpdate }: PostProblemSectionProps) {
  const handleProblemChange = (value: PostProblem) => {
    onUpdate({
      postProblem: value,
      customPostProblem: value === "other" ? formData.customPostProblem : "",
    })
  }

  const handleCustomProblemChange = (value: string) => {
    onUpdate({ customPostProblem: value })
  }

  return (
    <Card className={CARD_COLORS[TABS.PROBLEM] + " border-t-4"}>
      <CardContent className="p-6">
        <div className="flex items-center mb-4">
          <HelpCircle className="h-6 w-6 text-purple-600" />
          <h3 className="text-xl font-semibold text-purple-800 ml-3">
            {CARD_TITLES[TABS.PROBLEM]}
          </h3>
        </div>
        <RadioGroup
          value={formData.postProblem}
          onValueChange={handleProblemChange}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {POST_PROBLEM_OPTIONS.map((option) => (
            <div
              key={option.value}
              className="flex items-center space-x-2 rtl:space-x-reverse"
            >
              <RadioGroupItem value={option.value} id={`post-problem-${option.value}`} />
              <Label htmlFor={`post-problem-${option.value}`}>{option.label}</Label>
            </div>
          ))}
        </RadioGroup>
        {formData.postProblem === "other" && (
          <div className="mt-4">
            <Label htmlFor="customProblem" className="mb-2 block">
              פרט את הבעיה או השאלה הספציפית:
            </Label>
            <Textarea
              id="customProblem"
              value={formData.customPostProblem}
              onChange={(e) => handleCustomProblemChange(e.target.value)}
              placeholder="לדוגמה: כיצד להתמודד עם עליית הריבית..."
              className="min-h-[80px]"
            />
          </div>
        )}
      </CardContent>
    </Card>
  )
} 