"use client"

import React from "react"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import LeadsTab from "@/components/leads-tab"
import ResponsesTab from "@/components/responses-tab"
import { TopPerformers } from "@/components/top-performers"
import { mockLeads } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import { ChevronDown, Home, HelpCircle, BarChart3, PieChart, LineChart, Filter, Search } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Card, CardContent } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Input } from "@/components/ui/input"
import { useSearchParams, useRouter } from "next/navigation"

export default function Dashboard() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const postIdFilter = searchParams.get("postId")

  const [activeTab, setActiveTab] = useState("leads")
  const [showFilters, setShowFilters] = useState(false)
  const [showTopPerformers, setShowTopPerformers] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeChartView, setActiveChartView] = useState("bar")

  // If there's a postId filter, make sure we're on the leads tab
  React.useEffect(() => {
    if (postIdFilter) {
      setActiveTab("leads")
    }
  }, [postIdFilter])

  // Find the top performing post
  const topLeadPost = mockLeads.reduce((max, lead) => (lead.postId > max.postId ? lead : max), mockLeads[0])

  return (
    <div className="space-y-4">
      {/* Header with collapsible search */}
      <div className="flex flex-col space-y-2">
        <div className="flex items-center justify-between">
          <h1 className="text-xl md:text-3xl font-bold tracking-tight">ניתוח תגובות ולידים</h1>
          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
                    <HelpCircle className="h-5 w-5" />
                    <span className="sr-only">עזרה</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>מרכז העזרה</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1 h-9 px-3"
              onClick={() => (window.location.href = "/")}
            >
              <Home className="h-4 w-4 ml-1" />
              <span className="hidden sm:inline">מסך ראשי</span>
            </Button>
          </div>
        </div>

        {/* Collapsible search and filters */}
        <Collapsible>
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground text-sm">צפה בנתוני הלידים והתגובות מהפוסטים שלך וקבל תובנות עסקיות</p>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm">
                <Search className="h-4 w-4 ml-1" />
                <span className="hidden sm:inline">חיפוש ופילטרים</span>
                <ChevronDown className="h-4 w-4 mr-1" />
              </Button>
            </CollapsibleTrigger>
          </div>

          <CollapsibleContent>
            <div className="mt-2 space-y-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="חיפוש לידים ותגובות..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-full"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                  className={showFilters ? "bg-muted" : ""}
                >
                  <Filter className="h-4 w-4 ml-1" />
                  פילטרים
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowTopPerformers(!showTopPerformers)}
                  className={showTopPerformers ? "bg-muted" : ""}
                >
                  <BarChart3 className="h-4 w-4 ml-1" />
                  מובילים
                </Button>

                <div className="flex rounded-md border overflow-hidden">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`rounded-none px-2 ${activeChartView === "bar" ? "bg-muted" : ""}`}
                    onClick={() => setActiveChartView("bar")}
                  >
                    <BarChart3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`rounded-none px-2 ${activeChartView === "line" ? "bg-muted" : ""}`}
                    onClick={() => setActiveChartView("line")}
                  >
                    <LineChart className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`rounded-none px-2 ${activeChartView === "pie" ? "bg-muted" : ""}`}
                    onClick={() => setActiveChartView("pie")}
                  >
                    <PieChart className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {showFilters && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 pt-2 border-t">
                  <div>
                    <label className="text-xs font-medium">סטטוס</label>
                    <select className="w-full mt-1 text-sm rounded-md border border-input bg-background px-3 py-1">
                      <option value="">הכל</option>
                      <option value="new">חדש</option>
                      <option value="open">פתוח</option>
                      <option value="closed">סגור</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-medium">מקור</label>
                    <select className="w-full mt-1 text-sm rounded-md border border-input bg-background px-3 py-1">
                      <option value="">הכל</option>
                      <option value="post">פוסט</option>
                      <option value="form">טופס</option>
                      <option value="campaign">קמפיין</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-medium">תאריך</label>
                    <input
                      type="date"
                      className="w-full mt-1 text-sm rounded-md border border-input bg-background px-3 py-1"
                    />
                  </div>
                </div>
              )}
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>

      {/* Top performers section - collapsible */}
      {showTopPerformers && (
        <Card>
          <CardContent className="p-3">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-semibold">מובילים</h2>
              <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                <ChevronDown className="h-4 w-4" />
              </Button>
            </div>
            <TopPerformers leads={mockLeads} />
          </CardContent>
        </Card>
      )}

      {/* Tabs */}
      <Tabs defaultValue="leads" value={activeTab} onValueChange={setActiveTab} className="space-y-2">
        <TabsList className="grid w-full max-w-md grid-cols-2 p-1 h-10">
          <TabsTrigger value="leads" className="text-sm py-2">
            לידים
          </TabsTrigger>
          <TabsTrigger value="responses" className="text-sm py-2">
            תגובות
          </TabsTrigger>
        </TabsList>
        <TabsContent value="leads" className="space-y-4 mt-0">
          <LeadsTab searchQuery={searchQuery} chartView={activeChartView} postIdFilter={postIdFilter} />
        </TabsContent>
        <TabsContent value="responses" className="space-y-4 mt-0">
          <ResponsesTab searchQuery={searchQuery} chartView={activeChartView} postIdFilter={postIdFilter} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

