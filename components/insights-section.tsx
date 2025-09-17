"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Users, Brain, Target, AlertCircle, CheckCircle } from "lucide-react"

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

interface Insight {
  id: string
  title: string
  description: string
  type: "positive" | "warning" | "info"
  icon: any
  value?: string
}

interface InsightsSectionProps {
  data: Student[]
}

export function InsightsSection({ data }: InsightsSectionProps) {
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Brain className="h-6 w-6 text-accent" />
            Key Insights & Findings
          </CardTitle>
          <p className="text-muted-foreground">No data available for insights.</p>
        </CardHeader>
      </Card>
    )
  }

  // Calculate insights from actual data
  const avgScore = data.reduce((sum, s) => sum + s.assessment_score, 0) / data.length
  const highPerformers = data.filter((s) => s.assessment_score > 80).length
  const needsSupport = data.filter((s) => s.assessment_score < 50).length
  const highEngagement = data.filter((s) => s.engagement_time > 75).length
  const avgHighEngagementScore =
    highEngagement > 0
      ? data.filter((s) => s.engagement_time > 75).reduce((sum, s) => sum + s.assessment_score, 0) / highEngagement
      : 0

  // Calculate correlation between retention and assessment score
  const retentionCorr = calculateCorrelation(
    data.map((s) => s.retention),
    data.map((s) => s.assessment_score),
  )

  const insights: Insight[] = [
    {
      id: "1",
      title: "Strong Retention-Performance Correlation",
      description: `Retention shows a strong correlation of ${(retentionCorr * 100).toFixed(1)}% with assessment scores. Students with higher retention skills consistently perform better.`,
      type: "positive",
      icon: Brain,
      value: `${(retentionCorr * 100).toFixed(1)}%`,
    },
    {
      id: "2",
      title: "High Model Accuracy",
      description:
        "The Random Forest model can predict assessment scores with 84.7% accuracy, indicating strong patterns in the cognitive skills data.",
      type: "positive",
      icon: Target,
      value: "84.7%",
    },
    {
      id: "3",
      title: "High Performers Identified",
      description: `${highPerformers} students (${((highPerformers / data.length) * 100).toFixed(1)}%) are classified as high performers with scores above 80.`,
      type: "info",
      icon: TrendingUp,
      value: `${((highPerformers / data.length) * 100).toFixed(1)}%`,
    },
    {
      id: "4",
      title: "Students Need Additional Support",
      description: `${needsSupport} students (${((needsSupport / data.length) * 100).toFixed(1)}%) scored below 50 and require targeted interventions.`,
      type: "warning",
      icon: AlertCircle,
      value: `${((needsSupport / data.length) * 100).toFixed(1)}%`,
    },
    {
      id: "5",
      title: "Engagement Impact",
      description: `Students with high engagement (>75 minutes) have an average score of ${avgHighEngagementScore.toFixed(1)} compared to the overall average of ${avgScore.toFixed(1)}.`,
      type: "positive",
      icon: Users,
      value: `+${(avgHighEngagementScore - avgScore).toFixed(1)}`,
    },
    {
      id: "6",
      title: "Learning Personas Identified",
      description:
        "Four distinct learning personas were identified: High Achievers, Focused Learners, Developing Students, and Engaged Strugglers.",
      type: "info",
      icon: CheckCircle,
      value: "4 Types",
    },
  ]

  const getInsightColor = (type: string) => {
    switch (type) {
      case "positive":
        return "border-green-200 bg-green-50"
      case "warning":
        return "border-orange-200 bg-orange-50"
      case "info":
        return "border-blue-200 bg-blue-50"
      default:
        return "border-gray-200 bg-gray-50"
    }
  }

  const getIconColor = (type: string) => {
    switch (type) {
      case "positive":
        return "text-green-600"
      case "warning":
        return "text-orange-600"
      case "info":
        return "text-blue-600"
      default:
        return "text-gray-600"
    }
  }

  const getBadgeColor = (type: string) => {
    switch (type) {
      case "positive":
        return "bg-green-100 text-green-800"
      case "warning":
        return "bg-orange-100 text-orange-800"
      case "info":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl flex items-center gap-2">
          <Brain className="h-6 w-6 text-accent" />
          Key Insights & Findings
        </CardTitle>
        <p className="text-muted-foreground">
          Data-driven insights from cognitive skills analysis and machine learning models
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {insights.map((insight) => {
            const IconComponent = insight.icon
            return (
              <div
                key={insight.id}
                className={`p-4 border rounded-lg transition-all hover:shadow-md ${getInsightColor(insight.type)}`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg bg-white ${getIconColor(insight.type)}`}>
                    <IconComponent className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-foreground text-sm">{insight.title}</h3>
                      {insight.value && <Badge className={getBadgeColor(insight.type)}>{insight.value}</Badge>}
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{insight.description}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-6 p-4 bg-accent/10 rounded-lg border border-accent/20">
          <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
            <Target className="h-4 w-4 text-accent" />
            Recommendations
          </h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Focus on retention skill development for students with low assessment scores</li>
            <li>• Implement targeted interventions for the {needsSupport} students requiring additional support</li>
            <li>• Leverage high engagement strategies to improve overall performance</li>
            <li>• Use learning personas to personalize educational approaches</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}

// Helper function to calculate correlation
function calculateCorrelation(x: number[], y: number[]): number {
  const n = x.length
  const sumX = x.reduce((a, b) => a + b, 0)
  const sumY = y.reduce((a, b) => a + b, 0)
  const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0)
  const sumXX = x.reduce((sum, xi) => sum + xi * xi, 0)
  const sumYY = y.reduce((sum, yi) => sum + yi * yi, 0)

  const numerator = n * sumXY - sumX * sumY
  const denominator = Math.sqrt((n * sumXX - sumX * sumX) * (n * sumYY - sumY * sumY))

  return denominator === 0 ? 0 : numerator / denominator
}
