"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, Check, X } from "lucide-react"
import { Switch } from "@/components/ui/switch"

interface TemplateEditorProps {
  onSave?: (template: any) => void
  onCancel?: () => void
  initialTemplate?: any
}

export function TemplateEditor({ onSave, onCancel, initialTemplate }: TemplateEditorProps) {
  const [activeTab, setActiveTab] = useState("design")
  const [templateName, setTemplateName] = useState(initialTemplate?.name || "")
  const [primaryColor, setPrimaryColor] = useState(initialTemplate?.primaryColor || "#6D28D9")
  const [secondaryColor, setSecondaryColor] = useState(initialTemplate?.secondaryColor || "#EDE9FE")
  const [textColor, setTextColor] = useState(initialTemplate?.textColor || "#1F2937")
  const [hasLogo, setHasLogo] = useState(initialTemplate?.hasLogo || false)
  const [hasProfileImage, setHasProfileImage] = useState(initialTemplate?.hasProfileImage || false)
  const [hasBackgroundImage, setHasBackgroundImage] = useState(initialTemplate?.hasBackgroundImage || false)
  const [hasButton, setHasButton] = useState(initialTemplate?.hasButton || false)
  const [buttonText, setButtonText] = useState(initialTemplate?.buttonText || "קרא עוד")
  const [buttonUrl, setButtonUrl] = useState(initialTemplate?.buttonUrl || "")
  const [logoPosition, setLogoPosition] = useState(initialTemplate?.logoPosition || "top-right")
  const [fixedTitle, setFixedTitle] = useState(initialTemplate?.fixedTitle || "")
  const [useFixedTitle, setUseFixedTitle] = useState(initialTemplate?.useFixedTitle || false)

  const handleSave = () => {
    const template = {
      id: initialTemplate?.id || `template-${Date.now()}`,
      name: templateName,
      primaryColor,
      secondaryColor,
      textColor,
      hasLogo,
      hasProfileImage,
      hasBackgroundImage,
      hasButton,
      buttonText,
      buttonUrl,
      logoPosition,
      useFixedTitle,
      fixedTitle,
      createdAt: initialTemplate?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    if (onSave) {
      onSave(template)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">{initialTemplate ? "עריכת תבנית" : "יצירת תבנית חדשה"}</h3>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onCancel}>
            <X className="h-4 w-4 ml-2" />
            ביטול
          </Button>
          <Button onClick={handleSave}>
            <Check className="h-4 w-4 ml-2" />
            שמור תבנית
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="template-name">שם התבנית</Label>
          <Input
            id="template-name"
            value={templateName}
            onChange={(e) => setTemplateName(e.target.value)}
            placeholder="הזן שם לתבנית"
          />
        </div>
      </div>

      <Tabs defaultValue="design" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="design">עיצוב</TabsTrigger>
          <TabsTrigger value="elements">אלמנטים</TabsTrigger>
          <TabsTrigger value="preview">תצוגה מקדימה</TabsTrigger>
        </TabsList>

        <TabsContent value="design" className="space-y-4 pt-4">
          <div className="space-y-4">
            <h4 className="font-medium">צבעים</h4>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>צבע ראשי</Label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="w-10 h-10 p-1 border rounded cursor-pointer"
                  />
                  <Input value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} className="font-mono" />
                </div>
              </div>

              <div className="space-y-2">
                <Label>צבע משני</Label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={secondaryColor}
                    onChange={(e) => setSecondaryColor(e.target.value)}
                    className="w-10 h-10 p-1 border rounded cursor-pointer"
                  />
                  <Input
                    value={secondaryColor}
                    onChange={(e) => setSecondaryColor(e.target.value)}
                    className="font-mono"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>צבע טקסט</Label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={textColor}
                    onChange={(e) => setTextColor(e.target.value)}
                    className="w-10 h-10 p-1 border rounded cursor-pointer"
                  />
                  <Input value={textColor} onChange={(e) => setTextColor(e.target.value)} className="font-mono" />
                </div>
              </div>
            </div>

            <div className="pt-4 space-y-2">
              <p className="text-sm text-gray-600">צבעים מוגדרים מראש:</p>
              <div className="flex flex-wrap gap-2">
                {["#6D28D9", "#047857", "#DC2626", "#2563EB", "#D97706", "#4F46E5", "#7C3AED"].map((color) => (
                  <button
                    key={color}
                    className="w-8 h-8 rounded-md border"
                    style={{ backgroundColor: color }}
                    onClick={() => setPrimaryColor(color)}
                    title="הגדר כצבע ראשי"
                  />
                ))}
              </div>
            </div>

            <div className="pt-2">
              <Button variant="outline" size="sm">
                שאב צבעים מהלוגו
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium">טיפוגרפיה</h4>

            <div className="space-y-2">
              <Label>פונט כותרת</Label>
              <select className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md">
                <option value="assistant">Assistant</option>
                <option value="heebo">Heebo</option>
                <option value="rubik">Rubik</option>
                <option value="open-sans">Open Sans</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label>פונט טקסט</Label>
              <select className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md">
                <option value="assistant">Assistant</option>
                <option value="heebo">Heebo</option>
                <option value="rubik">Rubik</option>
                <option value="open-sans">Open Sans</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label>גודל כותרת</Label>
              <select className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md">
                <option value="small">קטן</option>
                <option value="medium">בינוני</option>
                <option value="large">גדול</option>
              </select>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="elements" className="space-y-6 pt-4">
          <div className="space-y-4">
            <h4 className="font-medium">אלמנטים</h4>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Switch id="has-logo" checked={hasLogo} onCheckedChange={setHasLogo} />
                <Label htmlFor="has-logo">לוגו</Label>
              </div>

              {hasLogo && (
                <div className="flex items-center gap-2">
                  <Label htmlFor="logo-position" className="text-sm">
                    מיקום:
                  </Label>
                  <select
                    id="logo-position"
                    value={logoPosition}
                    onChange={(e) => setLogoPosition(e.target.value)}
                    className="h-8 px-2 py-1 border border-gray-300 rounded-md text-sm"
                  >
                    <option value="top-right">ימין למעלה</option>
                    <option value="top-left">שמאל למעלה</option>
                    <option value="bottom-right">ימין למטה</option>
                    <option value="bottom-left">שמאל למטה</option>
                  </select>
                </div>
              )}
            </div>

            {hasLogo && (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center mt-2">
                <div className="flex flex-col items-center">
                  <Upload className="h-6 w-6 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600">העלה לוגו</p>
                  <p className="text-xs text-gray-500 mt-1">PNG, SVG עם רקע שקוף</p>
                  <Button variant="outline" size="sm" className="mt-2">
                    בחר קובץ
                  </Button>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-2">
                <Switch id="use-fixed-title" checked={useFixedTitle} onCheckedChange={setUseFixedTitle} />
                <Label htmlFor="use-fixed-title">כותרת קבועה</Label>
              </div>
            </div>

            {useFixedTitle && (
              <div className="mt-2 space-y-2">
                <Label htmlFor="fixed-title">טקסט הכותרת</Label>
                <Input
                  id="fixed-title"
                  value={fixedTitle}
                  onChange={(e) => setFixedTitle(e.target.value)}
                  placeholder="הזן כותרת קבועה לתבנית"
                />
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Switch id="has-profile-image" checked={hasProfileImage} onCheckedChange={setHasProfileImage} />
                <Label htmlFor="has-profile-image">תמונת פרופיל</Label>
              </div>
            </div>

            {hasProfileImage && (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                <div className="flex flex-col items-center">
                  <Upload className="h-6 w-6 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600">העלה תמונת פרופיל</p>
                  <p className="text-xs text-gray-500 mt-1">מומלץ תמונה מרובעת</p>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Switch
                  id="has-background-image"
                  checked={hasBackgroundImage}
                  onCheckedChange={setHasBackgroundImage}
                />
                <Label htmlFor="has-background-image">תמונת רקע</Label>
              </div>
            </div>

            {hasBackgroundImage && (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                <div className="flex flex-col items-center">
                  <Upload className="h-6 w-6 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600">העלה תמונת רקע</p>
                  <p className="text-xs text-gray-500 mt-1">מומלץ תמונה ברזולוציה גבוהה</p>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Switch id="has-button" checked={hasButton} onCheckedChange={setHasButton} />
                <Label htmlFor="has-button">כפתור קריאה לפעולה</Label>
              </div>
            </div>

            {hasButton && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="button-text">טקסט הכפתור</Label>
                  <Input
                    id="button-text"
                    value={buttonText}
                    onChange={(e) => setButtonText(e.target.value)}
                    placeholder="קרא עוד"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="button-url">קישור</Label>
                  <Input
                    id="button-url"
                    value={buttonUrl}
                    onChange={(e) => setButtonUrl(e.target.value)}
                    placeholder="https://example.com"
                  />
                </div>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="preview" className="pt-4">
          <div className="border rounded-lg overflow-hidden">
            <div className="aspect-[16/9] bg-gray-100 relative">
              {/* Preview of the template */}
              <div className="absolute inset-0" style={{ backgroundColor: secondaryColor }}>
                {hasBackgroundImage && (
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                    <span>תמונת רקע</span>
                  </div>
                )}

                {hasLogo && (
                  <div
                    className={`absolute p-4 ${
                      logoPosition === "top-right"
                        ? "top-0 right-0"
                        : logoPosition === "top-left"
                          ? "top-0 left-0"
                          : logoPosition === "bottom-right"
                            ? "bottom-0 right-0"
                            : "bottom-0 left-0"
                    }`}
                  >
                    <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
                      <span className="text-xs text-gray-500">לוגו</span>
                    </div>
                  </div>
                )}

                <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
                  {hasProfileImage && (
                    <div className="w-20 h-20 bg-gray-200 rounded-full mb-4 flex items-center justify-center">
                      <span className="text-xs text-gray-500">פרופיל</span>
                    </div>
                  )}

                  <div className="text-center">
                    {useFixedTitle ? (
                      <h4 className="text-xl font-bold mb-2" style={{ color: textColor }}>
                        {fixedTitle || "כותרת קבועה"}
                      </h4>
                    ) : (
                      <h4 className="text-xl font-bold mb-2" style={{ color: textColor }}>
                        כותרת לדוגמה
                      </h4>
                    )}
                    <p style={{ color: textColor }}>כאן יופיע הטקסט של הפוסט שלך</p>

                    {hasButton && (
                      <button
                        className="mt-4 px-4 py-2 rounded-md text-white"
                        style={{ backgroundColor: primaryColor }}
                      >
                        {buttonText}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 border-t">
              <div className="flex items-center">
                {hasProfileImage && (
                  <div className="w-10 h-10 bg-gray-200 rounded-full ml-3 flex items-center justify-center">
                    <span className="text-xs text-gray-500">פרופיל</span>
                  </div>
                )}
                <div>
                  <h4 className="font-medium">שם העסק שלך</h4>
                  <p className="text-sm text-gray-500">תיאור קצר</p>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

