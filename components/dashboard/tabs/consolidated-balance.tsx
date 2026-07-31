"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Loader2, Calendar } from "lucide-react"
import { fetchGlobalBalanceSheet, type GlobalBalanceSheetResponse } from "@/lib/api"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { format } from "date-fns"

function StatementRow({
  label,
  amount,
  variant = "normal",
  transactionCount,
}: {
  label: string
  amount?: string | number
  variant?: "normal" | "indent" | "subtitle" | "total" | "grand-total"
  transactionCount?: number
}) {
  const baseStyles = "flex justify-between py-2 px-3 border-b border-border"
  const variantStyles = {
    normal: "text-xs",
    indent: "pl-8 text-[11px] text-muted-foreground",
    subtitle: "font-semibold text-xs text-primary bg-secondary mt-1",
    total: "font-semibold text-xs bg-secondary border-t-2 border-b-2 border-border mt-1",
    "grand-total": "bg-primary text-primary-foreground font-semibold text-sm mt-2 py-2.5",
  }

  const formatAmount = (amt: string | number | undefined) => {
    if (amt === undefined || amt === null) return ""
    const numAmount = typeof amt === "string" ? parseFloat(amt) : amt
    return `RWF ${numAmount.toLocaleString()}`
  }

  return (
    <div className={`${baseStyles} ${variantStyles[variant]}`}>
      <div className="flex items-center gap-1.5">
        <span>{label}</span>
        {transactionCount !== undefined && variant === "indent" && (
          <span className="text-[10px] text-muted-foreground">
            ({transactionCount} {transactionCount === 1 ? "tx" : "txs"})
          </span>
        )}
      </div>
      {amount !== undefined && (
        <span className="font-mono font-semibold tabular-nums">{formatAmount(amount)}</span>
      )}
    </div>
  )
}

