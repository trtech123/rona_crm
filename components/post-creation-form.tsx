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
// import { TemplateGallery } from "@/components/template-gallery"
// import { SimplifiedTemplateCreator } from "@/components/simplified-template-creator"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
// import MediaEditor from "@/components/media-editor"
import { Textarea } from "@/components/ui/textarea"
import AIPostCreator from "@/components/ai-post-creator"

// --- Select Component Definition --- START --- Moved Above
import * as SelectPrimitive from "@radix-ui/react-select"
import * as React from "react"
import { Check, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

const Select = SelectPrimitive.Root
const SelectGroup = SelectPrimitive.Group
const SelectValue = SelectPrimitive.Value

const SelectTrigger = React.forwardRef<React.ElementRef<typeof SelectPrimitive.Trigger>, React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>>(
  ({ className, children, ...props }, ref) => (
    <SelectPrimitive.Trigger
      ref={ref}
      className={cn(
        "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDown className="h-4 w-4 opacity-50" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  ),
)
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName

const SelectContent = React.forwardRef<React.ElementRef<typeof SelectPrimitive.Content>, React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>>(
  ({ className, children, position = "popper", ...props }, ref) => (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        ref={ref}
        className={cn(
          "relative z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
          position === "popper" &&
          "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
          className,
        )}
        position={position}
        {...props}
      >
        <SelectPrimitive.Viewport
          className={cn(
            "p-1",
            position === "popper" &&
            "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]",
          )}
        >
          {children}
        </SelectPrimitive.Viewport>
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  ),
)
SelectContent.displayName = SelectPrimitive.Content.displayName

const SelectLabel = React.forwardRef<React.ElementRef<typeof SelectPrimitive.Label>, React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>>(
  ({ className, ...props }, ref) => (
    <SelectPrimitive.Label ref={ref} className={cn("py-1.5 pl-8 pr-2 text-sm font-semibold", className)} {...props} />
  ),
)
SelectLabel.displayName = SelectPrimitive.Label.displayName

const SelectItem = React.forwardRef<React.ElementRef<typeof SelectPrimitive.Item>, React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>>(
  ({ className, children, ...props }, ref) => (
    <SelectPrimitive.Item
      ref={ref}
      className={cn(
        "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        className,
      )}
      {...props}
    >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        <SelectPrimitive.ItemIndicator>
          <Check className="h-4 w-4" />
        </SelectPrimitive.ItemIndicator>
      </span>

      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  ),
)
SelectItem.displayName = SelectPrimitive.Item.displayName

const SelectSeparator = React.forwardRef<React.ElementRef<typeof SelectPrimitive.Separator>, React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>>(
  ({ className, ...props }, ref) => (
    <SelectPrimitive.Separator ref={ref} className={cn("-mx-1 my-1 h-px bg-muted", className)} {...props} />
  ),
)
SelectSeparator.displayName = SelectPrimitive.Separator.displayName
// --- Select Component Definition --- END ---

// Define the type for writing styles keys explicitly
type WritingStyleKey = 'professional' | 'friendly' | 'storytelling' | 'persuasive' | 'other';

function PostCreationForm() {
  const [step, setStep] = useState(1)
  const [progress, setProgress] = useState(25)
  const [socialNetwork, setSocialNetwork] = useState("")
  const [contentGoal, setContentGoal] = useState("")
  const [postType, setPostType] = useState("")
  const [postProblem, setPostProblem] = useState("")
  const [customPostProblem, setCustomPostProblem] = useState("")
  const [useTemplate, setUseTemplate] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<any | null>(null) // Added type annotation
  const [showTemplateGallery, setShowTemplateGallery] = useState(false)
  const [isSimplifiedCreating, setIsSimplifiedCreating] = useState(false)
  const [targetAudience, setTargetAudience] = useState("")
  const [hasSpecificProperty, setHasSpecificProperty] = useState("no")
  const [useExternalArticles, setUseExternalArticles] = useState("no")
  const [externalArticleLink, setExternalArticleLink] = useState("")
  const [writingStyles, setWritingStyles] = useState<Record<WritingStyleKey, boolean>>({
    professional: false,
    friendly: false,
    storytelling: false,
    persuasive: false,
    other: false,
  })
  const [customWritingStyle, setCustomWritingStyle] = useState("")

  const [includeCTA, setIncludeCTA] = useState("no")
  const [ctaType, setCTAType] = useState("")
  const [ctaText, setCTAText] = useState("")
  const [ctaLink, setCTALink] = useState("")
  const [ctaPhone, setCTAPhone] = useState("")
  const [ctaWhatsappMessage, setCTAWhatsappMessage] = useState("")

  const [activeTab, setActiveTab] = useState("post-type")

  const handleNext = () => {
    if (step < 4) {
      if (step === 1) {
        console.log("שמירת נתוני השאלון המקדים")
      }

      setStep(step + 1)
      setProgress((step + 1) * 25)

      if (step + 1 === 2) {
        setActiveTab("content-creation")
      } else if (step + 1 === 3) {
        setActiveTab("media-creation")
      } else if (step + 1 === 4) {
        setActiveTab("final-post")
      }
    }
  }

  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1)
      setProgress(step * 25 - 25)

      if (step - 1 === 1) {
        setActiveTab("post-type")
      } else if (step - 1 === 2) {
        setActiveTab("content-creation")
      } else if (step - 1 === 3) {
        setActiveTab("media-creation")
      }
    }
  }

  const jumpToStep = (targetStep: number) => {
    if (targetStep >= 1 && targetStep <= 4) {
      setStep(targetStep)
      setProgress(targetStep * 25)
      // Also update active tab based on jumped step
      if (targetStep === 1) setActiveTab("post-type")
      else if (targetStep === 2) setActiveTab("content-creation")
      else if (targetStep === 3) setActiveTab("media-creation")
      else if (targetStep === 4) setActiveTab("final-post")
    }
  }

  const handleSelectTemplate = (template: any) => {
    setSelectedTemplate(template)
    setShowTemplateGallery(false)
    setActiveTab("template") // Should switch to template tab when selected
  }

  const handleWritingStyleChange = (style: WritingStyleKey) => {
    setWritingStyles((prev) => ({
      ...prev,
      [style]: !prev[style],
    }))
  }

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

  const generateCtaLink = () => {
    if (ctaType === "call" && ctaPhone) {
      return `tel:${ctaPhone.startsWith("+") ? ctaPhone : "+" + ctaPhone}`
    } else if (ctaType === "whatsapp" && ctaPhone) {
      const encodedMessage = encodeURIComponent(ctaWhatsappMessage || "")
      return `https://wa.me/${ctaPhone.replace(/^\+/, "")}${encodedMessage ? '?text=' + encodedMessage : ''}` // Fixed WhatsApp link generation
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
          {/* Changed order to match handleNext logic */}
           <Button
            variant={step === 2 ? "default" : "ghost"}
            className={`rounded-none border-b-2 ${step === 2 ? "border-purple-500" : "border-transparent"} px-4 py-3 text-sm font-medium transition-all`}
            onClick={() => jumpToStep(2)}
          >
            <PenTool className="mr-2 h-4 w-4" />
            יצירת תוכן
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
          className="h-2 [&>div]:bg-gradient-to-r [&>div]:from-purple-500 [&>div]:to-blue-500 transition-all duration-500 ease-out"
        />
        <p className="text-sm text-center mt-2 text-gray-500">שלב {step} מתוך 4</p>
      </div>

      {step === 1 && (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-6">
          <TabsList className="grid w-full grid-cols-7 gap-2 bg-gray-100 p-1 rounded-lg">
            <TabsTrigger value="post-type">סוג הפוסט</TabsTrigger>
            <TabsTrigger value="problem">בעיה/שאלה</TabsTrigger>
            <TabsTrigger value="social-network">רשת חברתית</TabsTrigger>
            <TabsTrigger value="goals">מטרות</TabsTrigger>
            <TabsTrigger value="audience">קהל יעד</TabsTrigger>
            <TabsTrigger value="template">תבנית עיצוב</TabsTrigger>
            <TabsTrigger value="property">נכס ספציפי</TabsTrigger>
          </TabsList>

          <TabsContent value="post-type">
            <Card className={cardColors["post-type"] + " border-t-4"}>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {cardIcons["post-type"]}
                  <h3 className="text-xl font-semibold text-blue-800 ml-3">{cardTitles["post-type"]}</h3>
                </div>
                <RadioGroup
                  value={postType}
                  onValueChange={setPostType}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                >
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <RadioGroupItem value="property-marketing" id="r1" />
                    <Label htmlFor="r1">שיווק נכס חדש למכירה</Label>
                  </div>
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <RadioGroupItem value="rental-marketing" id="r2" />
                    <Label htmlFor="r2">שיווק נכס להשכרה</Label>
                  </div>
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <RadioGroupItem value="market-update" id="r3" />
                    <Label htmlFor="r3">עדכון שוק / ניתוח אזור</Label>
                  </div>
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <RadioGroupItem value="real-estate-tip" id="r4" />
                    <Label htmlFor="r4">טיפ בנושא נדל"ן</Label>
                  </div>
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <RadioGroupItem value="event-promotion" id="r5" />
                    <Label htmlFor="r5">קידום אירוע (בית פתוח, וובינר)</Label>
                  </div>
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <RadioGroupItem value="client-testimonial" id="r6" />
                    <Label htmlFor="r6">סיפור לקוח / המלצה</Label>
                  </div>
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <RadioGroupItem value="holiday-greeting" id="r7" />
                    <Label htmlFor="r7">ברכה לחג / מועד</Label>
                  </div>
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <RadioGroupItem value="personal-story" id="r8" />
                    <Label htmlFor="r8">סיפור אישי / היכרות</Label>
                  </div>
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <RadioGroupItem value="question-to-audience" id="r9" />
                    <Label htmlFor="r9">שאלה לקהל</Label>
                  </div>
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <RadioGroupItem value="other" id="r10" />
                    <Label htmlFor="r10">אחר (נא לפרט)</Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="problem">
            <Card className={cardColors.problem + " border-t-4"}>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {cardIcons.problem}
                  <h3 className="text-xl font-semibold text-purple-800 ml-3">{cardTitles.problem}</h3>
                </div>
                <RadioGroup
                  value={postProblem}
                  onValueChange={(value) => {
                    setPostProblem(value)
                    if (value !== "other") {
                      setCustomPostProblem("")
                    }
                  }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <RadioGroupItem value="selling-process" id="p1" />
                    <Label htmlFor="p1">קושי במכירת נכס קיים</Label>
                  </div>
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <RadioGroupItem value="finding-property" id="p2" />
                    <Label htmlFor="p2">אתגר במציאת הנכס המתאים</Label>
                  </div>
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <RadioGroupItem value="market-understanding" id="p3" />
                    <Label htmlFor="p3">חוסר הבנה של מצב השוק הנוכחי</Label>
                  </div>
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <RadioGroupItem value="financing-mortgage" id="p4" />
                    <Label htmlFor="p4">התלבטות בנושאי מימון ומשכנתא</Label>
                  </div>
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <RadioGroupItem value="investment-strategy" id="p5" />
                    <Label htmlFor="p5">שאלות לגבי אסטרטגיית השקעה</Label>
                  </div>
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <RadioGroupItem value="legal-bureaucracy" id="p6" />
                    <Label htmlFor="p6">חשש מהבירוקרטיה וההיבטים המשפטיים</Label>
                  </div>
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <RadioGroupItem value="no-specific-problem" id="p7" />
                    <Label htmlFor="p7">אין בעיה ספציפית, פוסט כללי / מידעי</Label>
                  </div>
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <RadioGroupItem value="other" id="p8" />
                    <Label htmlFor="p8">אחר (נא לפרט)</Label>
                  </div>
                </RadioGroup>
                {postProblem === "other" && (
                  <div className="mt-4">
                    <Label htmlFor="customProblem" className="mb-2 block">
                      פרט את הבעיה או השאלה הספציפית:
                    </Label>
                    <Textarea
                      id="customProblem"
                      value={customPostProblem}
                      onChange={(e) => setCustomPostProblem(e.target.value)}
                      placeholder="לדוגמה: כיצד להתמודד עם עליית הריבית..."
                      className="min-h-[80px]"
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="social-network">
            <Card className={cardColors["social-network"] + " border-t-4"}>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {cardIcons["social-network"]}
                  <h3 className="text-xl font-semibold text-green-800 ml-3">{cardTitles["social-network"]}</h3>
                </div>
                <RadioGroup
                  value={socialNetwork}
                  onValueChange={setSocialNetwork}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                >
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <RadioGroupItem value="facebook" id="sn1" />
                    <Label htmlFor="sn1">פייסבוק (Facebook)</Label>
                  </div>
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <RadioGroupItem value="instagram" id="sn2" />
                    <Label htmlFor="sn2">אינסטגרם (Instagram)</Label>
                  </div>
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <RadioGroupItem value="linkedin" id="sn3" />
                    <Label htmlFor="sn3">לינקדאין (LinkedIn)</Label>
                  </div>
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <RadioGroupItem value="whatsapp" id="sn4" />
                    <Label htmlFor="sn4">וואטסאפ (WhatsApp)</Label>
                  </div>
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <RadioGroupItem value="tiktok" id="sn5" />
                    <Label htmlFor="sn5">טיקטוק (TikTok)</Label>
                  </div>
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <RadioGroupItem value="all" id="sn6" />
                    <Label htmlFor="sn6">כל הרשתות יחד</Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="goals">
            <Card className={cardColors.goals + " border-t-4"}>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {cardIcons.goals}
                  <h3 className="text-xl font-semibold text-amber-800 ml-3">{cardTitles.goals}</h3>
                </div>
                <RadioGroup
                  value={contentGoal}
                  onValueChange={setContentGoal}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                >
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <RadioGroupItem value="lead-generation" id="g1" />
                    <Label htmlFor="g1">יצירת לידים (פניות)</Label>
                  </div>
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <RadioGroupItem value="brand-awareness" id="g2" />
                    <Label htmlFor="g2">חיזוק המותג והמוניטין</Label>
                  </div>
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <RadioGroupItem value="engagement" id="g3" />
                    <Label htmlFor="g3">הגברת מעורבות הקהל</Label>
                  </div>
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <RadioGroupItem value="education" id="g4" />
                    <Label htmlFor="g4">מתן ערך וחינוך שוק</Label>
                  </div>
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <RadioGroupItem value="traffic" id="g5" />
                    <Label htmlFor="g5">הפניית תנועה לאתר / דף נחיתה</Label>
                  </div>
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <RadioGroupItem value="community-building" id="g6" />
                    <Label htmlFor="g6">בניית קהילה</Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="audience">
            <Card className={cardColors.audience + " border-t-4"}>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {cardIcons.audience}
                  <h3 className="text-xl font-semibold text-rose-800 ml-3">{cardTitles.audience}</h3>
                </div>
                <RadioGroup
                  value={targetAudience}
                  onValueChange={setTargetAudience}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                >
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <RadioGroupItem value="first-time-buyers" id="a1" />
                    <Label htmlFor="a1">רוכשי דירה ראשונה</Label>
                  </div>
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <RadioGroupItem value="property-investors" id="a2" />
                    <Label htmlFor="a2">משקיעי נדל"ן</Label>
                  </div>
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <RadioGroupItem value="upgraders" id="a3" />
                    <Label htmlFor="a3">משפרי דיור</Label>
                  </div>
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <RadioGroupItem value="renters" id="a4" />
                    <Label htmlFor="a4">שוכרי דירות</Label>
                  </div>
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <RadioGroupItem value="luxury-market" id="a5" />
                    <Label htmlFor="a5">קהל יוקרה</Label>
                  </div>
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <RadioGroupItem value="specific-area-residents" id="a6" />
                    <Label htmlFor="a6">תושבי אזור מסוים (יפורט בהמשך)</Label>
                  </div>
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <RadioGroupItem value="other" id="a7" />
                    <Label htmlFor="a7">אחר (נא לפרט)</Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="template">
            <Card className={cardColors.template + " border-t-4"}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    {cardIcons.template}
                    <h3 className="text-xl font-semibold text-indigo-800 ml-3">{cardTitles.template}</h3>
                  </div>
                  <div className="flex space-x-2 rtl:space-x-reverse">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setShowTemplateGallery(true)
                        setIsSimplifiedCreating(false)
                      }}
                    >
                      גלריית תבניות
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setIsSimplifiedCreating(true)
                        setShowTemplateGallery(false)
                        setSelectedTemplate(null)
                      }}
                    >
                      יצירת תבנית מופשטת
                    </Button>
                  </div>
                </div>

                {selectedTemplate ? (
                  <div className="border p-4 rounded-md bg-indigo-50">
                    <p>תבנית נבחרה: {selectedTemplate.name}</p>
                    <Button
                      variant="link"
                      size="sm"
                      onClick={() => {
                        setSelectedTemplate(null)
                        setShowTemplateGallery(true)
                        setIsSimplifiedCreating(false)
                      }}
                      className="p-0 h-auto mt-2"
                    >
                      שנה תבנית
                    </Button>
                  </div>
                ) : isSimplifiedCreating ? (
                   <div className="border p-4 rounded-md bg-gray-50">
                     <h3 className="font-semibold mb-2">יצירת תבנית מופשטת (מקום שמור)</h3>
                     <p className="text-sm text-gray-600 mb-4">
                       כאן תוכל להגדיר מבנה בסיסי לתבנית.
                     </p>
                     <Textarea placeholder="תיאור מבנה התבנית..." className="min-h-[100px]" />
                     <Button size="sm" className="mt-2">שמור מבנה</Button>
                   </div>
                ) : (
                  <p className="text-gray-600">
                    אנא בחר תבנית מהגלריה או צור תבנית מופשטת.
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <Dialog open={showTemplateGallery} onOpenChange={setShowTemplateGallery}>
            <DialogContent className="max-w-4xl">
              <div>
                <h2 className="text-2xl font-bold mb-4">גלריית תבניות (מקום שמור)</h2>
                <p className="text-gray-600">כאן תוצג גלריית התבניות לבחירה.</p>
                <Button onClick={() => handleSelectTemplate({ id: 1, name: 'תבנית דמה' })}>בחר תבנית דמה</Button>
              </div>
            </DialogContent>
          </Dialog>

          <TabsContent value="property">
            <Card className={cardColors.property + " border-t-4"}>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {cardIcons.property}
                  <h3 className="text-xl font-semibold text-cyan-800 ml-3">{cardTitles.property}</h3>
                </div>
                <RadioGroup value={hasSpecificProperty} onValueChange={setHasSpecificProperty} className="flex space-x-4 rtl:space-x-reverse mb-4">
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <RadioGroupItem value="yes" id="prop-yes" />
                    <Label htmlFor="prop-yes">כן, הפוסט עוסק בנכס ספציפי</Label>
                  </div>
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <RadioGroupItem value="no" id="prop-no" />
                    <Label htmlFor="prop-no">לא, הפוסט כללי יותר</Label>
                  </div>
                </RadioGroup>

                {hasSpecificProperty === "yes" && (
                  <div className="space-y-4 mt-4 border-t pt-4">
                    <p className="font-medium">פרטי הנכס:</p>
                    <Input placeholder="כתובת הנכס" />
                    <Input placeholder="מספר חדרים" type="number" />
                    <Input placeholder="מחיר (אם רלוונטי)" />
                    <Textarea placeholder="תיאור קצר של הנכס" />
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

        </Tabs>
      )}

      {step === 2 && (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-6">
          <TabsList className="grid w-full grid-cols-7 gap-2 bg-gray-100 p-1 rounded-lg">
            <TabsTrigger value="content-creation">יצירת תוכן</TabsTrigger>
            <TabsTrigger value="location">מיקום</TabsTrigger>
            <TabsTrigger value="holiday">חגים ומועדים</TabsTrigger>
            <TabsTrigger value="writing-style">סגנון כתיבה</TabsTrigger>
            <TabsTrigger value="length">אורך הפוסט</TabsTrigger>
            <TabsTrigger value="articles">מאמרים</TabsTrigger>
            <TabsTrigger value="call-to-action">קריאה לפעולה</TabsTrigger>
          </TabsList>

          <TabsContent value="content-creation">
            <Card className="border-t-4 border-purple-200">
              <CardContent className="p-6">
                <AIPostCreator />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="location">
            <Card className={cardColors.location + " border-t-4"}>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {cardIcons.location}
                  <h3 className="text-xl font-semibold text-teal-800 ml-3">{cardTitles.location}</h3>
                </div>
                <Input placeholder="הכנס עיר, שכונה או אזור רלוונטי" />
                <p className="text-sm text-gray-500 mt-2">הכנסת מיקום תעזור לנו להתאים את התוכן לקהל המקומי.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="holiday">
            <Card className={cardColors.holiday + " border-t-4"}>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {cardIcons.holiday}
                  <h3 className="text-xl font-semibold text-orange-800 ml-3">{cardTitles.holiday}</h3>
                </div>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="בחר חג או מועד (אופציונלי)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">ללא</SelectItem>
                    <SelectItem value="rosh-hashana">ראש השנה</SelectItem>
                    <SelectItem value="sukkot">סוכות</SelectItem>
                    <SelectItem value="hanukkah">חנוכה</SelectItem>
                    <SelectItem value="purim">פורים</SelectItem>
                    <SelectItem value="pesach">פסח</SelectItem>
                    <SelectItem value="shavuot">שבועות</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-gray-500 mt-2">אם הפוסט קשור לחג מסוים, בחירתו תעזור להתאים את המסר.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="writing-style">
            <Card className={cardColors["writing-style"] + " border-t-4"}>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {cardIcons["writing-style"]}
                  <h3 className="text-xl font-semibold text-fuchsia-800 ml-3">{cardTitles["writing-style"]}</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <Checkbox id="style-professional" checked={writingStyles.professional} onCheckedChange={() => handleWritingStyleChange('professional')} />
                    <Label htmlFor="style-professional">מקצועי ורשמי</Label>
                  </div>
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <Checkbox id="style-friendly" checked={writingStyles.friendly} onCheckedChange={() => handleWritingStyleChange('friendly')} />
                    <Label htmlFor="style-friendly">ידידותי וקליל</Label>
                  </div>
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <Checkbox id="style-storytelling" checked={writingStyles.storytelling} onCheckedChange={() => handleWritingStyleChange('storytelling')} />
                    <Label htmlFor="style-storytelling">מספר סיפור (Storytelling)</Label>
                  </div>
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <Checkbox id="style-persuasive" checked={writingStyles.persuasive} onCheckedChange={() => handleWritingStyleChange('persuasive')} />
                    <Label htmlFor="style-persuasive">משכנע ומניע לפעולה</Label>
                  </div>
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <Checkbox id="style-other" checked={writingStyles.other} onCheckedChange={(checked) => {
                      handleWritingStyleChange('other')
                      if (!checked) setCustomWritingStyle("")
                    }} />
                    <Label htmlFor="style-other">אחר</Label>
                  </div>
                </div>
                {writingStyles.other && (
                  <div className="mt-4">
                    <Label htmlFor="customStyle" className="mb-2 block">
                      פרט את הסגנון הרצוי:
                    </Label>
                    <Input
                      id="customStyle"
                      value={customWritingStyle}
                      onChange={(e) => setCustomWritingStyle(e.target.value)}
                      placeholder="לדוגמה: הומוריסטי, אינפורמטיבי קצר..."
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="length">
            <Card className={cardColors.length + " border-t-4"}>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {cardIcons.length}
                  <h3 className="text-xl font-semibold text-blue-800 ml-3">{cardTitles.length}</h3>
                </div>
                <RadioGroup defaultValue="medium">
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <RadioGroupItem value="short" id="len-short" />
                    <Label htmlFor="len-short">קצר (עד 50 מילים)</Label>
                  </div>
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <RadioGroupItem value="medium" id="len-medium" />
                    <Label htmlFor="len-medium">בינוני (50-150 מילים)</Label>
                  </div>
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <RadioGroupItem value="long" id="len-long" />
                    <Label htmlFor="len-long">ארוך (מעל 150 מילים)</Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="articles">
            <Card className={cardColors.articles + " border-t-4"}>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {cardIcons.articles}
                  <h3 className="text-xl font-semibold text-violet-800 ml-3">{cardTitles.articles}</h3>
                </div>
                <p className="mb-4">האם תרצה לשלב בפוסט מידע ממאמרים חיצוניים או מהבלוג שלך?</p>
                <RadioGroup value={useExternalArticles} onValueChange={setUseExternalArticles} className="flex space-x-4 rtl:space-x-reverse mb-4">
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <RadioGroupItem value="yes" id="article-yes" />
                    <Label htmlFor="article-yes">כן</Label>
                  </div>
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <RadioGroupItem value="no" id="article-no" />
                    <Label htmlFor="article-no">לא</Label>
                  </div>
                </RadioGroup>

                {useExternalArticles === "yes" && (
                  <div className="mt-4 space-y-3">
                    <Label htmlFor="articleLink">הדבק כאן קישור למאמר:</Label>
                    <Input
                      id="articleLink"
                      value={externalArticleLink}
                      onChange={(e) => setExternalArticleLink(e.target.value)}
                      placeholder="https://www.example.com/article"
                    />
                    <Button variant="outline" size="sm">
                      <LinkIcon className="mr-2 h-4 w-4" />
                      צרף מאמר
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="call-to-action">
            <Card className={cardColors["call-to-action"] + " border-t-4"}>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {cardIcons["call-to-action"]}
                  <h3 className="text-xl font-semibold text-pink-800 ml-3">{cardTitles["call-to-action"]}</h3>
                </div>
                <p className="mb-4">האם תרצה להוסיף קריאה לפעולה בסוף הפוסט?</p>
                <RadioGroup value={includeCTA} onValueChange={setIncludeCTA} className="flex space-x-4 rtl:space-x-reverse mb-4">
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <RadioGroupItem value="yes" id="cta-yes" />
                    <Label htmlFor="cta-yes">כן</Label>
                  </div>
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <RadioGroupItem value="no" id="cta-no" />
                    <Label htmlFor="cta-no">לא</Label>
                  </div>
                </RadioGroup>

                {includeCTA === "yes" && (
                  <div className="mt-4 space-y-4 border-t pt-4">
                    <Label>בחר סוג קריאה לפעולה:</Label>
                    <RadioGroup value={ctaType} onValueChange={setCTAType} className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                    {ctaType && (
                      <div className="mt-4 space-y-3">
                        <Label htmlFor="ctaText">טקסט הקריאה לפעולה:</Label>
                        <Input
                          id="ctaText"
                          value={ctaText}
                          onChange={(e) => setCTAText(e.target.value)}
                          placeholder="לדוגמה: לפרטים נוספים ולתיאום, לחצו כאן"
                        />

                        {ctaType === "link" && (
                          <>
                            <Label htmlFor="ctaLink">קישור:</Label>
                            <Input
                              id="ctaLink"
                              value={ctaLink}
                              onChange={(e) => setCTALink(e.target.value)}
                              placeholder="https://www.example.com"
                            />
                          </>
                        )}

                        {(ctaType === "call" || ctaType === "whatsapp") && (
                          <>
                            <Label htmlFor="ctaPhone">מספר טלפון:</Label>
                            <Input
                              id="ctaPhone"
                              value={ctaPhone}
                              onChange={(e) => setCTAPhone(e.target.value)}
                              type="tel"
                              placeholder="+972501234567"
                            />
                          </>
                        )}

                        {ctaType === "whatsapp" && (
                          <>
                            <Label htmlFor="ctaWhatsappMessage">הודעה מוכנה (אופציונלי):</Label>
                            <Textarea
                              id="ctaWhatsappMessage"
                              value={ctaWhatsappMessage}
                              onChange={(e) => setCTAWhatsappMessage(e.target.value)}
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
          </TabsContent>

        </Tabs>
      )}

      {step === 3 && (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-6">
          <TabsList className="grid w-full grid-cols-1 gap-2 bg-gray-100 p-1 rounded-lg">
            <TabsTrigger value="media-creation">יצירת מדיה</TabsTrigger>
          </TabsList>

          <TabsContent value="media-creation">
            <Card className="border-t-4 border-purple-200">
              <CardContent className="p-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">עורך מדיה (מקום שמור)</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    כאן תוכל להעלות/ליצור מדיה.
                  </p>
                  <div className="border-dashed border-2 border-gray-300 p-8 rounded-lg text-center">
                    <p>גרור ושחרר קבצים או לחץ לבחירה</p>
                    <div className="flex justify-center mt-4 space-x-2 rtl:space-x-reverse">
                      <Button variant="outline" size="sm">
                        <ImageIcon className="mr-2 h-4 w-4" />
                        העלאת תמונה \ סרטון
                      </Button>
                      <Button variant="outline" size="sm">
                        <Zap className="mr-2 h-4 w-4" />
                        צור תמונה עם AI
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}

      {step === 4 && (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-6">
          <TabsList className="grid w-full grid-cols-1 gap-2 bg-gray-100 p-1 rounded-lg">
            <TabsTrigger value="final-post">פוסט מוכן</TabsTrigger>
          </TabsList>

          <TabsContent value="final-post">
            <Card className="border-t-4 border-green-200">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-green-800 mb-4">הפוסט שלך מוכן!</h3>
                <div className="border rounded-lg p-4 bg-gray-50 mb-4">
                  <p className="whitespace-pre-wrap">[כאן יוצג הפוסט הסופי שנוצר על ידי ה-AI]</p>
                  {includeCTA === 'yes' && ctaType && ctaText && (
                    <div className="mt-4 pt-3 border-t">
                      <a
                        href={generateCtaLink()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline font-medium flex items-center"
                      >
                        {(ctaType === 'call' || ctaType === 'whatsapp') && <Phone className="w-4 h-4 mr-2" />}
                        {ctaType === 'link' && <LinkIcon className="w-4 h-4 mr-2" />}
                        {ctaText}
                      </a>
                    </div>
                  )}
                </div>
                <Button className="bg-green-600 hover:bg-green-700">
                  פרסם עכשיו
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}

      <div className="flex justify-between mt-8">
        <Button variant="outline" onClick={handlePrevious} disabled={step === 1}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          חזור לשלב הקודם
        </Button>
        <Button onClick={handleNext} disabled={step === 4}>
          {step === 3 ? "הצג פוסט מוכן" : "המשך לשלב הבא"}{/* Update button text for step 3 */}
        </Button>
      </div>
    </div>
  )
}

export default PostCreationForm

// ==================================================
// ========= סוף קומפוננטות עזר =========
// ==================================================