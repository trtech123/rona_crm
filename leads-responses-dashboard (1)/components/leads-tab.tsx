"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { LeadsTable } from "@/components/leads-table"
import { LeadsCharts } from "@/components/leads-charts"
import { ChevronDown, ChevronUp } from "lucide-react"
import { mockLeads } from "@/lib/mock-data"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

interface LeadsTabProps {
  searchQuery?: string
  chartView?: string
  postIdFilter?: string | null
}

export default function LeadsTab({ searchQuery = "", chartView = "bar", postIdFilter = null }: LeadsTabProps) {
  const [showCharts, setShowCharts] = useState(true)

  // Filter leads based on search query and postId filter
  const filteredLeads = mockLeads.filter((lead) => {
    // Apply postId filter if it exists
    if (postIdFilter && lead.post.id.toString() !== postIdFilter) {
      return false
    }

    // Apply search query filter
    return (
      lead.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.phone.includes(searchQuery) ||
      lead.source.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })

  return (
    <div className="space-y-4">
      {postIdFilter && (
        <div className="bg-blue-50 p-2 rounded-md mb-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">מציג לידים מפוסט #{postIdFilter}</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-xs"
              onClick={() => {
                // Remove the postId filter from the URL
                const url = new URL(window.location.href)
                url.searchParams.delete("postId")
                window.history.pushState({}, "", url)
                window.location.reload()
              }}
            >
              נקה סינון
            </Button>
          </div>
        </div>
      )}

      <LeadsTable leads={filteredLeads} />

      {/* Collapsible charts section */}
      <Collapsible open={showCharts} onOpenChange={setShowCharts}>
        <Card>
          <CardContent className="p-0">
            <CollapsibleTrigger asChild>
              <div className="flex items-center justify-between p-3 cursor-pointer hover:bg-muted/50">
                <h3 className="text-sm font-medium">גרפים וניתוח נתונים</h3>
                <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                  {showCharts ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
              </div>
            </CollapsibleTrigger>

            <CollapsibleContent>
              <div className="p-3 pt-0 border-t">
                <LeadsCharts leads={filteredLeads} chartView={chartView} />
              </div>
            </CollapsibleContent>
          </CardContent>
        </Card>
      </Collapsible>
    </div>
  )
}

