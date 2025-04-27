import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Zap } from "lucide-react"
import { CTAType, PostFormData } from "@/types/post"

interface CTASectionProps {
  formData: PostFormData
  onUpdate: (updates: Partial<PostFormData>) => void
}

export function CTASection({ formData, onUpdate }: CTASectionProps) {
  const handleCTATypeChange = (value: CTAType) => {
    onUpdate({ ctaType: value })
  }

  const generateCtaLink = () => {
    if (formData.ctaType === "call" && formData.ctaPhone) {
      return `tel:${formData.ctaPhone.startsWith("+") ? formData.ctaPhone : "+" + formData.ctaPhone}`
    } else if (formData.ctaType === "whatsapp" && formData.ctaPhone) {
      const encodedMessage = encodeURIComponent(formData.ctaWhatsappMessage || "")
      return `https://wa.me/${formData.ctaPhone.replace(/^\+/, "")}${encodedMessage ? '?text=' + encodedMessage : ''}`
    } else {
      return formData.ctaLink
    }
  }

  return (
    <Card className="border-t-4 border-pink-200 bg-gradient-to-br from-pink-50 to-rose-50">
      <CardContent className="p-6">
        <div className="flex items-center mb-4">
          <Zap className="h-6 w-6 text-pink-600" />
          <h3 className="text-xl font-semibold text-pink-800 ml-3">קריאה לפעולה</h3>
        </div>
        <p className="mb-4">האם תרצה להוסיף קריאה לפעולה בסוף הפוסט?</p>
        <RadioGroup
          value={formData.includeCTA}
          onValueChange={(value: "yes" | "no") => onUpdate({ includeCTA: value })}
          className="flex space-x-4 rtl:space-x-reverse mb-4"
        >
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <RadioGroupItem value="yes" id="cta-yes" />
            <Label htmlFor="cta-yes">כן</Label>
          </div>
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <RadioGroupItem value="no" id="cta-no" />
            <Label htmlFor="cta-no">לא</Label>
          </div>
        </RadioGroup>

        {formData.includeCTA === "yes" && (
          <div className="mt-4 space-y-4 border-t pt-4">
            <Label>בחר סוג קריאה לפעולה:</Label>
            <RadioGroup
              value={formData.ctaType}
              onValueChange={handleCTATypeChange}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <RadioGroupItem value="link" id="cta-link" />
                <Label htmlFor="cta-link">קישור לאתר / דף נחיתה</Label>
              </div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <RadioGroupItem value="call" id="cta-call" />
                <Label htmlFor="cta-call">התקשרות טלפונית</Label>
              </div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <RadioGroupItem value="whatsapp" id="cta-whatsapp" />
                <Label htmlFor="cta-whatsapp">הודעת וואטסאפ</Label>
              </div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <RadioGroupItem value="message" id="cta-message" />
                <Label htmlFor="cta-message">שלח הודעה (ברשת החברתית)</Label>
              </div>
            </RadioGroup>

            {formData.ctaType && (
              <div className="mt-4 space-y-3">
                <Label htmlFor="ctaText">טקסט הקריאה לפעולה:</Label>
                <Input
                  id="ctaText"
                  value={formData.ctaText}
                  onChange={(e) => onUpdate({ ctaText: e.target.value })}
                  placeholder="לדוגמה: לפרטים נוספים ולתיאום, לחצו כאן"
                />

                {formData.ctaType === "link" && (
                  <>
                    <Label htmlFor="ctaLink">קישור:</Label>
                    <Input
                      id="ctaLink"
                      value={formData.ctaLink}
                      onChange={(e) => onUpdate({ ctaLink: e.target.value })}
                      placeholder="https://www.example.com"
                    />
                  </>
                )}

                {(formData.ctaType === "call" || formData.ctaType === "whatsapp") && (
                  <>
                    <Label htmlFor="ctaPhone">מספר טלפון:</Label>
                    <Input
                      id="ctaPhone"
                      value={formData.ctaPhone}
                      onChange={(e) => onUpdate({ ctaPhone: e.target.value })}
                      type="tel"
                      placeholder="+972501234567"
                    />
                  </>
                )}

                {formData.ctaType === "whatsapp" && (
                  <>
                    <Label htmlFor="ctaWhatsappMessage">הודעה מוכנה (אופציונלי):</Label>
                    <Textarea
                      id="ctaWhatsappMessage"
                      value={formData.ctaWhatsappMessage}
                      onChange={(e) => onUpdate({ ctaWhatsappMessage: e.target.value })}
                      placeholder="לדוגמה: אשמח לקבל פרטים נוספים על..."
                      className="min-h-[60px]"
                    />
                  </>
                )}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
} 