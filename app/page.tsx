"use client"

import { useState } from "react"
import { DashboardOverview } from "@/components/dashboard-overview"
import { ChartsSection } from "@/components/charts-section"
import { StudentTable } from "@/components/student-table"
import { InsightsSection } from "@/components/insights-section"
import { CSVUpload } from "@/components/csv-upload"
import { NavigationHeader } from "@/components/navigation-header"
import { StudentProfileModal } from "@/components/student-profile-modal"
import { AdvancedAnalytics } from "@/components/advanced-analytics"
import { ExportReports } from "@/components/export-reports"
import { DataManagement } from "@/components/data-management"

const sampleData = [
  {
    student_id: "STU0001",
    name: "Emma Johnson",
    class: "10A",
    comprehension: 75.2,
    attention: 68.4,
    focus: 72.1,
    retention: 78.9,
    assessment_score: 74.3,
    engagement_time: 65.2,
  },
  {
    student_id: "STU0002",
    name: "Liam Smith",
    class: "10B",
    comprehension: 82.1,
    attention: 79.3,
    focus: 85.6,
    retention: 81.4,
    assessment_score: 82.8,
    engagement_time: 78.9,
  },
  {
    student_id: "STU0003",
    name: "Olivia Brown",
    class: "11A",
    comprehension: 68.9,
    attention: 62.1,
    focus: 59.8,
    retention: 71.2,
    assessment_score: 67.5,
    engagement_time: 58.4,
  },
  {
    student_id: "STU0004",
    name: "Noah Davis",
    class: "12C",
    comprehension: 91.3,
    attention: 88.7,
    focus: 92.4,
    retention: 89.6,
    assessment_score: 90.8,
    engagement_time: 89.1,
  },
  {
    student_id: "STU0005",
    name: "Ava Wilson",
    class: "11B",
    comprehension: 77.8,
    attention: 74.2,
    focus: 76.9,
    retention: 79.3,
    assessment_score: 77.1,
    engagement_time: 72.6,
  },
  {
    student_id: "STU0006",
    name: "Ethan Moore",
    class: "10C",
    comprehension: 69.4,
    attention: 71.8,
    focus: 68.2,
    retention: 73.6,
    assessment_score: 70.8,
    engagement_time: 67.3,
  },
  {
    student_id: "STU0007",
    name: "Sophia Taylor",
    class: "11A",
    comprehension: 88.7,
    attention: 85.2,
    focus: 89.1,
    retention: 87.4,
    assessment_score: 87.6,
    engagement_time: 84.9,
  },
  {
    student_id: "STU0008",
    name: "Mason Anderson",
    class: "12A",
    comprehension: 73.5,
    attention: 69.8,
    focus: 71.3,
    retention: 75.9,
    assessment_score: 72.6,
    engagement_time: 68.7,
  },
  {
    student_id: "STU0009",
    name: "Isabella Thomas",
    class: "10B",
    comprehension: 79.2,
    attention: 76.5,
    focus: 78.8,
    retention: 80.1,
    assessment_score: 78.7,
    engagement_time: 75.4,
  },
  {
    student_id: "STU0010",
    name: "William Jackson",
    class: "11C",
    comprehension: 85.6,
    attention: 82.3,
    focus: 86.9,
    retention: 84.7,
    assessment_score: 85.1,
    engagement_time: 81.8,
  },
]

export default function HomePage() {
  const [studentData, setStudentData] = useState(sampleData)
  const [activeView, setActiveView] = useState("overview")
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)

  const handleDataUpload = (data: any[]) => {
    setStudentData(data)
  }

  const handleRefresh = async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000))
  }

  const handleStudentClick = (student: any) => {
    setSelectedStudent(student)
    setIsProfileModalOpen(true)
  }

  const renderActiveView = () => {
    switch (activeView) {
      case "overview":
        return (
          <div className="space-y-8">
            <CSVUpload onDataUpload={handleDataUpload} />
            <DashboardOverview data={studentData} />
            <ChartsSection data={studentData} />
            <StudentTable data={studentData} onStudentClick={handleStudentClick} />
            <InsightsSection data={studentData} />
          </div>
        )
      case "analytics":
        return <AdvancedAnalytics data={studentData} />
      case "students":
        return <StudentTable data={studentData} onStudentClick={handleStudentClick} />
      case "reports":
        return <ExportReports data={studentData} />
      case "manage":
        return <DataManagement data={studentData} onDataUpdate={setStudentData} />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <NavigationHeader
        activeView={activeView}
        onViewChange={setActiveView}
        studentCount={studentData.length}
        onRefresh={handleRefresh}
      />

      <div className="container mx-auto px-4 py-8">{renderActiveView()}</div>

      <StudentProfileModal
        student={selectedStudent}
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />
    </div>
  )
}
