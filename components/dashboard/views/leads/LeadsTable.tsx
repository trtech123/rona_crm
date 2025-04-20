"use client"
import { useState } from "react"
import { DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

import type React from "react"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Mail, Phone, MoreHorizontal, MessageSquare, Copy, ChevronDown, Sparkles, Eye, Edit, Info } from "lucide-react"
import { PostPreview } from "@/components/post-preview" // Adjust path
import { PostHoverCard } from "@/components/post-hover-card" // Adjust path
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { DetailDialog } from "@/components/detail-dialog" // Adjust path
import type { Lead } from "@/lib/types" // Adjust path
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea" // Added Textarea import

interface LeadsTableProps {
  leads: Lead[]
}

export function LeadsTable({ leads }: LeadsTableProps) {
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [selectedLeads, setSelectedLeads] = useState<number[]>([])
  const [editingNoteId, setEditingNoteId] = useState<number | null>(null)
  const [notes, setNotes] = useState<Record<number, string>>({})
  const [showResponseContent, setShowResponseContent] = useState<number | null>(null)

  const socialNetworks = [
    { name: "פייסבוק", icon: "facebook" },
    { name: "אינסטגרם", icon: "instagram" },
    { name: "טוויטר", icon: "twitter" },
    { name: "וואטסאפ", icon: "whatsapp" },
    { name: "טלגרם", icon: "telegram" },
  ]

  // אוטומציות זמינות
  const availableAutomations = [
    { id: 1, name: "בקשת פרטים", channels: ["אימייל", "SMS", "וואטסאפ"] },
    { id: 2, name: "תיאום שיחה", channels: ["אימייל", "SMS", "וואטסאפ"] },
    { id: 3, name: "הזמנה לפגישה", channels: ["אימייל", "SMS", "וואטסאפ"] },
    { id: 4, name: "מידע על נכסים", channels: ["אימייל", "וואטסאפ"] },
    { id: 5, name: "הצעת מחיר", channels: ["אימייל"] },
  ]

  // תוכן האוטומציות
  const automationContent = {
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
    // Logic to copy link would go here
    alert("הקישור הועתק!")
  }

  const handleRowClick = (lead: Lead) => {
    try {
      if (!lead) {
        console.error("Invalid lead data: lead is null or undefined")
        return
      }

      if (!lead.post) {
        console.error("Invalid lead data: lead.post is null or undefined", lead)
        return
      }

      // פתיחת הדיאלוג עם הליד הנבחר
      setSelectedLead(lead)
      setIsDetailOpen(true)
    } catch (error) {
      console.error("Error in handleRowClick:", error)
    }
  }

  const toggleSelectLead = (id: number, e: React.MouseEvent) => {
    e.stopPropagation()
    if (selectedLeads.includes(id)) {
      setSelectedLeads(selectedLeads.filter((leadId) => leadId !== id))
    } else {
      setSelectedLeads([...selectedLeads, id])
    }
  }

  const selectAllLeads = () => {
    if (selectedLeads.length === leads.length) {
      setSelectedLeads([])
    } else {
      setSelectedLeads(leads.map((lead) => lead.id))
    }
  }

  const handleNoteChange = (id: number, note: string) => {
    setNotes({
      ...notes,
      [id]: note,
    })
  }

  const saveNote = (id: number) => {
    setEditingNoteId(null)
    alert(`הערה נשמרה ללקוח #${id}`)
  }

  const getAutoResponseContent = (lead: Lead, automationType?: string, channel?: string) => {
    if (!lead.autoResponse && !automationType) return "לא הוגדר מענה אוטומטי"

    // אם יש סוג אוטומציה וערוץ ספציפיים שנבחרו
    if (automationType && channel && automationContent[automationType as keyof typeof automationContent]) {
      const content =
        automationContent[automationType as keyof typeof automationContent][
          channel as keyof (typeof automationContent)[keyof typeof automationContent]
        ]
      return content ? content.replace("[שם]", lead.fullName) : "תוכן לא זמין"
    }

    // אחרת, השתמש בערוץ הקיים של הליד
    if (lead.autoResponse && lead.autoResponseChannel) {
      // מציאת תוכן אוטומציה מתאים לפי הערוץ
      for (const type in automationContent) {
        if (
          automationContent[type as keyof typeof automationContent][
            lead.autoResponseChannel as keyof (typeof automationContent)[keyof typeof automationContent]
          ]
        ) {
          return automationContent[type as keyof typeof automationContent][
            lead.autoResponseChannel as keyof (typeof automationContent)[keyof typeof automationContent]
          ].replace("[שם]", lead.fullName)
        }
      }
    }

    return "תוכן מותאם אישית"
  }

  const handleAutomationChange = (lead: Lead, automationType: string, channel: string) => {
    alert(`שינוי אוטומציה ללקוח ${lead.fullName}: סוג - ${automationType}, ערוץ - ${channel}`)
    // כאן יש לעדכן את הליד עם האוטומציה החדשה
  }

  return (
    <>
      {/* Desktop View */}
      <div className="rounded-md border overflow-x-auto hidden md:block max-w-full">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40px]">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  checked={selectedLeads.length === leads.length && leads.length > 0}
                  onChange={selectAllLeads}
                />
              </TableHead>
              <TableHead className="w-[30%]">פרטים ותוכן</TableHead>
              <TableHead className="w-[25%]">פרטי קשר</TableHead>
              <TableHead className="w-[25%]">אוטומציה</TableHead>
              <TableHead className="w-[20%]">הערות</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leads.map((lead) => (
              <TableRow
                key={lead.id}
                className={`cursor-pointer hover:bg-muted/50 ${selectedLeads.includes(lead.id) ? "bg-blue-50" : ""}`}
                onClick={() => handleRowClick(lead)}
              >
                <TableCell onClick={(e) => toggleSelectLead(lead.id, e)} className="pr-0">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    checked={selectedLeads.includes(lead.id)}
                    onChange={() => {}}
                  />
                </TableCell>

                {/* Column 1: Content and Details */}
                <TableCell>
                  <div className="flex items-start gap-2">
                    <PostHoverCard post={lead.post}>
                      <div className="flex-shrink-0">
                        <PostPreview post={lead.post} size="small" />
                      </div>
                    </PostHoverCard>
                    <div className="flex flex-col">
                      <div className="font-medium">{lead.fullName}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        <Badge variant="outline" className="mr-1">
                          {lead.source}
                        </Badge>
                        <Badge
                          variant={lead.status === "חדש" ? "default" : lead.status === "פתוח" ? "secondary" : "outline"}
                        >
                          {lead.status}
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">{lead.date}</div>
                      {lead.convertedFromResponse && (
                        <div className="text-xs mt-1">
                          <Badge variant="secondary" className="flex items-center gap-1">
                            <Info className="h-3 w-3" />
                            <span>הומר מתגובה</span>
                          </Badge>
                        </div>
                      )}
                    </div>
                  </div>
                </TableCell>

                {/* Column 2: Contact Details */}
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1">
                      <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                      <a
                        href={`mailto:${lead.email}`}
                        onClick={(e) => e.stopPropagation()}
                        className="text-sm truncate max-w-[150px] hover:text-primary transition-colors"
                      >
                        {lead.email}
                      </a>
                    </div>
                    <div className="flex items-center gap-1">
                      <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                      <a
                        href={`tel:${lead.phone}`}
                        onClick={(e) => e.stopPropagation()}
                        className="text-sm hover:text-primary transition-colors"
                      >
                        {lead.phone}
                      </a>
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 px-2 text-xs"
                        onClick={(e) => {
                          e.stopPropagation()
                          window.open(`mailto:${lead.email}`)
                        }}
                      >
                        <Mail className="h-3.5 w-3.5 mr-1" />
                        <span>אימייל</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 px-2 text-xs"
                        onClick={(e) => {
                          e.stopPropagation()
                          window.open(`https://wa.me/${lead.phone.replace(/[^0-9]/g, "")}`)
                        }}
                      >
                        <MessageSquare className="h-3.5 w-3.5 mr-1" />
                        <span>וואטסאפ</span>
                      </Button>
                    </div>
                  </div>
                </TableCell>

                {/* Column 3: Automation */}
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 px-2 text-xs justify-between w-full max-w-[180px]"
                          >
                            {lead.autoResponse ? (
                              <div className="flex items-center">
                                <Badge variant="secondary" className="mr-1">
                                  {lead.autoResponseChannel}
                                </Badge>
                                <span className="truncate max-w-[80px]">מענה אוטומטי</span>
                              </div>
                            ) : (
                              <span className="text-muted-foreground">בחר אוטומציה</span>
                            )}
                            <ChevronDown className="h-3 w-3 ml-1" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                          {availableAutomations.map((automation) => (
                            <DropdownMenuSub key={automation.id}>
                              <DropdownMenuSubTrigger>{automation.name}</DropdownMenuSubTrigger>
                              <DropdownMenuSubContent className="w-48">
                                {automation.channels.map((channel) => (
                                  <DropdownMenuItem
                                    key={channel}
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      handleAutomationChange(lead, automation.name, channel)
                                    }}
                                  >
                                    <div className="flex items-center justify-between w-full">
                                      <span>{channel}</span>
                                      <TooltipProvider>
                                        <Tooltip>
                                          <TooltipTrigger asChild>
                                            <Button
                                              variant="ghost"
                                              size="icon"
                                              className="h-6 w-6 p-0 ml-1"
                                              onClick={(e) => {
                                                e.stopPropagation()
                                                alert(getAutoResponseContent(lead, automation.name, channel))
                                              }}
                                            >
                                              <Eye className="h-3.5 w-3.5" />
                                            </Button>
                                          </TooltipTrigger>
                                          <TooltipContent side="left" align="center" className="max-w-xs">
                                            <p>הצג תוכן</p>
                                          </TooltipContent>
                                        </Tooltip>
                                      </TooltipProvider>
                                    </div>
                                  </DropdownMenuItem>
                                ))}
                              </DropdownMenuSubContent>
                            </DropdownMenuSub>
                          ))}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation()
                              alert(`ביטול מענה אוטומטי ללקוח ${lead.fullName}`)
                            }}
                          >
                            <span className="text-destructive">ביטול אוטומציה</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>

                      {lead.autoResponse && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild onClick={(e) => e.stopPropagation()}>
                              <Button variant="ghost" size="icon" className="h-7 w-7">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent side="top" align="center" className="max-w-xs p-4 text-right">
                              <p className="font-bold mb-1">תוכן המענה האוטומטי:</p>
                              <p>{getAutoResponseContent(lead)}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </div>

                    {showResponseContent === lead.id && (
                      <div
                        className="text-xs bg-muted p-2 rounded-md mt-1 relative"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-5 w-5 p-0 absolute top-1 left-1"
                          onClick={() => setShowResponseContent(null)}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="lucide lucide-x"
                          >
                            <path d="M18 6 6 18" />
                            <path d="m6 6 12 12" />
                          </svg>
                        </Button>
                        {getAutoResponseContent(lead)}
                      </div>
                    )}

                    <div className="flex items-center gap-1 mt-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2 text-xs"
                        title="תגובה חכמה"
                        onClick={(e) => {
                          e.stopPropagation()
                          alert(`תגובה חכמה לפוסט #${lead.post.id}`)
                        }}
                      >
                        <Sparkles className="h-3.5 w-3.5 mr-1" />
                        <span>תגובה חכמה</span>
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2 text-xs"
                        onClick={(e) => {
                          e.stopPropagation()
                          setShowResponseContent(showResponseContent === lead.id ? null : lead.id)
                        }}
                      >
                        {showResponseContent === lead.id ? (
                          <span>הסתר תוכן</span>
                        ) : (
                          <>
                            <Eye className="h-3.5 w-3.5 mr-1" />
                            <span>הצג תוכן</span>
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </TableCell>

                {/* Column 4: Notes */}
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <div className="flex flex-col gap-1">
                    {editingNoteId === lead.id ? (
                      <div className="flex flex-col gap-1">
                        <Textarea
                          value={notes[lead.id] || ""}
                          onChange={(e) => handleNoteChange(lead.id, e.target.value)}
                          className="w-full p-2 text-sm border border-gray-200 rounded-md min-h-[60px]"
                          placeholder="הוסף הערה..."
                        />
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-7 px-2 text-xs"
                            onClick={() => setEditingNoteId(null)}
                          >
                            ביטול
                          </Button>
                          <Button
                            variant="default"
                            size="sm"
                            className="h-7 px-2 text-xs"
                            onClick={() => saveNote(lead.id)}
                          >
                            שמור
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-muted-foreground truncate max-w-[120px]">
                          {notes[lead.id] ? notes[lead.id] : "אין הערות"}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0"
                          onClick={() => setEditingNoteId(lead.id)}
                        >
                          <Edit className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    )}

                    <div className="flex items-center gap-1 mt-1">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-7 w-7">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem onClick={() => copyLink()}>
                            <Copy className="h-4 w-4 ml-2" />
                            העתק קישור
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>ערוך פרטים</DropdownMenuItem>
                          <DropdownMenuItem>שנה סטטוס</DropdownMenuItem>
                          <DropdownMenuItem>מחק</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile View - Card Based */}
      <div className="space-y-4 md:hidden">
        {leads.map((lead) => (
          <Card
            key={lead.id}
            className={`${selectedLeads.includes(lead.id) ? "border-primary" : ""}`}
            onClick={() => handleRowClick(lead)}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-2">
                <div className="flex-shrink-0 mt-1">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    checked={selectedLeads.includes(lead.id)}
                    onChange={() => {}}
                    onClick={(e) => toggleSelectLead(lead.id, e)}
                  />
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-2">
                      <PostHoverCard post={lead.post}>
                        <PostPreview post={lead.post} size="small" />
                      </PostHoverCard>
                      <div>
                        <div className="font-medium">{lead.fullName}</div>
                        <div className="text-xs text-muted-foreground">{lead.date}</div>
                        <div className="flex items-center gap-1 mt-1">
                          <Badge variant="outline" className="text-[10px] h-5 px-1">
                            {lead.source}
                          </Badge>
                          <Badge
                            variant={
                              lead.status === "חדש" ? "default" : lead.status === "פתוח" ? "secondary" : "outline"
                            }
                            className="text-[10px] h-5 px-1"
                          >
                            {lead.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation()
                            window.open(`mailto:${lead.email}`)
                          }}
                        >
                          <Mail className="h-4 w-4 ml-2" />
                          שלח אימייל
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation()
                            window.open(`tel:${lead.phone}`)
                          }}
                        >
                          <Phone className="h-4 w-4 ml-2" />
                          התקשר
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation()
                            window.open(`https://wa.me/${lead.phone.replace(/[^0-9]/g, "")}`)
                          }}
                        >
                          <MessageSquare className="h-4 w-4 ml-2" />
                          וואטסאפ
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                          <Edit className="h-4 w-4 ml-2" />
                          ערוך פרטים
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                          <Copy className="h-4 w-4 ml-2" />
                          העתק קישור
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-3">
                    {/* Contact Info */}
                    <div className="space-y-1">
                      <div className="text-xs font-medium text-muted-foreground">פרטי קשר</div>
                      <div className="flex items-center gap-1">
                        <Mail className="h-3 w-3 text-muted-foreground" />
                        <a
                          href={`mailto:${lead.email}`}
                          onClick={(e) => e.stopPropagation()}
                          className="text-xs truncate max-w-[120px]"
                        >
                          {lead.email}
                        </a>
                      </div>
                      <div className="flex items-center gap-1">
                        <Phone className="h-3 w-3 text-muted-foreground" />
                        <a href={`tel:${lead.phone}`} onClick={(e) => e.stopPropagation()} className="text-xs">
                          {lead.phone}
                        </a>
                      </div>
                    </div>

                    {/* Automation */}
                    <div className="space-y-1">
                      <div className="text-xs font-medium text-muted-foreground">אוטומציה</div>
                      <div className="flex items-center gap-1">
                        {lead.autoResponse ? (
                          <>
                            <Badge variant="secondary" className="text-[10px] h-5 px-1">
                              {lead.autoResponseChannel}
                            </Badge>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild onClick={(e) => e.stopPropagation()}>
                                  <Button variant="ghost" size="icon" className="h-5 w-5 p-0">
                                    <Eye className="h-3 w-3" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent side="top" align="center" className="max-w-xs p-4 text-right">
                                  <p className="font-bold mb-1">תוכן המענה האוטומטי:</p>
                                  <p>{getAutoResponseContent(lead)}</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </>
                        ) : (
                          <span className="text-xs text-muted-foreground">לא הוגדר</span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 px-2 text-[10px]"
                          onClick={(e) => {
                            e.stopPropagation()
                            alert(`תגובה חכמה לפוסט #${lead.post.id}`)
                          }}
                        >
                          <Sparkles className="h-3 w-3 mr-1" />
                          <span>תגובה חכמה</span>
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Notes */}
                  <div className="mt-3 border-t pt-2">
                    <div className="flex items-center justify-between">
                      <div className="text-xs font-medium text-muted-foreground">הערות</div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={(e) => {
                          e.stopPropagation()
                          setEditingNoteId(lead.id)
                        }}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                    </div>

                    {editingNoteId === lead.id ? (
                      <div className="mt-1" onClick={(e) => e.stopPropagation()}>
                        <Textarea
                          value={notes[lead.id] || ""}
                          onChange={(e) => handleNoteChange(lead.id, e.target.value)}
                          className="w-full p-2 text-xs border border-gray-200 rounded-md min-h-[60px]"
                          placeholder="הוסף הערה..."
                        />
                        <div className="flex justify-end gap-1 mt-1">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-6 px-2 text-[10px]"
                            onClick={() => setEditingNoteId(null)}
                          >
                            ביטול
                          </Button>
                          <Button
                            variant="default"
                            size="sm"
                            className="h-6 px-2 text-[10px]"
                            onClick={() => saveNote(lead.id)}
                          >
                            שמור
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-xs mt-1 min-h-[20px]">{notes[lead.id] ? notes[lead.id] : "אין הערות"}</div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detail Dialog */}
      <DetailDialog
        isOpen={isDetailOpen}
        setIsOpen={setIsDetailOpen} // Make sure DetailDialog uses setIsOpen
        item={selectedLead}
        itemType="lead" // Pass itemType
        availableAutomations={availableAutomations}
        automationContent={automationContent}
        notes={notes}
        handleNoteChange={handleNoteChange}
        saveNote={saveNote}
        handleAutomationChange={handleAutomationChange}
        getAutoResponseContent={getAutoResponseContent}
        // Removed onClose and type as they are likely covered by setIsOpen and itemType
      />
    </>
  )
} 