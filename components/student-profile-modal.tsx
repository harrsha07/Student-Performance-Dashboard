"use client"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { User, AlertTriangle, CheckCircle, Download } from "lucide-react"
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
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

interface StudentProfileModalProps {
  student: Student | null
  isOpen: boolean
  onClose: () => void
}

export function StudentProfileModal({ student, isOpen, onClose }: StudentProfileModalProps) {
  if (!student) return null

  const getPerformanceLevel = (score: number) => {
    if (score >= 85) return { level: "Excellent", color: "text-green-600", bg: "bg-green-100" }
    if (score >= 75) return { level: "Good", color: "text-blue-600", bg: "bg-blue-100" }
    if (score >= 65) return { level: "Average", color: "text-yellow-600", bg: "bg-yellow-100" }
    return { level: "Needs Improvement", color: "text-red-600", bg: "bg-red-100" }
  }

  const getLearningPersona = (student: Student) => {
    const avgCognitive = (student.comprehension + student.attention + student.focus + student.retention) / 4
    if (student.assessment_score >= 85 && avgCognitive >= 80) return { persona: "High Achiever", color: "bg-green-500" }
    if (student.focus >= 75 && student.attention >= 70) return { persona: "Focused Learner", color: "bg-blue-500" }
    if (student.engagement_time >= 70) return { persona: "Engaged Struggler", color: "bg-orange-500" }
    return { persona: "Developing Student", color: "bg-purple-500" }
  }

  const radarData = [
    { skill: "Comprehension", value: student.comprehension, fullMark: 100 },
    { skill: "Attention", value: student.attention, fullMark: 100 },
    { skill: "Focus", value: student.focus, fullMark: 100 },
    { skill: "Retention", value: student.retention, fullMark: 100 },
    { skill: "Assessment", value: student.assessment_score, fullMark: 100 },
    { skill: "Engagement", value: student.engagement_time, fullMark: 100 },
  ]

  // Mock historical data for trend analysis
  const trendData = [
    { month: "Jan", score: student.assessment_score - 15 },
    { month: "Feb", score: student.assessment_score - 10 },
    { month: "Mar", score: student.assessment_score - 5 },
    { month: "Apr", score: student.assessment_score },
  ]

  const performance = getPerformanceLevel(student.assessment_score)
  const persona = getLearningPersona(student)

  const recommendations = [
    {
      type: student.attention < 70 ? "warning" : "success",
      title: student.attention < 70 ? "Attention Enhancement" : "Strong Attention Skills",
      description:
        student.attention < 70
          ? "Consider shorter study sessions with frequent breaks to improve attention span."
          : "Excellent attention skills. Continue with current learning strategies.",
    },
    {
      type: student.retention < 75 ? "warning" : "success",
      title: student.retention < 75 ? "Memory Improvement" : "Good Retention",
      description:
        student.retention < 75
          ? "Implement spaced repetition and active recall techniques to boost retention."
          : "Strong retention abilities. Consider peer tutoring opportunities.",
    },
    {
      type: student.engagement_time < 65 ? "warning" : "success",
      title: student.engagement_time < 65 ? "Engagement Boost" : "High Engagement",
      description:
        student.engagement_time < 65
          ? "Introduce more interactive and hands-on learning activities."
          : "Excellent engagement levels. Consider advanced or enrichment activities.",
    },
  ]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <User className="h-5 w-5" />
            <span>{student.name}</span>
            <Badge variant="outline">{student.student_id}</Badge>
          </DialogTitle>
          <DialogDescription>Class {student.class} • Detailed Performance Analysis</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="skills">Cognitive Skills</TabsTrigger>
            <TabsTrigger value="trends">Performance Trends</TabsTrigger>
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Overall Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{student.assessment_score.toFixed(1)}</div>
                  <Badge className={`${performance.bg} ${performance.color} mt-1`}>{performance.level}</Badge>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Learning Persona</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${persona.color}`}></div>
                    <span className="font-medium">{persona.persona}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Engagement Time</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{student.engagement_time.toFixed(1)}h</div>
                  <div className="text-sm text-muted-foreground">per week</div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Skill Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Comprehension</span>
                    <span>{student.comprehension.toFixed(1)}%</span>
                  </div>
                  <Progress value={student.comprehension} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Attention</span>
                    <span>{student.attention.toFixed(1)}%</span>
                  </div>
                  <Progress value={student.attention} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Focus</span>
                    <span>{student.focus.toFixed(1)}%</span>
                  </div>
                  <Progress value={student.focus} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Retention</span>
                    <span>{student.retention.toFixed(1)}%</span>
                  </div>
                  <Progress value={student.retention} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="skills" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Cognitive Skills Radar</CardTitle>
                <CardDescription>Visual representation of all cognitive abilities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={radarData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="skill" />
                      <PolarRadiusAxis angle={90} domain={[0, 100]} />
                      <Radar
                        name="Skills"
                        dataKey="value"
                        stroke="hsl(var(--primary))"
                        fill="hsl(var(--primary))"
                        fillOpacity={0.3}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trends" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Performance Trend</CardTitle>
                <CardDescription>Assessment score progression over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={trendData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="score" stroke="hsl(var(--primary))" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="recommendations" className="space-y-4">
            <div className="space-y-4">
              {recommendations.map((rec, index) => (
                <Card key={index}>
                  <CardContent className="pt-6">
                    <div className="flex items-start space-x-3">
                      {rec.type === "warning" ? (
                        <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
                      ) : (
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      )}
                      <div>
                        <h4 className="font-medium">{rec.title}</h4>
                        <p className="text-sm text-muted-foreground mt-1">{rec.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Export Profile
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
