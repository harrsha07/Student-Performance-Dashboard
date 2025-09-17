"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from "recharts"
import { Users, Target, AlertCircle, CheckCircle } from "lucide-react"

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

interface AdvancedAnalyticsProps {
  data: Student[]
}

export function AdvancedAnalytics({ data }: AdvancedAnalyticsProps) {
  // Correlation Analysis
  const calculateCorrelation = (x: number[], y: number[]) => {
    const n = x.length
    const sumX = x.reduce((a, b) => a + b, 0)
    const sumY = y.reduce((a, b) => a + b, 0)
    const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0)
    const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0)
    const sumY2 = y.reduce((sum, yi) => sum + yi * yi, 0)

    return (n * sumXY - sumX * sumY) / Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY))
  }

  const correlations = [
    {
      pair: "Comprehension vs Assessment",
      value: calculateCorrelation(
        data.map((s) => s.comprehension),
        data.map((s) => s.assessment_score),
      ),
    },
    {
      pair: "Attention vs Assessment",
      value: calculateCorrelation(
        data.map((s) => s.attention),
        data.map((s) => s.assessment_score),
      ),
    },
    {
      pair: "Focus vs Retention",
      value: calculateCorrelation(
        data.map((s) => s.focus),
        data.map((s) => s.retention),
      ),
    },
    {
      pair: "Engagement vs Performance",
      value: calculateCorrelation(
        data.map((s) => s.engagement_time),
        data.map((s) => s.assessment_score),
      ),
    },
  ]

  // Class Performance Analysis
  const classAnalysis = data.reduce((acc, student) => {
    if (!acc[student.class]) {
      acc[student.class] = {
        class: student.class,
        students: 0,
        avgScore: 0,
        avgEngagement: 0,
        highPerformers: 0,
        needsSupport: 0,
      }
    }

    acc[student.class].students += 1
    acc[student.class].avgScore += student.assessment_score
    acc[student.class].avgEngagement += student.engagement_time

    if (student.assessment_score >= 80) acc[student.class].highPerformers += 1
    if (student.assessment_score < 60) acc[student.class].needsSupport += 1

    return acc
  }, {} as any)

  Object.values(classAnalysis).forEach((cls: any) => {
    cls.avgScore = cls.avgScore / cls.students
    cls.avgEngagement = cls.avgEngagement / cls.students
  })

  const classData = Object.values(classAnalysis)

  // Performance Distribution
  const performanceRanges = [
    { range: "90-100", count: data.filter((s) => s.assessment_score >= 90).length, color: "#22c55e" },
    {
      range: "80-89",
      count: data.filter((s) => s.assessment_score >= 80 && s.assessment_score < 90).length,
      color: "#3b82f6",
    },
    {
      range: "70-79",
      count: data.filter((s) => s.assessment_score >= 70 && s.assessment_score < 80).length,
      color: "#f59e0b",
    },
    {
      range: "60-69",
      count: data.filter((s) => s.assessment_score >= 60 && s.assessment_score < 70).length,
      color: "#ef4444",
    },
    { range: "Below 60", count: data.filter((s) => s.assessment_score < 60).length, color: "#dc2626" },
  ]

  // Skill Gaps Analysis
  const skillAverages = {
    comprehension: data.reduce((sum, s) => sum + s.comprehension, 0) / data.length,
    attention: data.reduce((sum, s) => sum + s.attention, 0) / data.length,
    focus: data.reduce((sum, s) => sum + s.focus, 0) / data.length,
    retention: data.reduce((sum, s) => sum + s.retention, 0) / data.length,
  }

  const skillGaps = Object.entries(skillAverages).map(([skill, avg]) => ({
    skill: skill.charAt(0).toUpperCase() + skill.slice(1),
    average: avg,
    gap: 85 - avg, // Target is 85%
    needsImprovement: avg < 75,
  }))

  // Risk Assessment
  const riskStudents = data.filter((student) => {
    const avgCognitive = (student.comprehension + student.attention + student.focus + student.retention) / 4
    return student.assessment_score < 65 || avgCognitive < 65 || student.engagement_time < 50
  })

  return (
    <div className="space-y-6">
      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Users className="h-4 w-4 mr-2" />
              Total Students
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.length}</div>
            <p className="text-xs text-muted-foreground">Across all classes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Target className="h-4 w-4 mr-2" />
              Average Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(data.reduce((sum, s) => sum + s.assessment_score, 0) / data.length).toFixed(1)}
            </div>
            <p className="text-xs text-muted-foreground">Out of 100</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
              High Performers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {data.filter((s) => s.assessment_score >= 80).length}
            </div>
            <p className="text-xs text-muted-foreground">Score ≥ 80</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <AlertCircle className="h-4 w-4 mr-2 text-red-500" />
              At Risk
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{riskStudents.length}</div>
            <p className="text-xs text-muted-foreground">Need support</p>
          </CardContent>
        </Card>
      </div>

      {/* Correlation Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Correlation Analysis</CardTitle>
          <CardDescription>
            Statistical relationships between different cognitive skills and performance metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {correlations.map((corr, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">{corr.pair}</span>
                  <Badge
                    variant={
                      Math.abs(corr.value) > 0.7 ? "default" : Math.abs(corr.value) > 0.4 ? "secondary" : "outline"
                    }
                  >
                    {corr.value.toFixed(3)}
                  </Badge>
                </div>
                <Progress value={Math.abs(corr.value) * 100} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  {Math.abs(corr.value) > 0.7 ? "Strong" : Math.abs(corr.value) > 0.4 ? "Moderate" : "Weak"} correlation
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Class Performance Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Class Performance Analysis</CardTitle>
          <CardDescription>Comparative analysis across different classes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={classData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="class" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="avgScore" fill="hsl(var(--primary))" name="Average Score" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Performance Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Performance Distribution</CardTitle>
            <CardDescription>Student distribution across score ranges</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={performanceRanges}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="count"
                    label={({ range, count }) => `${range}: ${count}`}
                  >
                    {performanceRanges.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Skill Gap Analysis</CardTitle>
            <CardDescription>Areas requiring improvement (Target: 85%)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {skillGaps.map((skill, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">{skill.skill}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm">{skill.average.toFixed(1)}%</span>
                    {skill.needsImprovement && <AlertCircle className="h-4 w-4 text-red-500" />}
                  </div>
                </div>
                <Progress value={skill.average} className="h-2" />
                <p className="text-xs text-muted-foreground">Gap to target: {skill.gap.toFixed(1)} points</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* At-Risk Students */}
      {riskStudents.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertCircle className="h-5 w-5 mr-2 text-red-500" />
              Students Requiring Immediate Attention
            </CardTitle>
            <CardDescription>Students with low performance or engagement metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {riskStudents.slice(0, 6).map((student, index) => (
                <div key={index} className="p-4 border rounded-lg space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{student.name}</span>
                    <Badge variant="destructive">{student.class}</Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Score: {student.assessment_score.toFixed(1)} | Engagement: {student.engagement_time.toFixed(1)}h
                  </div>
                  <div className="text-xs">
                    Primary concerns:
                    {student.assessment_score < 65 && " Low scores"}
                    {student.engagement_time < 50 && " Low engagement"}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
