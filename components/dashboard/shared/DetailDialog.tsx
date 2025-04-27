"use client"

import { DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

import { useState, useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { type Lead, type Response } from "@/lib/temp_types"
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
// import { mockPostAnalytics } from "@/lib/mock-data" // Removed mock data import
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
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface DetailDialogProps {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  item: Lead | Response | null
  itemType: "lead" | "response"
  availableAutomations?: any[]
  automationContent?: Record<string, Record<string, string>>
  notes?: Record<number, string>
  handleNoteChange?: (id: number, note: string) => void
  saveNote?: (id: number) => void
  handleAutomationChange?: (lead: Lead, automationType: string, channel: string) => void
  getAutoResponseContent?: (lead: Lead, automationType?: string, channel?: string) => string
}

export function DetailDialog({
  isOpen,
  setIsOpen,
  item,
  itemType,
  availableAutomations: propAvailableAutomations,
  automationContent: propAutomationContent,
  notes: propNotes = {},
  handleNoteChange: propHandleNoteChange,
  saveNote: propSaveNote,
  handleAutomationChange: propHandleAutomationChange,
  getAutoResponseContent: propGetAutoResponseContent,
}: DetailDialogProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const [postNotes, setPostNotes] = useState<Record<number, string>>({})
  const [showAutomationContent, setShowAutomationContent] = useState(false)
  const [selectedAutomation, setSelectedAutomation] = useState<string | null>(null)
  const [selectedChannel, setSelectedChannel] = useState<string | null>(null)
  const [isEditingAutomation, setIsEditingAutomation] = useState(false)
  const [currentAutomationContent, setCurrentAutomationContent] = useState("")
  const [responseType, setResponseType] = useState<"auto" | "manual">("auto")
  const [manualResponse, setManualResponse] = useState("")
  const notesRef = useRef<HTMLTextAreaElement>(null)

  const [localNotes, setLocalNotes] = useState(propNotes)

  const onClose = () => setIsOpen(false)

  if (!isOpen) return null
  if (!item) return null
  if (!item.post) {
    console.error("Missing post data in item", item)
    return null
  }

  const post = item.post
  const postId = post.id || 0

  const availableAutomations = propAvailableAutomations || [
    { id: 1, name: "בקשת פרטים", channels: ["אימייל", "SMS", "וואטסאפ"] },
    { id: 2, name: "תיאום שיחה", channels: ["אימייל", "SMS", "וואטסאפ"] },
    { id: 3, name: "הזמנה לפגישה", channels: ["אימייל", "SMS", "וואטסאפ"] },
    { id: 4, name: "מידע על נכסים", channels: ["אימייל", "וואטסאפ"] },
    { id: 5, name: "הצעת מחיר", channels: ["אימייל"] },
  ]

  const automationTemplates = propAutomationContent || {
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

  const analyticsData = []

  const totalLeads = 50
  const totalResponses = 150

  const postLeads = 10
  const postResponses = 30

  const comparisonData = [
    {
      name: "לידים",
      פוסט_זה: postLeads,
      ממוצע_כללי: Math.round(totalLeads / 5),
    },
    {
      name: "תגובות",
      פוסט_זה: postResponses,
      ממוצע_כללי: Math.round(totalResponses / 5),
    },
    {
      name: "צפיות",
      פוסט_זה: Math.round(Math.random() * 500 + 200),
      ממוצע_כללי: Math.round(Math.random() * 300 + 100),
    },
  ]

  const timeData =
    analyticsData.length > 0
      ? analyticsData
      : Array.from({ length: 7 }, (_, i) => ({
          date: `${i + 1}/4`,
          leads: Math.round(Math.random() * 5 + 1),
          responses: Math.round(Math.random() * 10 + 5),
        }))

  const platformData = [
    { name: "פייסבוק", value: 45 },
    { name: "אינסטגרם", value: 30 },
    { name: "טוויטר", value: 15 },
    { name: "אחר", value: 10 },
  ]

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"]

  const copyLink = () => {
    alert("הקישור הועתק!")
  }

  const sendEmail = () => {
    if (itemType === "lead") {
      window.open(`mailto:${(item as Lead).email}`)
    } else {
      alert("שליחת אימייל")
    }
  }

  const makeCall = () => {
    if (itemType === "lead") {
      window.open(`tel:${(item as Lead).phone}`)
    } else {
      alert("התקשרות...")
    }
  }

  const sendWhatsApp = () => {
    if (itemType === "lead") {
      window.open(`https://wa.me/${(item as Lead).phone.replace(/[^0-9]/g, "")}`)
    } else {
      alert("שליחת הודעת וואטסאפ")
    }
  }

  const handleInternalNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (propHandleNoteChange && item) {
      propHandleNoteChange(item.id, e.target.value)
    }
  }

  const saveInternalNote = () => {
    if (propSaveNote && item) {
      propSaveNote(item.id)
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

  const getAutomationContent = (automation: string, channel: string): string => {
    const name = getLeadName()
    if (propGetAutoResponseContent && itemType === "lead") {
      return propGetAutoResponseContent(item as Lead, automation, channel)
    }
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
        return content.replace("[שם]", name)
      } else {
        return `תוכן תגובה "${automation}" דרך ${channel}`
      }
    } catch (error) {
      console.error("Error getting automation content", error)
      return `תוכן תגובה "${automation}" דרך ${channel}`
    }
  }

  const handleAutomationSelect = (automation: string, channel: string) => {
    setSelectedAutomation(automation)
    setSelectedChannel(channel)
    setCurrentAutomationContent(getAutomationContent(automation, channel))
    setShowAutomationContent(true)
  }

  const handleInternalAutomationChange = (automation: string, channel: string) => {
    if (propHandleAutomationChange && itemType === "lead") {
      propHandleAutomationChange(item as Lead, automation, channel)
      setSelectedAutomation(automation)
      setSelectedChannel(channel)
      setCurrentAutomationContent(getAutomationContent(automation, channel))
    } else {
      alert(`שינוי אוטומציה ל "${automation}" דרך ${channel}`)
      setSelectedAutomation(automation)
      setSelectedChannel(channel)
      setCurrentAutomationContent(getAutomationContent(automation, channel))
    }
  }

  const saveAutomation = () => {
    alert(`התגובה האוטומטית "${selectedAutomation}" נשמרה בהצלחה!`)
    setIsEditingAutomation(false)
  }

  const getLeadName = () => {
    if (itemType === "lead" && item) {
      return (item as Lead).fullName || ""
    } else if (itemType === "response" && item) {
      return (item as Response).name || ""
    }
    return ""
  }

  const getLeadEmail = () => {
    if (itemType === "lead" && item) {
      return (item as Lead).email || ""
    }
    return ""
  }

  const getLeadPhone = () => {
    if (itemType === "lead" && item) {
      return (item as Lead).phone || ""
    }
    return ""
  }

  const sendAutomation = (channel: string | null = selectedChannel) => {
    if (responseType === "auto" && !selectedAutomation) return
    if (!channel) {
      alert("יש לבחור ערוץ שליחה")
      return
    }

    const name = getLeadName()

    if (responseType === "auto") {
      alert(`שליחת תגובה אוטומטית "${selectedAutomation}" דרך ${channel} ל${name}`)
    } else {
      alert(`שליחת תגובה ידנית דרך ${channel} ל${name}:\n${manualResponse}`)
    }
  }

  const handleAddAutomation = () => {
    setSelectedAutomation("תגובה חדשה")
    setSelectedChannel("אימייל")
    setCurrentAutomationContent("תוכן תגובה חדשה - ניתן לערוך כאן")
    setShowAutomationContent(true)
    setResponseType("auto")
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0 w-[95vw] md:w-auto" dir="rtl">
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
                {itemType === "lead" ? "פרטי ליד" : "פרטי תגובה"} - {getLeadName()}
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

        <div className="p-4 md:p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3 mb-4">
              <TabsTrigger value="overview">סקירה כללית</TabsTrigger>
              <TabsTrigger value="details">פרטים</TabsTrigger>
              <TabsTrigger value="analytics">ניתוחים</TabsTrigger>
            </TabsList>

            {/* Overview Tab Content */}
            <TabsContent value="overview" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left Column: Post Preview & Response Area */}
                <div className="md:col-span-2 space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>תצוגת הפוסט המקורי</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="relative rounded-md overflow-hidden h-[200px] bg-muted">
                        {post.type === "image" ? (
                          <Image src={post.content || "/placeholder.svg"} alt="Post" fill className="object-cover" />
                        ) : post.type === "video" ? (
                          <div className="flex items-center justify-center h-full">
                            <span className="text-lg">סרטון</span>
                          </div>
                        ) : (
                          <div className="p-4 h-full overflow-auto">
                            <p>{post.content}</p>
                          </div>
                        )}
                        {/* Badges and Buttons on image */}
                        <div className="absolute top-2 right-2 flex gap-1">
                          <Badge variant="secondary">פוסט #{post.id}</Badge>
                          <Badge variant="outline">{post.type}</Badge>
                        </div>
                        <div className="absolute bottom-2 right-2">
                          <Badge variant="outline">מקור: {itemType === "lead" ? (item as Lead).source : (item as Response).platform}</Badge>
                        </div>
                        <div className="absolute bottom-2 left-2 flex gap-1">
                          <Button variant="ghost" size="icon" className="h-7 w-7 bg-background/80" onClick={copyLink}>
                            <LinkIcon className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>אזור תגובה</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <RadioGroup
                        value={responseType}
                        onValueChange={(value: "auto" | "manual") => setResponseType(value)}
                        className="flex gap-4 mb-4"
                      >
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <RadioGroupItem value="auto" id="r-auto" />
                          <Label htmlFor="r-auto">אוטומטית</Label>
                        </div>
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <RadioGroupItem value="manual" id="r-manual" />
                          <Label htmlFor="r-manual">ידנית</Label>
                        </div>
                      </RadioGroup>

                      {responseType === "auto" ? (
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <Label>בחר תגובה:</Label>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm">
                                  {selectedAutomation || "בחר תגובה אוטומטית"}
                                  <ChevronDown className="h-4 w-4 mr-2" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                {availableAutomations.map((auto) => (
                                  <DropdownMenuItem key={auto.id} onClick={() => handleAutomationSelect(auto.name, auto.channels[0])}>
                                    {auto.name}
                                  </DropdownMenuItem>
                                ))}
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={handleAddAutomation}>
                                  <Plus className="h-4 w-4 ml-2" />
                                  הוסף תגובה חדשה
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                          {selectedAutomation && (
                            <div className="flex items-center justify-between">
                              <Label>ערוץ:</Label>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="outline" size="sm">
                                    {selectedChannel || "בחר ערוץ"}
                                    <ChevronDown className="h-4 w-4 mr-2" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  {(() => {
                                    const automation = availableAutomations?.find(a => a.name === selectedAutomation);
                                    if (automation && automation.channels) {
                                      return automation.channels.map((ch: string) => (
                                        <DropdownMenuItem key={ch} onClick={() => handleAutomationSelect(selectedAutomation, ch)}>
                                          {ch}
                                        </DropdownMenuItem>
                                      ));
                                    }
                                    return null;
                                  })()}
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          )}
                          {selectedAutomation && selectedChannel && (
                            <div className="border p-3 rounded-md bg-muted/30">
                              <Label className="block mb-1 text-xs font-medium">תצוגה מקדימה:</Label>
                              <p className="text-sm text-muted-foreground min-h-[60px]">
                                {currentAutomationContent}
                              </p>
                              <div className="flex justify-end mt-2">
                                <Button size="sm" onClick={() => sendAutomation()}>שלח תגובה זו</Button>
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <Label htmlFor="manual-response">תוכן תגובה ידנית:</Label>
                          <Textarea
                            id="manual-response"
                            placeholder="הקלד תגובתך..."
                            className="min-h-[100px]"
                            value={manualResponse}
                            onChange={(e) => setManualResponse(e.target.value)}
                          />
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" size="sm" onClick={() => sendAutomation("אימייל")}> <Mail className="h-4 w-4 ml-1"/> אימייל</Button>
                            <Button variant="outline" size="sm" onClick={() => sendAutomation("וואטסאפ")}> <MessageSquare className="h-4 w-4 ml-1"/> וואטסאפ</Button>
                            <Button size="sm" onClick={() => sendAutomation("כללי")}>שלח</Button>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Right Column: Details & Notes */}
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>פרטי {itemType === "lead" ? "ליד" : "תגובה"}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      {itemType === "lead" ? (
                        <>
                          <p><strong>שם:</strong> {(item as Lead).fullName}</p>
                          <p><strong>אימייל:</strong> <a href={`mailto:${(item as Lead).email}`} className="text-blue-600 hover:underline">{(item as Lead).email}</a></p>
                          <p><strong>טלפון:</strong> <a href={`tel:${(item as Lead).phone}`} className="text-blue-600 hover:underline">{(item as Lead).phone}</a></p>
                          <p><strong>סטטוס:</strong> <Badge variant={(item as Lead).status === "חדש" ? "default" : (item as Lead).status === "פתוח" ? "secondary" : "outline"}>{(item as Lead).status}</Badge></p>
                          <p><strong>מקור:</strong> {(item as Lead).source}</p>
                          <p><strong>תאריך:</strong> {item.date}</p>
                        </>
                      ) : (
                        <>
                          <p><strong>שם:</strong> {(item as Response).name}</p>
                          <p><strong>פלטפורמה:</strong> <Badge variant="outline">{(item as Response).platform}</Badge></p>
                          <p><strong>תאריך:</strong> {new Date((item as Response).date).toLocaleString('he-IL')}</p>
                          <p><strong>סטטוס:</strong> <Badge variant={(item as Response).status === 'ידנית' ? 'default' : (item as Response).status === 'אוטומטית' ? 'secondary' : 'outline'}>{(item as Response).status}</Badge></p>
                          <p><strong>הפך לליד:</strong> {(item as Response).convertedToLead ? 'כן' : 'לא'}</p>
                          <p><strong>תג אוטומטי:</strong> <Badge variant={(item as Response).autoTag === 'שאלה' ? 'default' : (item as Response).autoTag === 'מעוניין' ? 'secondary' : 'destructive'}>{(item as Response).autoTag}</Badge></p>
                          <div className="space-y-1">
                            <p><strong>תוכן התגובה:</strong></p>
                            <p className="text-xs bg-muted/30 p-2 rounded max-h-20 overflow-auto">{(item as Response).text}</p>
                          </div>
                        </>
                      )}
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex justify-between items-center">
                        הערות
                        {propSaveNote && (
                          <Button variant="ghost" size="sm" onClick={saveInternalNote}><Save className="h-4 w-4"/></Button>
                        )}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {propHandleNoteChange ? (
                         <Textarea
                           placeholder={`הוסף הערות ל${itemType === "lead" ? "ליד" : "תגובה"}...`}
                           value={(localNotes && item) ? localNotes[item.id] || "" : ""}
                           onChange={handleInternalNoteChange}
                           className="min-h-[100px] text-sm"
                         />
                       ) : (
                         <div className="text-sm text-muted-foreground italic">ניהול הערות אינו זמין כאן.</div>
                       )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Details Tab Content */}
            <TabsContent value="details">
              <p>פרטים נוספים יופיעו כאן...</p>
            </TabsContent>

            {/* Analytics Tab Content */}
            <TabsContent value="analytics" className="mt-0">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>השוואת ביצועים</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={250}>
                      <BarChart data={comparisonData} layout="vertical" barSize={20}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis dataKey="name" type="category" width={60} />
                        <RechartsTooltip />
                        <Legend />
                        <Bar dataKey="פוסט_זה" name="פוסט זה" fill="#8884d8" />
                        <Bar dataKey="ממוצע_כללי" name="ממוצע כללי" fill="#82ca9d" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>התפלגות פלטפורמות</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={250}>
                      <PieChart>
                        <Pie
                          data={platformData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }: { name: string; percent: number }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {platformData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <RechartsTooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle>ביצועים לאורך זמן</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={timeData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <RechartsTooltip />
                        <Legend />
                        <Line type="monotone" dataKey="leads" name="לידים" stroke="#8884d8" />
                        <Line type="monotone" dataKey="responses" name="תגובות" stroke="#82ca9d" />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <DialogFooter>
          <Button type="submit" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

