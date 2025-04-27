import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { CARD_COLORS, CARD_TITLES, TABS } from "@/constants/form"
import { PostFormData } from "@/types/post"
import { Home } from "lucide-react"

interface PropertySectionProps {
  formData: PostFormData
  onUpdate: (updates: Partial<PostFormData>) => void
}

export function PropertySection({ formData, onUpdate }: PropertySectionProps) {
  const handleHasSpecificPropertyChange = (value: "yes" | "no") => {
    onUpdate({ hasSpecificProperty: value })
  }

  return (
    <Card className={CARD_COLORS[TABS.PROPERTY] + " border-t-4"}>
      <CardContent className="p-6">
        <div className="flex items-center mb-4">
          <Home className="h-6 w-6 text-teal-600" />
          <h3 className="text-xl font-semibold text-teal-800 ml-3">
            {CARD_TITLES[TABS.PROPERTY]}
          </h3>
        </div>
        <div className="space-y-6">
          <div>
            <Label>האם הפוסט מתייחס לנכס ספציפי?</Label>
            <RadioGroup
              value={formData.hasSpecificProperty}
              onValueChange={handleHasSpecificPropertyChange}
              className="grid grid-cols-2 gap-4 mt-2"
            >
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <RadioGroupItem value="yes" id="property-yes" />
                <Label htmlFor="property-yes">כן</Label>
              </div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <RadioGroupItem value="no" id="property-no" />
                <Label htmlFor="property-no">לא</Label>
              </div>
            </RadioGroup>
          </div>

          {formData.hasSpecificProperty === "yes" && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="property-address">כתובת הנכס</Label>
                <Input
                  id="property-address"
                  placeholder="הזן את כתובת הנכס..."
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="property-type">סוג הנכס</Label>
                <Input
                  id="property-type"
                  placeholder="למשל: דירה, בית, חנות..."
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="property-features">מאפיינים עיקריים</Label>
                <Textarea
                  id="property-features"
                  placeholder="תאר את המאפיינים העיקריים של הנכס..."
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="property-price">מחיר</Label>
                <Input
                  id="property-price"
                  placeholder="הזן את מחיר הנכס..."
                  className="mt-2"
                />
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
} 