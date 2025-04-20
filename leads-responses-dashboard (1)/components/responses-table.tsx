"use client"

import { DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

import type React from "react"

import { useState } from "react"
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
import {
  Mail,
  Phone,
  MoreHorizontal,
  MessageSquare,
  Link,
  Share2,
  Copy,
  Bot,
  Sparkles,
  ChevronDown,
} from "lucide-react"
import { PostPreview } from "@/components/post-preview"
import { PostHoverCard } from "@/components/post-hover-card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import type { Response } from "@/lib/types"
import { DetailDialog } from "@/components/detail-dialog"

interface ResponsesTableProps {
  responses: Response[]
}

export function ResponsesTable({ responses }: ResponsesTableProps) {
  const [selectedResponse, setSelectedResponse] = useState<Response | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [showAutoResponseOptions, setShowAutoResponseOptions] = useState(false)
  const [selectedResponses, setSelectedResponses] = useState<number[]>([])

  const socialNetworks = [
    { name: "פייסבוק", icon: "facebook" },
    { name: "אינסטגרם", icon: "instagram" },
    { name: "טוויטר", icon: "twitter" },
    { name: "וואטסאפ", icon: "whatsapp" },
    { name: "טלגרם", icon: "telegram" },
  ]

  const copyLink = () => {
    // Logic to copy link would go here
    alert("הקישור הועתק!")
  }

  const handleRowClick = (response: Response) => {
    try {
      if (!response) {
        console.error("Invalid response data: response is null or undefined")
        return
      }

      if (!response.post) {
        console.error("Invalid response data: response.post is null or undefined", response)
        return
      }

      // פתיחת הדיאלוג עם התגובה הנבחרת
      setSelectedResponse(response)
      setIsDetailOpen(true)
    } catch (error) {
      console.error("Error in handleRowClick:", error)
    }
  }

  const sendAutoResponse = (type: string) => {
    alert(
      `שליחת תגובה אוטומטית מסוג: ${type} ל-${selectedResponses.length > 0 ? selectedResponses.length : "כל"} התגובות הנבחרות`,
    )
    setShowAutoResponseOptions(false)
  }

  const toggleSelectResponse = (id: number, e: React.MouseEvent) => {
    e.stopPropagation()
    if (selectedResponses.includes(id)) {
      setSelectedResponses(selectedResponses.filter((responseId) => responseId !== id))
    } else {
      setSelectedResponses([...selectedResponses, id])
    }
  }

  const selectAllResponses = () => {
    if (selectedResponses.length === responses.length) {
      setSelectedResponses([])
    } else {
      setSelectedResponses(responses.map((response) => response.id))
    }
  }

  return (
    <>
      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40px]">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  checked={selectedResponses.length === responses.length && responses.length > 0}
                  onChange={selectAllResponses}
                />
              </TableHead>
              <TableHead>שם מגיב</TableHead>
              <TableHead>טקסט תגובה</TableHead>
              <TableHead>פלטפורמה</TableHead>
              <TableHead>תאריך</TableHead>
              <TableHead>פוסט</TableHead>
              <TableHead>סטטוס תגובה</TableHead>
              <TableHead>מענה אוטומטי</TableHead>
              <TableHead>הפך לליד</TableHead>
              <TableHead>תג אוטומטי</TableHead>
              <TableHead>פעולות</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {responses.map((response) => (
              <TableRow
                key={response.id}
                className={`cursor-pointer hover:bg-muted/50 ${selectedResponses.includes(response.id) ? "bg-blue-50" : ""}`}
                onClick={() => handleRowClick(response)}
              >
                <TableCell onClick={(e) => toggleSelectResponse(response.id, e)} className="pr-0">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    checked={selectedResponses.includes(response.id)}
                    onChange={() => {}}
                  />
                </TableCell>
                <TableCell className="font-medium">{response.name}</TableCell>
                <TableCell className="max-w-[200px] truncate">{response.text}</TableCell>
                <TableCell>
                  <Badge variant="outline">{response.platform}</Badge>
                </TableCell>
                <TableCell>{response.date}</TableCell>
                <TableCell>
                  <PostHoverCard post={response.post}>
                    <PostPreview post={response.post} size="small" />
                  </PostHoverCard>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      response.status === "ידנית" ? "default" : response.status === "אוטומטית" ? "secondary" : "outline"
                    }
                  >
                    {response.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
                        {response.status === "אוטומטית" ? (
                          <Badge variant="secondary">פעיל</Badge>
                        ) : (
                          <span className="text-muted-foreground">בחר מענה</span>
                        )}
                        <ChevronDown className="h-3 w-3 mr-1" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation()
                          alert(`החלפת מענה אוטומטי לתגובה של ${response.name}`)
                        }}
                      >
                        בקשת פרטים
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation()
                          alert(`החלפת מענה אוטומטי לתגובה של ${response.name}`)
                        }}
                      >
                        תיאום שיחה
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation()
                          alert(`החלפת מענה אוטומטי לתגובה של ${response.name}`)
                        }}
                      >
                        הזמנה לפגישה
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation()
                          alert(`ביטול מענה אוטומטי לתגובה של ${response.name}`)
                        }}
                      >
                        <span className="text-destructive">ביטול מענה</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
                <TableCell>
                  {response.convertedToLead ? (
                    <Badge variant="secondary">
                      <a href="#" className="underline" onClick={(e) => e.stopPropagation()}>
                        כן
                      </a>
                    </Badge>
                  ) : (
                    "לא"
                  )}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      response.autoTag === "שאלה"
                        ? "default"
                        : response.autoTag === "מעוניין"
                          ? "secondary"
                          : "destructive"
                    }
                  >
                    {response.autoTag}
                  </Badge>
                </TableCell>
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center space-x-1">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" onClick={() => copyLink()}>
                            <Link className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>העתק קישור</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <Button
                      variant="ghost"
                      size="icon"
                      title="תגובה חכמה"
                      onClick={() => alert(`תגובה חכמה לפוסט #${response.post.id}`)}
                    >
                      <Sparkles className="h-4 w-4" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" title="מענה אוטומטי">
                          <Bot className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem onClick={() => alert(`מענה אוטומטי: בקשת פרטים לפוסט #${response.post.id}`)}>
                          בקשת פרטים
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => alert(`מענה אוטומטי: תיאום שיחה לפוסט #${response.post.id}`)}>
                          תיאום שיחה
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => alert(`מענה אוטומטי: הזמנה לפגישה לפוסט #${response.post.id}`)}
                        >
                          הזמנה לפגישה
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <Button variant="ghost" size="icon" title="שלח אימייל">
                      <Mail className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" title="התקשר">
                      <Phone className="h-4 w-4" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem>
                          <MessageSquare className="h-4 w-4 ml-2" />
                          שלח הודעה
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => copyLink()}>
                          <Copy className="h-4 w-4 ml-2" />
                          העתק קישור
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuSub>
                          <DropdownMenuSubTrigger>
                            <Share2 className="h-4 w-4 ml-2" />
                            שתף ברשת
                          </DropdownMenuSubTrigger>
                          <DropdownMenuSubContent className="w-48">
                            {socialNetworks.map((network) => (
                              <DropdownMenuItem key={network.icon}>{network.name}</DropdownMenuItem>
                            ))}
                          </DropdownMenuSubContent>
                        </DropdownMenuSub>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>המר לליד</DropdownMenuItem>
                        <DropdownMenuItem>סמן כטופל</DropdownMenuItem>
                        <DropdownMenuItem>שנה תג</DropdownMenuItem>
                        <DropdownMenuItem>מחק</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <DetailDialog
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        item={selectedResponse}
        type="response"
        allData={responses}
      />
    </>
  )
}

