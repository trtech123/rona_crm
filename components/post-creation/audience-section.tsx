import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { CARD_COLORS, CARD_TITLES, TABS } from "@/constants/form"
import { PostFormData } from "@/types/post"
import { Users } from "lucide-react"

interface AudienceSectionProps {
  formData: PostFormData
  onUpdate: (updates: Partial<PostFormData>) => void
}

export function AudienceSection({ formData, onUpdate }: AudienceSectionProps) {
  const handleTargetAudienceChange = (value: string) => {
    onUpdate({ targetAudience: value })
  }

  return (
    <Card className={CARD_COLORS[TABS.AUDIENCE] + " border-t-4"}>
      <CardContent className="p-6">
        <div className="flex items-center mb-4">
          <Users className="h-6 w-6 text-pink-600" />
          <h3 className="text-xl font-semibold text-pink-800 ml-3">
            {CARD_TITLES[TABS.AUDIENCE]}
          </h3>
        </div>
        <div className="space-y-4">
          <div>
            <Label htmlFor="target-audience">קהל היעד</Label>
            <Input
              id="target-audience"
              value={formData.targetAudience}
              onChange={(e) => handleTargetAudienceChange(e.target.value)}
              placeholder="למשל: משפחות צעירות, משקיעים, קונים ראשונים..."
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="audience-interests">תחומי עניין</Label>
            <Textarea
              id="audience-interests"
              placeholder="תאר את תחומי העניין של קהל היעד..."
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="audience-pain-points">בעיות ואתגרים</Label>
            <Textarea
              id="audience-pain-points"
              placeholder="תאר את הבעיות והאתגרים של קהל היעד..."
              className="mt-2"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 