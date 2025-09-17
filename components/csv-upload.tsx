"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, Download, FileText } from "lucide-react"

interface CSVUploadProps {
  onDataUpload: (data: any[]) => void
}

export function CSVUpload({ onDataUpload }: CSVUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null)

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsUploading(true)

    try {
      const text = await file.text()
      const lines = text.split("\n").filter((line) => line.trim())
      const headers = lines[0].split(",").map((h) => h.trim())

      const data = lines.slice(1).map((line) => {
        const values = line.split(",").map((v) => v.trim())
        const row: any = {}
        headers.forEach((header, index) => {
          const value = values[index]
          // Try to parse as number, otherwise keep as string
          row[header] = isNaN(Number(value)) ? value : Number(value)
        })
        return row
      })

      onDataUpload(data)
      setUploadedFileName(file.name)
    } catch (error) {
      console.error("Error parsing CSV:", error)
      alert("Error parsing CSV file. Please check the format.")
    } finally {
      setIsUploading(false)
    }
  }

  const downloadSampleCSV = () => {
    const sampleData = `student_id,name,class,comprehension,attention,focus,retention,assessment_score,engagement_time
STU0001,Emma Johnson,10A,75.2,68.4,72.1,78.9,74.3,65.2
STU0002,Liam Smith,10B,82.1,79.3,85.6,81.4,82.8,78.9
STU0003,Olivia Brown,11A,68.9,62.1,59.8,71.2,67.5,58.4
STU0004,Noah Davis,12C,91.3,88.7,92.4,89.6,90.8,89.1
STU0005,Ava Wilson,11B,77.8,74.2,76.9,79.3,77.1,72.6`

    const blob = new Blob([sampleData], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "sample_student_data.csv"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Upload Student Data
        </CardTitle>
        <CardDescription>Upload a CSV file with student performance data or download our sample format</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              disabled={isUploading}
              className="hidden"
              id="csv-upload"
            />
            <label htmlFor="csv-upload">
              <Button variant="outline" className="w-full cursor-pointer bg-transparent" disabled={isUploading} asChild>
                <span>
                  <Upload className="h-4 w-4 mr-2" />
                  {isUploading ? "Uploading..." : "Choose CSV File"}
                </span>
              </Button>
            </label>
            {uploadedFileName && (
              <p className="text-sm text-muted-foreground mt-2 flex items-center gap-1">
                <FileText className="h-4 w-4" />
                Uploaded: {uploadedFileName}
              </p>
            )}
          </div>

          <Button variant="secondary" onClick={downloadSampleCSV} className="sm:w-auto">
            <Download className="h-4 w-4 mr-2" />
            Download Sample CSV
          </Button>
        </div>

        <div className="mt-4 p-4 bg-muted rounded-lg">
          <h4 className="font-medium mb-2">Expected CSV Format:</h4>
          <p className="text-sm text-muted-foreground">
            student_id, name, class, comprehension, attention, focus, retention, assessment_score, engagement_time
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
