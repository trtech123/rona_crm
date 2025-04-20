"use client"

import React from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LeadsTabView } from "./leads/LeadsTabView" // Adjusted path
// Import ResponsesTabView when it's ready
import { ResponsesTabView } from "./responses/ResponsesTabView" // Import the component

export default function DashboardMain() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">דשבורד לידים ותגובות</h2>
        {/* Add any header controls here if needed */}
      </div>
      <Tabs defaultValue="leads" className="space-y-4">
        <TabsList>
          <TabsTrigger value="leads">לידים</TabsTrigger>
          <TabsTrigger value="responses">תגובות</TabsTrigger>
          {/* Add other tabs here if needed */}
        </TabsList>
        <TabsContent value="leads" className="space-y-4">
          <LeadsTabView />
        </TabsContent>
        <TabsContent value="responses" className="space-y-4">
          {/* Placeholder for Responses Tab View */}
          {/* <div className="flex items-center justify-center h-64 border rounded-md bg-muted/30">
            <p className="text-muted-foreground">תצוגת תגובות תופיע כאן</p>
          </div> */}
          <ResponsesTabView /> {/* Render the actual component */}
        </TabsContent>
      </Tabs>
    </div>
  )
}
