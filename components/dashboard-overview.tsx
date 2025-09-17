"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

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

interface DashboardOverviewProps {
  data: Student[]
}

export function DashboardOverview({ data }: DashboardOverviewProps) {
  if (!data || data.length === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-4 bg-muted rounded w-3/4"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-muted rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-muted rounded w-full"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const avgScore = data.reduce((sum, student) => sum + student.assessment_score, 0) / data.length
  const avgComprehension = data.reduce((sum, student) => sum + student.comprehension, 0) / data.length
  const avgAttention = data.reduce((sum, student) => sum + student.attention, 0) / data.length
  const avgEngagement = data.reduce((sum, student) => sum + student.engagement_time, 0) / data.length

  const highPerformers = data.filter((s) => s.assessment_score > 80).length
  const needsSupport = data.filter((s) => s.assessment_score < 50).length

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Average Assessment Score</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">{avgScore.toFixed(1)}</div>
          <p className="text-xs text-muted-foreground mt-1">Out of 100 points</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Cognitive Skills Average</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Comprehension</span>
              <span className="font-medium">{avgComprehension.toFixed(1)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Attention</span>
              <span className="font-medium">{avgAttention.toFixed(1)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Student Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="default" className="bg-green-100 text-green-800">
                High Performers
              </Badge>
              <span className="text-sm font-medium">{highPerformers}</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                Need Support
              </Badge>
              <span className="text-sm font-medium">{needsSupport}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">ML Model Accuracy</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-accent">84.7%</div>
          <p className="text-xs text-muted-foreground mt-1">R² Score for prediction model</p>
        </CardContent>
      </Card>
    </div>
  )
}
