"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Upload, Check, ArrowLeft, ImageIcon, UserCircle, ArrowRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface SimplifiedTemplateCreatorProps {
  onSave?: (template: any) => void
  onCancel?: () => void
  onBack?: () => void
  onNextQuestion?: () => void
  onPreviousQuestion?: () => void
  initialTemplate?: any
}

export function SimplifiedTemplateCreator({
  onSave,
  onCancel,
  onBack,
  onNextQuestion,
  onPreviousQuestion,
  initialTemplate,
}: SimplifiedTemplateCreatorProps) {
  const [templateName, setTemplateName] = useState(initialTemplate?.name || "תבנית חדשה")
  const [primaryColor, setPrimaryColor] = useState(initialTemplate?.primaryColor || "#6D28D9")
  const [secondaryColor, setSecondaryColor] = useState(initialTemplate?.secondaryColor || "#EDE9FE")
  const [textColor, setTextColor] = useState(initialTemplate?.textColor || "#1F2937")
  const [hasLogo, setHasLogo] = useState(initialTemplate?.hasLogo !== undefined ? initialTemplate.hasLogo : true)
  const [hasProfileImage, setHasProfileImage] = useState(initialTemplate?.hasProfileImage || false)
  const [hasBackgroundImage, setHasBackgroundImage] = useState(initialTemplate?.hasBackgroundImage || false)
  const [useFixedTitle, setUseFixedTitle] = useState(
    initialTemplate?.useFixedTitle !== undefined ? initialTemplate.useFixedTitle : true,
  )
  const [fixedTitle, setFixedTitle] = useState(initialTemplate?.fixedTitle || "כותרת קבועה")
  const [fixedSubtitle, setFixedSubtitle] = useState(initialTemplate?.fixedSubtitle || "משפט משנה קבוע")
  const [hasBorder, setHasBorder] = useState(initialTemplate?.hasBorder || false)
  const [borderColor, setBorderColor] = useState(initialTemplate?.borderColor || "#6D28D9")
  const [borderWidth, setBorderWidth] = useState(initialTemplate?.borderWidth || 2)
  const [borderStyle, setBorderStyle] = useState(initialTemplate?.borderStyle || "solid")
  const [activeTab, setActiveTab] = useState("colors")

  // צבעים מוגדרים מראש
  const predefinedColors = [
    { primary: "#6D28D9", secondary: "#EDE9FE", name: "סגול" },
    { primary: "#047857", secondary: "#ECFDF5", name: "ירוק" },
    { primary: "#DC2626", secondary: "#FEE2E2", name: "אדום" },
    { primary: "#2563EB", secondary: "#EFF6FF", name: "כחול" },
    { primary: "#D97706", secondary: "#FEF3C7", name: "כתום" },
    { primary: "#4F46E5", secondary: "#EEF2FF", name: "אינדיגו" },
    { primary: "#7C3AED", secondary: "#F3E8FF", name: "סגול בהיר" },
    { primary: "#0F172A", secondary: "#F8FAFC", name: "כהה" },
    { primary: "#0369A1", secondary: "#E0F2FE", name: "תכלת" },
    { primary: "#B45309", secondary: "#FEF3C7", name: "חום" },
    { primary: "#BE185D", secondary: "#FCE7F3", name: "ורוד" },
    { primary: "#064E3B", secondary: "#ECFDF5", name: "ירוק כהה" },
  ]

  const handleSelectColor = (primary, secondary) => {
    setPrimaryColor(primary)
    setSecondaryColor(secondary)
  }

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
      hasButton: true,
      buttonText: "קרא עוד",
      buttonUrl: "",
      logoPosition: "top-right",
      useFixedTitle,
      fixedTitle,
      fixedSubtitle,
      hasBorder,
      borderColor,
      borderWidth,
      borderStyle,
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
        <div className="flex items-center">
          <Button variant="ghost" size="icon" onClick={onBack} className="ml-2">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h3 className="text-xl font-semibold">יצירת תבנית</h3>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onBack || onCancel}>
            ביטול
          </Button>
          <Button onClick={handleSave}>
            <Check className="h-4 w-4 ml-2" />
            שמור תבנית
          </Button>
        </div>
      </div>

      <div>
        <Label htmlFor="template-name">שם התבנית</Label>
        <Input
          id="template-name"
          value={templateName}
          onChange={(e) => setTemplateName(e.target.value)}
          placeholder="הזן שם לתבנית"
          className="mt-1"
        />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="colors">צבעים ומסגרת</TabsTrigger>
          <TabsTrigger value="content">תוכן</TabsTrigger>
          <TabsTrigger value="media">תמונות</TabsTrigger>
        </TabsList>

        <TabsContent value="colors" className="space-y-6 pt-4">
          <div className="space-y-4">
            <h4 className="font-medium">בחר סכמת צבעים מובילה</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {predefinedColors.map((colorSet) => (
                <button
                  key={colorSet.primary}
                  className={`p-2 rounded-md border transition-all ${
                    primaryColor === colorSet.primary ? "border-gray-900 ring-2 ring-gray-200" : "border-gray-200"
                  }`}
                  onClick={() => handleSelectColor(colorSet.primary, colorSet.secondary)}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full" style={{ backgroundColor: colorSet.primary }} />
                    <span className="text-sm">{colorSet.name}</span>
                  </div>
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
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
                <Label>צבע רקע</Label>
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

            <div className="space-y-4 mt-6">
              <div className="flex items-center justify-between">
                <Label htmlFor="has-border" className="cursor-pointer">
                  הוסף מסגרת
                </Label>
                <Switch id="has-border" checked={hasBorder} onCheckedChange={setHasBorder} />
              </div>

              {hasBorder && (
                <div className="space-y-4 p-4 border rounded-md">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>צבע מסגרת</Label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={borderColor}
                          onChange={(e) => setBorderColor(e.target.value)}
                          className="w-10 h-10 p-1 border rounded cursor-pointer"
                        />
                        <Input
                          value={borderColor}
                          onChange={(e) => setBorderColor(e.target.value)}
                          className="font-mono"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>עובי מסגרת (פיקסלים)</Label>
                      <Input
                        type="number"
                        min="1"
                        max="10"
                        value={borderWidth}
                        onChange={(e) => setBorderWidth(Number.parseInt(e.target.value))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>סגנון מסגרת</Label>
                      <RadioGroup value={borderStyle} onValueChange={setBorderStyle} className="flex gap-3">
                        <div className="flex items-center">
                          <RadioGroupItem value="solid" id="border-solid" />
                          <Label htmlFor="border-solid" className="mr-2 ml-2">
                            רציף
                          </Label>
                        </div>
                        <div className="flex items-center">
                          <RadioGroupItem value="dashed" id="border-dashed" />
                          <Label htmlFor="border-dashed" className="mr-2 ml-2">
                            מקווקו
                          </Label>
                        </div>
                        <div className="flex items-center">
                          <RadioGroupItem value="dotted" id="border-dotted" />
                          <Label htmlFor="border-dotted" className="mr-2 ml-2">
                            נקודות
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="content" className="space-y-6 pt-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="use-fixed-title" className="cursor-pointer">
                כותרת קבועה
              </Label>
              <Switch id="use-fixed-title" checked={useFixedTitle} onCheckedChange={setUseFixedTitle} />
            </div>

            {useFixedTitle && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fixed-title">טקסט הכותרת</Label>
                  <Input
                    id="fixed-title"
                    value={fixedTitle}
                    onChange={(e) => setFixedTitle(e.target.value)}
                    placeholder="הזן כותרת קבועה לתבנית"
                  />{" "}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fixed-subtitle">משפט משנה</Label>
                  <Textarea
                    id="fixed-subtitle"
                    value={fixedSubtitle}
                    onChange={(e) => setFixedSubtitle(e.target.value)}
                    placeholder="הזן משפט משנה קבוע לתבנית"
                    rows={2}
                  />
                </div>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="media" className="space-y-6 pt-4">
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="has-logo" className="cursor-pointer">
                  לוגו
                </Label>
                <Switch id="has-logo" checked={hasLogo} onCheckedChange={setHasLogo} />
              </div>

              {hasLogo && (
                <div className="space-y-4">
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

                  <div>
                    <p className="text-sm font-medium mb-2">או השתמש בלוגו שכבר הועלה</p>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="border rounded-md p-2 cursor-pointer hover:border-purple-500">
                        <div className="aspect-square bg-gray-100 flex items-center justify-center">
                          <span className="text-xs text-gray-500">לוגו 1</span>
                        </div>
                      </div>
                      <div className="border rounded-md p-2 cursor-pointer hover:border-purple-500">
                        <div className="aspect-square bg-gray-100 flex items-center justify-center">
                          <span className="text-xs text-gray-500">לוגו 2</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="has-background-image" className="cursor-pointer">
                  תמונת רקע
                </Label>
                <Switch
                  id="has-background-image"
                  checked={hasBackgroundImage}
                  onCheckedChange={setHasBackgroundImage}
                />
              </div>

              {hasBackgroundImage && (
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center mt-2">
                    <div className="flex flex-col items-center">
                      <ImageIcon className="h-6 w-6 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600">העלה תמונת רקע</p>
                      <p className="text-xs text-gray-500 mt-1">מומלץ תמונה ברזולוציה גבוהה</p>
                      <Button variant="outline" size="sm" className="mt-2">
                        בחר קובץ
                      </Button>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium mb-2">או השתמש בתמונה שכבר הועלתה</p>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="border rounded-md p-2 cursor-pointer hover:border-purple-500">
                        <div className="aspect-video bg-gray-100 flex items-center justify-center">
                          <span className="text-xs text-gray-500">תמונה 1</span>
                        </div>
                      </div>
                      <div className="border rounded-md p-2 cursor-pointer hover:border-purple-500">
                        <div className="aspect-video bg-gray-100 flex items-center justify-center">
                          <span className="text-xs text-gray-500">תמונה 2</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="has-profile-image" className="cursor-pointer">
                  תמונת תדמית
                </Label>
                <Switch id="has-profile-image" checked={hasProfileImage} onCheckedChange={setHasProfileImage} />
              </div>

              {hasProfileImage && (
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center mt-2">
                    <div className="flex flex-col items-center">
                      <UserCircle className="h-6 w-6 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600">העלה תמונת תדמית</p>
                      <p className="text-xs text-gray-500 mt-1">מומלץ תמונה מרובעת</p>
                      <Button variant="outline" size="sm" className="mt-2">
                        בחר קובץ
                      </Button>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium mb-2">או השתמש בתמונה שכבר הועלתה</p>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="border rounded-md p-2 cursor-pointer hover:border-purple-500">
                        <div className="aspect-square bg-gray-100 flex items-center justify-center rounded-full">
                          <span className="text-xs text-gray-500">תדמית 1</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <div className="mt-6">
        <Label className="mb-2 block">תצוגה מקדימה</Label>
        <Card className="overflow-hidden">
          <div
            className={`aspect-[16/9] relative ${hasBorder ? "border" : ""}`}
            style={{
              backgroundColor: secondaryColor,
              borderColor: hasBorder ? borderColor : "transparent",
              borderWidth: hasBorder ? `${borderWidth}px` : 0,
              borderStyle: hasBorder ? borderStyle : "none",
            }}
          >
            {hasLogo && (
              <div className="absolute top-0 right-0 p-4">
                <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                  <span className="text-xs text-gray-500">לוגו</span>
                </div>
              </div>
            )}

            <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
              {hasProfileImage && (
                <div className="w-16 h-16 bg-gray-200 rounded-full mb-3 flex items-center justify-center">
                  <span className="text-xs text-gray-500">תדמית</span>
                </div>
              )}

              <div className="text-center">
                <h4 className="text-lg font-bold mb-2" style={{ color: textColor }}>
                  {useFixedTitle ? fixedTitle : "כותרת לדוגמה"}
                </h4>
                <p className="text-sm mb-3" style={{ color: textColor }}>
                  {useFixedTitle ? fixedSubtitle : "כאן יופיע הטקסט של הפוסט שלך"}
                </p>

                <button className="px-3 py-1.5 rounded-md text-white text-sm" style={{ backgroundColor: primaryColor }}>
                  קרא עוד
                </button>
              </div>
            </div>
          </div>

          <CardContent className="p-4">
            <div className="flex items-center">
              {hasProfileImage && (
                <div className="w-10 h-10 bg-gray-200 rounded-full ml-3 flex items-center justify-center">
                  <span className="text-xs text-gray-500">תדמית</span>
                </div>
              )}
              <div>
                <h4 className="font-medium">שם העסק שלך</h4>
                <p className="text-sm text-gray-500">תיאור קצר</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="flex justify-between mt-6">
        <div className="flex gap-2">
          <Button variant="outline" onClick={onBack || onCancel}>
            ביטול
          </Button>
          <Button variant="outline" onClick={onPreviousQuestion}>
            <ArrowRight className="h-4 w-4 ml-2" />
            חזרה לשאלה הקודמת
          </Button>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={handleSave}
            className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600"
          >
            <Check className="h-4 w-4 ml-2" />
            שמור תבנית
          </Button>
          <Button onClick={onNextQuestion} variant="outline">
            המשך לשאלה הבאה
            <ArrowLeft className="h-4 w-4 mr-2" />
          </Button>
        </div>
      </div>
    </div>
  )
}

