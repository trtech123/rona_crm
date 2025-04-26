"use client"

import { useState } from "react"
import { Owl } from "@/components/owl"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Save, FileText, ImageIcon, PenTool, ArrowLeft, Home, Target, Users, MapPin, Calendar, Edit3, Ruler, BookOpen, Layout, HelpCircle, MessageSquare, Share2, Award, Zap, LinkIcon, X, Phone } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { TemplateGallery } from "@/components/template-gallery"
import { SimplifiedTemplateCreator } from "@/components/simplified-template-creator"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import MediaEditor from "@/components/media-editor" // Updated import
import { Textarea } from "@/components/ui/textarea"
import AIPostCreator from "@/components/ai-post-creator"

function PostCreationForm() {
  const [step, setStep] = useState(1)
  const [progress, setProgress] = useState(25)
  const [socialNetwork, setSocialNetwork] = useState("")
  const [contentGoal, setContentGoal] = useState("")
  const [postType, setPostType] = useState("")
  const [postProblem, setPostProblem] = useState("")
  const [customPostProblem, setCustomPostProblem] = useState("")
  const [useTemplate, setUseTemplate] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [showTemplateGallery, setShowTemplateGallery] = useState(false)
  const [isSimplifiedCreating, setIsSimplifiedCreating] = useState(false)
  const [targetAudience, setTargetAudience] = useState("")
  const [hasSpecificProperty, setHasSpecificProperty] = useState("no")
  const [useExternalArticles, setUseExternalArticles] = useState("no")
  const [externalArticleLink, setExternalArticleLink] = useState("")
  const [writingStyles, setWritingStyles] = useState({
    professional: false,
    friendly: false,
    storytelling: false,
    persuasive: false,
    other: false,
  })
  const [customWritingStyle, setCustomWritingStyle] = useState("")

  // נוסיף משתנה state חדש לניהול קריאה לפעולה
  // הוסף את המשתנים הבאים לאחר הצהרות ה-state הקיימות (בערך בשורה 50)

  const [includeCTA, setIncludeCTA] = useState("no")
  const [ctaType, setCTAType] = useState("")
  const [ctaText, setCTAText] = useState("")
  const [ctaLink, setCTALink] = useState("")
  const [ctaPhone, setCTAPhone] = useState("")
  const [ctaWhatsappMessage, setCTAWhatsappMessage] = useState("")

  const [activeTab, setActiveTab] = useState("post-type")

  const handleNext = () => {
    if (step < 4) {
      // שמירת הטאב הנוכחי לפני המעבר לשלב הבא
      if (step === 1) {
        // שמירת הבחירות מהשאלון המקדים
        console.log("שמירת נתוני השאלון המקדים")
      }

      setStep(step + 1)
      setProgress((step + 1) * 25)

      // איפוס הטאב הפעיל בהתאם לשלב החדש
      if (step + 1 === 2) {
        // אם עוברים לשלב 2, נאפס את הטאב הפעיל לטאב הראשון של שלב 2
        setActiveTab("content-creation")
      } else if (step + 1 === 3) {
        // אם עוברים לשלב 3, נאפס את הטאב הפעיל לטאב הראשון של שלב 3
        setActiveTab("media-creation")
      } else if (step + 1 === 4) {
        // אם עוברים לשלב 4, נאפס את הטאב הפעיל לטאב הראשון של שלב 4
        setActiveTab("final-post")
      }
    }
  }

  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1)
      setProgress(step * 25 - 25)

      // איפוס הטאב הפעיל בהתאם לשלב החדש
      if (step - 1 === 1) {
        // אם חוזרים לשלב 1, נאפס את הטאב הפעיל לטאב הראשון של שלב 1
        setActiveTab("post-type")
      } else if (step - 1 === 2) {
        // אם חוזרים לשלב 2, נאפס את הטאב הפעיל לטאב הראשון של שלב 2
        setActiveTab("content-creation")
      } else if (step - 1 === 3) {
        // אם חוזרים לשלב 3, נאפס את הטאב הפעיל לטאב הראשון של שלב 3
        setActiveTab("media-creation")
      }
    }
  }

  const jumpToStep = (targetStep) => {
    if (targetStep >= 1 && targetStep <= 4) {
      setStep(targetStep)
      setProgress(targetStep * 25)
    }
  }

  const handleSelectTemplate = (template) => {
    setSelectedTemplate(template)
    setShowTemplateGallery(false)
    // חזרה לטאב של תבנית עיצוב אחרי בחירת תבנית
    setActiveTab("template")
  }

  const handleWritingStyleChange = (style) => {
    setWritingStyles((prev) => ({
      ...prev,
      [style]: !prev[style],
    }))
  }

  // הגדרת הצבעים לכרטיסיות
  const cardColors = {
    "post-type": "bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200",
    problem: "bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200",
    "social-network": "bg-gradient-to-br from-green-50 to-emerald-50 border-green-200",
    goals: "bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-200",
    audience: "bg-gradient-to-br from-rose-50 to-red-50 border-rose-200",
    template: "bg-gradient-to-br from-indigo-50 to-violet-50 border-indigo-200",
    property: "bg-gradient-to-br from-cyan-50 to-sky-50 border-cyan-200",
    location: "bg-gradient-to-br from-teal-50 to-emerald-50 border-teal-200",
    holiday: "bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200",
    "writing-style": "bg-gradient-to-br from-fuchsia-50 to-pink-50 border-fuchsia-200",
    length: "bg-gradient-to-br from-blue-50 to-sky-50 border-blue-200",
    articles: "bg-gradient-to-br from-violet-50 to-purple-50 border-violet-200",
    "call-to-action": "bg-gradient-to-br from-pink-50 to-rose-50 border-pink-200",
  }

  // הגדרת האייקונים לכרטיסיות
  const cardIcons = {
    "post-type": <MessageSquare className="h-6 w-6 text-blue-600" />,
    problem: <HelpCircle className="h-6 w-6 text-purple-600" />,
    "social-network": <Share2 className="h-6 w-6 text-green-600" />,
    goals: <Target className="h-6 w-6 text-amber-600" />,
    audience: <Users className="h-6 w-6 text-rose-600" />,
    template: <Layout className="h-6 w-6 text-indigo-600" />,
    property: <Home className="h-6 w-6 text-cyan-600" />,
    location: <MapPin className="h-6 w-6 text-teal-600" />,
    holiday: <Calendar className="h-6 w-6 text-orange-600" />,
    "writing-style": <Edit3 className="h-6 w-6 text-fuchsia-600" />,
    length: <Ruler className="h-6 w-6 text-blue-600" />,
    articles: <BookOpen className="h-6 w-6 text-violet-600" />,
    "call-to-action": <Zap className="h-6 w-6 text-pink-600" />,
  }

  // הגדרת הכותרות לכרטיסיות
  const cardTitles = {
    "post-type": "סוג הפוסט",
    problem: "בעיה או שאלה בפוסט",
    "social-network": "רשת חברתית",
    goals: "מטרות שיווקיות",
    audience: "קהל יעד",
    template: "תבנית עיצוב",
    property: "נכס ספציפי",
    location: "מיקום",
    holiday: "חגים ומועדים",
    "writing-style": "סגנון כתיבה",
    length: "אורך הפוסט",
    articles: "מאמרים ותוכן מקצועי",
    "call-to-action": "קריאה לפעולה",
  }

  // הוסף פונקציה שמייצרת את הקישור המתאים לפי סוג הקריאה לפעולה
  const generateCtaLink = () => {
    if (ctaType === "call" && ctaPhone) {
      return `tel:${ctaPhone.startsWith("+") ? ctaPhone : "+" + ctaPhone}`
    } else if (ctaType === "whatsapp" && ctaPhone) {
      const encodedMessage = encodeURIComponent(ctaWhatsappMessage || "")
      return `https://wa.me/${ctaPhone.replace(/^\+/, "")}?text=${encodedMessage}`
    } else {
      return ctaLink
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between mb-4 bg-white p-4 rounded-xl shadow-sm">
        <div className="flex items-center">
          <div className="relative">
            <Owl size="small" />
            <div className="absolute -bottom-1 -right-1 bg-purple-600 rounded-full p-1">
              <Zap className="h-3 w-3 text-white" />
            </div>
          </div>
          <div className="ml-4">
            <h2 className="text-xl font-semibold">הסוכן האישי שלך</h2>
            <p className="text-sm text-gray-500">כאן לעזור לך ליצור תוכן מעולה</p>
          </div>
        </div>
        <div className="text-sm bg-purple-50 px-4 py-2 rounded-full flex items-center">
          <Award className="h-4 w-4 text-purple-600 mr-2" />
          <span className="font-medium text-purple-800">5</span>
          <span className="text-purple-600 mx-1">פוסטים נותרו מתוך</span>
          <span className="font-medium text-purple-800">10</span>
          <span className="text-purple-600 mr-1">במנוי</span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b mb-6 bg-white rounded-t-xl shadow-sm">
        <div className="flex space-x-1 rtl:space-x-reverse">
          <Button
            variant={step === 1 ? "default" : "ghost"}
            className={`rounded-none border-b-2 ${step === 1 ? "border-purple-500" : "border-transparent"} px-4 py-3 text-sm font-medium transition-all`}
            onClick={() => jumpToStep(1)}
          >
            <FileText className="mr-2 h-4 w-4" />
            שאלון
          </Button>
          <Button
            variant={step === 3 ? "default" : "ghost"}
            className={`rounded-none border-b-2 ${step === 3 ? "border-purple-500" : "border-transparent"} px-4 py-3 text-sm font-medium transition-all`}
            onClick={() => jumpToStep(3)}
          >
            <ImageIcon className="mr-2 h-4 w-4" />
            מדיה
          </Button>
          <Button
            variant={step === 2 ? "default" : "ghost"}
            className={`rounded-none border-b-2 ${step === 2 ? "border-purple-500" : "border-transparent"} px-4 py-3 text-sm font-medium transition-all`}
            onClick={() => jumpToStep(2)}
          >
            <PenTool className="mr-2 h-4 w-4" />
            יצירת תוכן
          </Button>
          <Button
            variant={step === 4 ? "default" : "ghost"}
            className={`rounded-none border-b-2 ${step === 4 ? "border-purple-500" : "border-transparent"} px-4 py-3 text-sm font-medium transition-all`}
            onClick={() => jumpToStep(4)}
          >
            <Save className="mr-2 h-4 w-4" />
            פוסט מוכן
          </Button>
        </div>
      </div>

      <div className="mb-6">
        <Progress
          value={progress}
          className="h-2 bg-gray-100"
          indicatorClassName="bg-gradient-to-r from-purple-500 to-indigo-500"
        />
        <div className="flex justify-between mt-2 text-sm">
          <span className={`${progress >= 25 ? "text-purple-600 font-medium" : "text-gray-500"}`}>שאלון</span>
          <span className={`${progress >= 50 ? "text-purple-600 font-medium" : "text-gray-500"}`}>מדיה</span>
          <span className={`${progress >= 75 ? "text-purple-600 font-medium" : "text-gray-500"}`}>יצירת תוכן</span>
          <span className={`${progress >= 100 ? "text-purple-600 font-medium" : "text-gray-500"}`}>סיום</span>
        </div>
      </div>

      {step === 1 && (
        <div className="space-y-8">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-xl font-semibold mb-6 flex items-center">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-purple-100 text-purple-800 mr-3">
                1
              </span>
              שאלון מקדים - פרטי הפוסט
            </h3>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-3 md:grid-cols-6 mb-6 bg-gray-100 p-1 rounded-lg">
                <TabsTrigger value="post-type" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  סוג הפוסט
                </TabsTrigger>
                <TabsTrigger value="problem" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  בעיה/שאלה
                </TabsTrigger>
                <TabsTrigger
                  value="social-network"
                  className="data-[state=active]:bg-white data-[state=active]:shadow-sm"
                >
                  רשת חברתית
                </TabsTrigger>
                <TabsTrigger value="goals" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  מטרות
                </TabsTrigger>
                <TabsTrigger value="audience" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  קהל יעד
                </TabsTrigger>
                <TabsTrigger value="more" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  עוד...
                </TabsTrigger>
              </TabsList>
              <TabsContent value="post-type" className="mt-0">
                <Card className={`border ${cardColors["post-type"]} shadow-sm`}>
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      {cardIcons["post-type"]}
                      <h4 className="text-lg font-medium mr-2">{cardTitles["post-type"]}</h4>
                    </div>

                    <div className="space-y-2">
                      <p className="text-gray-700 font-medium">איזה סוג פוסט תרצה ליצור?</p>
                      <RadioGroup value={postType} onValueChange={setPostType}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div
                            className={`flex items-center p-4 border rounded-md hover:bg-blue-50 cursor-pointer transition-colors ${postType === "informative" ? "bg-blue-50 border-blue-300 shadow-sm" : "border-gray-200"}`}
                          >
                            <RadioGroupItem value="informative" id="type-informative" className="mr-2" />
                            <Label htmlFor="type-informative" className="flex-1 cursor-pointer">
                              <div className="flex items-center">
                                <div className="bg-blue-100 p-2 rounded-full mr-3">
                                  <FileText className="h-5 w-5 text-blue-600" />
                                </div>
                                <div>
                                  <div className="font-medium">פוסט מידע</div>
                                  <div className="text-xs text-gray-500">שיתוף מידע מקצועי ומועיל</div>
                                </div>
                              </div>
                            </Label>
                          </div>
                          <div
                            className={`flex items-center p-4 border rounded-md hover:bg-green-50 cursor-pointer transition-colors ${postType === "promotional" ? "bg-green-50 border-green-300 shadow-sm" : "border-gray-200"}`}
                          >
                            <RadioGroupItem value="promotional" id="type-promotional" className="mr-2" />
                            <Label htmlFor="type-promotional" className="flex-1 cursor-pointer">
                              <div className="flex items-center">
                                <div className="bg-green-100 p-2 rounded-full mr-3">
                                  <Target className="h-5 w-5 text-green-600" />
                                </div>
                                <div>
                                  <div className="font-medium">פוסט פרסומי</div>
                                  <div className="text-xs text-gray-500">קידום שירותים או נכסים</div>
                                </div>
                              </div>
                            </Label>
                          </div>
                          <div
                            className={`flex items-center p-4 border rounded-md hover:bg-amber-50 cursor-pointer transition-colors ${postType === "story" ? "bg-amber-50 border-amber-300 shadow-sm" : "border-gray-200"}`}
                          >
                            <RadioGroupItem value="story" id="type-story" className="mr-2" />
                            <Label htmlFor="type-story" className="flex-1 cursor-pointer">
                              <div className="flex items-center">
                                <div className="bg-amber-100 p-2 rounded-full mr-3">
                                  <BookOpen className="h-5 w-5 text-amber-600" />
                                </div>
                                <div>
                                  <div className="font-medium">סיפור אישי</div>
                                  <div className="text-xs text-gray-500">שיתוף חוויה או סיפור מקצועי</div>
                                </div>
                              </div>
                            </Label>
                          </div>
                          <div
                            className={`flex items-center p-4 border rounded-md hover:bg-purple-50 cursor-pointer transition-colors ${postType === "question" ? "bg-purple-50 border-purple-300 shadow-sm" : "border-gray-200"}`}
                          >
                            <RadioGroupItem value="question" id="type-question" className="mr-2" />
                            <Label htmlFor="type-question" className="flex-1 cursor-pointer">
                              <div className="flex items-center">
                                <div className="bg-purple-100 p-2 rounded-full mr-3">
                                  <HelpCircle className="h-5 w-5 text-purple-600" />
                                </div>
                                <div>
                                  <div className="font-medium">שאלה לקהילה</div>
                                  <div className="text-xs text-gray-500">שאלה מקצועית או התייעצות</div>
                                </div>
                              </div>
                            </Label>
                          </div>
                        </div>
                      </RadioGroup>
                    </div>

                    <div className="flex justify-end mt-6">
                      <Button
                        onClick={() => setActiveTab("problem")}
                        className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
                      >
                        המשך לשאלה הבאה
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="problem" className="mt-0">
                <Card className={`border ${cardColors["problem"]} shadow-sm`}>
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      {cardIcons["problem"]}
                      <h4 className="text-lg font-medium mr-2">{cardTitles["problem"]}</h4>
                    </div>

                    <div className="space-y-2">
                      <p className="text-gray-700 font-medium">מהי הבעיה או השאלה שהפוסט מתייחס אליה?</p>
                      <RadioGroup value={postProblem} onValueChange={setPostProblem}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div
                            className={`flex items-center p-4 border rounded-md hover:bg-purple-50 cursor-pointer transition-colors ${postProblem === "buying" ? "bg-purple-50 border-purple-300 shadow-sm" : "border-gray-200"}`}
                          >
                            <RadioGroupItem value="buying" id="problem-buying" className="mr-2" />
                            <Label htmlFor="problem-buying" className="flex-1 cursor-pointer">
                              <div className="flex items-center">
                                <div className="bg-purple-100 p-2 rounded-full mr-3">
                                  <Home className="h-5 w-5 text-purple-600" />
                                </div>
                                <div>
                                  <div className="font-medium">קשיים ברכישת דירה</div>
                                  <div className="text-xs text-gray-500">אתגרים בתהליך הרכישה</div>
                                </div>
                              </div>
                            </Label>
                          </div>
                          <div
                            className={`flex items-center p-4 border rounded-md hover:bg-rose-50 cursor-pointer transition-colors ${postProblem === "selling" ? "bg-rose-50 border-rose-300 shadow-sm" : "border-gray-200"}`}
                          >
                            <RadioGroupItem value="selling" id="problem-selling" className="mr-2" />
                            <Label htmlFor="problem-selling" className="flex-1 cursor-pointer">
                              <div className="flex items-center">
                                <div className="bg-rose-100 p-2 rounded-full mr-3">
                                  <Share2 className="h-5 w-5 text-rose-600" />
                                </div>
                                <div>
                                  <div className="font-medium">אתגרים במכירת נכס</div>
                                  <div className="text-xs text-gray-500">קשיים בתהליך המכירה</div>
                                </div>
                              </div>
                            </Label>
                          </div>
                          <div
                            className={`flex items-center p-4 border rounded-md hover:bg-blue-50 cursor-pointer transition-colors ${postProblem === "investment" ? "bg-blue-50 border-blue-300 shadow-sm" : "border-gray-200"}`}
                          >
                            <RadioGroupItem value="investment" id="problem-investment" className="mr-2" />
                            <Label htmlFor="problem-investment" className="flex-1 cursor-pointer">
                              <div className="flex items-center">
                                <div className="bg-blue-100 p-2 rounded-full mr-3">
                                  <Award className="h-5 w-5 text-blue-600" />
                                </div>
                                <div>
                                  <div className="font-medium">השקעות בנדל"ן</div>
                                  <div className="text-xs text-gray-500">שאלות וסוגיות בהשקעה</div>
                                </div>
                              </div>
                            </Label>
                          </div>
                          <div
                            className={`flex items-center p-4 border rounded-md hover:bg-indigo-50 cursor-pointer transition-colors ${postProblem === "other" ? "bg-indigo-50 border-indigo-300 shadow-sm" : "border-gray-200"}`}
                          >
                            <RadioGroupItem value="other" id="problem-other" className="mr-2" />
                            <Label htmlFor="problem-other" className="flex-1 cursor-pointer">
                              <div className="flex items-center">
                                <div className="bg-indigo-100 p-2 rounded-full mr-3">
                                  <Edit3 className="h-5 w-5 text-indigo-600" />
                                </div>
                                <div>
                                  <div className="font-medium">אחר (כתוב בעצמך)</div>
                                  <div className="text-xs text-gray-500">הגדר בעיה מותאמת אישית</div>
                                </div>
                              </div>
                            </Label>
                          </div>
                        </div>
                      </RadioGroup>

                      {postProblem === "other" && (
                        <div className="mt-4 p-4 bg-indigo-50 rounded-lg border border-indigo-100 transition-all">
                          <Label htmlFor="custom-problem" className="text-sm font-medium text-indigo-800 mb-2 block">
                            פרט את הבעיה או השאלה
                          </Label>
                          <Input
                            id="custom-problem"
                            placeholder="פרט את הבעיה או השאלה..."
                            value={customPostProblem}
                            onChange={(e) => setCustomPostProblem(e.target.value)}
                            className="border-indigo-200 focus:border-indigo-400 focus:ring-indigo-300"
                          />
                        </div>
                      )}
                    </div>

                    <div className="flex justify-between mt-6">
                      <Button variant="outline" onClick={() => setActiveTab("post-type")}>
                        חזרה
                      </Button>
                      <Button
                        onClick={() => setActiveTab("social-network")}
                        className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                      >
                        המשך לשאלה הבאה
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="social-network" className="mt-0">
                <Card className={`border ${cardColors["social-network"]} shadow-sm`}>
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      {cardIcons["social-network"]}
                      <h4 className="text-lg font-medium mr-2">{cardTitles["social-network"]}</h4>
                    </div>

                    <div className="space-y-2">
                      <p className="text-gray-700 font-medium">באיזו רשת חברתית תרצה לפרסם את הפוסט?</p>
                      <RadioGroup value={socialNetwork} onValueChange={setSocialNetwork}>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          <div
                            className={`flex items-center p-4 border rounded-md hover:bg-blue-50 cursor-pointer transition-colors ${socialNetwork === "facebook" ? "bg-blue-50 border-blue-300 shadow-sm" : "border-gray-200"}`}
                          >
                            <RadioGroupItem value="facebook" id="network-facebook" className="mr-2" />
                            <Label htmlFor="network-facebook" className="flex-1 cursor-pointer">
                              <div className="flex items-center">
                                <div className="bg-blue-600 p-2 rounded-full mr-3 flex items-center justify-center">
                                  <span className="text-white font-bold text-sm">f</span>
                                </div>
                                <span>פייסבוק</span>
                              </div>
                            </Label>
                          </div>
                          <div
                            className={`flex items-center p-4 border rounded-md hover:bg-pink-50 cursor-pointer transition-colors ${socialNetwork === "instagram" ? "bg-pink-50 border-pink-300 shadow-sm" : "border-gray-200"}`}
                          >
                            <RadioGroupItem value="instagram" id="network-instagram" className="mr-2" />
                            <Label htmlFor="network-instagram" className="flex-1 cursor-pointer">
                              <div className="flex items-center">
                                <div className="bg-gradient-to-tr from-purple-600 via-pink-500 to-orange-400 p-2 rounded-full mr-3">
                                  <ImageIcon className="h-4 w-4 text-white" />
                                </div>
                                <span>אינסטגרם</span>
                              </div>
                            </Label>
                          </div>
                          <div
                            className={`flex items-center p-4 border rounded-md hover:bg-sky-50 cursor-pointer transition-colors ${socialNetwork === "linkedin" ? "bg-sky-50 border-sky-300 shadow-sm" : "border-gray-200"}`}
                          >
                            <RadioGroupItem value="linkedin" id="network-linkedin" className="mr-2" />
                            <Label htmlFor="network-linkedin" className="flex-1 cursor-pointer">
                              <div className="flex items-center">
                                <div className="bg-sky-700 p-2 rounded-full mr-3 flex items-center justify-center">
                                  <span className="text-white font-bold text-sm">in</span>
                                </div>
                                <span>לינקדאין</span>
                              </div>
                            </Label>
                          </div>
                          <div
                            className={`flex items-center p-4 border rounded-md hover:bg-gray-50 cursor-pointer transition-colors ${socialNetwork === "twitter" ? "bg-gray-50 border-gray-300 shadow-sm" : "border-gray-200"}`}
                          >
                            <RadioGroupItem value="twitter" id="network-twitter" className="mr-2" />
                            <Label htmlFor="network-twitter" className="flex-1 cursor-pointer">
                              <div className="flex items-center">
                                <div className="bg-black p-2 rounded-full mr-3">
                                  <span className="text-white font-bold text-sm">X</span>
                                </div>
                                <span>טוויטר / X</span>
                              </div>
                            </Label>
                          </div>
                          <div
                            className={`flex items-center p-4 border rounded-md hover:bg-black/5 cursor-pointer transition-colors ${socialNetwork === "tiktok" ? "bg-black/5 border-gray-300 shadow-sm" : "border-gray-200"}`}
                          >
                            <RadioGroupItem value="tiktok" id="network-tiktok" className="mr-2" />
                            <Label htmlFor="network-tiktok" className="flex-1 cursor-pointer">
                              <div className="flex items-center">
                                <div className="bg-black p-2 rounded-full mr-3">
                                  <span className="text-white text-sm">TT</span>
                                </div>
                                <span>טיקטוק</span>
                              </div>
                            </Label>
                          </div>
                          <div
                            className={`flex items-center p-4 border rounded-md hover:bg-green-50 cursor-pointer transition-colors ${socialNetwork === "whatsapp" ? "bg-green-50 border-green-300 shadow-sm" : "border-gray-200"}`}
                          >
                            <RadioGroupItem value="whatsapp" id="network-whatsapp" className="mr-2" />
                            <Label htmlFor="network-whatsapp" className="flex-1 cursor-pointer">
                              <div className="flex items-center">
                                <div className="bg-green-500 p-2 rounded-full mr-3">
                                  <MessageSquare className="h-4 w-4 text-white" />
                                </div>
                                <span>וואטסאפ</span>
                              </div>
                            </Label>
                          </div>
                        </div>
                      </RadioGroup>
                    </div>

                    <div className="flex justify-between mt-6">
                      <Button variant="outline" onClick={() => setActiveTab("problem")}>
                        חזרה
                      </Button>
                      <Button
                        onClick={() => setActiveTab("goals")}
                        className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                      >
                        המשך לשאלה הבאה
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="goals" className="mt-0">
                <Card className={`border ${cardColors["goals"]} shadow-sm`}>
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      {cardIcons["goals"]}
                      <h4 className="text-lg font-medium mr-2">{cardTitles["goals"]}</h4>
                    </div>

                    <div className="space-y-2">
                      <p className="text-gray-700 font-medium">מה מטרת התוכן שאתה רוצה ליצור?</p>
                      <RadioGroup value={contentGoal} onValueChange={setContentGoal}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div
                            className={`flex items-center p-4 border rounded-md hover:bg-amber-50 cursor-pointer transition-colors ${contentGoal === "new-clients" ? "bg-amber-50 border-amber-300 shadow-sm" : "border-gray-200"}`}
                          >
                            <RadioGroupItem value="new-clients" id="goal-new-clients" className="mr-2" />
                            <Label htmlFor="goal-new-clients" className="flex-1 cursor-pointer">
                              <div className="flex items-center">
                                <div className="bg-amber-100 p-2 rounded-full mr-3">
                                  <Users className="h-5 w-5 text-amber-600" />
                                </div>
                                <div>
                                  <div className="font-medium">למשוך לקוחות חדשים</div>
                                  <div className="text-xs text-gray-500">הרחבת מעגל הלקוחות</div>
                                </div>
                              </div>
                            </Label>
                          </div>
                          <div
                            className={`flex items-center p-4 border rounded-md hover:bg-cyan-50 cursor-pointer transition-colors ${contentGoal === "showcase" ? "bg-cyan-50 border-cyan-300 shadow-sm" : "border-gray-200"}`}
                          >
                            <RadioGroupItem value="showcase" id="goal-showcase" className="mr-2" />
                            <Label htmlFor="goal-showcase" className="flex-1 cursor-pointer">
                              <div className="flex items-center">
                                <div className="bg-cyan-100 p-2 rounded-full mr-3">
                                  <Home className="h-5 w-5 text-cyan-600" />
                                </div>
                                <div>
                                  <div className="font-medium">להציג נכסים למכירה / השכרה</div>
                                  <div className="text-xs text-gray-500">חשיפת נכסים זמינים</div>
                                </div>
                              </div>
                            </Label>
                          </div>
                          <div
                            className={`flex items-center p-4 border rounded-md hover:bg-indigo-50 cursor-pointer transition-colors ${contentGoal === "branding" ? "bg-indigo-50 border-indigo-300 shadow-sm" : "border-gray-200"}`}
                          >
                            <RadioGroupItem value="branding" id="goal-branding" className="mr-2" />
                            <Label htmlFor="goal-branding" className="flex-1 cursor-pointer">
                              <div className="flex items-center">
                                <div className="bg-indigo-100 p-2 rounded-full mr-3">
                                  <Award className="h-5 w-5 text-indigo-600" />
                                </div>
                                <div>
                                  <div className="font-medium">לבנות מותג אישי</div>
                                  <div className="text-xs text-gray-500">חיזוק הנוכחות המקצועית</div>
                                </div>
                              </div>
                            </Label>
                          </div>
                          <div
                            className={`flex items-center p-4 border rounded-md hover:bg-emerald-50 cursor-pointer transition-colors ${contentGoal === "trust" ? "bg-emerald-50 border-emerald-300 shadow-sm" : "border-gray-200"}`}
                          >
                            <RadioGroupItem value="trust" id="goal-trust" className="mr-2" />
                            <Label htmlFor="goal-trust" className="flex-1 cursor-pointer">
                              <div className="flex items-center">
                                <div className="bg-emerald-100 p-2 rounded-full mr-3">
                                  <FileText className="h-5 w-5 text-emerald-600" />
                                </div>
                                <div>
                                  <div className="font-medium">לייצר אמון ומומחיות בתחום</div>
                                  <div className="text-xs text-gray-500">ביסוס מעמד כמומחה</div>
                                </div>
                              </div>
                            </Label>
                          </div>
                          <div
                            className={`flex items-center p-4 border rounded-md hover:bg-violet-50 cursor-pointer transition-colors ${contentGoal === "other" ? "bg-violet-50 border-violet-300 shadow-sm" : "border-gray-200"}`}
                          >
                            <RadioGroupItem value="other" id="goal-other" className="mr-2" />
                            <Label htmlFor="goal-other" className="flex-1 cursor-pointer">
                              <div className="flex items-center">
                                <div className="bg-violet-100 p-2 rounded-full mr-3">
                                  <Edit3 className="h-5 w-5 text-violet-600" />
                                </div>
                                <div>
                                  <div className="font-medium">אחר:</div>
                                  <div className="text-xs text-gray-500">הגדר מטרה מותאמת אישית</div>
                                </div>
                              </div>
                            </Label>
                          </div>
                        </div>
                      </RadioGroup>

                      {contentGoal === "other" && (
                        <div className="mt-4 p-4 bg-violet-50 rounded-lg border border-violet-100 transition-all">
                          <Label htmlFor="custom-goal" className="text-sm font-medium text-violet-800 mb-2 block">
                            פרט את מטרת התוכן
                          </Label>
                          <Input
                            id="custom-goal"
                            placeholder="פרט את מטרת התוכן..."
                            className="border-violet-200 focus:border-violet-400 focus:ring-violet-300"
                          />
                        </div>
                      )}
                    </div>

                    <div className="flex justify-between mt-6">
                      <Button variant="outline" onClick={() => setActiveTab("social-network")}>
                        חזרה
                      </Button>
                      <Button
                        onClick={() => setActiveTab("audience")}
                        className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600"
                      >
                        המשך לשאלה הבאה
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="audience" className="mt-0">
                <Card className={`border ${cardColors["audience"]} shadow-sm`}>
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      {cardIcons["audience"]}
                      <h4 className="text-lg font-medium mr-2">{cardTitles["audience"]}</h4>
                    </div>

                    <div className="space-y-2">
                      <p className="text-gray-700 font-medium">מיהו קהל היעד העיקרי של הפוסט?</p>
                      <RadioGroup value={targetAudience} onValueChange={setTargetAudience}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div
                            className={`flex items-center p-4 border rounded-md hover:bg-rose-50 cursor-pointer transition-colors ${targetAudience === "buyers" ? "bg-rose-50 border-rose-300 shadow-sm" : "border-gray-200"}`}
                          >
                            <RadioGroupItem value="buyers" id="audience-buyers" className="mr-2" />
                            <Label htmlFor="audience-buyers" className="flex-1 cursor-pointer">
                              <div className="flex items-center">
                                <div className="bg-rose-100 p-2 rounded-full mr-3">
                                  <Home className="h-5 w-5 text-rose-600" />
                                </div>
                                <div>
                                  <div className="font-medium">רוכשי דירות</div>
                                  <div className="text-xs text-gray-500">מחפשים לקנות נכס</div>
                                </div>
                              </div>
                            </Label>
                          </div>
                          <div
                            className={`flex items-center p-4 border rounded-md hover:bg-orange-50 cursor-pointer transition-colors ${targetAudience === "sellers" ? "bg-orange-50 border-orange-300 shadow-sm" : "border-gray-200"}`}
                          >
                            <RadioGroupItem value="sellers" id="audience-sellers" className="mr-2" />
                            <Label htmlFor="audience-sellers" className="flex-1 cursor-pointer">
                              <div className="flex items-center">
                                <div className="bg-orange-100 p-2 rounded-full mr-3">
                                  <Share2 className="h-5 w-5 text-orange-600" />
                                </div>
                                <div>
                                  <div className="font-medium">מוכרי נכסים</div>
                                  <div className="text-xs text-gray-500">מעוניינים למכור נכס</div>
                                </div>
                              </div>
                            </Label>
                          </div>
                          <div
                            className={`flex items-center p-4 border rounded-md hover:bg-blue-50 cursor-pointer transition-colors ${targetAudience === "investors" ? "bg-blue-50 border-blue-300 shadow-sm" : "border-gray-200"}`}
                          >
                            <RadioGroupItem value="investors" id="audience-investors" className="mr-2" />
                            <Label htmlFor="audience-investors" className="flex-1 cursor-pointer">
                              <div className="flex items-center">
                                <div className="bg-blue-100 p-2 rounded-full mr-3">
                                  <Award className="h-5 w-5 text-blue-600" />
                                </div>
                                <div>
                                  <div className="font-medium">משקיעים</div>
                                  <div className="text-xs text-gray-500">מחפשים הזדמנויות השקעה</div>
                                </div>
                              </div>
                            </Label>
                          </div>
                          <div
                            className={`flex items-center p-4 border rounded-md hover:bg-teal-50 cursor-pointer transition-colors ${targetAudience === "renters" ? "bg-teal-50 border-teal-300 shadow-sm" : "border-gray-200"}`}
                          >
                            <RadioGroupItem value="renters" id="audience-renters" className="mr-2" />
                            <Label htmlFor="audience-renters" className="flex-1 cursor-pointer">
                              <div className="flex items-center">
                                <div className="bg-teal-100 p-2 rounded-full mr-3">
                                  <Home className="h-5 w-5 text-teal-600" />
                                </div>
                                <div>
                                  <div className="font-medium">שוכרים</div>
                                  <div className="text-xs text-gray-500">מחפשים דירה להשכרה</div>
                                </div>
                              </div>
                            </Label>
                          </div>
                          <div
                            className={`flex items-center p-4 border rounded-md hover:bg-emerald-50 cursor-pointer transition-colors ${targetAudience === "landlords" ? "bg-emerald-50 border-emerald-300 shadow-sm" : "border-gray-200"}`}
                          >
                            <RadioGroupItem value="landlords" id="audience-landlords" className="mr-2" />
                            <Label htmlFor="audience-landlords" className="flex-1 cursor-pointer">
                              <div className="flex items-center">
                                <div className="bg-emerald-100 p-2 rounded-full mr-3">
                                  <Home className="h-5 w-5 text-emerald-600" />
                                </div>
                                <div>
                                  <div className="font-medium">משכירים</div>
                                  <div className="text-xs text-gray-500">בעלי נכסים להשכרה</div>
                                </div>
                              </div>
                            </Label>
                          </div>
                          <div
                            className={`flex items-center p-4 border rounded-md hover:bg-indigo-50 cursor-pointer transition-colors ${targetAudience === "professionals" ? "bg-indigo-50 border-indigo-300 shadow-sm" : "border-gray-200"}`}
                          >
                            <RadioGroupItem value="professionals" id="audience-professionals" className="mr-2" />
                            <Label htmlFor="audience-professionals" className="flex-1 cursor-pointer">
                              <div className="flex items-center">
                                <div className="bg-indigo-100 p-2 rounded-full mr-3">
                                  <Users className="h-5 w-5 text-indigo-600" />
                                </div>
                                <div>
                                  <div className="font-medium">אנשי מקצוע בתחום</div>
                                  <div className="text-xs text-gray-500">מתווכים, יועצים, שמאים</div>
                                </div>
                              </div>
                            </Label>
                          </div>
                        </div>
                      </RadioGroup>
                    </div>

                    <div className="flex justify-between mt-6">
                      <Button variant="outline" onClick={() => setActiveTab("goals")}>
                        חזרה
                      </Button>
                      <Button
                        onClick={() => setActiveTab("more")}
                        className="bg-gradient-to-r from-rose-500 to-red-500 hover:from-rose-600 hover:to-red-600"
                      >
                        המשך לשאלות נוספות
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="more" className="mt-0">
                <Card className="border bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200 shadow-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <Layout className="h-6 w-6 text-purple-600" />
                      <h4 className="text-lg font-medium mr-2">שאלות נוספות</h4>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div
                        className="p-4 border border-indigo-200 rounded-lg bg-white hover:shadow-md transition-all cursor-pointer"
                        onClick={() => setActiveTab("template")}
                      >
                        <div className="flex items-center mb-2">
                          <div className="bg-indigo-100 p-2 rounded-full">
                            <Layout className="h-5 w-5 text-indigo-600" />
                          </div>
                          <h5 className="font-medium mr-2 text-indigo-800">תבנית עיצוב</h5>
                        </div>
                        <p className="text-xs text-gray-500">בחירת תבנית עיצוב לפוסט</p>
                      </div>
                      <div
                        className="p-4 border border-cyan-200 rounded-lg bg-white hover:shadow-md transition-all cursor-pointer"
                        onClick={() => setActiveTab("property")}
                      >
                        <div className="flex items-center mb-2">
                          <div className="bg-cyan-100 p-2 rounded-full">
                            <Home className="h-5 w-5 text-cyan-600" />
                          </div>
                          <h5 className="font-medium mr-2 text-cyan-800">נכס ספציפי</h5>
                        </div>
                        <p className="text-xs text-gray-500">האם הפוסט מתייחס לנכס ספציפי?</p>
                      </div>
                      <div
                        className="p-4 border border-teal-200 rounded-lg bg-white hover:shadow-md transition-all cursor-pointer"
                        onClick={() => setActiveTab("location")}
                      >
                        <div className="flex items-center mb-2">
                          <div className="bg-teal-100 p-2 rounded-full">
                            <MapPin className="h-5 w-5 text-teal-600" />
                          </div>
                          <h5 className="font-medium mr-2 text-teal-800">מיקום</h5>
                        </div>
                        <p className="text-xs text-gray-500">באיזה אזור או עיר מדובר?</p>
                      </div>
                      <div
                        className="p-4 border border-orange-200 rounded-lg bg-white hover:shadow-md transition-all cursor-pointer"
                        onClick={() => setActiveTab("holiday")}
                      >
                        <div className="flex items-center mb-2">
                          <div className="bg-orange-100 p-2 rounded-full">
                            <Calendar className="h-5 w-5 text-orange-600" />
                          </div>
                          <h5 className="font-medium mr-2 text-orange-800">חגים ומועדים</h5>
                        </div>
                        <p className="text-xs text-gray-500">האם הפוסט קשור לחג או מועד מיוחד?</p>
                      </div>
                      <div
                        className="p-4 border border-fuchsia-200 rounded-lg bg-white hover:shadow-md transition-all cursor-pointer"
                        onClick={() => setActiveTab("writing-style")}
                      >
                        <div className="flex items-center mb-2">
                          <div className="bg-fuchsia-100 p-2 rounded-full">
                            <Edit3 className="h-5 w-5 text-fuchsia-600" />
                          </div>
                          <h5 className="font-medium mr-2 text-fuchsia-800">סגנון כתיבה</h5>
                        </div>
                        <p className="text-xs text-gray-500">איזה סגנון כתיבה תעדיף?</p>
                      </div>
                      <div
                        className="p-4 border border-blue-200 rounded-lg bg-white hover:shadow-md transition-all cursor-pointer"
                        onClick={() => setActiveTab("length")}
                      >
                        <div className="flex items-center mb-2">
                          <div className="bg-blue-100 p-2 rounded-full">
                            <Ruler className="h-5 w-5 text-blue-600" />
                          </div>
                          <h5 className="font-medium mr-2 text-blue-800">אורך הפוסט</h5>
                        </div>
                        <p className="text-xs text-gray-500">מה האורך המועדף לפוסט?</p>
                      </div>
                      <div
                        className="p-4 border border-violet-200 rounded-lg bg-white hover:shadow-md transition-all cursor-pointer"
                        onClick={() => setActiveTab("articles")}
                      >
                        <div className="flex items-center mb-2">
                          <div className="bg-violet-100 p-2 rounded-full">
                            <BookOpen className="h-5 w-5 text-violet-600" />
                          </div>
                          <h5 className="font-medium mr-2 text-violet-800">מאמרים ותוכן מקצועי</h5>
                        </div>
                        <p className="text-xs text-gray-500">האם לשלב מידע מקצועי או סטטיסטיקות?</p>
                      </div>
                      // נוסיף טאב חדש לשאלון בחלק ה-"more" (בערך בשורה 500) // הוסף את הקוד הבא לאחר הכרטיסיות הקיימות
                      // בחלק ה-"more"
                      <div
                        className="p-4 border border-pink-200 rounded-lg bg-white hover:shadow-md transition-all cursor-pointer"
                        onClick={() => setActiveTab("call-to-action")}
                      >
                        <div className="flex items-center mb-2">
                          <div className="bg-pink-100 p-2 rounded-full">
                            <Zap className="h-5 w-5 text-pink-600" />
                          </div>
                          <h5 className="font-medium mr-2 text-pink-800">קריאה לפעולה</h5>
                        </div>
                        <p className="text-xs text-gray-500">הוספת כפתור או קריאה לפעולה בפוסט</p>
                      </div>
                    </div>

                    <div className="flex justify-between mt-6">
                      <Button variant="outline" onClick={() => setActiveTab("audience")}>
                        חזרה
                      </Button>
                      <Button
                        onClick={() => {
                          // שמירת כל הנתונים מהשאלון
                          console.log("שמירת כל נתוני השאלון")
                          // מעבר לשלב הבא
                          handleNext()
                        }}
                        className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600"
                      >
                        סיום השאלון והמשך
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="template" className="mt-0">
                <Card className={`border ${cardColors["template"]} shadow-sm`}>
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      {cardIcons["template"]}
                      <h4 className="text-lg font-medium mr-2">{cardTitles["template"]}</h4>
                    </div>

                    <div className="space-y-2">
                      <p className="text-gray-700 font-medium">האם להשתמש בתבנית עיצוב?</p>
                      <div className="flex items-center space-x-4 rtl:space-x-reverse">
                        <RadioGroup
                          value={useTemplate ? "yes" : "no"}
                          onValueChange={(val) => setUseTemplate(val === "yes")}
                          className="flex gap-4"
                        >
                          <div className="flex items-center">
                            <RadioGroupItem value="yes" id="template-yes" />
                            <Label htmlFor="template-yes" className="mr-2 ml-2">
                              כן
                            </Label>
                          </div>
                          <div className="flex items-center">
                            <RadioGroupItem value="no" id="template-no" />
                            <Label htmlFor="template-no" className="mr-2 ml-2">
                              לא
                            </Label>
                          </div>
                        </RadioGroup>
                      </div>
                    </div>

                    {useTemplate && (
                      <div className="mt-3 p-4 border rounded-md bg-indigo-50 border-indigo-100 space-y-4">
                        {selectedTemplate ? (
                          <div className="space-y-4">
                            <div className="space-y-4">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                  <div
                                    className="w-12 h-12 rounded-md mr-3"
                                    style={{ backgroundColor: selectedTemplate.secondaryColor }}
                                  ></div>
                                  <div>
                                    <h4 className="font-medium">{selectedTemplate.name}</h4>
                                    <p className="text-sm text-gray-500">נבחרה תבנית</p>
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  <Button variant="outline" size="sm" onClick={() => setShowTemplateGallery(true)}>
                                    החלף תבנית
                                  </Button>
                                  <Button variant="outline" size="sm" onClick={() => setIsSimplifiedCreating(true)}>
                                    ערוך תבנית
                                  </Button>
                                </div>
                              </div>

                              <div
                                className="aspect-[16/9] relative rounded-md overflow-hidden"
                                style={{ backgroundColor: selectedTemplate.secondaryColor }}
                              >
                                {selectedTemplate.hasLogo && (
                                  <div className="absolute top-0 right-0 p-4">
                                    <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center">
                                      <span className="text-xs text-gray-500">לוגו</span>
                                    </div>
                                  </div>
                                )}

                                <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                                  {selectedTemplate.hasProfileImage && (
                                    <div className="w-12 h-12 bg-gray-200 rounded-full mb-2 flex items-center justify-center">
                                      <span className="text-xs text-gray-500">פרופיל</span>
                                    </div>
                                  )}

                                  <div className="text-center">
                                    <h4 className="font-medium mb-1" style={{ color: selectedTemplate.textColor }}>
                                      {selectedTemplate.useFixedTitle ? selectedTemplate.fixedTitle : "כותרת לדוגמה"}
                                    </h4>
                                    <p className="text-xs" style={{ color: selectedTemplate.textColor }}>
                                      {selectedTemplate.useFixedTitle && selectedTemplate.fixedSubtitle
                                        ? selectedTemplate.fixedSubtitle
                                        : "טקסט לדוגמה"}
                                    </p>

                                    {selectedTemplate.hasButton && (
                                      <button
                                        className="mt-2 px-2 py-1 rounded-md text-white text-xs"
                                        style={{ backgroundColor: selectedTemplate.primaryColor }}
                                      >
                                        {selectedTemplate.buttonText}
                                      </button>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="text-center">
                            <p className="text-gray-700 mb-4">בחר תבנית עיצוב לפוסט שלך</p>
                            <div className="flex flex-col sm:flex-row gap-2 justify-center">
                              <Button onClick={() => setShowTemplateGallery(true)}>בחר מתבניות קיימות</Button>
                              <Button variant="outline" onClick={() => setIsSimplifiedCreating(true)}>
                                צור תבנית חדשה
                              </Button>
                            </div>
                            <p className="text-sm text-gray-500 mt-2">ניתן ליצור עד 3 תבניות</p>
                          </div>
                        )}
                      </div>
                    )}

                    <Dialog open={showTemplateGallery} onOpenChange={setShowTemplateGallery}>
                      <DialogContent className="max-w-5xl">
                        <TemplateGallery
                          onSelectTemplate={handleSelectTemplate}
                          onBack={() => setShowTemplateGallery(false)}
                        />
                      </DialogContent>
                    </Dialog>

                    <Dialog open={isSimplifiedCreating} onOpenChange={setIsSimplifiedCreating}>
                      <DialogContent className="max-w-4xl">
                        <SimplifiedTemplateCreator
                          initialTemplate={selectedTemplate}
                          onSave={(template) => {
                            setSelectedTemplate(template)
                            setIsSimplifiedCreating(false)
                          }}
                          onCancel={() => setIsSimplifiedCreating(false)}
                          onBack={() => setIsSimplifiedCreating(false)}
                        />
                      </DialogContent>
                    </Dialog>

                    <div className="flex justify-between mt-6">
                      <Button variant="outline" onClick={() => setActiveTab("more")}>
                        חזרה
                      </Button>
                      <Button
                        onClick={() => setActiveTab("property")}
                        className="bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600"
                      >
                        המשך לשאלה הבאה
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              {/* המשך הטאבים האחרים... */}
              {/* נכס ספציפי */}
              <TabsContent value="property" className="mt-0">
                <Card className={`border ${cardColors["property"]} shadow-sm`}>
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      {cardIcons["property"]}
                      <h4 className="text-lg font-medium mr-2">{cardTitles["property"]}</h4>
                    </div>

                    <div className="space-y-2">
                      <p className="text-gray-700 font-medium">האם הפוסט מתייחס לנכס ספציפי?</p>
                      <div className="flex items-center space-x-4 rtl:space-x-reverse">
                        <RadioGroup
                          value={hasSpecificProperty}
                          onValueChange={setHasSpecificProperty}
                          className="flex gap-4"
                        >
                          <div className="flex items-center">
                            <RadioGroupItem value="yes" id="property-yes" />
                            <Label htmlFor="property-yes" className="mr-2 ml-2">
                              כן
                            </Label>
                          </div>
                          <div className="flex items-center">
                            <RadioGroupItem value="no" id="property-no" />
                            <Label htmlFor="property-no" className="mr-2 ml-2">
                              לא
                            </Label>
                          </div>
                        </RadioGroup>
                      </div>
                    </div>

                    {hasSpecificProperty === "yes" && (
                      <div className="mt-3 p-4 border rounded-md bg-cyan-50 border-cyan-100 space-y-4">
                        <h5 className="font-medium text-cyan-800">פרטי הנכס</h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="property-type" className="text-cyan-800">
                              סוג הנכס
                            </Label>
                            <select
                              id="property-type"
                              className="w-full h-10 px-3 py-2 border border-cyan-200 rounded-md focus:border-cyan-400 focus:ring-cyan-300"
                            >
                              <option value="">בחר סוג נכס</option>
                              <option value="apartment">דירה</option>
                              <option value="house">בית פרטי</option>
                              <option value="penthouse">פנטהאוז</option>
                              <option value="commercial">נכס מסחרי</option>
                              <option value="land">קרקע</option>
                            </select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="property-rooms" className="text-cyan-800">
                              מספר חדרים
                            </Label>
                            <select
                              id="property-rooms"
                              className="w-full h-10 px-3 py-2 border border-cyan-200 rounded-md focus:border-cyan-400 focus:ring-cyan-300"
                            >
                              <option value="">בחר מספר חדרים</option>
                              <option value="1">1</option>
                              <option value="2">2</option>
                              <option value="3">3</option>
                              <option value="4">4</option>
                              <option value="5">5</option>
                              <option value="6+">6+</option>
                            </select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="property-size" className="text-cyan-800">
                              גודל במ"ר
                            </Label>
                            <Input
                              id="property-size"
                              type="number"
                              placeholder="הזן גודל במ״ר"
                              className="border-cyan-200 focus:border-cyan-400 focus:ring-cyan-300"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="property-price" className="text-cyan-800">
                              מחיר
                            </Label>
                            <Input
                              id="property-price"
                              type="number"
                              placeholder="הזן מחיר"
                              className="border-cyan-200 focus:border-cyan-400 focus:ring-cyan-300"
                            />
                          </div>
                          <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="property-address" className="text-cyan-800">
                              כתובת
                            </Label>
                            <Input
                              id="property-address"
                              placeholder="הזן כתובת מלאה"
                              className="border-cyan-200 focus:border-cyan-400 focus:ring-cyan-300"
                            />
                          </div>
                          <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="property-description" className="text-cyan-800">
                              תיאור הנכס
                            </Label>
                            <textarea
                              id="property-description"
                              rows={3}
                              className="w-full px-3 py-2 border border-cyan-200 rounded-md focus:border-cyan-400 focus:ring-cyan-300"
                              placeholder="תאר את הנכס בקצרה..."
                            ></textarea>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex justify-between mt-6">
                      <Button variant="outline" onClick={() => setActiveTab("template")}>
                        חזרה
                      </Button>
                      <Button
                        onClick={() => setActiveTab("location")}
                        className="bg-gradient-to-r from-cyan-500 to-sky-500 hover:from-cyan-600 hover:to-sky-600"
                      >
                        המשך לשאלה הבאה
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              {/* שאר הטאבים... */}
              <TabsContent value="location" className="mt-0">
                <Card className={`border ${cardColors["location"]} shadow-sm`}>
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      {cardIcons["location"]}
                      <h4 className="text-lg font-medium mr-2">{cardTitles["location"]}</h4>
                    </div>

                    <div className="space-y-2">
                      <p className="text-gray-700 font-medium">באיזה אזור או עיר מדובר?</p>
                      <RadioGroup className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="flex items-center p-4 border rounded-md hover:bg-teal-50 cursor-pointer transition-colors">
                          <RadioGroupItem value="tel-aviv" id="location-tel-aviv" className="mr-2" />
                          <Label htmlFor="location-tel-aviv" className="flex-1 cursor-pointer">
                            <div className="flex items-center">
                              <div className="bg-teal-100 p-2 rounded-full mr-3">
                                <MapPin className="h-5 w-5 text-teal-600" />
                              </div>
                              <div>
                                <div className="font-medium">תל אביב והמרכז</div>
                                <div className="text-xs text-gray-500">אזור גוש דן</div>
                              </div>
                            </div>
                          </Label>
                        </div>
                        <div className="flex items-center p-4 border rounded-md hover:bg-teal-50 cursor-pointer transition-colors">
                          <RadioGroupItem value="jerusalem" id="location-jerusalem" className="mr-2" />
                          <Label htmlFor="location-jerusalem" className="flex-1 cursor-pointer">
                            <div className="flex items-center">
                              <div className="bg-teal-100 p-2 rounded-full mr-3">
                                <MapPin className="h-5 w-5 text-teal-600" />
                              </div>
                              <div>
                                <div className="font-medium">ירושלים והסביבה</div>
                                <div className="text-xs text-gray-500">אזור ירושלים</div>
                              </div>
                            </div>
                          </Label>
                        </div>
                        <div className="flex items-center p-4 border rounded-md hover:bg-teal-50 cursor-pointer transition-colors">
                          <RadioGroupItem value="north" id="location-north" className="mr-2" />
                          <Label htmlFor="location-north" className="flex-1 cursor-pointer">
                            <div className="flex items-center">
                              <div className="bg-teal-100 p-2 rounded-full mr-3">
                                <MapPin className="h-5 w-5 text-teal-600" />
                              </div>
                              <div>
                                <div className="font-medium">צפון הארץ</div>
                                <div className="text-xs text-gray-500">חיפה והצפון</div>
                              </div>
                            </div>
                          </Label>
                        </div>
                        <div className="flex items-center p-4 border rounded-md hover:bg-teal-50 cursor-pointer transition-colors">
                          <RadioGroupItem value="south" id="location-south" className="mr-2" />
                          <Label htmlFor="location-south" className="flex-1 cursor-pointer">
                            <div className="flex items-center">
                              <div className="bg-teal-100 p-2 rounded-full mr-3">
                                <MapPin className="h-5 w-5 text-teal-600" />
                              </div>
                              <div>
                                <div className="font-medium">דרום הארץ</div>
                                <div className="text-xs text-gray-500">באר שבע והדרום</div>
                              </div>
                            </div>
                          </Label>
                        </div>
                        <div className="flex items-center p-4 border rounded-md hover:bg-teal-50 cursor-pointer transition-colors">
                          <RadioGroupItem value="sharon" id="location-sharon" className="mr-2" />
                          <Label htmlFor="location-sharon" className="flex-1 cursor-pointer">
                            <div className="flex items-center">
                              <div className="bg-teal-100 p-2 rounded-full mr-3">
                                <MapPin className="h-5 w-5 text-teal-600" />
                              </div>
                              <div>
                                <div className="font-medium">השרון</div>
                                <div className="text-xs text-gray-500">אזור השרון</div>
                              </div>
                            </div>
                          </Label>
                        </div>
                        <div className="flex items-center p-4 border rounded-md hover:bg-teal-50 cursor-pointer transition-colors">
                          <RadioGroupItem value="other" id="location-other" className="mr-2" />
                          <Label htmlFor="location-other" className="flex-1 cursor-pointer">
                            <div className="flex items-center">
                              <div className="bg-teal-100 p-2 rounded-full mr-3">
                                <Edit3 className="h-5 w-5 text-teal-600" />
                              </div>
                              <div>
                                <div className="font-medium">אחר (הזן מיקום)</div>
                                <div className="text-xs text-gray-500">מיקום מותאם אישית</div>
                              </div>
                            </div>
                          </Label>
                        </div>
                      </RadioGroup>
                      <Input
                        placeholder="הזן את שם העיר או האזור..."
                        className="mt-2 border-teal-200 focus:border-teal-400 focus:ring-teal-300"
                      />
                    </div>

                    <div className="flex justify-between mt-6">
                      <Button variant="outline" onClick={() => setActiveTab("property")}>
                        חזרה
                      </Button>
                      <Button
                        onClick={() => setActiveTab("holiday")}
                        className="bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600"
                      >
                        המשך לשאלה הבאה
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="holiday" className="mt-0">
                <Card className={`border ${cardColors["holiday"]} shadow-sm`}>
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      {cardIcons["holiday"]}
                      <h4 className="text-lg font-medium mr-2">{cardTitles["holiday"]}</h4>
                    </div>

                    <div className="space-y-2">
                      <p className="text-gray-700 font-medium">האם הפוסט קשור לחג או מועד מיוחד?</p>
                      <p className="text-sm text-gray-500 mb-2">הרשימה תתקבל מהמערכת</p>
                      <RadioGroup className="flex flex-col space-y-2">
                        <div className="flex items-center p-4 border rounded-md hover:bg-orange-50 cursor-pointer transition-colors">
                          <RadioGroupItem value="none" id="holiday-none" />
                          <Label htmlFor="holiday-none" className="mr-2 ml-2">
                            <div className="flex items-center">
                              <div className="bg-orange-100 p-2 rounded-full mr-3">
                                <Calendar className="h-5 w-5 text-orange-600" />
                              </div>
                              <span>לא קשור לחג</span>
                            </div>
                          </Label>
                        </div>
                        <div className="flex items-center p-4 border rounded-md hover:bg-orange-50 cursor-pointer transition-colors">
                          <RadioGroupItem value="rosh-hashana" id="holiday-rosh-hashana" />
                          <Label htmlFor="holiday-rosh-hashana" className="mr-2 ml-2">
                            <div className="flex items-center">
                              <div className="bg-orange-100 p-2 rounded-full mr-3">
                                <Calendar className="h-5 w-5 text-orange-600" />
                              </div>
                              <span>ראש השנה</span>
                            </div>
                          </Label>
                        </div>
                        <div className="flex items-center p-4 border rounded-md hover:bg-orange-50 cursor-pointer transition-colors">
                          <RadioGroupItem value="pesach" id="holiday-pesach" />
                          <Label htmlFor="holiday-pesach" className="mr-2 ml-2">
                            <div className="flex items-center">
                              <div className="bg-orange-100 p-2 rounded-full mr-3">
                                <Calendar className="h-5 w-5 text-orange-600" />
                              </div>
                              <span>פסח</span>
                            </div>
                          </Label>
                        </div>
                        <div className="flex items-center p-4 border rounded-md hover:bg-orange-50 cursor-pointer transition-colors">
                          <RadioGroupItem value="sukkot" id="holiday-sukkot" />
                          <Label htmlFor="holiday-sukkot" className="mr-2 ml-2">
                            <div className="flex items-center">
                              <div className="bg-orange-100 p-2 rounded-full mr-3">
                                <Calendar className="h-5 w-5 text-orange-600" />
                              </div>
                              <span>סוכות</span>
                            </div>
                          </Label>
                        </div>
                        <div className="flex items-center p-4 border rounded-md hover:bg-orange-50 cursor-pointer transition-colors">
                          <RadioGroupItem value="other" id="holiday-other" />
                          <Label htmlFor="holiday-other" className="mr-2 ml-2">
                            <div className="flex items-center">
                              <div className="bg-orange-100 p-2 rounded-full mr-3">
                                <Edit3 className="h-5 w-5 text-orange-600" />
                              </div>
                              <span>אחר</span>
                            </div>
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div className="flex justify-between mt-6">
                      <Button variant="outline" onClick={() => setActiveTab("location")}>
                        חזרה
                      </Button>
                      <Button
                        onClick={() => setActiveTab("writing-style")}
                        className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
                      >
                        המשך לשאלה הבאה
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="writing-style" className="mt-0">
                <Card className={`border ${cardColors["writing-style"]} shadow-sm`}>
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      {cardIcons["writing-style"]}
                      <h4 className="text-lg font-medium mr-2">{cardTitles["writing-style"]}</h4>
                    </div>

                    <div className="space-y-2">
                      <p className="text-gray-700 font-medium">איזה סגנון כתיבה תעדיף? (ניתן לבחור מספר אפשרויות)</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="flex items-center p-4 border rounded-md hover:bg-fuchsia-50 cursor-pointer transition-colors">
                          <Checkbox
                            id="style-professional"
                            checked={writingStyles.professional}
                            onCheckedChange={() => handleWritingStyleChange("professional")}
                            className="mr-2"
                          />
                          <Label htmlFor="style-professional" className="flex-1 cursor-pointer">
                            <div className="flex items-center">
                              <div className="bg-fuchsia-100 p-2 rounded-full mr-3">
                                <FileText className="h-5 w-5 text-fuchsia-600" />
                              </div>
                              <div>
                                <div className="font-medium">מקצועי ורשמי</div>
                                <div className="text-xs text-gray-500">סגנון עסקי ומקצועי</div>
                              </div>
                            </div>
                          </Label>
                        </div>
                        <div className="flex items-center p-4 border rounded-md hover:bg-fuchsia-50 cursor-pointer transition-colors">
                          <Checkbox
                            id="style-friendly"
                            checked={writingStyles.friendly}
                            onCheckedChange={() => handleWritingStyleChange("friendly")}
                            className="mr-2"
                          />
                          <Label htmlFor="style-friendly" className="flex-1 cursor-pointer">
                            <div className="flex items-center">
                              <div className="bg-fuchsia-100 p-2 rounded-full mr-3">
                                <MessageSquare className="h-5 w-5 text-fuchsia-600" />
                              </div>
                              <div>
                                <div className="font-medium">ידידותי וקליל</div>
                                <div className="text-xs text-gray-500">סגנון נגיש וחברותי</div>
                              </div>
                            </div>
                          </Label>
                        </div>
                        <div className="flex items-center p-4 border rounded-md hover:bg-fuchsia-50 cursor-pointer transition-colors">
                          <Checkbox
                            id="style-storytelling"
                            checked={writingStyles.storytelling}
                            onCheckedChange={() => handleWritingStyleChange("storytelling")}
                            className="mr-2"
                          />
                          <Label htmlFor="style-storytelling" className="flex-1 cursor-pointer">
                            <div className="flex items-center">
                              <div className="bg-fuchsia-100 p-2 rounded-full mr-3">
                                <BookOpen className="h-5 w-5 text-fuchsia-600" />
                              </div>
                              <div>
                                <div className="font-medium">סיפורי</div>
                                <div className="text-xs text-gray-500">סגנון מספר סיפור</div>
                              </div>
                            </div>
                          </Label>
                        </div>
                        <div className="flex items-center p-4 border rounded-md hover:bg-fuchsia-50 cursor-pointer transition-colors">
                          <Checkbox
                            id="style-persuasive"
                            checked={writingStyles.persuasive}
                            onCheckedChange={() => handleWritingStyleChange("persuasive")}
                            className="mr-2"
                          />
                          <Label htmlFor="style-persuasive" className="flex-1 cursor-pointer">
                            <div className="flex items-center">
                              <div className="bg-fuchsia-100 p-2 rounded-full mr-3">
                                <Target className="h-5 w-5 text-fuchsia-600" />
                              </div>
                              <div>
                                <div className="font-medium">שכנועי</div>
                                <div className="text-xs text-gray-500">סגנון משכנע ומשווק</div>
                              </div>
                            </div>
                          </Label>
                        </div>
                        <div className="flex items-center p-4 border rounded-md hover:bg-fuchsia-50 cursor-pointer transition-colors">
                          <Checkbox
                            id="style-other"
                            checked={writingStyles.other}
                            onCheckedChange={() => handleWritingStyleChange("other")}
                            className="mr-2"
                          />
                          <Label htmlFor="style-other" className="flex-1 cursor-pointer">
                            <div className="flex items-center">
                              <div className="bg-fuchsia-100 p-2 rounded-full mr-3">
                                <Edit3 className="h-5 w-5 text-fuchsia-600" />
                              </div>
                              <div>
                                <div className="font-medium">אחר (פרט)</div>
                                <div className="text-xs text-gray-500">סגנון מותאם אישית</div>
                              </div>
                            </div>
                          </Label>
                        </div>
                      </div>
                      {writingStyles.other && (
                        <div className="mt-4 p-4 bg-fuchsia-50 rounded-lg border border-fuchsia-100 transition-all">
                          <Label
                            htmlFor="custom-writing-style"
                            className="text-sm font-medium text-fuchsia-800 mb-2 block"
                          >
                            פרט את סגנון הכתיבה המבוקש
                          </Label>
                          <Input
                            id="custom-writing-style"
                            placeholder="פרט את סגנון הכתיבה המבוקש..."
                            className="mt-2 border-fuchsia-200 focus:border-fuchsia-400 focus:ring-fuchsia-300"
                            value={customWritingStyle}
                            onChange={(e) => setCustomWritingStyle(e.target.value)}
                          />
                        </div>
                      )}
                    </div>

                    <div className="flex justify-between mt-6">
                      <Button variant="outline" onClick={() => setActiveTab("holiday")}>
                        חזרה
                      </Button>
                      <Button
                        onClick={() => setActiveTab("length")}
                        className="bg-gradient-to-r from-fuchsia-500 to-pink-500 hover:from-fuchsia-600 hover:to-pink-600"
                      >
                        המשך לשאלה הבאה
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="length" className="mt-0">
                <Card className={`border ${cardColors["length"]} shadow-sm`}>
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      {cardIcons["length"]}
                      <h4 className="text-lg font-medium mr-2">{cardTitles["length"]}</h4>
                    </div>

                    <div className="space-y-2">
                      <p className="text-gray-700 font-medium">מה האורך המועדף לפוסט?</p>
                      <RadioGroup className="flex flex-col space-y-2">
                        <div className="flex items-center p-4 border rounded-md hover:bg-blue-50 cursor-pointer transition-colors">
                          <RadioGroupItem value="short" id="length-short" />
                          <Label htmlFor="length-short" className="mr-2 ml-2">
                            <div className="flex items-center">
                              <div className="bg-blue-100 p-2 rounded-full mr-3">
                                <Ruler className="h-5 w-5 text-blue-600" />
                              </div>
                              <div>
                                <div className="font-medium">קצר (עד 100 מילים)</div>
                                <div className="text-xs text-gray-500">מתאים לפוסטים קצרים ותמציתיים</div>
                              </div>
                            </div>
                          </Label>
                        </div>
                        <div className="flex items-center p-4 border rounded-md hover:bg-blue-50 cursor-pointer transition-colors">
                          <RadioGroupItem value="medium" id="length-medium" />
                          <Label htmlFor="length-medium" className="mr-2 ml-2">
                            <div className="flex items-center">
                              <div className="bg-blue-100 p-2 rounded-full mr-3">
                                <Ruler className="h-5 w-5 text-blue-600" />
                              </div>
                              <div>
                                <div className="font-medium">בינוני (100-250 מילים)</div>
                                <div className="text-xs text-gray-500">מתאים לרוב סוגי הפוסטים</div>
                              </div>
                            </div>
                          </Label>
                        </div>
                        <div className="flex items-center p-4 border rounded-md hover:bg-blue-50 cursor-pointer transition-colors">
                          <RadioGroupItem value="long" id="length-long" />
                          <Label htmlFor="length-long" className="mr-2 ml-2">
                            <div className="flex items-center">
                              <div className="bg-blue-100 p-2 rounded-full mr-3">
                                <Ruler className="h-5 w-5 text-blue-600" />
                              </div>
                              <div>
                                <div className="font-medium">ארוך (מעל 250 מילים)</div>
                                <div className="text-xs text-gray-500">מתאים לפוסטים מעמיקים ומפורטים</div>
                              </div>
                            </div>
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div className="flex justify-between mt-6">
                      <Button variant="outline" onClick={() => setActiveTab("writing-style")}>
                        חזרה
                      </Button>
                      <Button
                        onClick={() => setActiveTab("articles")}
                        className="bg-gradient-to-r from-blue-500 to-sky-500 hover:from-blue-600 hover:to-sky-600"
                      >
                        המשך לשאלה הבאה
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="articles" className="mt-0">
                <Card className={`border ${cardColors["articles"]} shadow-sm`}>
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      {cardIcons["articles"]}
                      <h4 className="text-lg font-medium mr-2">{cardTitles["articles"]}</h4>
                    </div>

                    <div className="space-y-2">
                      <p className="text-gray-700 font-medium">האם לשלב מידע מקצועי או סטטיסטיקות?</p>
                      <RadioGroup
                        value={useExternalArticles}
                        onValueChange={setUseExternalArticles}
                        className="flex flex-col space-y-2"
                      >
                        <div className="flex items-center p-4 border rounded-md hover:bg-violet-50 cursor-pointer transition-colors">
                          <RadioGroupItem value="system" id="professional-content-system" />
                          <Label htmlFor="professional-content-system" className="mr-2 ml-2">
                            <div className="flex items-center">
                              <div className="bg-violet-100 p-2 rounded-full mr-3">
                                <BookOpen className="h-5 w-5 text-violet-600" />
                              </div>
                              <div>
                                <div className="font-medium">כן, ממאמרי המערכת</div>
                                <div className="text-xs text-gray-500">שימוש במאמרים מהמערכת</div>
                              </div>
                            </div>
                          </Label>
                        </div>
                        <div className="flex items-center p-4 border rounded-md hover:bg-violet-50 cursor-pointer transition-colors">
                          <RadioGroupItem value="external" id="professional-content-external" />
                          <Label htmlFor="professional-content-external" className="mr-2 ml-2">
                            <div className="flex items-center">
                              <div className="bg-violet-100 p-2 rounded-full mr-3">
                                <LinkIcon className="h-5 w-5 text-violet-600" />
                              </div>
                              <div>
                                <div className="font-medium">כן, ממאמר חיצוני</div>
                                <div className="text-xs text-gray-500">שימוש במאמר מקישור חיצוני</div>
                              </div>
                            </div>
                          </Label>
                        </div>
                        <div className="flex items-center p-4 border rounded-md hover:bg-violet-50 cursor-pointer transition-colors">
                          <RadioGroupItem value="no" id="professional-content-no" />
                          <Label htmlFor="professional-content-no" className="mr-2 ml-2">
                            <div className="flex items-center">
                              <div className="bg-violet-100 p-2 rounded-full mr-3">
                                <X className="h-5 w-5 text-violet-600" />
                              </div>
                              <div>
                                <div className="font-medium">לא</div>
                                <div className="text-xs text-gray-500">ללא שימוש במאמרים חיצוניים</div>
                              </div>
                            </div>
                          </Label>
                        </div>
                      </RadioGroup>

                      {useExternalArticles === "system" && (
                        <div className="mt-4 p-4 bg-violet-50 rounded-lg border border-violet-100 transition-all">
                          <Label className="text-sm font-medium text-violet-800 mb-2 block">בחר מאמר מהמערכת</Label>
                          <select className="w-full h-10 px-3 py-2 border border-violet-200 rounded-md focus:border-violet-400 focus:ring-violet-300">
                            <option value="">בחר מאמר...</option>
                            <option value="article1">מדריך לרכישת דירה ראשונה</option>
                            <option value="article2">איך לבחור משכנתא מתאימה</option>
                            <option value="article3">טיפים למכירת נכס במחיר הטוב ביותר</option>
                            <option value="article4">השקעות נדל"ן - מדריך למתחילים</option>
                          </select>
                          <p className="text-xs text-gray-500 mt-2">בחר מאמר מהמערכת שתרצה להתייחס אליו בפוסט</p>
                        </div>
                      )}

                      {useExternalArticles === "external" && (
                        <div className="mt-4 p-4 bg-violet-50 rounded-lg border border-violet-100 transition-all">
                          <Label
                            htmlFor="article-link"
                            className="flex items-center text-sm font-medium text-violet-800 mb-2"
                          >
                            <LinkIcon className="h-4 w-4 mr-1" />
                            קישור למאמר חיצוני
                          </Label>
                          <Input
                            id="article-link"
                            placeholder="הזן כתובת URL למאמר..."
                            value={externalArticleLink}
                            onChange={(e) => setExternalArticleLink(e.target.value)}
                            className="border-violet-200 focus:border-violet-400 focus:ring-violet-300"
                          />
                          <p className="text-xs text-gray-500 mt-2">
                            הוסף קישור למאמר או מקור מידע שתרצה להתייחס אליו בפוסט
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="flex justify-between mt-6">
                      <Button variant="outline" onClick={() => setActiveTab("length")}>
                        חזרה
                      </Button>
                      <Button
                        onClick={() => {
                          setActiveTab("more")
                          handleNext()
                        }}
                        className="bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600"
                      >
                        סיום השאלון והמשך
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              // נוסיף טאב חדש לשאלון עבור קריאה לפעולה // הוסף את הקוד הבא לאחר הטאב האחרון בשאלון (בערך בשורה 1500, //
              לפני סגירת ה-Tabs)
              <TabsContent value="call-to-action" className="mt-0">
                <Card className={`border bg-gradient-to-br from-pink-50 to-rose-50 border-pink-200 shadow-sm`}>
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <Zap className="h-6 w-6 text-pink-600" />
                      <h4 className="text-lg font-medium mr-2">קריאה לפעולה</h4>
                    </div>

                    <div className="space-y-2">
                      <p className="text-gray-700 font-medium">האם לכלול קריאה לפעולה בפוסט?</p>
                      <RadioGroup value={includeCTA} onValueChange={setIncludeCTA} className="flex gap-4">
                        <div className="flex items-center">
                          <RadioGroupItem value="yes" id="cta-yes" />
                          <Label htmlFor="cta-yes" className="mr-2 ml-2">
                            כן
                          </Label>
                        </div>
                        <div className="flex items-center">
                          <RadioGroupItem value="no" id="cta-no" />
                          <Label htmlFor="cta-no" className="mr-2 ml-2">
                            לא
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>

                    {includeCTA === "yes" && (
                      <div className="mt-4 space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="cta-type">סוג הקריאה לפעולה</Label>
                          <RadioGroup
                            value={ctaType}
                            onValueChange={setCTAType}
                            className="grid grid-cols-1 md:grid-cols-2 gap-3"
                          >
                            <div className="flex items-center p-4 border rounded-md hover:bg-pink-50 cursor-pointer transition-colors">
                              <RadioGroupItem value="contact" id="cta-contact" className="mr-2" />
                              <Label htmlFor="cta-contact" className="flex-1 cursor-pointer">
                                <div className="flex items-center">
                                  <div className="bg-pink-100 p-2 rounded-full mr-3">
                                    <MessageSquare className="h-5 w-5 text-pink-600" />
                                  </div>
                                  <div>
                                    <div className="font-medium">צור קשר</div>
                                    <div className="text-xs text-gray-500">הזמנה ליצירת קשר</div>
                                  </div>
                                </div>
                              </Label>
                            </div>

                            <div className="flex items-center p-4 border rounded-md hover:bg-pink-50 cursor-pointer transition-colors">
                              <RadioGroupItem value="website" id="cta-website" className="mr-2" />
                              <Label htmlFor="cta-website" className="flex-1 cursor-pointer">
                                <div className="flex items-center">
                                  <div className="bg-pink-100 p-2 rounded-full mr-3">
                                    <LinkIcon className="h-5 w-5 text-pink-600" />
                                  </div>
                                  <div>
                                    <div className="font-medium">בקר באתר</div>
                                    <div className="text-xs text-gray-500">הפניה לאתר האינטרנט</div>
                                  </div>
                                </div>
                              </Label>
                            </div>

                            <div className="flex items-center p-4 border rounded-md hover:bg-pink-50 cursor-pointer transition-colors">
                              <RadioGroupItem value="property" id="cta-property" className="mr-2" />
                              <Label htmlFor="cta-property" className="flex-1 cursor-pointer">
                                <div className="flex items-center">
                                  <div className="bg-pink-100 p-2 rounded-full mr-3">
                                    <Home className="h-5 w-5 text-pink-600" />
                                  </div>
                                  <div>
                                    <div className="font-medium">צפה בנכס</div>
                                    <div className="text-xs text-gray-500">הפניה לדף נכס ספציפי</div>
                                  </div>
                                </div>
                              </Label>
                            </div>

                            <div className="flex items-center p-4 border rounded-md hover:bg-pink-50 cursor-pointer transition-colors">
                              <RadioGroupItem value="whatsapp" id="cta-whatsapp" className="mr-2" />
                              <Label htmlFor="cta-whatsapp" className="flex-1 cursor-pointer">
                                <div className="flex items-center">
                                  <div className="bg-pink-100 p-2 rounded-full mr-3">
                                    <MessageSquare className="h-5 w-5 text-pink-600" />
                                  </div>
                                  <div>
                                    <div className="font-medium">שלח הודעת וואטסאפ</div>
                                    <div className="text-xs text-gray-500">פתיחת צ'אט בוואטסאפ</div>
                                  </div>
                                </div>
                              </Label>
                            </div>

                            <div className="flex items-center p-4 border rounded-md hover:bg-pink-50 cursor-pointer transition-colors">
                              <RadioGroupItem value="call" id="cta-call" className="mr-2" />
                              <Label htmlFor="cta-call" className="flex-1 cursor-pointer">
                                <div className="flex items-center">
                                  <div className="bg-pink-100 p-2 rounded-full mr-3">
                                    <Phone className="h-5 w-5 text-pink-600" />
                                  </div>
                                  <div>
                                    <div className="font-medium">התקשר עכשיו</div>
                                    <div className="text-xs text-gray-500">חיוג ישיר למספר טלפון</div>
                                  </div>
                                </div>
                              </Label>
                            </div>

                            <div className="flex items-center p-4 border rounded-md hover:bg-pink-50 cursor-pointer transition-colors">
                              <RadioGroupItem value="custom" id="cta-custom" className="mr-2" />
                              <Label htmlFor="cta-custom" className="flex-1 cursor-pointer">
                                <div className="flex items-center">
                                  <div className="bg-pink-100 p-2 rounded-full mr-3">
                                    <Edit3 className="h-5 w-5 text-pink-600" />
                                  </div>
                                  <div>
                                    <div className="font-medium">מותאם אישית</div>
                                    <div className="text-xs text-gray-500">הגדר טקסט מותאם אישית</div>
                                  </div>
                                </div>
                              </Label>
                            </div>
                          </RadioGroup>
                        </div>

                        {ctaType && (
                          <div className="space-y-4 p-4 bg-white rounded-md border">
                            <div className="space-y-2">
                              <Label htmlFor="cta-text">טקסט הקריאה לפעולה</Label>
                              <Input
                                id="cta-text"
                                value={ctaText}
                                onChange={(e) => setCTAText(e.target.value)}
                                placeholder={
                                  ctaType === "contact"
                                    ? "צור קשר עכשיו"
                                    : ctaType === "website"
                                      ? "בקר באתר שלנו"
                                      : ctaType === "property"
                                        ? "צפה בנכס"
                                        : ctaType === "whatsapp"
                                          ? "שלח הודעת וואטסאפ"
                                          : ctaType === "call"
                                            ? "התקשר עכשיו"
                                            : "הזן טקסט לקריאה לפעולה"
                                }
                                className="border-pink-200 focus:border-pink-400 focus:ring-pink-300"
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
                                  className="border-pink-200 focus:border-pink-400 focus:ring-pink-300"
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
                                    className="border-pink-200 focus:border-pink-400 focus:ring-pink-300"
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
                                    className="border-pink-200 focus:border-pink-400 focus:ring-pink-300"
                                    rows={3}
                                  />
                                  <p className="text-xs text-gray-500 mt-1">
                                    הודעה זו תופיע אוטומטית כאשר המשתמש ילחץ על כפתור הוואטסאפ
                                  </p>
                                </div>
                              </div>
                            )}

                            {ctaType !== "call" && ctaType !== "whatsapp" && (
                              <div className="space-y-2">
                                <Label htmlFor="cta-link">קישור (URL)</Label>
                                <Input
                                  id="cta-link"
                                  value={ctaLink}
                                  onChange={(e) => setCTALink(e.target.value)}
                                  placeholder={
                                    ctaType === "contact"
                                      ? "mailto:your@email.com"
                                      : ctaType === "website"
                                        ? "https://www.yourwebsite.com"
                                        : ctaType === "property"
                                          ? "https://www.yourwebsite.com/property/123"
                                          : "https://"
                                  }
                                  className="border-pink-200 focus:border-pink-400 focus:ring-pink-300"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                  {ctaType === "contact"
                                    ? "הזן כתובת אימייל או קישור לדף יצירת קשר"
                                    : ctaType === "website"
                                      ? "הזן את כתובת האתר המלאה כולל https://"
                                      : ctaType === "property"
                                        ? "הזן קישור לדף הנכס"
                                        : "הזן את הקישור המלא כולל https://"}
                                </p>
                              </div>
                            )}

                            <div className="mt-4 p-4 bg-pink-50 rounded-md border border-pink-100">
                              <h5 className="text-sm font-medium text-pink-800 mb-2">תצוגה מקדימה</h5>
                              <div className="flex justify-center">
                                <Button
                                  className="bg-pink-600 hover:bg-pink-700 text-white"
                                  onClick={(e) => e.preventDefault()}
                                >
                                  {ctaText ||
                                    (ctaType === "contact"
                                      ? "צור קשר עכשיו"
                                      : ctaType === "website"
                                        ? "בקר באתר שלנו"
                                        : ctaType === "property"
                                          ? "צפה בנכס"
                                          : ctaType === "whatsapp"
                                            ? "שלח הודעת וואטסאפ"
                                            : ctaType === "call"
                                              ? "התקשר עכשיו"
                                              : "קריאה לפעולה")}
                                </Button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="flex justify-between mt-6">
                      <Button variant="outline" onClick={() => setActiveTab("more")}>
                        חזרה
                      </Button>
                      <Button
                        onClick={() => setActiveTab("more")}
                        className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600"
                      >
                        המשך
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-8">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-xl font-semibold mb-6 flex items-center">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-purple-100 text-purple-800 mr-3">
                2
              </span>
              יצירת תוכן - פוסט מותאם אישית
            </h3>

            <AIPostCreator 
              initialData={{
                socialNetwork,
                contentGoal,
                postType,
                postProblem,
                targetAudience,
                hasSpecificProperty,
                useTemplate,
                selectedTemplate,
                includeCTA: includeCTA === "yes",
                ctaType,
                ctaText,
                ctaLink,
                ctaPhone,
                ctaWhatsappMessage
              }}
            />
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-8">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-xl font-semibold mb-6 flex items-center">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-purple-100 text-purple-800 mr-3">
                3
              </span>
              יצירת מדיה - תמונות, סרטונים והדמיות
            </h3>

            <MediaEditor />
          </div>
        </div>
      )}

      <div className="flex justify-between mt-8">
        <Button variant="outline" onClick={handlePrevious} disabled={step === 1}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          הקודם
        </Button>
        <Button
          onClick={handleNext}
          disabled={step === 4}
          className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600"
        >
          הבא
        </Button>
      </div>
    </div>
  )
}

// Export the component as default
export default PostCreationForm

