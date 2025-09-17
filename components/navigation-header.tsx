"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Settings,
  Download,
  Upload,
  BarChart3,
  Users,
  FileText,
  Moon,
  Sun,
  Filter,
  Search,
  RefreshCw,
} from "lucide-react"
import { useTheme } from "next-themes"

interface NavigationHeaderProps {
  activeView: string
  onViewChange: (view: string) => void
  studentCount: number
  onRefresh: () => void
}

export function NavigationHeader({ activeView, onViewChange, studentCount, onRefresh }: NavigationHeaderProps) {
  const { theme, setTheme } = useTheme()
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await onRefresh()
    setTimeout(() => setIsRefreshing(false), 1000)
  }

  const views = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "analytics", label: "Analytics", icon: FileText },
    { id: "students", label: "Students", icon: Users },
    { id: "reports", label: "Reports", icon: Download },
    { id: "manage", label: "Manage", icon: Settings }, // Added manage view
  ]

  return (
    <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-4">
            <div>
              <h1 className="text-xl font-semibold">Student Performance Dashboard</h1>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <span>Cognitive Skills Analysis</span>
                <Badge variant="secondary">{studentCount} Students</Badge>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* View Navigation */}
            <div className="hidden md:flex items-center space-x-1 bg-muted rounded-lg p-1">
              {views.map((view) => {
                const Icon = view.icon
                return (
                  <Button
                    key={view.id}
                    variant={activeView === view.id ? "default" : "ghost"}
                    size="sm"
                    onClick={() => onViewChange(view.id)}
                    className="h-8"
                  >
                    <Icon className="h-4 w-4 mr-1" />
                    {view.label}
                  </Button>
                )
              })}
            </div>

            {/* Actions */}
            <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
              <RefreshCw className={`h-4 w-4 mr-1 ${isRefreshing ? "animate-spin" : ""}`} />
              Refresh
            </Button>

            {/* Settings Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4 mr-1" />
                  Settings
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Appearance</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
                  {theme === "dark" ? (
                    <>
                      <Sun className="h-4 w-4 mr-2" />
                      Light Mode
                    </>
                  ) : (
                    <>
                      <Moon className="h-4 w-4 mr-2" />
                      Dark Mode
                    </>
                  )}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuLabel>Data</DropdownMenuLabel>
                <DropdownMenuItem>
                  <Upload className="h-4 w-4 mr-2" />
                  Import Data
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Download className="h-4 w-4 mr-2" />
                  Export Data
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuLabel>View Options</DropdownMenuLabel>
                <DropdownMenuItem>
                  <Filter className="h-4 w-4 mr-2" />
                  Advanced Filters
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Search className="h-4 w-4 mr-2" />
                  Global Search
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  )
}
