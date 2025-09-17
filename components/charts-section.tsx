"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts"

interface Student {
  student_id: string
  name: string
  class: string
  comprehension: number
  attention: number
  focus: number
  retention: number
  assessment_score: number
  engagement_time: number
}

interface ChartsSectionProps {
  data: Student[]
}

export function ChartsSection({ data }: ChartsSectionProps) {
  if (!data || data.length === 0) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-muted rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-muted rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  // Calculate skills data from actual student data
  const skillsData = [
    {
      skill: "Comprehension",
      avgScore: data.reduce((sum, s) => sum + s.comprehension, 0) / data.length,
      students: data.length,
    },
    {
      skill: "Attention",
      avgScore: data.reduce((sum, s) => sum + s.attention, 0) / data.length,
      students: data.length,
    },
    {
      skill: "Focus",
      avgScore: data.reduce((sum, s) => sum + s.focus, 0) / data.length,
      students: data.length,
    },
    {
      skill: "Retention",
      avgScore: data.reduce((sum, s) => sum + s.retention, 0) / data.length,
      students: data.length,
    },
  ]

  // Use actual student data for scatter plot
  const scatterData = data.map((student) => ({
    attention: student.attention,
    performance: student.assessment_score,
    focus: student.focus,
  }))

  // Calculate radar data from actual averages
  const radarData = [
    { skill: "Comprehension", value: skillsData[0].avgScore, fullMark: 100 },
    { skill: "Attention", value: skillsData[1].avgScore, fullMark: 100 },
    { skill: "Focus", value: skillsData[2].avgScore, fullMark: 100 },
    { skill: "Retention", value: skillsData[3].avgScore, fullMark: 100 },
    { skill: "Assessment", value: data.reduce((sum, s) => sum + s.assessment_score, 0) / data.length, fullMark: 100 },
    { skill: "Engagement", value: data.reduce((sum, s) => sum + s.engagement_time, 0) / data.length, fullMark: 100 },
  ]

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-foreground">Data Visualizations</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bar Chart - Skills vs Scores */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Cognitive Skills Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={skillsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="skill" tick={{ fontSize: 12 }} angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="avgScore" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Scatter Chart - Attention vs Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Attention vs Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <ScatterChart data={scatterData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="attention" name="Attention Score" domain={[0, 100]} />
                <YAxis dataKey="performance" name="Assessment Score" domain={[0, 100]} />
                <Tooltip
                  cursor={{ strokeDasharray: "3 3" }}
                  formatter={(value, name) => [value.toFixed(1), name === "attention" ? "Attention" : "Performance"]}
                />
                <Scatter dataKey="performance" fill="hsl(var(--chart-2))" />
              </ScatterChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Radar Chart - Student Profile */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Average Student Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="skill" tick={{ fontSize: 12 }} />
                <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10 }} />
                <Radar
                  name="Score"
                  dataKey="value"
                  stroke="hsl(var(--chart-3))"
                  fill="hsl(var(--chart-3))"
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
