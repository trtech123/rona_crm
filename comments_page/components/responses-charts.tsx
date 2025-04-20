"use client"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts"
import type { Response } from "@/lib/types"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface ResponsesChartsProps {
  responses: Response[]
  chartView?: string
}

export function ResponsesCharts({ responses, chartView = "bar" }: ResponsesChartsProps) {
  // Prepare data for charts
  const postResponsesData = responses.reduce((acc: any[], response) => {
    const existingPost = acc.find((item) => item.postId === response.post.id)
    if (existingPost) {
      existingPost.count += 1
    } else {
      acc.push({
        postId: response.post.id,
        count: 1,
        name: `פוסט #${response.post.id}`,
      })
    }
    return acc
  }, [])

  // Create hourly data
  const hourlyData = Array.from({ length: 24 }, (_, i) => ({
    hour: i,
    count: 0,
    name: `${i}:00`,
  }))

  responses.forEach((response) => {
    const hour = new Date(response.date).getHours()
    const hourData = hourlyData.find((data) => data.hour === hour)
    if (hourData) {
      hourData.count += 1
    }
  })

  const tagData = responses.reduce((acc: any[], response) => {
    const existingTag = acc.find((item) => item.name === response.autoTag)
    if (existingTag) {
      existingTag.value += 1
    } else {
      acc.push({ name: response.autoTag, value: 1 })
    }
    return acc
  }, [])

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

  return (
    <div className="space-y-4">
      <Tabs defaultValue="posts">
        <TabsList className="w-full grid grid-cols-3 h-8">
          <TabsTrigger value="posts" className="text-xs">
            פוסטים
          </TabsTrigger>
          <TabsTrigger value="hourly" className="text-xs">
            שעות
          </TabsTrigger>
          <TabsTrigger value="tags" className="text-xs">
            תגיות
          </TabsTrigger>
        </TabsList>

        <TabsContent value="posts" className="mt-2">
          <div className="h-[250px]">
            {chartView === "bar" && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={postResponsesData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: 10, bottom: 0 }} />
                  <Bar dataKey="count" name="מספר תגובות" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            )}

            {chartView === "line" && (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={postResponsesData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: 10, bottom: 0 }} />
                  <Line type="monotone" dataKey="count" name="מספר תגובות" stroke="#8884d8" />
                </LineChart>
              </ResponsiveContainer>
            )}

            {chartView === "pie" && (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={postResponsesData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {postResponsesData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </TabsContent>

        <TabsContent value="hourly" className="mt-2">
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hourlyData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 10, bottom: 0 }} />
                <Bar dataKey="count" name="מספר תגובות" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </TabsContent>

        <TabsContent value="tags" className="mt-2">
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={tagData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {tagData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

