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
import type { Lead } from "@/lib/types"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface LeadsChartsProps {
  leads: Lead[]
  chartView?: string
}

export function LeadsCharts({ leads, chartView = "bar" }: LeadsChartsProps) {
  // Prepare data for charts
  const postLeadsData = leads.reduce((acc: any[], lead) => {
    const existingPost = acc.find((item) => item.postId === lead.post.id)
    if (existingPost) {
      existingPost.count += 1
    } else {
      acc.push({ postId: lead.post.id, count: 1, name: `פוסט #${lead.post.id}` })
    }
    return acc
  }, [])

  const sourceData = leads.reduce((acc: any[], lead) => {
    const existingSource = acc.find((item) => item.name === lead.source)
    if (existingSource) {
      existingSource.value += 1
    } else {
      acc.push({ name: lead.source, value: 1 })
    }
    return acc
  }, [])

  const statusData = [
    {
      name: "סטטיסטיקה",
      חדש: leads.filter((lead) => lead.status === "חדש").length,
      פתוח: leads.filter((lead) => lead.status === "פתוח").length,
      סגור: leads.filter((lead) => lead.status === "סגור").length,
    },
  ]

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

  return (
    <div className="space-y-4">
      <Tabs defaultValue="posts">
        <TabsList className="w-full grid grid-cols-3 h-8">
          <TabsTrigger value="posts" className="text-xs">
            פוסטים
          </TabsTrigger>
          <TabsTrigger value="sources" className="text-xs">
            מקורות
          </TabsTrigger>
          <TabsTrigger value="status" className="text-xs">
            סטטוס
          </TabsTrigger>
        </TabsList>

        <TabsContent value="posts" className="mt-2">
          <div className="h-[250px]">
            {chartView === "bar" && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={postLeadsData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: 10, bottom: 0 }} />
                  <Bar dataKey="count" name="מספר לידים" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            )}

            {chartView === "line" && (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={postLeadsData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: 10, bottom: 0 }} />
                  <Line type="monotone" dataKey="count" name="מספר לידים" stroke="#8884d8" />
                </LineChart>
              </ResponsiveContainer>
            )}

            {chartView === "pie" && (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={postLeadsData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {postLeadsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </TabsContent>

        <TabsContent value="sources" className="mt-2">
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sourceData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {sourceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </TabsContent>

        <TabsContent value="status" className="mt-2">
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statusData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 10, bottom: 0 }} />
                <Bar dataKey="חדש" fill="#8884d8" />
                <Bar dataKey="פתוח" fill="#82ca9d" />
                <Bar dataKey="סגור" fill="#ffc658" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

