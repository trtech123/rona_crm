import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { CARD_COLORS, CARD_TITLES, TABS } from "@/constants/form"
import { PostFormData } from "@/types/post"
import { Layout } from "lucide-react"

const TEMPLATE_OPTIONS = [
  {
    value: "standard",
    label: "תבנית סטנדרטית",
    description: "פורמט בסיסי עם תמונה וטקסט",
  },
  {
    value: "carousel",
    label: "קרוסלה",
    description: "מספר תמונות בגלילה אופקית",
  },
  {
    value: "video",
    label: "וידאו",
    description: "פוסט עם וידאו כמוקד",
  },
  {
    value: "story",
    label: "סיפור",
    description: "פורמט סיפורי עם תמונות מרובות",
  },
  {
    value: "quote",
    label: "ציטוט",
    description: "ציטוט מעוצב עם רקע",
  },
  {
    value: "custom",
    label: "מותאם אישית",
    description: "עיצוב ייחודי לפי דרישה",
  },
] as const

interface TemplateSectionProps {
  formData: PostFormData
  onUpdate: (updates: Partial<PostFormData>) => void
}

export function TemplateSection({ formData, onUpdate }: TemplateSectionProps) {
  const handleTemplateChange = (value: string) => {
    onUpdate({ selectedTemplate: value })
  }

  return (
    <Card className={CARD_COLORS[TABS.TEMPLATE] + " border-t-4"}>
      <CardContent className="p-6">
        <div className="flex items-center mb-4">
          <Layout className="h-6 w-6 text-orange-600" />
          <h3 className="text-xl font-semibold text-orange-800 ml-3">
            {CARD_TITLES[TABS.TEMPLATE]}
          </h3>
        </div>
        <RadioGroup
          value={formData.selectedTemplate as string}
          onValueChange={handleTemplateChange}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {TEMPLATE_OPTIONS.map((option) => (
            <div
              key={option.value}
              className="flex items-start space-x-2 rtl:space-x-reverse p-4 border rounded-lg hover:bg-orange-50 transition-colors"
            >
              <RadioGroupItem value={option.value} id={`template-${option.value}`} />
              <div className="flex-1">
                <Label htmlFor={`template-${option.value}`} className="font-medium">
                  {option.label}
                </Label>
                <p className="text-sm text-gray-500 mt-1">{option.description}</p>
              </div>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
    </Card>
  )
} 