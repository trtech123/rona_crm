import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { CARD_COLORS, CARD_TITLES, POST_TYPE_OPTIONS, TABS } from "@/constants/form"
import { PostFormData, PostType } from "@/types/post"
import { FileText } from "lucide-react"

interface PostTypeSectionProps {
  formData: PostFormData
  onUpdate: (updates: Partial<PostFormData>) => void
}

export function PostTypeSection({ formData, onUpdate }: PostTypeSectionProps) {
  const handlePostTypeChange = (value: PostType) => {
    onUpdate({ postType: value })
  }

  return (
    <Card className={CARD_COLORS[TABS.POST_TYPE] + " border-t-4"}>
      <CardContent className="p-6">
        <div className="flex items-center mb-4">
          <FileText className="h-6 w-6 text-blue-600" />
          <h3 className="text-xl font-semibold text-blue-800 ml-3">
            {CARD_TITLES[TABS.POST_TYPE]}
          </h3>
        </div>
        <RadioGroup
          value={formData.postType}
          onValueChange={handlePostTypeChange}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {POST_TYPE_OPTIONS.map((option) => (
            <div
              key={option.value}
              className="flex items-center space-x-2 rtl:space-x-reverse"
            >
              <RadioGroupItem value={option.value} id={`post-type-${option.value}`} />
              <Label htmlFor={`post-type-${option.value}`}>{option.label}</Label>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
    </Card>
  )
} 