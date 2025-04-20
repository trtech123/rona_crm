"use client"

import { useEffect, useState } from "react"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { mockPostAnalytics } from "@/lib/mock-data"

interface PostAnalyticsChartProps {
  postId: number
}

export function PostAnalyticsChart({ postId }: PostAnalyticsChartProps) {
  const [data, setData] = useState<any[]>([])

  useEffect(() => {
    // In a real app, you would fetch this data from an API
    // For now, we'll use mock data
    const analyticsData = mockPostAnalytics[postId] || []
    setData(analyticsData)
  }, [postId])

  return (
    <div className="h-[150px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{
            top: 5,
            right: 0,
            left: 0,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" tick={{ fontSize: 10 }} />
          <YAxis tick={{ fontSize: 10 }} />
          <Tooltip />
          <Area type="monotone" dataKey="leads" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
          <Area type="monotone" dataKey="responses" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.3} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

