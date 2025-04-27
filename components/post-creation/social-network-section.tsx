import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { CARD_COLORS, CARD_TITLES, TABS } from "@/constants/form"
import { PostFormData, SocialNetwork } from "@/types/post"
import { Share2 } from "lucide-react"

const SOCIAL_NETWORK_OPTIONS: Array<{ value: SocialNetwork; label: string }> = [
  {
    value: "facebook",
    label: "Facebook",
  },
  {
    value: "instagram",
    label: "Instagram",
  },
  {
    value: "linkedin",
    label: "LinkedIn",
  },
  {
    value: "twitter",
    label: "Twitter",
  },
  {
    value: "whatsapp",
    label: "WhatsApp",
  },
  {
    value: "other",
    label: "אחר",
  },
]

interface SocialNetworkSectionProps {
  formData: PostFormData
  onUpdate: (updates: Partial<PostFormData>) => void
}

export function SocialNetworkSection({ formData, onUpdate }: SocialNetworkSectionProps) {
  const handleSocialNetworkChange = (value: SocialNetwork) => {
    onUpdate({ socialNetwork: value })
  }

  return (
    <Card className={CARD_COLORS[TABS.SOCIAL_NETWORK] + " border-t-4"}>
      <CardContent className="p-6">
        <div className="flex items-center mb-4">
          <Share2 className="h-6 w-6 text-green-600" />
          <h3 className="text-xl font-semibold text-green-800 ml-3">
            {CARD_TITLES[TABS.SOCIAL_NETWORK]}
          </h3>
        </div>
        <RadioGroup
          value={formData.socialNetwork}
          onValueChange={handleSocialNetworkChange}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {SOCIAL_NETWORK_OPTIONS.map((option) => (
            <div
              key={option.value}
              className="flex items-center space-x-2 rtl:space-x-reverse"
            >
              <RadioGroupItem value={option.value} id={`social-network-${option.value}`} />
              <Label htmlFor={`social-network-${option.value}`}>{option.label}</Label>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
    </Card>
  )
} 