export function ConsolidatedBalance() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<GlobalBalanceSheetResponse | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true)
        setError(null)
        const dateString = format(selectedDate, "yyyy-MM-dd")
        const response = await fetchGlobalBalanceSheet(dateString)
        console.log("Global Balance Sheet:", response)
        setData(response)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load balance sheet")
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [selectedDate])

  const handleExportPDF = () => {
    // TODO: Implement PDF export
    console.log("Export PDF clicked")
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center min-h-[300px]">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center min-h-[300px]">
          <div className="text-center">
            <p className="text-xs text-destructive">{error}</p>
            <p className="text-[10px] text-muted-foreground mt-1">
              Please try again or contact support
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!data || !data.summary) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center min-h-[300px]">
          <div className="text-center">
            <p className="text-xs text-muted-foreground">No balance sheet data available</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const { summary, companies } = data

  // Check if we have detailed company data
  const hasDetailedData = companies && companies.length > 0
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between pb-3">
        <div>
          <CardTitle className="text-sm font-semibold">Consolidated Balance Sheet</CardTitle>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-[11px] text-muted-foreground italic">
              As at {format(selectedDate, "MMM dd, yyyy")}
            </p>
            <span className="text-[10px] text-muted-foreground">•</span>
            <p className="text-[10px] text-muted-foreground">
              {summary.totalCompanies} {summary.totalCompanies === 1 ? "Company" : "Companies"}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="h-7 text-xs">
                <Calendar className="h-3.5 w-3.5 mr-1.5" />
                Change Date
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <CalendarComponent
                mode="single"
                selected={selectedDate}
                onSelect={(date) => {
                  if (date) {
                    setSelectedDate(date)
                    setIsCalendarOpen(false)
                  }
                }}
                disabled={(date) => date > new Date()}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <Button
            onClick={handleExportPDF}
            variant="outline"
            size="sm"
            className="h-7 text-xs"
          >
            <FileText className="h-3.5 w-3.5 mr-1.5" />
            Export PDF
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Balance Sheet Equation - Side by Side */}
        <div className="grid grid-cols-2 gap-3">
          {/* Left Side: Assets */}
          <div className="p-3 bg-green-50 dark:bg-green-950/30 rounded-md border border-green-200 dark:border-green-800">
            <p className="text-[10px] text-green-700 dark:text-green-400 font-medium mb-1">
              Total Assets
            </p>
            <p className="text-base font-bold font-mono tabular-nums text-green-600 dark:text-green-400">
              RWF {summary.totalAssets.toLocaleString()}
            </p>
          </div>

          {/* Right Side: Liabilities + Equity */}
          <div className="space-y-2">
            <div className="p-2.5 bg-red-50 dark:bg-red-950/30 rounded-md border border-red-200 dark:border-red-800">
              <p className="text-[10px] text-red-700 dark:text-red-400 font-medium mb-0.5">
                Total Liabilities
              </p>
              <p className="text-sm font-bold font-mono tabular-nums text-red-600 dark:text-red-400">
                RWF {summary.totalLiabilities.toLocaleString()}
              </p>
            </div>
            <div className="p-2.5 bg-blue-50 dark:bg-blue-950/30 rounded-md border border-blue-200 dark:border-blue-800">
              <p className="text-[10px] text-blue-700 dark:text-blue-400 font-medium mb-0.5">
                Total Equity
              </p>
              <p className="text-sm font-bold font-mono tabular-nums text-blue-600 dark:text-blue-400">
                RWF {summary.totalEquity.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Balance Check Indicator */}
        <div className={`p-2.5 rounded-md border ${
          summary.balanceCheck === 'BALANCED' 
            ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-700' 
            : 'bg-amber-50 dark:bg-amber-950/20 border-amber-300 dark:border-amber-700'
        }`}>
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-medium text-muted-foreground">Balance Check:</span>
            <span className={`font-bold text-xs ${
              summary.balanceCheck === "BALANCED"
                ? "text-emerald-700 dark:text-emerald-400"
                : "text-amber-700 dark:text-amber-400"
            }`}>
              {summary.balanceCheck}
            </span>
          </div>
          <p className="text-[10px] text-muted-foreground mt-1">
            Assets = Liabilities ({summary.totalLiabilities.toLocaleString()}) + Equity ({summary.totalEquity.toLocaleString()})
          </p>
        </div>

        {/* Detailed Breakdown */}
        <div className="space-y-3 pt-2">
          {/* Assets Section */}
          <div>
            <h3 className="text-xs font-semibold text-green-700 dark:text-green-400 border-b border-green-300 dark:border-green-700 pb-1.5 mb-2">
              Assets Breakdown
            </h3>
            
            {hasDetailedData ? (
              <>
                {companies.map((company, idx) => (
                  <StatementRow
                    key={`asset-${idx}`}
                    label={company.companyName}
                    amount={company.totalAssets}
                    variant="indent"
                  />
                ))}
              </>
            ) : (
              <div className="px-3 py-1.5 text-[11px] text-muted-foreground italic">
                No detailed breakdown available
              </div>
            )}
            
            <StatementRow
              label="Total Assets"
              amount={summary.totalAssets}
              variant="total"
            />
          </div>

          {/* Liabilities Section */}
          <div>
            <h3 className="text-xs font-semibold text-red-700 dark:text-red-400 border-b border-red-300 dark:border-red-700 pb-1.5 mb-2">
              Liabilities Breakdown
            </h3>
            
            {hasDetailedData ? (
              <>
                {companies.map((company, idx) => (
                  <StatementRow
                    key={`liab-${idx}`}
                    label={company.companyName}
                    amount={company.totalLiabilities}
                    variant="indent"
                  />
                ))}
              </>
            ) : (
              <div className="px-3 py-1.5 text-[11px] text-muted-foreground italic">
                No detailed breakdown available
              </div>
            )}
            
            <StatementRow
              label="Total Liabilities"
              amount={summary.totalLiabilities}
              variant="total"
            />
          </div>

          {/* Equity Section */}
          <div>
            <h3 className="text-xs font-semibold text-blue-700 dark:text-blue-400 border-b border-blue-300 dark:border-blue-700 pb-1.5 mb-2">
              Equity Breakdown
            </h3>
            
            {hasDetailedData ? (
              <>
                {companies.map((company, idx) => (
                  <div key={`equity-${idx}`}>
                    <StatementRow
                      label={company.companyName}
                      amount={company.totalEquity}
                      variant="indent"
                    />
                    {company.retainedEarnings !== undefined && company.retainedEarnings !== 0 && (
                      <div className="pl-12 py-1 text-[11px] text-muted-foreground flex justify-between px-3">
                        <span className="italic">└─ Retained Earnings</span>
                        <span className="font-mono tabular-nums">
                          RWF {company.retainedEarnings.toLocaleString()}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </>
            ) : (
              <div className="px-3 py-1.5 text-[11px] text-muted-foreground italic">
                No detailed breakdown available
              </div>
            )}
            
            <StatementRow
              label="Total Equity"
              amount={summary.totalEquity}
              variant="total"
            />
          </div>

          {/* Grand Total - Liabilities + Equity */}
          <div className="pt-1">
            <StatementRow
              label="Total Liabilities & Equity"
              amount={summary.totalLiabilities + summary.totalEquity}
              variant="grand-total"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
