"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, ArrowUpDown, Eye } from "lucide-react"
import { useEffect, useState } from "react"

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

interface StudentTableProps {
  data: Student[]
  onStudentClick?: (student: Student) => void
}

export function StudentTable({ data, onStudentClick }: StudentTableProps) {
  const [filteredStudents, setFilteredStudents] = useState<Student[]>(data)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortField, setSortField] = useState<keyof Student>("assessment_score")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")

  const personaNames = ["High Achievers", "Focused Learners", "Developing Students", "Engaged Strugglers"]
  const personaColors = [
    "bg-green-100 text-green-800",
    "bg-blue-100 text-blue-800",
    "bg-orange-100 text-orange-800",
    "bg-red-100 text-red-800",
  ]

  const getPersona = (student: Student): number => {
    const avgCognitive = (student.comprehension + student.attention + student.focus + student.retention) / 4

    if (student.assessment_score >= 80 && avgCognitive >= 75) return 0 // High Achievers
    if (student.focus >= 70 && student.attention >= 65) return 1 // Focused Learners
    if (student.assessment_score >= 50 && student.assessment_score < 80) return 2 // Developing Students
    return 3 // Engaged Strugglers
  }

  useEffect(() => {
    const filtered = data.filter(
      (student) =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.student_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.class.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    // Sort the filtered results
    filtered.sort((a, b) => {
      const aValue = a[sortField]
      const bValue = b[sortField]

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortDirection === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
      }

      return sortDirection === "asc" ? (aValue as number) - (bValue as number) : (bValue as number) - (aValue as number)
    })

    setFilteredStudents(filtered)
  }, [data, searchTerm, sortField, sortDirection])

  const handleSort = (field: keyof Student) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("desc")
    }
  }

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Student Data Table</CardTitle>
          <p className="text-muted-foreground">No student data available. Please upload a CSV file.</p>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Student Data Table</CardTitle>
        <div className="flex items-center space-x-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="text-sm text-muted-foreground">
            Showing {filteredStudents.length} of {data.length} students
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <Button variant="ghost" onClick={() => handleSort("student_id")} className="h-auto p-0 font-semibold">
                    Student ID <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" onClick={() => handleSort("name")} className="h-auto p-0 font-semibold">
                    Name <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" onClick={() => handleSort("class")} className="h-auto p-0 font-semibold">
                    Class <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("assessment_score")}
                    className="h-auto p-0 font-semibold"
                  >
                    Score <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("comprehension")}
                    className="h-auto p-0 font-semibold"
                  >
                    Comprehension <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" onClick={() => handleSort("attention")} className="h-auto p-0 font-semibold">
                    Attention <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" onClick={() => handleSort("focus")} className="h-auto p-0 font-semibold">
                    Focus <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" onClick={() => handleSort("retention")} className="h-auto p-0 font-semibold">
                    Retention <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("engagement_time")}
                    className="h-auto p-0 font-semibold"
                  >
                    Engagement <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>Learning Persona</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.slice(0, 50).map((student) => {
                const persona = getPersona(student)
                return (
                  <TableRow key={student.student_id}>
                    <TableCell className="font-mono text-sm">{student.student_id}</TableCell>
                    <TableCell className="font-medium">{student.name}</TableCell>
                    <TableCell>{student.class}</TableCell>
                    <TableCell>
                      <span
                        className={`font-semibold ${
                          student.assessment_score >= 80
                            ? "text-green-600"
                            : student.assessment_score >= 60
                              ? "text-blue-600"
                              : student.assessment_score >= 40
                                ? "text-orange-600"
                                : "text-red-600"
                        }`}
                      >
                        {student.assessment_score}
                      </span>
                    </TableCell>
                    <TableCell>{student.comprehension}</TableCell>
                    <TableCell>{student.attention}</TableCell>
                    <TableCell>{student.focus}</TableCell>
                    <TableCell>{student.retention}</TableCell>
                    <TableCell>{student.engagement_time}m</TableCell>
                    <TableCell>
                      <Badge className={personaColors[persona]}>{personaNames[persona]}</Badge>
                    </TableCell>
                    <TableCell>
                      {onStudentClick && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onStudentClick(student)}
                          className="h-8 w-8 p-0"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
        {filteredStudents.length > 50 && (
          <div className="mt-4 text-center text-sm text-muted-foreground">
            Showing first 50 results. Use search to filter further.
          </div>
        )}
      </CardContent>
    </Card>
  )
}
