"use client"

import { DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

import { useState, useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import type { Lead, Response } from "@/lib/types"
import Image from "next/image"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { mockPostAnalytics } from "@/lib/mock-data"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Edit,
  Trash,
  Copy,
  LinkIcon,
  Share2,
  MoreHorizontal,
  Mail,
  Phone,
  MessageSquare,
  ArrowRight,
  Calendar,
  Save,
  ChevronDown,
  Eye,
  Plus,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"

interface DetailDialogProps {
  isOpen: boolean
  onClose: () => void
  item: Lead | Response | null
  type: "lead" | "response"
  allData: Lead[] | Response[]
}

export function DetailDialog({ isOpen, onClose, item, type, allData }: DetailDialogProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const [postNotes, setPostNotes] = useState<Record<number, string>>({})
  const [showAutomationContent, setShowAutomationContent] = useState(false)
  const [selectedAutomation, setSelectedAutomation] = useState<string | null>(null)
  const [selectedChannel, setSelectedChannel] = useState<string | null>(null)
  const [isEditingAutomation, setIsEditingAutomation] = useState(false)
  const [automationContent, setAutomationContent] = useState("")
  const [responseType, setResponseType] = useState<"auto" | "manual">("auto")
  const notesRef = useRef<HTMLTextAreaElement>(null)

  // בדיקה מקיפה יותר לתקינות הנתונים
  if (!isOpen) return null
  if (!item) return null
  if (!item.post) {
    console.error("Missing post data in item", item)
    return null
  }

  const post = item.post
  const postId = post.id || 0

  // Get analytics data for this post
  const analyticsData = mockPostAnalytics[postId] || []

  // Calculate general stats
  const totalLeads =
    type === "lead" ? (allData as Lead[]).length : (allData as Response[]).filter((r) => r.convertedToLead).length

  const totalResponses = type === "response" ? (allData as Response[]).length : 0

  // Calculate stats for this post
  const postLeads =
    type === "lead"
      ? (allData as Lead[]).filter((l) => l.post.id === postId).length
      : (allData as Response[]).filter((r) => r.convertedToLead && r.post.id === postId).length

  const postResponses = type === "response" ? (allData as Response[]).filter((r) => r.post.id === postId).length : 0

  // Prepare comparison data
  const comparisonData = [
    {
      name: "לידים",
      פוסט_זה: postLeads,
      ממוצע_כללי: Math.round(totalLeads / (type === "lead" ? 5 : 3)),
    },
    {
      name: "תגובות",
      פוסט_זה: postResponses || Math.round(Math.random() * 30 + 10),
      ממוצע_כללי: Math.round(totalResponses / 3),
    },
    {
      name: "צפיות",
      פוסט_זה: Math.round(Math.random() * 500 + 200),
      ממוצע_כללי: Math.round(Math.random() * 300 + 100),
    },
  ]

  // Prepare time-based data
  const timeData =
    analyticsData.length > 0
      ? analyticsData
      : Array.from({ length: 7 }, (_, i) => ({
          date: `${i + 1}/4`,
          leads: Math.round(Math.random() * 5 + 1),
          responses: Math.round(Math.random() * 10 + 5),
        }))

  // Prepare platform distribution data
  const platformData = [
    { name: "פייסבוק", value: 45 },
    { name: "אינסטגרם", value: 30 },
    { name: "טוויטר", value: 15 },
    { name: "אחר", value: 10 },
  ]

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"]

  // אוטומציות זמינות
  const availableAutomations = [
    { id: 1, name: "בקשת פרטים", channels: ["אימייל", "SMS", "וואטסאפ"] },
    { id: 2, name: "תיאום שיחה", channels: ["אימייל", "SMS", "וואטסאפ"] },
    { id: 3, name: "הזמנה לפגישה", channels: ["אימייל", "SMS", "וואטסאפ"] },
    { id: 4, name: "מידע על נכסים", channels: ["אימייל", "וואטסאפ"] },
    { id: 5, name: "הצעת מחיר", channels: ["אימייל"] },
  ]

  // תוכן האוטומציות
  const automationTemplates = {
    "בקשת פרטים": {
      אימייל:
        "שלום [שם], תודה על פנייתך! נשמח לעזור לך בהקדם. כדי שנוכל להתאים לך את השירות הטוב ביותר, נשמח אם תוכל/י לשלוח לנו פרטים נוספים על הדרישות שלך.",
      SMS: 'שלום [שם], תודה על פנייתך! נשמח לקבל פרטים נוספים על הדרישות שלך. צוות נדל"ן ABC',
      וואטסאפ:
        "שלום [שם], קיבלנו את פנייתך בנוגע לנכס. נשמח לקבל פרטים נוספים כדי להתאים לך את הנכס המושלם. האם יש זמן נוח ליצירת קשר?",
    },
    "תיאום שיחה": {
      אימייל: "שלום [שם], תודה על ההתעניינות! אשמח לתת לך פרטים נוספים בשיחה. האם יש זמן שנוח לך לשיחה קצרה?",
      SMS: 'שלום [שם], נשמח לתאם איתך שיחה בנושא פנייתך. מתי נוח לך? צוות נדל"ן ABC',
      וואטסאפ: "שלום [שם], תודה על פנייתך! נשמח לתאם איתך שיחה קצרה לגבי הנכס שהתעניינת בו. מתי יהיה לך נוח לדבר?",
    },
    "הזמנה לפגישה": {
      אימייל:
        "שלום [שם], תודה על פנייתך! נשמח להזמין אותך לפגישה במשרדנו כדי להציג בפניך את הנכסים שלנו. האם יש לך זמן פנוי השבוע?",
      SMS: 'שלום [שם], נשמח להזמין אותך לפגישה להצגת הנכסים שלנו. מתי נוח לך? צוות נדל"ן ABC',
      וואטסאפ:
        "שלום [שם], תודה על ההתעניינות! נשמח להזמין אותך לפגישה במשרדנו כדי להציג בפניך את הנכסים המתאימים. האם יש לך זמן פנוי השבוע?",
    },
    "מידע על נכסים": {
      אימייל:
        "שלום [שם], תודה על פנייתך! מצורף מידע על הנכסים שלנו שעשויים להתאים לדרישות שלך. אשמח לענות על כל שאלה נוספת.",
      וואטסאפ: "שלום [שם], הנה מידע על הנכסים שלנו שעשויים להתאים לך. אשמח לענות על כל שאלה נוספת.",
    },
    "הצעת מחיר": {
      אימייל: "שלום [שם], תודה על פנייתך! מצורפת הצעת מחיר עבור הנכס שהתעניינת בו. אשמח לענות על כל שאלה נוספת.",
    },
  }

  const copyLink = () => {
    alert("הקישור הועתק!")
  }

  const sendEmail = () => {
    if (type === "lead") {
      window.open(`mailto:${(item as Lead).email}`)
    } else {
      alert("שליחת אימייל")
    }
  }

  const makeCall = () => {
    if (type === "lead") {
      window.open(`tel:${(item as Lead).phone}`)
    } else {
      alert("התקשרות...")
    }
  }

  const sendWhatsApp = () => {
    if (type === "lead") {
      window.open(`https://wa.me/${(item as Lead).phone.replace(/[^0-9]/g, "")}`)
    } else {
      alert("שליחת הודעת וואטסאפ")
    }
  }

  const savePostNotes = () => {
    if (notesRef.current) {
      const notes = notesRef.current.value
      setPostNotes({
        ...postNotes,
        [post.id]: notes,
      })
      alert(`הערות נשמרו לפוסט #${post.id}`)
    }
  }

  const handleAutomationSelect = (automation: string, channel: string) => {
    setSelectedAutomation(automation)
    setSelectedChannel(channel)

    // Get template content - עם בדיקות תקינות משופרות
    try {
      if (
        automationTemplates[automation as keyof typeof automationTemplates] &&
        automationTemplates[automation as keyof typeof automationTemplates][
          channel as keyof (typeof automationTemplates)[keyof typeof automationTemplates]
        ]
      ) {
        const content =
          automationTemplates[automation as keyof typeof automationTemplates][
            channel as keyof (typeof automationTemplates)[keyof typeof automationTemplates]
          ]
        const name = type === "lead" ? (item as Lead).fullName : (item as Response).name
        setAutomationContent(content.replace("[שם]", name))
      } else {
        setAutomationContent(`תוכן תגובה "${automation}" דרך ${channel}`)
      }
    } catch (error) {
      console.error("Error setting automation content", error)
      setAutomationContent(`תוכן תגובה "${automation}" דרך ${channel}`)
    }

    setShowAutomationContent(true)
  }

  const saveAutomation = () => {
    alert(`התגובה האוטומטית "${selectedAutomation}" נשמרה בהצלחה!`)
    setIsEditingAutomation(false)
  }

  const getLeadName = () => {
    if (type === "lead" && item) {
      return (item as Lead).fullName || ""
    } else if (type === "response" && item) {
      return (item as Response).name || ""
    }
    return ""
  }

  const getLeadEmail = () => {
    if (type === "lead" && item) {
      return (item as Lead).email || ""
    }
    return ""
  }

  const getLeadPhone = () => {
    if (type === "lead" && item) {
      return (item as Lead).phone || ""
    }
    return ""
  }

  const sendAutomation = (channel: string) => {
    if (responseType === "auto" && !selectedAutomation) return

    const name = getLeadName()

    if (responseType === "auto") {
      alert(`שליחת תגובה אוטומטית "${selectedAutomation}" דרך ${channel} ל${name}`)
    } else {
      alert(`שליחת תגובה ידנית דרך ${channel} ל${name}`)
    }

    // כאן יהיה קוד לשליחת התגובה בפועל
  }

  const handleAddAutomation = () => {
    // במקום להציג התראה, נוסיף אוטומציה חדשה לרשימה
    setSelectedAutomation("תגובה חדשה")
    setSelectedChannel("אימייל")
    setAutomationContent("תוכן תגובה חדשה - ניתן לערוך כאן")
    setShowAutomationContent(true)
    setResponseType("auto")
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0 w-[95vw] md:w-auto">
        <DialogHeader className="p-3 border-b sticky top-0 bg-background z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0 rounded-full"
                onClick={onClose}
                aria-label="חזרה"
              >
                <ArrowRight className="h-4 w-4" />
              </Button>
              <DialogTitle className="text-base font-bold">
                {type === "lead" ? "פרטי ליד" : "פרטי תגובה"} - {getLeadName()}
              </DialogTitle>
            </div>
            <div className="flex items-center gap-1">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0 rounded-full" onClick={sendEmail}>
                      <Mail className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>שלח אימייל</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0 rounded-full" onClick={makeCall}>
                      <Phone className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>התקשר</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0 rounded-full" onClick={sendWhatsApp}>
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>וואטסאפ</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </DialogHeader>

        <div className="p-2 md:p-3">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-3">
            {/* תמונת הפוסט + פרטי איש קשר - 5/12 מהרוחב בדסקטופ, מלא במובייל */}
            <div className="col-span-1 md:col-span-5 space-y-2 md:space-y-3">
              <div className="relative rounded-md overflow-hidden h-[150px] md:h-[180px] bg-muted">
                {post.type === "image" ? (
                  <Image src={post.content || "/placeholder.svg"} alt="Post" fill className="object-cover" />
                ) : post.type === "video" ? (
                  <div className="flex items-center justify-center h-full">
                    <span className="text-lg">סרטון</span>
                  </div>
                ) : (
                  <div className="p-4 h-full overflow-auto">
                    <p className="text-sm">{post.content}</p>
                  </div>
                )}
                <div className="absolute top-2 right-2 flex gap-1">
                  <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm text-xs">
                    פוסט #{post.id}
                  </Badge>
                  <Badge variant="outline" className="bg-background/80 backdrop-blur-sm text-xs">
                    {post.type === "image" ? "תמונה" : post.type === "video" ? "סרטון" : "טקסט"}
                  </Badge>
                </div>
                <div className="absolute bottom-2 right-2">
                  <Badge variant="outline" className="bg-background/80 backdrop-blur-sm text-xs">
                    מקור: {type === "lead" ? (item as Lead).source : (item as Response).platform}
                  </Badge>
                </div>
                <div className="absolute bottom-2 left-2 flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 bg-background/80 backdrop-blur-sm"
                    onClick={() => copyLink()}
                  >
                    <LinkIcon className="h-3.5 w-3.5" />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-7 w-7 bg-background/80 backdrop-blur-sm">
                        <MoreHorizontal className="h-3.5 w-3.5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem>
                        <Edit className="w-4 h-4 ml-2" />
                        ערוך פוסט
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Copy className="w-4 h-4 ml-2" />
                        העתק פוסט
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Trash className="w-4 h-4 ml-2" />
                        מחק פוסט
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuSub>
                        <DropdownMenuSubTrigger>
                          <Share2 className="w-4 h-4 ml-2" />
                          שתף ברשת
                        </DropdownMenuSubTrigger>
                        <DropdownMenuSubContent className="w-48">
                          {["פייסבוק", "אינסטגרם", "טוויטר", "וואטסאפ", "טלגרם"].map((network) => (
                            <DropdownMenuItem key={network}>{network}</DropdownMenuItem>
                          ))}
                        </DropdownMenuSubContent>
                      </DropdownMenuSub>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {/* כפתורי ביצועים מתחת לתמונה */}
              <div className="grid grid-cols-3 gap-1">
                <Card className="bg-blue-50">
                  <CardContent className="p-1 text-center">
                    <div className="text-sm font-bold text-blue-600">{postLeads}</div>
                    <div className="text-[9px] text-muted-foreground">לידים</div>
                  </CardContent>
                </Card>
                <Card className="bg-green-50">
                  <CardContent className="p-1 text-center">
                    <div className="text-sm font-bold text-green-600">
                      {postResponses || Math.round(Math.random() * 30 + 10)}
                    </div>
                    <div className="text-[9px] text-muted-foreground">תגובות</div>
                  </CardContent>
                </Card>
                <Card className="bg-purple-50">
                  <CardContent className="p-1 text-center">
                    <div className="text-sm font-bold text-purple-600">{Math.round(Math.random() * 500 + 200)}</div>
                    <div className="text-[9px] text-muted-foreground">צפיות</div>
                  </CardContent>
                </Card>
              </div>

              {/* פרטי איש קשר - קומפקטי יותר */}
              <Card>
                <CardContent className="p-2 space-y-1">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-medium">פרטי {type === "lead" ? "ליד" : "תגובה"}</h3>
                    <div className="flex gap-1">
                      {type === "lead" && (
                        <>
                          <Button variant="ghost" size="icon" className="h-6 w-6 p-0" onClick={sendEmail}>
                            <Mail className="h-3.5 w-3.5" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-6 w-6 p-0" onClick={makeCall}>
                            <Phone className="h-3.5 w-3.5" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-6 w-6 p-0" onClick={sendWhatsApp}>
                            <MessageSquare className="h-3.5 w-3.5" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>

                  {type === "lead" ? (
                    <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-xs">
                      <span className="text-muted-foreground">שם:</span>
                      <span>{(item as Lead).fullName}</span>

                      <span className="text-muted-foreground">אימייל:</span>
                      <a href={`mailto:${(item as Lead).email}`} className="text-blue-600 hover:underline truncate">
                        {(item as Lead).email}
                      </a>

                      <span className="text-muted-foreground">טלפון:</span>
                      <a href={`tel:${(item as Lead).phone}`} className="text-blue-600 hover:underline">
                        {(item as Lead).phone}
                      </a>

                      <span className="text-muted-foreground">סטטוס:</span>
                      <Badge
                        variant={
                          (item as Lead).status === "חדש"
                            ? "default"
                            : (item as Lead).status === "פתוח"
                              ? "secondary"
                              : "outline"
                        }
                        className="text-[10px] h-4 px-1"
                      >
                        {(item as Lead).status}
                      </Badge>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-xs">
                      <span className="text-muted-foreground">שם:</span>
                      <span>{(item as Response).name}</span>

                      <span className="text-muted-foreground">פלטפורמה:</span>
                      <Badge variant="outline" className="text-[10px] h-4 px-1">
                        {(item as Response).platform}
                      </Badge>

                      <span className="text-muted-foreground">סטטוס:</span>
                      <Badge
                        variant={
                          (item as Response).status === "ידנית"
                            ? "default"
                            : (item as Response).status === "אוטומטית"
                              ? "secondary"
                              : "outline"
                        }
                        className="text-[10px] h-4 px-1"
                      >
                        {(item as Response).status}
                      </Badge>

                      <span className="text-muted-foreground">תג:</span>
                      <Badge
                        variant={
                          (item as Response).autoTag === "שאלה"
                            ? "default"
                            : (item as Response).autoTag === "מעוניין"
                              ? "secondary"
                              : "destructive"
                        }
                        className="text-[10px] h-4 px-1"
                      >
                        {(item as Response).autoTag}
                      </Badge>
                    </div>
                  )}

                  {type === "response" && (
                    <div className="mt-2">
                      <span className="text-xs text-muted-foreground">תוכן התגובה:</span>
                      <div className="mt-1 p-2 text-xs bg-muted/30 rounded-md max-h-[60px] overflow-auto">
                        {(item as Response).text}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* הערות לפוסט - קומפקטי יותר */}
              <Card>
                <CardContent className="p-2">
                  <div className="flex justify-between items-center mb-1">
                    <h3 className="text-sm font-medium">הערות</h3>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={savePostNotes}>
                      <Save className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                  <Textarea
                    ref={notesRef}
                    placeholder="הוסף הערות לפוסט זה..."
                    defaultValue={postNotes[post.id] || ""}
                    className="min-h-[60px] text-xs resize-none"
                  />
                </CardContent>
              </Card>
            </div>

            {/* תגובה אוטומטית ונתונים - 7/12 מהרוחב בדסקטופ, מלא במובייל */}
            <div className="col-span-1 md:col-span-7 space-y-2 md:space-y-3">
              {/* נתונים וגרפים - העלינו אותם למעלה */}
              <div>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-3 p-1 h-7">
                    <TabsTrigger value="overview" className="text-xs py-0.5">
                      סקירה כללית
                    </TabsTrigger>
                    <TabsTrigger value="comparison" className="text-xs py-0.5">
                      השוואה
                    </TabsTrigger>
                    <TabsTrigger value="timeline" className="text-xs py-0.5">
                      ציר זמן
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="overview" className="pt-2">
                    <Card>
                      <CardContent className="p-2">
                        <div className="flex justify-between items-center mb-1">
                          <h3 className="text-xs font-medium">ביצועי הפוסט</h3>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3 text-muted-foreground" />
                            <span className="text-[10px] text-muted-foreground">{post.date}</span>
                          </div>
                        </div>
                        <div className="h-[150px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                              data={comparisonData}
                              margin={{
                                top: 5,
                                right: 5,
                                left: 0,
                                bottom: 5,
                              }}
                            >
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="name" tick={{ fontSize: 9 }} />
                              <YAxis tick={{ fontSize: 9 }} />
                              <RechartsTooltip />
                              <Legend wrapperStyle={{ fontSize: "9px" }} />
                              <Bar dataKey="פוסט_זה" fill="#8884d8" />
                              <Bar dataKey="ממוצע_כללי" fill="#82ca9d" />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  <TabsContent value="comparison" className="pt-2">
                    <div className="grid grid-cols-2 gap-2">
                      <Card>
                        <CardContent className="p-2">
                          <h3 className="text-xs font-medium mb-1">התפלגות פלטפורמות</h3>
                          <div className="h-[120px]">
                            <ResponsiveContainer width="100%" height="100%">
                              <PieChart>
                                <Pie
                                  data={platformData}
                                  cx="50%"
                                  cy="50%"
                                  labelLine={false}
                                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                  outerRadius={40}
                                  fill="#8884d8"
                                  dataKey="value"
                                >
                                  {platformData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                  ))}
                                </Pie>
                                <RechartsTooltip />
                              </PieChart>
                            </ResponsiveContainer>
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-2">
                          <h3 className="text-xs font-medium mb-1">יחס המרה</h3>
                          <div className="flex flex-col items-center justify-center h-[120px]">
                            <div className="text-2xl font-bold text-primary">
                              {Math.round((postLeads / (postResponses || 20)) * 100)}%
                            </div>
                            <div className="text-[9px] text-muted-foreground mt-1">יחס המרה מתגובות ללידים</div>
                            <div className="text-[8px] mt-1 text-center max-w-xs">
                              הפוסט הזה מייצר יחס המרה {Math.random() > 0.5 ? "גבוה" : "נמוך"} ב-
                              {Math.round(Math.random() * 20 + 5)}% מהממוצע הכללי
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>
                  <TabsContent value="timeline" className="pt-2">
                    <Card>
                      <CardContent className="p-2">
                        <h3 className="text-xs font-medium mb-1">ביצועים לאורך זמן</h3>
                        <div className="h-[150px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart
                              data={timeData}
                              margin={{
                                top: 5,
                                right: 5,
                                left: 0,
                                bottom: 5,
                              }}
                            >
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="date" tick={{ fontSize: 9 }} />
                              <YAxis tick={{ fontSize: 9 }} />
                              <RechartsTooltip />
                              <Legend wrapperStyle={{ fontSize: "9px" }} />
                              <Line type="monotone" dataKey="leads" stroke="#8884d8" activeDot={{ r: 4 }} />
                              <Line type="monotone" dataKey="responses" stroke="#82ca9d" />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>

              {/* תגובה אוטומטית */}
              <Card>
                <CardContent className="p-3">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-sm font-medium">תגובה</h3>
                  </div>

                  <div className="space-y-2">
                    {/* סוג תגובה */}
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">סוג תגובה:</span>
                      <div className="flex gap-1">
                        <Button
                          variant={responseType === "auto" ? "default" : "outline"}
                          size="sm"
                          className="h-7 px-2 text-xs"
                          onClick={() => setResponseType("auto")}
                        >
                          אוטומטית
                        </Button>
                        <Button
                          variant={responseType === "manual" ? "default" : "outline"}
                          size="sm"
                          className="h-7 px-2 text-xs"
                          onClick={() => setResponseType("manual")}
                        >
                          ידנית
                        </Button>
                      </div>
                    </div>

                    {/* תגובה אוטומטית */}
                    {responseType === "auto" && (
                      <>
                        {/* סטטוס תגובה */}
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">סטטוס:</span>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="outline" size="sm" className="h-7 px-2 text-xs">
                                <Badge variant={selectedAutomation ? "secondary" : "outline"} className="mr-1">
                                  {selectedAutomation ? "פעיל" : "לא פעיל"}
                                </Badge>
                                <ChevronDown className="h-3.5 w-3.5 ml-1" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                              <DropdownMenuItem onClick={() => alert("הפעלת תגובה אוטומטית")}>
                                <Badge variant="secondary" className="mr-1">
                                  פעיל
                                </Badge>
                                הפעל תגובה אוטומטית
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedAutomation(null)
                                  setSelectedChannel(null)
                                  setAutomationContent("")
                                  alert("ביטול תגובה אוטומטית")
                                }}
                              >
                                <Badge variant="outline" className="mr-1">
                                  לא פעיל
                                </Badge>
                                בטל תגובה אוטומטית
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>

                        {/* בחירת תגובה אוטומטית */}
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">סוג תגובה:</span>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-7 px-2 text-xs justify-between min-w-[180px]"
                              >
                                <span>{selectedAutomation || "בחר תגובה אוטומטית"}</span>
                                <ChevronDown className="h-3.5 w-3.5 ml-1" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                              {availableAutomations.map((automation) => (
                                <DropdownMenuItem
                                  key={automation.id}
                                  onClick={() => {
                                    setSelectedAutomation(automation.name)
                                    setSelectedChannel(automation.channels[0])
                                    handleAutomationSelect(automation.name, automation.channels[0])
                                  }}
                                >
                                  {automation.name}
                                </DropdownMenuItem>
                              ))}
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={handleAddAutomation}>
                                <Plus className="h-3.5 w-3.5 ml-1" />
                                הוסף תגובה אוטומטית חדשה
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>

                        {/* בחירת ערוץ */}
                        {selectedAutomation && (
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">ערוץ תקשורת:</span>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-7 px-2 text-xs min-w-[180px] justify-between"
                                >
                                  <span>{selectedChannel || "בחר ערוץ"}</span>
                                  <ChevronDown className="h-3.5 w-3.5 ml-1" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-48">
                                {availableAutomations
                                  .find((a) => a.name === selectedAutomation)
                                  ?.channels.map((channel) => (
                                    <DropdownMenuItem
                                      key={channel}
                                      onClick={() => handleAutomationSelect(selectedAutomation, channel)}
                                    >
                                      {channel}
                                    </DropdownMenuItem>
                                  ))}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        )}

                        {/* זמן תגובה */}
                        {selectedAutomation && (
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">זמן תגובה:</span>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-7 px-2 text-xs min-w-[180px] justify-between"
                                >
                                  <span>תוך 24 שעות</span>
                                  <ChevronDown className="h-3.5 w-3.5 ml-1" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-48">
                                <DropdownMenuItem onClick={() => alert("שינוי זמן תגובה")}>מיידי</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => alert("שינוי זמן תגובה")}>תוך שעה</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => alert("שינוי זמן תגובה")}>תוך 3 שעות</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => alert("שינוי זמן תגובה")}>
                                  תוך 12 שעות
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => alert("שינוי זמן תגובה")}>
                                  תוך 24 שעות
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => alert("שינוי זמן תגובה")}>
                                  תוך 48 שעות
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        )}

                        {/* תוכן התגובה האוטומטית */}
                        {selectedAutomation && selectedChannel && (
                          <>
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-muted-foreground">תוכן התגובה:</span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0"
                                  onClick={() => setShowAutomationContent(!showAutomationContent)}
                                >
                                  <Eye className="h-3.5 w-3.5" />
                                </Button>
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-7 px-2 text-xs"
                                onClick={() => sendAutomation(selectedChannel || "")}
                                disabled={!selectedAutomation || !selectedChannel}
                              >
                                <span>שלח תגובה</span>
                              </Button>
                            </div>

                            {showAutomationContent && (
                              <div className="space-y-2">
                                <div className="p-2 text-xs bg-muted/30 rounded-md max-h-[80px] overflow-auto">
                                  {automationContent || "לא נבחרה תגובה אוטומטית"}
                                </div>
                                <div className="flex justify-end">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-7 px-2 text-xs"
                                    onClick={() => alert("עריכת תוכן התגובה האוטומטית")}
                                  >
                                    <Edit className="h-3.5 w-3.5 ml-1" />
                                    ערוך תוכן
                                  </Button>
                                </div>
                              </div>
                            )}
                          </>
                        )}
                      </>
                    )}

                    {/* תגובה ידנית */}
                    {responseType === "manual" && (
                      <div className="space-y-2">
                        <Textarea
                          placeholder="הקלד את תוכן התגובה הידנית כאן..."
                          className="min-h-[80px] text-xs resize-none"
                        />

                        {/* כפתורי שליחה לתגובה ידנית */}
                        <div className="flex gap-1 mt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-7 px-2 text-xs flex-1"
                            onClick={() => sendAutomation("אימייל")}
                          >
                            <Mail className="h-3.5 w-3.5 ml-1" />
                            אימייל
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-7 px-2 text-xs flex-1"
                            onClick={() => sendAutomation("וואטסאפ")}
                          >
                            <MessageSquare className="h-3.5 w-3.5 ml-1" />
                            וואטסאפ
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-7 px-2 text-xs"
                            onClick={() => sendAutomation("SMS")}
                          >
                            SMS
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

