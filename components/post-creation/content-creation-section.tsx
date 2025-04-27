"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { PostFormData } from "@/types/post"
import { PenTool, Mic, Wand2, MessageSquare, Image as ImageIcon } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useVoiceRecording } from "@/hooks/use-voice-recording"

interface ContentCreationSectionProps {
  formData: PostFormData
  onUpdate: (updates: Partial<PostFormData>) => void
}

export function ContentCreationSection({ formData, onUpdate }: ContentCreationSectionProps) {
  const [activeTab, setActiveTab] = useState("article")
  const [wordCount, setWordCount] = useState(300)
  const [isAIDialogOpen, setIsAIDialogOpen] = useState(false)
  const [aiPrompt, setAiPrompt] = useState("")
  const [aiResponse, setAiResponse] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const { isRecording, transcript, startRecording, stopRecording, error } = useVoiceRecording()

  const handleWordCountChange = (value: number[]) => {
    setWordCount(value[0])
  }

  const handleStyleChange = (style: "professional" | "friendly" | "storytelling" | "persuasive" | "other") => {
    const newStyles = {
      ...formData.writingStyles,
      [style]: !formData.writingStyles[style],
    }
    onUpdate({ writingStyles: newStyles })
  }

  const handleCustomStyleChange = (value: string) => {
    onUpdate({ customWritingStyle: value })
  }

  const handleContentGoalChange = (value: string) => {
    onUpdate({ contentGoal: value })
  }

  const handleTargetAudienceChange = (value: string) => {
    onUpdate({ targetAudience: value })
  }

  const handleUseTemplateChange = (value: boolean) => {
    onUpdate({ useTemplate: value })
  }

  const handleGenerateContent = async () => {
    setIsGenerating(true)
    try {
      // TODO: Implement actual AI content generation
      // For now, we'll use a placeholder response
      setTimeout(() => {
        const generatedContent = "זהו תוכן לדוגמה שנוצר על ידי ה-AI. בפועל, כאן יהיה תוכן אמיתי שנוצר על ידי מודל שפה מתקדם."
        setAiResponse(generatedContent)
        setIsGenerating(false)
      }, 2000)
    } catch (error) {
      console.error("Error generating content:", error)
      setIsGenerating(false)
    }
  }

  const handleApplyContent = () => {
    if (aiResponse) {
      onUpdate({ contentGoal: aiResponse })
      setIsAIDialogOpen(false)
    }
  }

  const handleContentChange = (value: string) => {
    onUpdate({ content: value })
  }

  const handleRecordingToggle = async () => {
    if (isRecording) {
      stopRecording()
    } else {
      await startRecording()
    }
  }

  // Update content when transcript changes
  useEffect(() => {
    if (transcript) {
      onUpdate({ contentGoal: transcript })
    }
  }, [transcript, onUpdate])

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="article">מאמר חדש</TabsTrigger>
          <TabsTrigger value="post">פוסטים</TabsTrigger>
        </TabsList>

        <TabsContent value="article" className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="content-goal">תוכן חופשי</Label>
                  <Textarea
                    id="content-goal"
                    value={formData.contentGoal}
                    onChange={(e) => handleContentGoalChange(e.target.value)}
                    placeholder="הקלד את התוכן שלך כאן..."
                    className="min-h-[200px]"
                  />
                  <div className="flex justify-end mt-2 space-x-2 rtl:space-x-reverse">
                    {error && (
                      <span className="text-sm text-red-500">{error}</span>
                    )}
                    <Button 
                      variant={isRecording ? "destructive" : "outline"} 
                      size="sm" 
                      className="flex items-center"
                      onClick={handleRecordingToggle}
                    >
                      <Mic className={`mr-2 h-4 w-4 ${isRecording ? "animate-pulse" : ""}`} />
                      {isRecording ? "עצור הקלטה" : "הקלטה"}
                    </Button>
                  </div>
                </div>

                <div>
                  <Label>הצעות חכמות למאמרים של AI</Label>
                  <div className="flex space-x-2 rtl:space-x-reverse mt-2">
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => setIsAIDialogOpen(true)}
                    >
                      <Wand2 className="mr-2 h-4 w-4" />
                      קבל הצעות מ-AI
                    </Button>
                  </div>
                </div>

                <div>
                  <Label>הגבלת מילים</Label>
                  <div className="flex items-center space-x-4 rtl:space-x-reverse mt-2">
                    <Slider
                      value={[wordCount]}
                      onValueChange={handleWordCountChange}
                      min={100}
                      max={1000}
                      step={50}
                      className="flex-1"
                    />
                    <span className="text-sm font-medium">{wordCount} מילים</span>
                  </div>
                </div>

                <div>
                  <Label>סגנון כתיבה</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <Checkbox
                        id="style-professional"
                        checked={formData.writingStyles.professional}
                        onCheckedChange={() => handleStyleChange("professional")}
                      />
                      <Label htmlFor="style-professional">מקצועי</Label>
                    </div>
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <Checkbox
                        id="style-friendly"
                        checked={formData.writingStyles.friendly}
                        onCheckedChange={() => handleStyleChange("friendly")}
                      />
                      <Label htmlFor="style-friendly">ידידותי</Label>
                    </div>
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <Checkbox
                        id="style-storytelling"
                        checked={formData.writingStyles.storytelling}
                        onCheckedChange={() => handleStyleChange("storytelling")}
                      />
                      <Label htmlFor="style-storytelling">סיפורי</Label>
                    </div>
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <Checkbox
                        id="style-persuasive"
                        checked={formData.writingStyles.persuasive}
                        onCheckedChange={() => handleStyleChange("persuasive")}
                      />
                      <Label htmlFor="style-persuasive">שכנועי</Label>
                    </div>
                  </div>
                  <Input
                    placeholder="סגנון אחר (נא לפרט)"
                    value={formData.customWritingStyle}
                    onChange={(e) => handleCustomStyleChange(e.target.value)}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label>קהל יעד</Label>
                  <Input
                    placeholder="הגדר את קהל היעד שלך..."
                    value={formData.targetAudience}
                    onChange={(e) => handleTargetAudienceChange(e.target.value)}
                  />
                </div>

                <div>
                  <Label>שימוש בתבנית</Label>
                  <div className="flex items-center space-x-2 rtl:space-x-reverse mt-2">
                    <Checkbox
                      id="use-template"
                      checked={formData.useTemplate}
                      onCheckedChange={(checked) => handleUseTemplateChange(checked as boolean)}
                    />
                    <Label htmlFor="use-template">השתמש בתבנית</Label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="post" className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <Label>טקסט חופשי</Label>
                  <Textarea
                    value={formData.content}
                    onChange={(e) => handleContentChange(e.target.value)}
                    placeholder="הקלד את הטקסט שלך כאן..."
                    className="min-h-[150px] mt-2"
                  />
                  <div className="flex justify-end mt-2">
                    <Button variant="outline" size="sm" className="flex items-center">
                      <Mic className="mr-2 h-4 w-4" />
                      הקלטה
                    </Button>
                  </div>
                </div>

                <div>
                  <Label>דוגמאות של AI</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                    <Card className="p-4 cursor-pointer hover:bg-gray-50" onClick={() => handleContentChange("דוגמה 1: פוסט שיווקי לנכס חדש")}>
                      <p className="text-sm">דוגמה 1: פוסט שיווקי לנכס חדש</p>
                    </Card>
                    <Card className="p-4 cursor-pointer hover:bg-gray-50" onClick={() => handleContentChange("דוגמה 2: עדכון שוק")}>
                      <p className="text-sm">דוגמה 2: עדכון שוק</p>
                    </Card>
                    <Card className="p-4 cursor-pointer hover:bg-gray-50" onClick={() => handleContentChange("דוגמה 3: טיפ נדל\"ן")}>
                      <p className="text-sm">דוגמה 3: טיפ נדל"ן</p>
                    </Card>
                    <Card className="p-4 cursor-pointer hover:bg-gray-50" onClick={() => handleContentChange("דוגמה 4: סיפור לקוח")}>
                      <p className="text-sm">דוגמה 4: סיפור לקוח</p>
                    </Card>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={isAIDialogOpen} onOpenChange={setIsAIDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>שיחה עם AI</DialogTitle>
            <DialogDescription>
              שאל את ה-AI שאלות או בקש עזרה ביצירת תוכן
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="bg-gray-100 p-4 rounded-md min-h-[200px] max-h-[300px] overflow-y-auto">
              {aiResponse ? (
                <p>{aiResponse}</p>
              ) : (
                <p className="text-gray-500">התשובה תופיע כאן...</p>
              )}
            </div>
            <div className="flex space-x-2 rtl:space-x-reverse">
              <Input
                placeholder="הקלד את השאלה או הבקשה שלך..."
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                className="flex-1"
              />
              <Button onClick={handleGenerateContent} disabled={isGenerating}>
                {isGenerating ? "מעבד..." : "שלח"}
              </Button>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAIDialogOpen(false)}>
              סגור
            </Button>
            <Button onClick={handleApplyContent} disabled={!aiResponse}>
              החל תוכן
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 