"use client"

import { cn } from "@/lib/utils"
import { TrendingUp, TrendingDown } from "lucide-react"

interface StatCardProps {
  label: string
  value: string
  change?: string
  changeType?: "positive" | "negative" | "neutral"
  variant?: "cash" | "revenue" | "expense" | "profit"
}

const variantStyles = {
  cash: "before:bg-primary",
  revenue: "before:bg-chart-1",
  expense: "before:bg-destructive",
  profit: "before:bg-accent",
}

export function StatCard({
  label,
  value,
  change,
  changeType = "neutral",
  variant = "cash",
}: StatCardProps) {
  return (
    <div
      className={cn(
        "bg-card px-4 py-2.5 rounded-md border border-border shadow-sm relative overflow-hidden transition-all hover:-translate-y-0.5 hover:shadow-md",
        "before:absolute before:top-0 before:left-0 before:w-1 before:h-full",
        variantStyles[variant]
      )}
    >
      <p className="text-[10px] uppercase tracking-wide text-muted-foreground font-medium mb-1.5">
        {label}
      </p>
      <p className="text-xl font-semibold text-foreground mb-1 tabular-nums leading-none">
        {value}
      </p>
      {change && (
        <div
          className={cn(
            "flex items-center gap-1 text-xs",
            changeType === "positive" && "text-chart-1",
            changeType === "negative" && "text-destructive",
            changeType === "neutral" && "text-muted-foreground"
          )}
        >
          {changeType === "positive" && <TrendingUp className="h-3 w-3" />}
          {changeType === "negative" && <TrendingDown className="h-3 w-3" />}
          <span>{change}</span>
        </div>
      )}
    </div>
  )
}