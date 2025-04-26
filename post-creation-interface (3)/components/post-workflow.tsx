"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Owl } from "@/components/owl"
import {
  Save,
  Trash2,
  Share2,
  Clock,
  CheckCircle,
  Send,
  ImageIcon,
  FileText,
  Sparkles,
  Loader2,
  ArrowLeft,
  ArrowRight,
  Check,
  X,
  AlertCircle,
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
} from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface PostWorkflowProps {
  initialMedia?: any
  onBack?: () => void
  onComplete?: (post: any) => void
}

export function PostWorkflow({ initialMedia, onBack, onComplete }: PostWorkflowProps) {
  const [activeTab, setActiveTab] = useState("content")
  const [isGenerating, setIsGenerating] = useState(false)
  const [showAiSuggestions, setShowAiSuggestions] = useState(false)
  const [postTitle, setPostTitle] = useState("")
  const [postContent, setPostContent] = useState("")
  const [postStatus, setPostStatus] = useState<"draft" | "ready">("draft")
  const [scheduledDate, setScheduledDate] = useState("")
  const [scheduledTime, setScheduledTime] = useState("")
  const [showScheduleOptions, setShowScheduleOptions] = useState(false)
  const [selectedNetworks, setSelectedNetworks] = useState({
    facebook: true,
    instagram: false,
    linkedin: true,
    twitter: false,
  })
  const [showDistributionDialog, setShowDistributionDialog] = useState(false)
  const [distributionStatus, setDistributionStatus] = useState<"pending" | "success" | "error" | null>(null)
  const [drafts, setDrafts] = useState<any[]>([])
  const [showDraftsDialog, setShowDraftsDialog] = useState(false)
  const [showSaveDraftAlert, setShowSaveDraftAlert] = useState(false)

  // AI הצעות תוכן
  const [aiSuggestions, setAiSuggestions] = useState<{
    titles: string[]
    contents: string[]
  }>({
    titles: [],
    contents: [],
  })

  const [includeCTA, setIncludeCTA] = useState(false)
  const [ctaText, setCTAText] = useState("")
  const [ctaLink, setCTALink] = useState("")

  const [ctaType, setCTAType] = useState("link")
  const [ctaPhone, setCTAPhone] = useState("")
  const [ctaWhatsappMessage, setCTAWhatsappMessage] = useState("")

  const generateAiSuggestions = () => {
    setIsGenerating(true)
    // בפועל, כאן היה נשלח API call לקבלת המלצות מ-AI
    setTimeout(() => {
      setAiSuggestions({
        titles: [
          "דירת 4 חדרים מדהימה בלב העיר - הזדמנות שלא תחזור!",
          "הנוף שתמיד חלמתם עליו - דירת יוקרה עם נוף פנורמי לים",
          'בית חלומות במחיר שפוי - הזדמנות נדירה בשוק הנדל"ן',
        ],
        contents: [
          "דירת 4 חדרים מרווחת ומוארת במיקום מרכזי, מרחק הליכה מכל מוקדי העניין בעיר. הדירה משופצת ברמה גבוהה, כוללת מטבח מודרני, סלון מרווח ומרפסת שמש. הזדמנות נדירה למשפחות או משקיעים!",
          "נכס יוקרתי עם נוף עוצר נשימה לים, עיצוב פנים ברמה גבוהה וגימור מושלם. הדירה כוללת 4 חדרים מרווחים, מטבח מאובזר במכשירי חשמל איכותיים, וסלון מרשים עם יציאה למרפסת רחבת ידיים. פנו עוד היום לתיאום ביקור!",
          "בית פרטי מקסים במיקום שקט ונגיש, מתאים למשפחה שמחפשת איכות חיים. הבית כולל 5 חדרים, גינה מטופחת וחניה פרטית. שכונה איכותית עם כל השירותים בקרבת מקום. אל תפספסו - צרו קשר עוד היום!",
        ],
      })
      setIsGenerating(false)
      setShowAiSuggestions(true)
    }, 2000)
  }

  const selectAiSuggestion = (type: "title" | "content", content: string) => {
    if (type === "title") {
      setPostTitle(content)
    } else {
      setPostContent(content)
    }
  }

  const saveDraft = () => {
    if (drafts.length >= 2) {
      setShowSaveDraftAlert(true)
      return
    }

    const newDraft = {
      id: `draft-${Date.now()}`,
      title: postTitle || "טיוטה ללא כותרת",
      content: postContent,
      date: new Date().toISOString(),
      media: initialMedia,
    }

    setDrafts([...drafts, newDraft])
    setPostStatus("draft")
    // הודעת הצלחה
  }

  const loadDraft = (draft: any) => {
    setPostTitle(draft.title)
    setPostContent(draft.content)
    // טעינת מדיה אם יש
    setShowDraftsDialog(false)
  }

  const deleteDraft = (draftId: string) => {
    setDrafts(drafts.filter((draft) => draft.id !== draftId))
  }

  const distributePost = () => {
    setDistributionStatus("pending")
    // בפועל, כאן היה נשלח API call להפצת הפוסט
    setTimeout(() => {
      setDistributionStatus("success")
      // בפועל, כאן היינו מקבלים את תוצאות ההפצה
    }, 3000)
  }

  const finalizePost = () => {
    setPostStatus("ready")
    if (onComplete) {
      // יצירת הקישור המתאים לפי סוג הקריאה לפעולה
      let finalCtaLink = ctaLink
      if (includeCTA) {
        if (ctaType === "call" && ctaPhone) {
          finalCtaLink = `tel:${ctaPhone.startsWith("+") ? ctaPhone : "+" + ctaPhone}`
        } else if (ctaType === "whatsapp" && ctaPhone) {
          const encodedMessage = encodeURIComponent(ctaWhatsappMessage || "")
          finalCtaLink = `https://wa.me/${ctaPhone.replace(/^\+/, "")}?text=${encodedMessage}`
        }
      }

      onComplete({
        title: postTitle,
        content: postContent,
        media: initialMedia,
        networks: selectedNetworks,
        scheduledDate: showScheduleOptions ? `${scheduledDate} ${scheduledTime}` : null,
        cta: includeCTA
          ? {
              type: ctaType,
              text: ctaText,
              link: finalCtaLink,
              phone: ctaPhone,
              whatsappMessage: ctaWhatsappMessage,
            }
          : null,
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">יצירת פוסט</h3>
        <div className="flex items-center gap-2">
          <div
            className={`text-sm px-3 py-1.5 rounded-full flex items-center ${
              postStatus === "draft" ? "bg-yellow-50 text-yellow-800" : "bg-green-50 text-green-800"
            }`}
          >
            {postStatus === "draft" ? (
              <>
                <Clock className="h-4 w-4 mr-1.5" />
                <span>טיוטה</span>
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4 mr-1.5" />
                <span>מוכן להפצה</span>
              </>
            )}
          </div>
        </div>
      </div>

      <Tabs defaultValue="content" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="content" className="flex items-center gap-1.5">
            <FileText className="h-4 w-4" />
            <span>תוכן</span>
          </TabsTrigger>
          <TabsTrigger value="media" className="flex items-center gap-1.5">
            <ImageIcon className="h-4 w-4" />
            <span>מדיה</span>
          </TabsTrigger>
          <TabsTrigger value="distribution" className="flex items-center gap-1.5">
            <Share2 className="h-4 w-4" />
            <span>הפצה</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="space-y-4">
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="post-title">כותרת הפוסט</Label>
                <Input
                  id="post-title"
                  placeholder="הזן כותרת לפוסט..."
                  value={postTitle}
                  onChange={(e) => setPostTitle(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="post-content">תוכן הפוסט</Label>
                <Textarea
                  id="post-content"
                  placeholder="הזן את תוכן הפוסט..."
                  rows={8}
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                />
              </div>

              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={generateAiSuggestions}
                  disabled={isGenerating}
                  className="text-purple-600 border-purple-200 hover:bg-purple-50"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      מייצר הצעות...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      קבל הצעות תוכן מ-AI
                    </>
                  )}
                </Button>

                <div className="flex gap-2">
                  <Button variant="outline" onClick={saveDraft}>
                    <Save className="h-4 w-4 mr-2" />
                    שמור כטיוטה
                  </Button>
                  <Dialog open={showDraftsDialog} onOpenChange={setShowDraftsDialog}>
                    <DialogTrigger asChild>
                      <Button variant="outline">
                        <Clock className="h-4 w-4 mr-2" />
                        טיוטות ({drafts.length}/2)
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <h3 className="text-lg font-semibold mb-4">טיוטות שמורות</h3>
                      {drafts.length === 0 ? (
                        <p className="text-gray-500 text-center py-4">אין טיוטות שמורות</p>
                      ) : (
                        <div className="space-y-3">
                          {drafts.map((draft) => (
                            <div key={draft.id} className="border rounded-md p-3 flex justify-between items-center">
                              <div>
                                <h4 className="font-medium">{draft.title}</h4>
                                <p className="text-xs text-gray-500">
                                  {new Date(draft.date).toLocaleDateString("he-IL")}
                                </p>
                              </div>
                              <div className="flex gap-1">
                                <Button variant="ghost" size="icon" onClick={() => loadDraft(draft)} title="טען טיוטה">
                                  <FileText className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => deleteDraft(draft.id)}
                                  title="מחק טיוטה"
                                  className="text-red-500 hover:text-red-600"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardContent>

            <div className="border-t mt-4 pt-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="include-cta" className="cursor-pointer">
                  הוסף קריאה לפעולה (CTA)
                </Label>
                <Switch id="include-cta" checked={includeCTA} onCheckedChange={setIncludeCTA} />
              </div>

              {includeCTA && (
                <div className="mt-4 space-y-4 p-4 bg-gray-50 rounded-md border">
                  <div className="space-y-2">
                    <Label htmlFor="cta-type">סוג הקריאה לפעולה</Label>
                    <select
                      id="cta-type"
                      value={ctaType}
                      onChange={(e) => setCTAType(e.target.value)}
                      className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:border-blue-400 focus:ring-blue-300"
                    >
                      <option value="link">קישור כללי</option>
                      <option value="call">התקשר עכשיו</option>
                      <option value="whatsapp">שלח הודעת וואטסאפ</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cta-text">טקסט הקריאה לפעולה</Label>
                    <Input
                      id="cta-text"
                      value={ctaText}
                      onChange={(e) => setCTAText(e.target.value)}
                      placeholder={
                        ctaType === "call"
                          ? "התקשר עכשיו"
                          : ctaType === "whatsapp"
                            ? "שלח הודעת וואטסאפ"
                            : "לדוגמה: צור קשר עכשיו"
                      }
                    />
                  </div>

                  {ctaType === "call" && (
                    <div className="space-y-2">
                      <Label htmlFor="cta-phone">מספר טלפון</Label>
                      <Input
                        id="cta-phone"
                        value={ctaPhone}
                        onChange={(e) => setCTAPhone(e.target.value)}
                        placeholder="הזן מספר טלפון (לדוגמה: 0501234567)"
                      />
                      <p className="text-xs text-gray-500 mt-1">מספר הטלפון ישמש ליצירת קישור חיוג ישיר</p>
                    </div>
                  )}

                  {ctaType === "whatsapp" && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="cta-phone-whatsapp">מספר טלפון לוואטסאפ</Label>
                        <Input
                          id="cta-phone-whatsapp"
                          value={ctaPhone}
                          onChange={(e) => setCTAPhone(e.target.value)}
                          placeholder="הזן מספר טלפון (לדוגמה: 972501234567)"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          הזן את מספר הטלפון בפורמט בינלאומי (972 במקום 0 בתחילת המספר)
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="cta-whatsapp-message">הודעה מוכנה לוואטסאפ</Label>
                        <Textarea
                          id="cta-whatsapp-message"
                          value={ctaWhatsappMessage}
                          onChange={(e) => setCTAWhatsappMessage(e.target.value)}
                          placeholder="הזן הודעה שתופיע אוטומטית בוואטסאפ"
                          rows={3}
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          הודעה זו תופיע אוטומטית כאשר המשתמש ילחץ על כפתור הוואטסאפ
                        </p>
                      </div>
                    </div>
                  )}

                  {ctaType === "link" && (
                    <div className="space-y-2">
                      <Label htmlFor="cta-link">קישור (URL)</Label>
                      <Input
                        id="cta-link"
                        value={ctaLink}
                        onChange={(e) => setCTALink(e.target.value)}
                        placeholder="https://example.com"
                      />
                      <p className="text-xs text-gray-500 mt-1">הזן את הקישור המלא כולל https://</p>
                    </div>
                  )}

                  <div className="mt-4 p-4 bg-blue-50 rounded-md border border-blue-100">
                    <h5 className="text-sm font-medium text-blue-800 mb-2">תצוגה מקדימה</h5>
                    <div className="flex justify-center">
                      <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={(e) => e.preventDefault()}>
                        {ctaText ||
                          (ctaType === "call"
                            ? "התקשר עכשיו"
                            : ctaType === "whatsapp"
                              ? "שלח הודעת וואטסאפ"
                              : "קריאה לפעולה")}
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {showAiSuggestions && (
            <Card className="border-purple-200 bg-purple-50">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-start">
                  <div className="mr-3 mt-1">
                    <Owl size="small" />
                  </div>
                  <div>
                    <h4 className="font-medium text-purple-800">הצעות תוכן מ-AI</h4>
                    <p className="text-sm text-purple-700 mt-1">בחר אחת מההצעות הבאות או ערוך אותן לפי צרכיך</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h5 className="text-sm font-medium text-purple-800 mb-2">הצעות לכותרת:</h5>
                    <div className="space-y-2">
                      {aiSuggestions.titles.map((title, index) => (
                        <div
                          key={index}
                          className="bg-white border border-purple-200 rounded-md p-3 cursor-pointer hover:border-purple-400 transition-colors"
                          onClick={() => selectAiSuggestion("title", title)}
                        >
                          <p>{title}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h5 className="text-sm font-medium text-purple-800 mb-2">הצעות לתוכן:</h5>
                    <div className="space-y-2">
                      {aiSuggestions.contents.map((content, index) => (
                        <div
                          key={index}
                          className="bg-white border border-purple-200 rounded-md p-3 cursor-pointer hover:border-purple-400 transition-colors"
                          onClick={() => selectAiSuggestion("content", content)}
                        >
                          <p className="text-sm">{content}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <Button
                  variant="outline"
                  className="w-full border-purple-200 text-purple-700 hover:bg-purple-100"
                  onClick={() => setShowAiSuggestions(false)}
                >
                  סגור הצעות
                </Button>
              </CardContent>
            </Card>
          )}

          {showSaveDraftAlert && (
            <Alert variant="warning">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>הגעת למגבלת הטיוטות</AlertTitle>
              <AlertDescription>ניתן לשמור עד 2 טיוטות. אנא מחק טיוטה קיימת לפני שמירת טיוטה חדשה.</AlertDescription>
              <Button variant="outline" size="sm" className="mt-2" onClick={() => setShowSaveDraftAlert(false)}>
                הבנתי
              </Button>
            </Alert>
          )}
        </TabsContent>

        <TabsContent value="media" className="space-y-4">
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium">תצוגה מקדימה של המדיה</h4>
                <Button variant="outline" size="sm" onClick={onBack}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  חזור לעריכת מדיה
                </Button>
              </div>

              {initialMedia && initialMedia.type === "image" ? (
                <div className="border rounded-md p-2">
                  <img
                    src={initialMedia.url || "/placeholder.svg?height=300&width=500"}
                    alt="תמונת הפוסט"
                    className="w-full max-h-80 object-contain"
                  />
                </div>
              ) : initialMedia && initialMedia.type === "video" ? (
                <div className="border rounded-md p-2">
                  <video
                    src={initialMedia.url || "/placeholder.svg?height=300&width=500"}
                    controls
                    className="w-full max-h-80 object-contain"
                  />
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <div className="flex flex-col items-center">
                    <ImageIcon className="h-10 w-10 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600 mb-2">לא נבחרה מדיה לפוסט</p>
                    <p className="text-xs text-gray-500 mb-4">ניתן ליצור פוסט גם ללא תמונה או סרטון</p>
                    <Button variant="outline" size="sm" onClick={onBack}>
                      הוסף מדיה
                    </Button>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label className="text-sm">הגדרות תצוגה</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between border rounded-md p-3">
                    <Label htmlFor="show-logo" className="cursor-pointer">
                      הצג לוגו
                    </Label>
                    <Switch id="show-logo" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between border rounded-md p-3">
                    <Label htmlFor="show-profile" className="cursor-pointer">
                      הצג תמונת פרופיל
                    </Label>
                    <Switch id="show-profile" defaultChecked />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="distribution" className="space-y-4">
          <Card>
            <CardContent className="p-6 space-y-4">
              <h4 className="font-medium mb-4">הגדרות הפצה</h4>

              <div className="space-y-2">
                <Label className="text-sm">רשתות חברתיות</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div
                    className={`flex flex-col items-center p-4 border rounded-md cursor-pointer transition-colors ${
                      selectedNetworks.facebook ? "bg-blue-50 border-blue-300" : "border-gray-200 hover:bg-gray-50"
                    }`}
                    onClick={() => setSelectedNetworks({ ...selectedNetworks, facebook: !selectedNetworks.facebook })}
                  >
                    <div className="bg-blue-600 text-white p-2 rounded-full mb-2">
                      <Facebook className="h-5 w-5" />
                    </div>
                    <span className="text-sm">פייסבוק</span>
                    {selectedNetworks.facebook && <Check className="h-4 w-4 text-blue-600 mt-2" />}
                  </div>

                  <div
                    className={`flex flex-col items-center p-4 border rounded-md cursor-pointer transition-colors ${
                      selectedNetworks.instagram ? "bg-pink-50 border-pink-300" : "border-gray-200 hover:bg-gray-50"
                    }`}
                    onClick={() => setSelectedNetworks({ ...selectedNetworks, instagram: !selectedNetworks.instagram })}
                  >
                    <div className="bg-gradient-to-tr from-purple-600 via-pink-500 to-orange-400 text-white p-2 rounded-full mb-2">
                      <Instagram className="h-5 w-5" />
                    </div>
                    <span className="text-sm">אינסטגרם</span>
                    {selectedNetworks.instagram && <Check className="h-4 w-4 text-pink-600 mt-2" />}
                  </div>

                  <div
                    className={`flex flex-col items-center p-4 border rounded-md cursor-pointer transition-colors ${
                      selectedNetworks.linkedin ? "bg-blue-50 border-blue-300" : "border-gray-200 hover:bg-gray-50"
                    }`}
                    onClick={() => setSelectedNetworks({ ...selectedNetworks, linkedin: !selectedNetworks.linkedin })}
                  >
                    <div className="bg-blue-700 text-white p-2 rounded-full mb-2">
                      <Linkedin className="h-5 w-5" />
                    </div>
                    <span className="text-sm">לינקדאין</span>
                    {selectedNetworks.linkedin && <Check className="h-4 w-4 text-blue-600 mt-2" />}
                  </div>

                  <div
                    className={`flex flex-col items-center p-4 border rounded-md cursor-pointer transition-colors ${
                      selectedNetworks.twitter ? "bg-blue-50 border-blue-300" : "border-gray-200 hover:bg-gray-50"
                    }`}
                    onClick={() => setSelectedNetworks({ ...selectedNetworks, twitter: !selectedNetworks.twitter })}
                  >
                    <div className="bg-black text-white p-2 rounded-full mb-2">
                      <Twitter className="h-5 w-5" />
                    </div>
                    <span className="text-sm">טוויטר / X</span>
                    {selectedNetworks.twitter && <Check className="h-4 w-4 text-blue-600 mt-2" />}
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="schedule-post" className="cursor-pointer">
                    תזמון פוסט
                  </Label>
                  <Switch id="schedule-post" checked={showScheduleOptions} onCheckedChange={setShowScheduleOptions} />
                </div>

                {showScheduleOptions && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2 p-4 bg-gray-50 rounded-md border">
                    <div className="space-y-2">
                      <Label htmlFor="schedule-date">תאריך</Label>
                      <Input
                        id="schedule-date"
                        type="date"
                        value={scheduledDate}
                        onChange={(e) => setScheduledDate(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="schedule-time">שעה</Label>
                      <Input
                        id="schedule-time"
                        type="time"
                        value={scheduledTime}
                        onChange={(e) => setScheduledTime(e.target.value)}
                      />
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setActiveTab("content")}>
              <ArrowRight className="h-4 w-4 ml-2" />
              חזרה לעריכת תוכן
            </Button>

            <div className="flex gap-2">
              <Button variant="outline" onClick={saveDraft}>
                <Save className="h-4 w-4 mr-2" />
                שמור כטיוטה
              </Button>

              <Dialog open={showDistributionDialog} onOpenChange={setShowDistributionDialog}>
                <DialogTrigger asChild>
                  <Button
                    className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600"
                    onClick={finalizePost}
                    disabled={!postTitle || !postContent}
                  >
                    <Send className="h-4 w-4 mr-2" />
                    {showScheduleOptions ? "תזמן פוסט" : "פרסם עכשיו"}
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">אישור פרסום</h3>

                    {distributionStatus === null && (
                      <>
                        <p>האם אתה בטוח שברצונך לפרסם את הפוסט?</p>
                        <div className="flex justify-end gap-2 mt-4">
                          <Button variant="outline" onClick={() => setShowDistributionDialog(false)}>
                            <X className="h-4 w-4 mr-2" />
                            ביטול
                          </Button>
                          <Button onClick={distributePost}>
                            <Send className="h-4 w-4 mr-2" />
                            {showScheduleOptions ? "תזמן פוסט" : "פרסם עכשיו"}
                          </Button>
                        </div>
                      </>
                    )}

                    {distributionStatus === "pending" && (
                      <div className="flex flex-col items-center py-6">
                        <Loader2 className="h-12 w-12 text-purple-600 animate-spin mb-4" />
                        <p className="text-center">מפרסם את הפוסט...</p>
                      </div>
                    )}

                    {distributionStatus === "success" && (
                      <div className="flex flex-col items-center py-6">
                        <div className="bg-green-100 p-3 rounded-full mb-4">
                          <CheckCircle className="h-12 w-12 text-green-600" />
                        </div>
                        <h4 className="text-lg font-medium text-center mb-2">הפוסט פורסם בהצלחה!</h4>
                        <p className="text-center text-gray-600 mb-4">
                          {showScheduleOptions
                            ? `הפוסט תוזמן לתאריך ${scheduledDate} בשעה ${scheduledTime}`
                            : "הפוסט פורסם ברשתות החברתיות שבחרת"}
                        </p>
                        <Button onClick={() => setShowDistributionDialog(false)}>סגור</Button>
                      </div>
                    )}

                    {distributionStatus === "error" && (
                      <div className="flex flex-col items-center py-6">
                        <div className="bg-red-100 p-3 rounded-full mb-4">
                          <AlertCircle className="h-12 w-12 text-red-600" />
                        </div>
                        <h4 className="text-lg font-medium text-center mb-2">שגיאה בפרסום הפוסט</h4>
                        <p className="text-center text-gray-600 mb-4">
                          אירעה שגיאה בעת פרסום הפוסט. אנא נסה שוב מאוחר יותר.
                        </p>
                        <Button onClick={() => setShowDistributionDialog(false)}>סגור</Button>
                      </div>
                    )}
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

