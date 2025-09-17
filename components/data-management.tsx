"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Database,
  Upload,
  Download,
  Plus,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Users,
  FileText,
  Settings,
} from "lucide-react"

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

interface DataManagementProps {
  data: Student[]
  onDataUpdate: (data: Student[]) => void
}

export function DataManagement({ data, onDataUpdate }: DataManagementProps) {
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false)
  const [isEditStudentOpen, setIsEditStudentOpen] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [bulkAction, setBulkAction] = useState("")
  const [selectedStudents, setSelectedStudents] = useState<string[]>([])
  const [isProcessing, setIsProcessing] = useState(false)

  const [newStudent, setNewStudent] = useState<Partial<Student>>({
    student_id: "",
    name: "",
    class: "",
    comprehension: 0,
    attention: 0,
    focus: 0,
    retention: 0,
    assessment_score: 0,
    engagement_time: 0,
  })

  const handleAddStudent = () => {
    if (!newStudent.student_id || !newStudent.name) return

    const student: Student = {
      student_id: newStudent.student_id!,
      name: newStudent.name!,
      class: newStudent.class || "Unknown",
      comprehension: newStudent.comprehension || 0,
      attention: newStudent.attention || 0,
      focus: newStudent.focus || 0,
      retention: newStudent.retention || 0,
      assessment_score: newStudent.assessment_score || 0,
      engagement_time: newStudent.engagement_time || 0,
    }

    onDataUpdate([...data, student])
    setNewStudent({
      student_id: "",
      name: "",
      class: "",
      comprehension: 0,
      attention: 0,
      focus: 0,
      retention: 0,
      assessment_score: 0,
      engagement_time: 0,
    })
    setIsAddStudentOpen(false)
  }

  const handleEditStudent = () => {
    if (!selectedStudent) return

    const updatedData = data.map((student) =>
      student.student_id === selectedStudent.student_id ? selectedStudent : student,
    )
    onDataUpdate(updatedData)
    setIsEditStudentOpen(false)
    setSelectedStudent(null)
  }

  const handleDeleteStudent = (studentId: string) => {
    const updatedData = data.filter((student) => student.student_id !== studentId)
    onDataUpdate(updatedData)
  }

  const handleBulkAction = async () => {
    if (!bulkAction || selectedStudents.length === 0) return

    setIsProcessing(true)

    switch (bulkAction) {
      case "delete":
        const filteredData = data.filter((student) => !selectedStudents.includes(student.student_id))
        onDataUpdate(filteredData)
        break
      case "export":
        const selectedData = data.filter((student) => selectedStudents.includes(student.student_id))
        const csvContent = [
          "Student ID,Name,Class,Comprehension,Attention,Focus,Retention,Assessment Score,Engagement Time",
          ...selectedData.map(
            (s) =>
              `${s.student_id},${s.name},${s.class},${s.comprehension},${s.attention},${s.focus},${s.retention},${s.assessment_score},${s.engagement_time}`,
          ),
        ].join("\n")

        const blob = new Blob([csvContent], { type: "text/csv" })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `selected-students-${new Date().toISOString().split("T")[0]}.csv`
        a.click()
        window.URL.revokeObjectURL(url)
        break
      case "update-class":
        // This would open a dialog to update class for selected students
        break
    }

    setSelectedStudents([])
    setBulkAction("")
    setIsProcessing(false)
  }

  const generateSampleData = () => {
    const sampleStudents: Student[] = [
      {
        student_id: `STU${String(data.length + 1).padStart(4, "0")}`,
        name: "Sample Student",
        class: "10A",
        comprehension: Math.random() * 40 + 60,
        attention: Math.random() * 40 + 60,
        focus: Math.random() * 40 + 60,
        retention: Math.random() * 40 + 60,
        assessment_score: Math.random() * 40 + 60,
        engagement_time: Math.random() * 40 + 40,
      },
    ]

    onDataUpdate([...data, ...sampleStudents])
  }

  const validateData = () => {
    const issues = []

    // Check for duplicates
    const ids = data.map((s) => s.student_id)
    const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index)
    if (duplicateIds.length > 0) {
      issues.push(`Duplicate student IDs: ${duplicateIds.join(", ")}`)
    }

    // Check for missing data
    const incomplete = data.filter((s) => !s.name || !s.student_id)
    if (incomplete.length > 0) {
      issues.push(`${incomplete.length} students with missing required data`)
    }

    // Check for outliers
    const outliers = data.filter(
      (s) => s.assessment_score > 100 || s.assessment_score < 0 || s.comprehension > 100 || s.comprehension < 0,
    )
    if (outliers.length > 0) {
      issues.push(`${outliers.length} students with invalid scores`)
    }

    return issues
  }

  const dataIssues = validateData()

  return (
    <div className="space-y-6">
      {/* Data Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Users className="h-4 w-4 mr-2" />
              Total Records
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.length}</div>
            <p className="text-xs text-muted-foreground">Student records</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Database className="h-4 w-4 mr-2" />
              Data Quality
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              {dataIssues.length === 0 ? (
                <>
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-sm font-medium text-green-600">Good</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="h-5 w-5 text-yellow-500" />
                  <span className="text-sm font-medium text-yellow-600">Issues</span>
                </>
              )}
            </div>
            <p className="text-xs text-muted-foreground">{dataIssues.length} issues found</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <FileText className="h-4 w-4 mr-2" />
              Classes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{new Set(data.map((s) => s.class)).size}</div>
            <p className="text-xs text-muted-foreground">Unique classes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Settings className="h-4 w-4 mr-2" />
              Last Updated
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm font-medium">Just now</div>
            <p className="text-xs text-muted-foreground">Auto-saved</p>
          </CardContent>
        </Card>
      </div>

      {/* Data Issues Alert */}
      {dataIssues.length > 0 && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="flex items-center text-yellow-800">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Data Quality Issues
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-1 text-sm text-yellow-700">
              {dataIssues.map((issue, index) => (
                <li key={index}>• {issue}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="manage" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="manage">Manage Data</TabsTrigger>
          <TabsTrigger value="bulk">Bulk Operations</TabsTrigger>
          <TabsTrigger value="import">Import/Export</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="manage" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Individual Student Management</CardTitle>
              <CardDescription>Add, edit, or remove individual student records</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Dialog open={isAddStudentOpen} onOpenChange={setIsAddStudentOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Student
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Add New Student</DialogTitle>
                      <DialogDescription>Enter the student's information and cognitive metrics</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="student_id">Student ID</Label>
                          <Input
                            id="student_id"
                            value={newStudent.student_id}
                            onChange={(e) => setNewStudent({ ...newStudent, student_id: e.target.value })}
                            placeholder="STU0001"
                          />
                        </div>
                        <div>
                          <Label htmlFor="class">Class</Label>
                          <Input
                            id="class"
                            value={newStudent.class}
                            onChange={(e) => setNewStudent({ ...newStudent, class: e.target.value })}
                            placeholder="10A"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          value={newStudent.name}
                          onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                          placeholder="John Doe"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="comprehension">Comprehension</Label>
                          <Input
                            id="comprehension"
                            type="number"
                            min="0"
                            max="100"
                            value={newStudent.comprehension}
                            onChange={(e) =>
                              setNewStudent({ ...newStudent, comprehension: Number.parseFloat(e.target.value) })
                            }
                          />
                        </div>
                        <div>
                          <Label htmlFor="attention">Attention</Label>
                          <Input
                            id="attention"
                            type="number"
                            min="0"
                            max="100"
                            value={newStudent.attention}
                            onChange={(e) =>
                              setNewStudent({ ...newStudent, attention: Number.parseFloat(e.target.value) })
                            }
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="focus">Focus</Label>
                          <Input
                            id="focus"
                            type="number"
                            min="0"
                            max="100"
                            value={newStudent.focus}
                            onChange={(e) => setNewStudent({ ...newStudent, focus: Number.parseFloat(e.target.value) })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="retention">Retention</Label>
                          <Input
                            id="retention"
                            type="number"
                            min="0"
                            max="100"
                            value={newStudent.retention}
                            onChange={(e) =>
                              setNewStudent({ ...newStudent, retention: Number.parseFloat(e.target.value) })
                            }
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="assessment_score">Assessment Score</Label>
                          <Input
                            id="assessment_score"
                            type="number"
                            min="0"
                            max="100"
                            value={newStudent.assessment_score}
                            onChange={(e) =>
                              setNewStudent({ ...newStudent, assessment_score: Number.parseFloat(e.target.value) })
                            }
                          />
                        </div>
                        <div>
                          <Label htmlFor="engagement_time">Engagement Time</Label>
                          <Input
                            id="engagement_time"
                            type="number"
                            min="0"
                            value={newStudent.engagement_time}
                            onChange={(e) =>
                              setNewStudent({ ...newStudent, engagement_time: Number.parseFloat(e.target.value) })
                            }
                          />
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsAddStudentOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleAddStudent}>Add Student</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                <Button variant="outline" onClick={generateSampleData}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Sample Data
                </Button>

                <Button variant="outline">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh Data
                </Button>
              </div>

              <div className="text-sm text-muted-foreground">
                Recent students can be edited by clicking on their names in the table view.
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bulk" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Bulk Operations</CardTitle>
              <CardDescription>Perform actions on multiple students at once</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <Select value={bulkAction} onValueChange={setBulkAction}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Select action" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="delete">Delete Selected</SelectItem>
                    <SelectItem value="export">Export Selected</SelectItem>
                    <SelectItem value="update-class">Update Class</SelectItem>
                    <SelectItem value="recalculate">Recalculate Scores</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  onClick={handleBulkAction}
                  disabled={!bulkAction || selectedStudents.length === 0 || isProcessing}
                >
                  {isProcessing ? (
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Settings className="h-4 w-4 mr-2" />
                  )}
                  Apply to {selectedStudents.length} students
                </Button>
              </div>

              <div className="text-sm text-muted-foreground">
                Select students in the table view to enable bulk operations.
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="import" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Data Import & Export</CardTitle>
              <CardDescription>Import data from files or export current dataset</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Import Options</h4>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload CSV File
                    </Button>
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      <Database className="h-4 w-4 mr-2" />
                      Import from Database
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">Export Options</h4>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      <Download className="h-4 w-4 mr-2" />
                      Export as CSV
                    </Button>
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      <FileText className="h-4 w-4 mr-2" />
                      Export as JSON
                    </Button>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">Data Format Requirements</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>
                    • CSV files must include headers: student_id, name, class, comprehension, attention, focus,
                    retention, assessment_score, engagement_time
                  </li>
                  <li>• All numeric values should be between 0-100</li>
                  <li>• Student IDs must be unique</li>
                  <li>• Required fields: student_id, name</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Data Management Settings</CardTitle>
              <CardDescription>Configure data validation and management preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Auto-save Changes</h4>
                    <p className="text-sm text-muted-foreground">Automatically save data modifications</p>
                  </div>
                  <Badge variant="secondary">Enabled</Badge>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Data Validation</h4>
                    <p className="text-sm text-muted-foreground">Validate data integrity on import</p>
                  </div>
                  <Badge variant="secondary">Strict</Badge>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Backup Frequency</h4>
                    <p className="text-sm text-muted-foreground">Automatic data backup interval</p>
                  </div>
                  <Badge variant="secondary">Daily</Badge>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Data Retention</h4>
                    <p className="text-sm text-muted-foreground">How long to keep deleted records</p>
                  </div>
                  <Badge variant="secondary">30 days</Badge>
                </div>
              </div>

              <div className="pt-4 border-t">
                <Button variant="outline" className="w-full bg-transparent">
                  <Settings className="h-4 w-4 mr-2" />
                  Advanced Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
