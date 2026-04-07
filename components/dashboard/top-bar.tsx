"use client"

import { Button } from "@/components/ui/button"
import { Download, Calendar } from "lucide-react"

interface TopBarProps {
  title: string
  breadcrumb: string
}

export function TopBar({ title, breadcrumb }: TopBarProps) {
  const currentDate = new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })

  return (
    <header className="bg-card border-b border-border px-6 py-4 sticky top-0 z-40 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-serif font-semibold text-primary">{title}</h1>
          <p className="text-sm text-muted-foreground">{breadcrumb}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-secondary rounded-md text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{currentDate}</span>
          </div>
          <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>
    </header>
  )
}
