"use client"

import { useState, useEffect } from "react"
import {
  Settings,
  CheckCircle,
  Zap,
  Check,
  MessageSquare,
  Trash2,
  Calendar,
  Send,
  Save,
  ArrowLeft,
  ArrowRight,
  X,
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  Loader2,
  AlertCircle,
  LinkIcon,
  Share,
  Eye,
  Edit,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Owl } from "@/components/owl"

interface AIPostCreatorProps {
  initialData?: any
  onBack?: () => void
  onComplete?: (post: any) => void
}

export function AIPostCreator({ initialData, onBack, onComplete }: AIPostCreatorProps) {
  const [activeTab, setActiveTab] = useState("content")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationProgress, setGenerationProgress] = useState(0)
  const [postTitle, setPostTitle] = useState("")
  const [postContent, setPostContent] = useState("")
  const [postStatus, setPostStatus] = useState<"draft" | "ready" | "approved" | "published">("draft")
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
  const [showDeleteConfirmDialog, setShowDeleteConfirmDialog] = useState(false)
  const [showDuplicateDialog, setShowDuplicateDialog] = useState(false)
  const [remainingPosts, setRemainingPosts] = useState(5)
  const [totalPosts, setTotalPosts] = useState(10)
  const [hasLogo, setHasLogo] = useState(false)
  const [logoImage, setLogoImage] = useState<string | null>(null)
  const [showLogoOptions, setShowLogoOptions] = useState(false)
  const [includeCTA, setIncludeCTA] = useState(false)
  const [ctaText, setCTAText] = useState("צור קשר")
  const [ctaLink, setCTALink] = useState("https://")
  const [aiPrompt, setAiPrompt] = useState("")
  const [aiSuggestions, setAiSuggestions] = useState<{ title: string; content: string }[]>([])
  const [showAiSuggestions, setShowAiSuggestions] = useState(true)
  const [generationAttempts, setGenerationAttempts] = useState(0)
  const [contentType, setContentType] = useState<"post" | "article">("post")
  const [showApprovalDialog, setShowApprovalDialog] = useState(false)
  const [selectedAutomation, setSelectedAutomation] = useState("")
  const [showAutomationDialog, setShowAutomationDialog] = useState(false)
  const [isApproved, setIsApproved] = useState(false)
  const [automationSelected, setAutomationSelected] = useState(false)
  const [showFinalReview, setShowFinalReview] = useState(false)
  const [selectedMedia, setSelectedMedia] = useState<{ type: string; url: string } | null>(null)
  const [videoUploadMode, setVideoUploadMode] = useState<"upload" | "enhance" | null>(null)
  const [uploadedVideo, setUploadedVideo] = useState<string | null>(null)
  const [isEnhancingVideo, setIsEnhancingVideo] = useState(false)
  const [showScheduleDialog, setShowScheduleDialog] = useState(false)
  const [step, setStep] = useState(1)
  const [postCount, setPostCount] = useState(5)
  const [totalPostCount, setTotalPostCount] = useState(10)
  const [showShareLinkDialog, setShowShareLinkDialog] = useState(false)
  const [postLink, setPostLink] = useState("")
  const [linkCopied, setLinkCopied] = useState(false)

  // רשימת אוטומציות לדוגמה
  const automations = [
    { id: "auto1", name: "פרסום יומי בבוקר", description: "פרסום אוטומטי בכל יום בשעה 9:00 בבוקר" },
    { id: "auto2", name: "פרסום שבועי בימי ראשון", description: "פרסום אוטומטי בכל יום ראשון בשעה 10:00 בבוקר" },
    { id: "auto3", name: "פרסום בשעות הערב", description: "פרסום אוטומטי בכל יום בשעה 19:00 בערב" },
    { id: "auto4", name: "פרסום + שליחת ניוזלטר", description: "פרסום ברשתות חברתיות ושליחת ניוזלטר למנויים" },
    {
      id: "auto5",
      name: "פרסום + הודעת וואטסאפ ללקוחות",
      description: "פרסום ברשתות חברתיות ושליחת הודעת וואטסאפ ללקוחות",
    },
  ]

  // יצירת המלצות תוכן אוטומטיות בטעינה
  useEffect(() => {
    if (activeTab === "content" && aiSuggestions.length === 0) {
      generatePostWithAI()
    }
  }, [activeTab])

  // מדמה תהליך יצירת פוסט באמצעות AI
  const generatePostWithAI = () => {
    setIsGenerating(true)
    setGenerationProgress(0)

    // מדמה התקדמות הדרגתית
    const interval = setInterval(() => {
      setGenerationProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 5
      })
    }, 200)

    // מדמה סיום התהליך לאחר 4 שניות
    setTimeout(() => {
      clearInterval(interval)
      setGenerationProgress(100)

      // מדמה תוצאות מה-AI בהתאם לסוג התוכן
      if (contentType === "post") {
        const titles = [
          "הזדמנות נדירה: דירת 4 חדרים במרכז העיר במחיר שלא יחזור!",
          'איך לזהות השקעת נדל"ן מצוינת? המדריך המלא למשקיע המתחיל',
          "5 טיפים שכל מוכר דירה חייב לדעת לפני שמפרסם את הנכס",
        ]

        const contents = [
          "דירת 4 חדרים מרווחת ומוארת במיקום מרכזי, מרחק הליכה מכל מוקדי העניין בעיר. הדירה משופצת ברמה גבוהה, כוללת מטבח מודרני, סלון מרווח ומרפסת שמש. הזדמנות נדירה למשפחות או משקיעים!\n\nיתרונות הנכס:\n• מיקום מרכזי ונגיש\n• משופצת ברמה גבוהה\n• מרפסת שמש מרווחת\n• חניה פרטית\n• מחסן צמוד\n\nלפרטים נוספים וקביעת סיור בנכס, צרו קשר עוד היום!",

          'השקעה בנדל"ן היא אחת הדרכים הבטוחות והיציבות לבנות הון לטווח ארוך. אבל איך מזהים השקעה טובה? הנה המדריך המלא למשקיע המתחיל:\n\n1. מיקום, מיקום, מיקום - זהו הפרמטר החשוב ביותר. חפשו אזורים מתפתחים עם תוכניות פיתוח עתידיות.\n\n2. תשואה - חשבו את התשואה השנתית על ההשקעה. תשואה טובה נעה בין 4%-7%.\n\n3. פוטנציאל השבחה - האם ניתן להשביח את הנכס ולהעלות את ערכו?\n\n4. נגישות לתחבורה ושירותים - נכסים קרובים לתחבורה ציבורית, מוסדות חינוך ומרכזי קניות שומרים על ערכם.\n\n5. בדקו את מצב הנכס - הימנעו מהפתעות יקרות בעתיד.\n\nלייעוץ אישי בנושא השקעות נדל"ן, אשמח לעמוד לרשותכם!',

          "מכירת דירה היא אחת העסקאות הפיננסיות המשמעותיות בחיים. הנה 5 טיפים שיעזרו לכם למקסם את המחיר ולזרז את תהליך המכירה:\n\n1. סטיילינג נכון - השקיעו בסידור וניקיון הדירה לפני צילומים וביקורים.\n\n2. צילום מקצועי - תמונות איכותיות מגדילות משמעותית את כמות הפניות.\n\n3. תמחור נכון - בדקו עסקאות דומות באזור והתייעצו עם מומחה.\n\n4. שיפוצים חכמים - לא כל שיפוץ מחזיר את ההשקעה. התמקדו בשיפוצים שמעלים את ערך הנכס.\n\n5. בחירת איש מקצוע מנוסה - מתווך טוב יכול להביא לכם הצעות טובות יותר.\n\nמעוניינים בהערכת שווי מקצועית לנכס שלכם? צרו קשר עוד היום!",
        ]

        // יצירת מערך של המלצות
        const suggestions = []
        for (let i = 0; i < 3; i++) {
          suggestions.push({
            title: titles[i],
            content: contents[i],
          })
        }

        setAiSuggestions(suggestions)

        // בחירת ברירת מחדל
        setPostTitle(titles[0])
        setPostContent(contents[0])
      } else {
        // תוכן למאמר - ארוך ומפורט יותר
        const articleTitles = [
          'מדריך מקיף להשקעה בנדל"ן בישראל: כל מה שצריך לדעת לפני שמשקיעים',
          "איך לבחור דירה ראשונה? המדריך המלא לרוכשים צעירים",
          'מגמות בשוק הנדל"ן לשנת 2025: לאן פני השוק ומה צפוי למחירי הדירות',
        ]

        const articleContents = [
          `# מדריך מקיף להשקעה בנדל"ן בישראל: כל מה שצריך לדעת לפני שמשקיעים

## מבוא

השקעה בנדל"ן נחשבת לאחת האסטרטגיות היציבות והמניבות ביותר לבניית הון לטווח ארוך. בישראל, שוק הנדל"ן מתאפיין בביקוש גבוה וקבוע, מחסור בקרקעות זמינות לבנייה, וקצב גידול אוכלוסייה מהגבוהים במדינות המפותחות. כל אלה הופכים את ההשקעה בנדל"ן לאטרקטיבית במיוחד, אך גם למורכבת ומאתגרת.`,

          `# איך לבחור דירה ראשונה? המדריך המלא לרוכשים צעירים

## מבוא

רכישת דירה ראשונה היא אחת ההחלטות הפיננסיות המשמעותיות ביותר בחיים. עבור רבים, זהו צעד מרגש אך גם מלחיץ, במיוחד לאור מחירי הדיור הגבוהים בישראל והמורכבות של תהליך הרכישה.`,

          `# מגמות בשוק הנדל"ן לשנת 2025: לאן פני השוק ומה צפוי למחירי הדירות

## מבוא

שוק הנדל"ן בישראל נמצא בתנועה מתמדת, מושפע מגורמים כלכליים, דמוגרפיים, פוליטיים וטכנולוגיים. הבנת המגמות הצפויות בשוק יכולה לסייע למשקיעים, רוכשים, ומוכרים לקבל החלטות מושכלות יותר.`,
        ]

        // יצירת מערך של המלצות
        const suggestions = []
        for (let i = 0; i < 3; i++) {
          suggestions.push({
            title: articleTitles[i],
            content: articleContents[i],
          })
        }

        setAiSuggestions(suggestions)

        // בחירת ברירת מחדל
        setPostTitle(articleTitles[0])
        setPostContent(articleContents[0])
      }

      setIsGenerating(false)
      setGenerationAttempts((prev) => prev + 1)
    }, 4000)
  }

  // בחירת המלצת תוכן
  const selectSuggestion = (index: number) => {
    setPostTitle(aiSuggestions[index].title)
    setPostContent(aiSuggestions[index].content)
  }

  // מדמה אישור פוסט
  const approvePost = () => {
    setIsApproved(true)
    setPostStatus("approved")
    setShowApprovalDialog(false)

    // אם כבר נבחרה אוטומציה, נדלג ישירות לדיאלוג התזמון
    if (automationSelected && selectedAutomation) {
      setShowScheduleDialog(true)
    } else {
      setShowAutomationDialog(true)
    }

    // הורדת מכסת פוסט
    setPostCount((prev) => Math.max(0, prev - 1))
  }

  // מדמה יצירת לינק לשיתוף
  const generateShareLink = () => {
    // בפועל, כאן היינו מייצרים לינק אמיתי לשיתוף
    const mockLink = `https://example.com/posts/${Date.now()}`
    setPostLink(mockLink)
    setShowShareLinkDialog(true)
  }

  // מדמה העתקת לינק
  const copyLinkToClipboard = () => {
    if (postLink) {
      navigator.clipboard.writeText(postLink)
      setLinkCopied(true)

      // איפוס הודעת ההעתקה אחרי 3 שניות
      setTimeout(() => {
        setLinkCopied(false)
      }, 3000)
    }
  }

  const saveDraft = () => {
    // Logic to save the draft
    console.log("Draft saved")
  }

  const deletePost = () => {
    // Logic to delete the post
    console.log("Post deleted")
    setShowDeleteConfirmDialog(false)
  }

  const selectAutomation = (automationId: string) => {
    setSelectedAutomation(automationId)
  }

  const schedulePost = () => {
    // Logic to schedule the post
    console.log("Post scheduled")
    setShowScheduleDialog(false)
    setShowDistributionDialog(true)
    setDistributionStatus("success")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex space-x-1 rtl:space-x-reverse">
            <Button variant="outline" className="rounded-md" onClick={onBack}>
              <ArrowRight className="mr-2 h-4 w-4" />
              שאלון
            </Button>
            <Button
              variant={activeTab === "content" ? "default" : "ghost"}
              className="rounded-md"
              onClick={() => setActiveTab("content")}
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              יצירת תוכן
            </Button>
            <Button
              variant={activeTab === "distribution" ? "default" : "ghost"}
              className="rounded-md"
              onClick={() => setActiveTab("distribution")}
            >
              <Send className="mr-2 h-4 w-4" />
              הפצה
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-sm bg-purple-50 px-3 py-1.5 rounded-full flex items-center mr-2">
            <span className="font-medium text-purple-800">{postCount}</span>
            <span className="text-purple-600 mx-1">פוסטים נותרו מתוך</span>
            <span className="font-medium text-purple-800">{totalPostCount}</span>
          </div>
          <div
            className={`text-sm px-3 py-1.5 rounded-full flex items-center ${
              postStatus === "draft"
                ? "bg-yellow-50 text-yellow-800"
                : postStatus === "approved"
                  ? "bg-green-50 text-green-800"
                  : "bg-gray-500 text-white"
            }`}
          >
            {postStatus === "draft" ? (
              <>
                <Settings className="h-4 w-4 mr-1.5" />
                <span>טיוטה</span>
              </>
            ) : postStatus === "approved" ? (
              <>
                <CheckCircle className="h-4 w-4 mr-1.5" />
                <span>אושר</span>
              </>
            ) : (
              <>
                <Zap className="h-4 w-4 mr-1.5" />
                <span>נוצר</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* תוכן */}
      {activeTab === "content" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Label htmlFor="content-type" className="mr-2">
                סוג תוכן:
              </Label>
              <RadioGroup
                value={contentType}
                onValueChange={(value: "post" | "article") => setContentType(value)}
                className="flex gap-4"
              >
                <div className="flex items-center">
                  <RadioGroupItem value="post" id="content-post" />
                  <Label htmlFor="content-post" className="mr-2 ml-2">
                    פוסט
                  </Label>
                </div>
                <div className="flex items-center">
                  <RadioGroupItem value="article" id="content-article" />
                  <Label htmlFor="content-article" className="mr-2 ml-2">
                    מאמר
                  </Label>
                </div>
              </RadioGroup>
            </div>
            <Button
              variant="outline"
              onClick={generatePostWithAI}
              disabled={isGenerating}
              className="text-purple-600 border-purple-200 hover:bg-purple-50"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  מייצר תוכן... ({generationProgress}%)
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4 mr-2" />
                  צור תוכן חדש
                </>
              )}
            </Button>
          </div>

          {/* המלצות AI אוטומטיות */}
          {showAiSuggestions && aiSuggestions.length > 0 && (
            <Card className="border-purple-200 bg-purple-50 mb-6">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-start">
                  <div className="mr-3 mt-1">
                    <Owl size="small" />
                  </div>
                  <div>
                    <h4 className="font-medium text-purple-800">המלצות תוכן מ-AI</h4>
                    <p className="text-sm text-purple-700 mt-1">בחר אחת מההצעות הבאות או ערוך אותן לפי צרכיך</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h5 className="text-sm font-medium text-purple-800 mb-2">הצעות:</h5>
                    <div className="space-y-2">
                      {aiSuggestions.map((suggestion, index) => (
                        <div
                          key={index}
                          className={`bg-white border rounded-md p-3 cursor-pointer hover:border-purple-400 transition-colors ${
                            postTitle === suggestion.title ? "border-purple-500 shadow-sm" : "border-purple-200"
                          }`}
                          onClick={() => selectSuggestion(index)}
                        >
                          <h6 className="font-medium">{suggestion.title}</h6>
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                            {suggestion.content.substring(0, 150)}...
                          </p>
                          <div className="flex justify-end mt-2">
                            <Button size="sm" variant="ghost" onClick={() => selectSuggestion(index)}>
                              <Check className="h-4 w-4 mr-1" />
                              בחר
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="space-y-4">
            <div>
              <Label htmlFor="post-title">כותרת</Label>
              <Input
                id="post-title"
                className="w-full border rounded-md px-3 py-2"
                placeholder="הזן כותרת..."
                value={postTitle}
                onChange={(e) => setPostTitle(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="post-content">תוכן</Label>
              <Textarea
                id="post-content"
                className="w-full border rounded-md px-3 py-2"
                placeholder="הזן את התוכן..."
                rows={12}
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
              />
            </div>

            <div className="space-y-4 border-t pt-4 mt-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="use-automation" className="cursor-pointer">
                  שימוש באוטומציה
                </Label>
                <Switch id="use-automation" checked={automationSelected} onCheckedChange={setAutomationSelected} />
              </div>

              {automationSelected && (
                <div className="space-y-2 p-4 bg-purple-50 rounded-md border border-purple-100">
                  <Label className="text-sm font-medium text-purple-800 mb-2 block">בחר אוטומציה</Label>
                  <div className="space-y-2">
                    {automations.map((automation) => (
                      <div
                        key={automation.id}
                        className={`p-3 border rounded-md cursor-pointer hover:bg-white transition-colors ${
                          selectedAutomation === automation.id
                            ? "border-purple-500 bg-white shadow-sm"
                            : "border-purple-200"
                        }`}
                        onClick={() => selectAutomation(automation.id)}
                      >
                        <div className="flex items-center">
                          <div className="mr-2">
                            {selectedAutomation === automation.id ? (
                              <div className="w-4 h-4 rounded-full bg-purple-500 flex items-center justify-center">
                                <Check className="h-3 w-3 text-white" />
                              </div>
                            ) : (
                              <div className="w-4 h-4 rounded-full border-2 border-gray-300"></div>
                            )}
                          </div>
                          <div>
                            <h4 className="font-medium text-sm">{automation.name}</h4>
                            <p className="text-xs text-gray-500">{automation.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={saveDraft}>
                <Save className="h-4 w-4 mr-2" />
                שמור כטיוטה
              </Button>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setShowDeleteConfirmDialog(true)}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  מחק
                </Button>
                <Button onClick={() => setActiveTab("distribution")}>
                  המשך להפצה
                  <ArrowLeft className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* הפצה */}
      {activeTab === "distribution" && (
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6 space-y-4">
              <h3 className="text-lg font-semibold">הגדרות הפצה</h3>

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
              חזרה לתוכן
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" onClick={generateShareLink}>
                <Share className="h-4 w-4 mr-2" />
                צור לינק לשיתוף
              </Button>
              <Button variant="outline" onClick={saveDraft}>
                <Save className="h-4 w-4 mr-2" />
                שמור כטיוטה
              </Button>
              <Button
                onClick={() => {
                  setShowApprovalDialog(true)
                  // אם כבר נבחרה אוטומציה, נדלג על דיאלוג בחירת האוטומציה
                  if (automationSelected && selectedAutomation) {
                    setIsApproved(true)
                    setPostStatus("approved")
                  }
                }}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                אשר פוסט
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* דיאלוג אישור פוסט */}
      <Dialog open={showApprovalDialog} onOpenChange={setShowApprovalDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>אישור פוסט</DialogTitle>
            <DialogDescription>האם אתה בטוח שברצונך לאשר את הפוסט?</DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setShowApprovalDialog(false)}>
              <X className="h-4 w-4 mr-2" />
              ביטול
            </Button>
            <Button onClick={approvePost}>
              <CheckCircle className="h-4 w-4 mr-2" />
              אשר פוסט
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* דיאלוג בחירת אוטומציה */}
      <Dialog open={showAutomationDialog} onOpenChange={setShowAutomationDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>בחירת אוטומציה</DialogTitle>
            <DialogDescription>בחר אוטומציה להפעלה לאחר אישור הפוסט</DialogDescription>
          </DialogHeader>
          <div className="space-y-2 my-4">
            {automations.map((automation) => (
              <div
                key={automation.id}
                className={`p-4 border rounded-md cursor-pointer hover:bg-gray-50 transition-colors ${
                  selectedAutomation === automation.id ? "border-purple-500 bg-purple-50" : "border-gray-200"
                }`}
                onClick={() => selectAutomation(automation.id)}
              >
                <div className="flex items-center">
                  <div className="mr-2">
                    {selectedAutomation === automation.id ? (
                      <div className="w-5 h-5 rounded-full bg-purple-500 flex items-center justify-center">
                        <Check className="h-3 w-3 text-white" />
                      </div>
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-gray-300"></div>
                    )}
                  </div>
                  <div>
                    <h4 className="font-medium">{automation.name}</h4>
                    <p className="text-sm text-gray-500">{automation.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAutomationDialog(false)}>
              דלג
            </Button>
            <Button
              onClick={() => {
                setSelectedAutomation(automations[0].id)
                setAutomationSelected(true)
                setShowAutomationDialog(false)
                setShowScheduleDialog(true)
              }}
              disabled={!selectedAutomation}
            >
              המשך
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* דיאלוג תזמון */}
      <Dialog open={showScheduleDialog} onOpenChange={setShowScheduleDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>תזמון הפצה</DialogTitle>
            <DialogDescription>בחר מתי להפיץ את הפוסט</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 my-4">
            <div className="space-y-2">
              <Label htmlFor="schedule-date-dialog">תאריך</Label>
              <Input
                id="schedule-date-dialog"
                type="date"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="schedule-time-dialog">שעה</Label>
              <Input
                id="schedule-time-dialog"
                type="time"
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowScheduleDialog(false)}>
              ביטול
            </Button>
            <Button onClick={schedulePost}>
              <Calendar className="h-4 w-4 mr-2" />
              תזמן הפצה
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* דיאלוג הפצה */}
      <Dialog open={showDistributionDialog} onOpenChange={setShowDistributionDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>הפצת פוסט</DialogTitle>
          </DialogHeader>

          {distributionStatus === "pending" && (
            <div className="flex flex-col items-center py-6">
              <Loader2 className="h-12 w-12 text-purple-600 animate-spin mb-4" />
              <p className="text-center">מפיץ את הפוסט...</p>
            </div>
          )}

          {distributionStatus === "success" && (
            <div className="flex flex-col items-center py-6">
              <div className="bg-green-100 p-3 rounded-full mb-4">
                <CheckCircle className="h-12 w-12 text-green-600" />
              </div>
              <h4 className="text-lg font-medium text-center mb-2">הפוסט הופץ בהצלחה!</h4>
              <p className="text-center text-gray-600 mb-4">
                {showScheduleOptions
                  ? `הפוסט תוזמן לתאריך ${scheduledDate} בשעה ${scheduledTime}`
                  : "הפוסט פורסם ברשתות החברתיות שבחרת"}
              </p>
              <Button
                onClick={() => {
                  setShowDistributionDialog(false)
                  setShowFinalReview(true)
                  if (onComplete) {
                    onComplete({
                      title: postTitle,
                      content: postContent,
                      media: selectedMedia,
                      networks: selectedNetworks,
                      scheduledDate: showScheduleOptions ? `${scheduledDate} ${scheduledTime}` : null,
                      automation: selectedAutomation,
                    })
                  }
                }}
              >
                סיום
              </Button>
            </div>
          )}

          {distributionStatus === "error" && (
            <div className="flex flex-col items-center py-6">
              <div className="bg-red-100 p-3 rounded-full mb-4">
                <AlertCircle className="h-12 w-12 text-red-600" />
              </div>
              <h4 className="text-lg font-medium text-center mb-2">שגיאה בהפצת הפוסט</h4>
              <p className="text-center text-gray-600 mb-4">אירעה שגיאה בעת הפצת הפוסט. אנא נסה שוב מאוחר יותר.</p>
              <Button onClick={() => setShowDistributionDialog(false)}>סגור</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* דיאלוג מחיקה */}
      <Dialog open={showDeleteConfirmDialog} onOpenChange={setShowDeleteConfirmDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>מחיקת פוסט</DialogTitle>
            <DialogDescription>האם אתה בטוח שברצונך למחוק את הפוסט? פעולה זו אינה ניתנת לביטול.</DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setShowDeleteConfirmDialog(false)}>
              ביטול
            </Button>
            <Button variant="destructive" onClick={deletePost}>
              <Trash2 className="h-4 w-4 mr-2" />
              מחק פוסט
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* דיאלוג שיתוף לינק */}
      <Dialog open={showShareLinkDialog} onOpenChange={setShowShareLinkDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>שיתוף פוסט</DialogTitle>
            <DialogDescription>העתק את הלינק כדי לשתף את הפוסט בפלטפורמות אחרות</DialogDescription>
          </DialogHeader>
          <div className="flex items-center space-x-2 rtl:space-x-reverse mt-4">
            <Input value={postLink} readOnly className="flex-1" />
            <Button onClick={copyLinkToClipboard}>
              {linkCopied ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  הועתק
                </>
              ) : (
                <>
                  <LinkIcon className="h-4 w-4 mr-2" />
                  העתק
                </>
              )}
            </Button>
          </div>
          <DialogFooter className="mt-4">
            <Button onClick={() => setShowShareLinkDialog(false)}>סגור</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* דיאלוג סיום ורשימת פוסטים */}
      <Dialog open={showFinalReview} onOpenChange={setShowFinalReview}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>רשימת הפוסטים שלך</DialogTitle>
            <DialogDescription>הפוסט נוצר בהצלחה ונוסף לרשימת הפוסטים שלך</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 my-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                <p className="text-green-800 font-medium">הפוסט נוצר בהצלחה ומוכן להפצה!</p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">רשימת הפוסטים שלך</h3>

              {/* הפוסט החדש */}
              <div className="border border-purple-300 bg-purple-50 rounded-lg p-4 shadow-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">{postTitle}</h4>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">{postContent.substring(0, 100)}...</p>
                    <div className="flex items-center mt-2 text-xs text-gray-500">
                      <Calendar className="h-3 w-3 mr-1" />
                      <span>נוצר היום</span>
                      {showScheduleOptions && (
                        <span className="ml-2">
                          • מתוזמן ל-{scheduledDate} {scheduledTime}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button size="sm" variant="ghost">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* פוסטים קודמים לדוגמה */}
              <div className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">דירת 3 חדרים במרכז העיר</h4>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                      דירה מרווחת במיקום מעולה, קרובה לכל השירותים...
                    </p>
                    <div className="flex items-center mt-2 text-xs text-gray-500">
                      <Calendar className="h-3 w-3 mr-1" />
                      <span>נוצר לפני 3 ימים</span>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button size="sm" variant="ghost">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">טיפים לרכישת דירה ראשונה</h4>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">מדריך מקיף לרוכשי דירה ראשונה...</p>
                    <div className="flex items-center mt-2 text-xs text-gray-500">
                      <Calendar className="h-3 w-3 mr-1" />
                      <span>נוצר לפני שבוע</span>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button size="sm" variant="ghost">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowFinalReview(false)}>
              סגור
            </Button>
            <Button
              onClick={() => {
                setShowFinalReview(false)
                if (onComplete) {
                  onComplete({
                    title: postTitle,
                    content: postContent,
                    media: selectedMedia,
                    networks: selectedNetworks,
                    scheduledDate: showScheduleOptions ? `${scheduledDate} ${scheduledTime}` : null,
                    automation: selectedAutomation,
                  })
                }
              }}
            >
              צור פוסט חדש
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default AIPostCreator

