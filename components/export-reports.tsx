"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, FileText, BarChart3, Users, Mail, Printer, Share2, Calendar } from "lucide-react"

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

interface ExportReportsProps {
  data: Student[]
}

export function ExportReports({ data }: ExportReportsProps) {
  const [selectedReports, setSelectedReports] = useState<string[]>([])
  const [exportFormat, setExportFormat] = useState("pdf")
  const [isExporting, setIsExporting] = useState(false)

  const reportTypes = [
    {
      id: "overview",
      title: "Performance Overview",
      description: "Summary statistics and key metrics",
      icon: BarChart3,
      estimatedPages: 2,
    },
    {
      id: "individual",
      title: "Individual Student Reports",
      description: "Detailed profiles for each student",
      icon: Users,
      estimatedPages: data.length * 2,
    },
    {
      id: "class-analysis",
      title: "Class Analysis",
      description: "Comparative analysis by class",
      icon: FileText,
      estimatedPages: 3,
    },
    {
      id: "correlations",
      title: "Correlation Analysis",
      description: "Statistical relationships between metrics",
      icon: BarChart3,
      estimatedPages: 2,
    },
    {
      id: "recommendations",
      title: "Recommendations Report",
      description: "Actionable insights and suggestions",
      icon: FileText,
      estimatedPages: 4,
    },
  ]

  const handleReportToggle = (reportId: string) => {
    setSelectedReports((prev) => (prev.includes(reportId) ? prev.filter((id) => id !== reportId) : [...prev, reportId]))
  }

  const handleExport = async () => {
    setIsExporting(true)

    // Simulate export process
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Generate mock data for download
    const reportData = generateReportData()

    if (exportFormat === "csv") {
      downloadCSV(reportData)
    } else if (exportFormat === "json") {
      downloadJSON(reportData)
    } else {
      // For PDF, we would typically use a library like jsPDF
      alert("PDF export would be implemented with a PDF generation library")
    }

    setIsExporting(false)
  }

  const generateReportData = () => {
    const summary = {
      totalStudents: data.length,
      averageScore: data.reduce((sum, s) => sum + s.assessment_score, 0) / data.length,
      highPerformers: data.filter((s) => s.assessment_score >= 80).length,
      needsSupport: data.filter((s) => s.assessment_score < 60).length,
      generatedAt: new Date().toISOString(),
    }

    return {
      summary,
      students: data,
      selectedReports,
      exportFormat,
    }
  }

  const downloadCSV = (reportData: any) => {
    const csvContent = [
      // Header
      "Student ID,Name,Class,Comprehension,Attention,Focus,Retention,Assessment Score,Engagement Time",
      // Data rows
      ...data.map(
        (student) =>
          `${student.student_id},${student.name},${student.class},${student.comprehension},${student.attention},${student.focus},${student.retention},${student.assessment_score},${student.engagement_time}`,
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `student-performance-report-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const downloadJSON = (reportData: any) => {
    const jsonContent = JSON.stringify(reportData, null, 2)
    const blob = new Blob([jsonContent], { type: "application/json" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `student-performance-report-${new Date().toISOString().split("T")[0]}.json`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const totalPages = selectedReports.reduce((total, reportId) => {
    const report = reportTypes.find((r) => r.id === reportId)
    return total + (report?.estimatedPages || 0)
  }, 0)

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Export Reports</CardTitle>
          <CardDescription>Generate comprehensive reports for student performance analysis</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Report Selection */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Select Reports to Include</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reportTypes.map((report) => {
                const Icon = report.icon
                const isSelected = selectedReports.includes(report.id)

                return (
                  <div
                    key={report.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      isSelected ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                    }`}
                    onClick={() => handleReportToggle(report.id)}
                  >
                    <div className="flex items-start space-x-3">
                      <Checkbox checked={isSelected} onChange={() => handleReportToggle(report.id)} />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <Icon className="h-4 w-4" />
                          <span className="font-medium">{report.title}</span>
                          <Badge variant="outline">{report.estimatedPages} pages</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{report.description}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Export Options */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Export Options</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Format</label>
                <Select value={exportFormat} onValueChange={setExportFormat}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pdf">PDF Report</SelectItem>
                    <SelectItem value="csv">CSV Data</SelectItem>
                    <SelectItem value="json">JSON Data</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Date Range</label>
                <Select defaultValue="current">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="current">Current Data</SelectItem>
                    <SelectItem value="month">Last Month</SelectItem>
                    <SelectItem value="quarter">Last Quarter</SelectItem>
                    <SelectItem value="year">Last Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Include</label>
                <Select defaultValue="all">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Students</SelectItem>
                    <SelectItem value="high">High Performers Only</SelectItem>
                    <SelectItem value="risk">At-Risk Students Only</SelectItem>
                    <SelectItem value="class">By Class</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Summary */}
          {selectedReports.length > 0 && (
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-medium mb-2">Export Summary</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Reports:</span>
                  <div className="font-medium">{selectedReports.length}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Est. Pages:</span>
                  <div className="font-medium">{totalPages}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Students:</span>
                  <div className="font-medium">{data.length}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Format:</span>
                  <div className="font-medium">{exportFormat.toUpperCase()}</div>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button onClick={handleExport} disabled={selectedReports.length === 0 || isExporting} className="flex-1">
              <Download className="h-4 w-4 mr-2" />
              {isExporting ? "Generating..." : "Export Reports"}
            </Button>

            <Button variant="outline">
              <Mail className="h-4 w-4 mr-2" />
              Email Reports
            </Button>

            <Button variant="outline">
              <Share2 className="h-4 w-4 mr-2" />
              Share Link
            </Button>

            <Button variant="outline">
              <Calendar className="h-4 w-4 mr-2" />
              Schedule
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Export Options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <FileText className="h-8 w-8 mx-auto text-muted-foreground" />
              <h3 className="font-medium">Quick Summary</h3>
              <p className="text-sm text-muted-foreground">Essential metrics and overview</p>
              <Button variant="outline" size="sm" className="w-full bg-transparent">
                <Download className="h-4 w-4 mr-2" />
                Export Summary
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <Users className="h-8 w-8 mx-auto text-muted-foreground" />
              <h3 className="font-medium">Student Data</h3>
              <p className="text-sm text-muted-foreground">Raw data in CSV format</p>
              <Button variant="outline" size="sm" className="w-full bg-transparent" onClick={() => downloadCSV({})}>
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <Printer className="h-8 w-8 mx-auto text-muted-foreground" />
              <h3 className="font-medium">Print Report</h3>
              <p className="text-sm text-muted-foreground">Printer-friendly version</p>
              <Button variant="outline" size="sm" className="w-full bg-transparent" onClick={() => window.print()}>
                <Printer className="h-4 w-4 mr-2" />
                Print Page
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
