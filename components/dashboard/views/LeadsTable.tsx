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
import { PostPreview } from "@/components/post-preview" // Adjust path if needed
import { PostHoverCard } from "@/components/post-hover-card" // Adjust path if needed
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { DetailDialog } from "@/components/detail-dialog" // Adjust path if needed
import type { Lead } from "@/lib/types" // Adjust path if needed
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
                      <Mail className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs">{lead.email}</span>
                      <TooltipProvider delayDuration={100}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-5 w-5 text-muted-foreground hover:text-primary"
                              onClick={(e) => {
                                e.stopPropagation()
                                navigator.clipboard.writeText(lead.email)
                                alert("אימייל הועתק!")
                              }}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>העתק אימייל</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <div className="flex items-center gap-1">
                      <Phone className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs">{lead.phone}</span>
                      <TooltipProvider delayDuration={100}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-5 w-5 text-muted-foreground hover:text-primary"
                              onClick={(e) => {
                                e.stopPropagation()
                                navigator.clipboard.writeText(lead.phone)
                                alert("טלפון הועתק!")
                              }}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>העתק טלפון</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                </TableCell>

                {/* Column 3: Automation */}
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="h-8 w-full justify-between text-xs">
                        <span>{lead.autoResponse || "בחר תגובה"}</span>
                        <ChevronDown className="h-3 w-3 ml-1" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {availableAutomations.map((automation) => (
                        <DropdownMenuSub key={automation.id}>
                          <DropdownMenuSubTrigger>{automation.name}</DropdownMenuSubTrigger>
                          <DropdownMenuSubContent>
                            {automation.channels.map((channel) => (
                              <DropdownMenuItem
                                key={channel}
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleAutomationChange(lead, automation.name, channel)
                                }}
                              >
                                <div className="flex justify-between w-full">
                                  <span>{channel}</span>
                                  <TooltipProvider delayDuration={100}>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          className="h-5 w-5 text-muted-foreground hover:text-primary ml-2"
                                          onClick={(e) => {
                                            e.stopPropagation()
                                            setShowResponseContent(lead.id)
                                            alert(
                                              getAutoResponseContent(
                                                lead,
                                                automation.name,
                                                channel
                                              )
                                            )
                                          }}
                                        >
                                          <Eye className="h-3 w-3" />
                                        </Button>
                                      </TooltipTrigger>
                                      <TooltipContent>
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
                          alert("מעבר לעמוד אוטומציות (לא מומש)")
                        }}
                      >
                        <Sparkles className="h-3 w-3 mr-2" />
                        <span>נהל אוטומציות</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  {lead.autoResponse && (
                    <div className="text-xs text-muted-foreground mt-1">
                      ערוץ: {lead.autoResponseChannel || "לא נבחר"}
                    </div>
                  )}
                </TableCell>

                {/* Column 4: Notes */}
                <TableCell>
                  {editingNoteId === lead.id ? (
                    <div className="flex gap-1">
                      <Textarea
                        value={notes[lead.id] || ""}
                        onChange={(e) => handleNoteChange(lead.id, e.target.value)}
                        onClick={(e) => e.stopPropagation()} // Prevent row click when editing
                        className="text-xs h-16"
                        placeholder="הוסף הערה..."
                      />
                      <Button
                        size="sm"
                        className="h-8 self-end"
                        onClick={(e) => {
                          e.stopPropagation()
                          saveNote(lead.id)
                        }}
                      >
                        שמור
                      </Button>
                    </div>
                  ) : (
                    <div
                      className="text-xs text-muted-foreground hover:text-primary cursor-pointer flex justify-between items-start group"
                      onClick={(e) => {
                        e.stopPropagation()
                        setEditingNoteId(lead.id)
                      }}
                    >
                      <span className="truncate flex-1">
                        {notes[lead.id] || "הוסף הערה..."}
                      </span>
                      <Edit className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity ml-1 flex-shrink-0" />
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile View */}
      <div className="md:hidden space-y-3">
        {leads.map((lead) => (
          <Card key={lead.id} className={`overflow-hidden ${selectedLeads.includes(lead.id) ? "bg-blue-50" : ""}`}>
            <CardContent className="p-3">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    checked={selectedLeads.includes(lead.id)}
                    onChange={(e) => toggleSelectLead(lead.id, e)}
                  />
                  <div className="font-medium text-sm">{lead.fullName}</div>
                </div>
                <Badge
                  variant={lead.status === "חדש" ? "default" : lead.status === "פתוח" ? "secondary" : "outline"}
                  className="text-xs"
                >
                  {lead.status}
                </Badge>
              </div>

              <div className="text-xs text-muted-foreground mb-2">
                <span className="mr-2">מקור: {lead.source}</span>
                <span>{lead.date}</span>
              </div>

              <div className="flex items-start gap-2 mb-3">
                <PostHoverCard post={lead.post}>
                  <div className="flex-shrink-0">
                    <PostPreview post={lead.post} size="xsmall" />
                  </div>
                </PostHoverCard>
                {lead.convertedFromResponse && (
                  <div className="text-xs mt-1">
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Info className="h-3 w-3" />
                      <span>הומר מתגובה</span>
                    </Badge>
                  </div>
                )}
              </div>

              {/* Contact and Automation Collapsible */}
              <details className="text-xs">
                <summary className="cursor-pointer text-primary hover:underline">פרטים נוספים</summary>
                <div className="mt-2 space-y-1">
                  <div className="flex items-center gap-1">
                    <Mail className="h-3 w-3 text-muted-foreground" />
                    <span>{lead.email}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Phone className="h-3 w-3 text-muted-foreground" />
                    <span>{lead.phone}</span>
                  </div>
                  <div className="mt-1">
                    <span className="font-medium">אוטומציה:</span> {lead.autoResponse || "לא נבחר"} (
                    {lead.autoResponseChannel || "-"})
                  </div>
                  {/* Add Notes here if needed */}
                  <div className="mt-1">
                    <span className="font-medium">הערות:</span>
                    <span className="ml-1">{notes[lead.id] || "-"}</span>
                    <Button
                      variant="link"
                      size="sm"
                      className="h-auto p-0 text-xs text-primary"
                      onClick={(e) => {
                        e.stopPropagation()
                        setEditingNoteId(lead.id) // Need to handle note editing modal for mobile
                      }}
                    >
                      ערוך
                    </Button>
                  </div>
                </div>
              </details>

              {/* Action Buttons */}
              <div className="mt-2 flex justify-end gap-1">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon" className="h-7 w-7">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleRowClick(lead)}>צפה בפרטים</DropdownMenuItem>
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger>שנה אוטומציה</DropdownMenuSubTrigger>
                      <DropdownMenuSubContent>
                        {availableAutomations.map((automation) => (
                          <DropdownMenuSub key={automation.id}>
                            <DropdownMenuSubTrigger>{automation.name}</DropdownMenuSubTrigger>
                            <DropdownMenuSubContent>
                              {automation.channels.map((channel) => (
                                <DropdownMenuItem
                                  key={channel}
                                  onClick={() => handleAutomationChange(lead, automation.name, channel)}
                                >
                                  {channel}
                                </DropdownMenuItem>
                              ))}
                            </DropdownMenuSubContent>
                          </DropdownMenuSub>
                        ))}
                      </DropdownMenuSubContent>
                    </DropdownMenuSub>
                    <DropdownMenuItem onClick={() => alert("ערוך הערה (מובייל)")}>ערוך הערה</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-600">מחק</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detail Dialog */}
      <DetailDialog
        isOpen={isDetailOpen}
        setIsOpen={setIsDetailOpen}
        item={selectedLead}
        itemType="lead"
        availableAutomations={availableAutomations}
        automationContent={automationContent}
        notes={notes}
        handleNoteChange={handleNoteChange}
        saveNote={saveNote}
        handleAutomationChange={handleAutomationChange}
        getAutoResponseContent={getAutoResponseContent}
      />
    </>
  )
} 