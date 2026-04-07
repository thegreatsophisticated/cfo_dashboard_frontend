"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Loader2, Calendar } from "lucide-react"
import { fetchGlobalIncomeStatement, type GlobalIncomeStatementResponse } from "@/lib/api"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

function StatementRow({
  label,
  amount,
  variant = "normal",
  percentage,
}: {
  label: string
  amount?: string | number
  variant?: "normal" | "indent" | "subtitle" | "total" | "grand-total"
  percentage?: string
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
        {percentage && (
          <span className="text-[10px] text-muted-foreground">({percentage})</span>
        )}
      </div>
      {amount !== undefined && (
        <span className="font-mono font-semibold tabular-nums">{formatAmount(amount)}</span>
      )}
    </div>
  )
}

export function ConsolidatedIncome() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<GlobalIncomeStatementResponse | null>(null)
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear())

  // Generate year options (current year and 5 years back)
  const yearOptions = Array.from({ length: 6 }, (_, i) => new Date().getFullYear() - i)

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true)
        setError(null)
        const response = await fetchGlobalIncomeStatement(selectedYear)
        console.log("Global Income Statement:", response)
        setData(response)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load income statement")
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [selectedYear])

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
            <p className="text-xs text-muted-foreground">No income statement data available</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const { summary, companies } = data
  const hasDetailedData = companies && companies.length > 0

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between pb-3">
        <div>
          <CardTitle className="text-sm font-semibold">Consolidated Income Statement</CardTitle>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-[11px] text-muted-foreground italic">
              Year Ended Dec 31, {selectedYear}
            </p>
            <span className="text-[10px] text-muted-foreground">•</span>
            <p className="text-[10px] text-muted-foreground">
              {summary.totalCompanies} {summary.totalCompanies === 1 ? "Company" : "Companies"}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Select
            value={selectedYear.toString()}
            onValueChange={(value) => setSelectedYear(parseInt(value))}
          >
            <SelectTrigger className="w-[110px] h-7 text-xs">
              <SelectValue placeholder="Select year" />
            </SelectTrigger>
            <SelectContent>
              {yearOptions.map((year) => (
                <SelectItem key={year} value={year.toString()} className="text-xs">
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            onClick={handleExportPDF}
            size="sm"
            variant="outline"
            className="h-7 text-xs"
          >
            <FileText className="h-3.5 w-3.5 mr-1.5" />
            Export PDF
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Summary Statistics - Grouped by financial relationship */}
        <div className="grid grid-cols-2 gap-3">
          {/* Income Group */}
          <div className="space-y-2">
            <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-md border border-blue-200 dark:border-blue-800">
              <p className="text-[10px] text-blue-700 dark:text-blue-400 font-medium mb-1">Total Revenue</p>
              <p className="text-base font-bold font-mono tabular-nums text-blue-600 dark:text-blue-400">
                RWF {summary.totalRevenue.toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-orange-50 dark:bg-orange-950/30 rounded-md border border-orange-200 dark:border-orange-800">
              <p className="text-[10px] text-orange-700 dark:text-orange-400 font-medium mb-1">Cost of Sales</p>
              <p className="text-base font-bold font-mono tabular-nums text-orange-600 dark:text-orange-400">
                RWF {summary.totalCostOfSales.toLocaleString()}
              </p>
            </div>
          </div>
          
          {/* Profit Group */}
          <div className="space-y-2">
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 rounded-md border border-emerald-200 dark:border-emerald-800">
              <p className="text-[10px] text-emerald-700 dark:text-emerald-400 font-medium mb-1">Gross Profit</p>
              <p className="text-base font-bold font-mono tabular-nums text-emerald-600 dark:text-emerald-400">
                RWF {summary.totalGrossProfit.toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-red-50 dark:bg-red-950/30 rounded-md border border-red-200 dark:border-red-800">
              <p className="text-[10px] text-red-700 dark:text-red-400 font-medium mb-1">Operating Expenses</p>
              <p className="text-base font-bold font-mono tabular-nums text-red-600 dark:text-red-400">
                RWF {summary.totalOperatingExpenses.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Net Profit Highlight */}
        <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-md border-2 border-green-300 dark:border-green-700">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-[10px] text-green-700 dark:text-green-400 font-medium">Net Profit</p>
              <p className="text-sm font-bold font-mono tabular-nums text-green-800 dark:text-green-300">
                RWF {summary.totalNetProfit.toLocaleString()}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-green-700 dark:text-green-400 font-medium">Avg. Margin</p>
              <p className="text-sm font-bold text-green-800 dark:text-green-300">
                {summary.averageProfitMargin}
              </p>
            </div>
          </div>
        </div>

        {/* Detailed Breakdown */}
        <div className="space-y-3 pt-2">
          {/* Revenue Section */}
          <div>
            <h3 className="text-xs font-semibold text-blue-700 dark:text-blue-400 border-b border-blue-300 dark:border-blue-700 pb-1.5 mb-2">
              Revenue Breakdown
            </h3>

            {hasDetailedData ? (
              <>
                {companies.map((company, idx) => (
                  <StatementRow
                    key={`revenue-${idx}`}
                    label={company.companyName}
                    amount={company.revenue}
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
              label="Total Revenue"
              amount={summary.totalRevenue}
              variant="total"
            />
          </div>

          {/* Cost of Sales Section */}
          <div>
            <h3 className="text-xs font-semibold text-orange-700 dark:text-orange-400 border-b border-orange-300 dark:border-orange-700 pb-1.5 mb-2">
              Cost of Sales
            </h3>

            {hasDetailedData ? (
              <>
                {companies.map((company, idx) => (
                  <StatementRow
                    key={`cos-${idx}`}
                    label={company.companyName}
                    amount={company.costOfSales}
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
              label="Total Cost of Sales"
              amount={summary.totalCostOfSales}
              variant="total"
            />
          </div>

          {/* Operating Expenses Section */}
          <div>
            <h3 className="text-xs font-semibold text-red-700 dark:text-red-400 border-b border-red-300 dark:border-red-700 pb-1.5 mb-2">
              Operating Expenses
            </h3>

            {hasDetailedData ? (
              <>
                {companies.map((company, idx) => (
                  <StatementRow
                    key={`opex-${idx}`}
                    label={company.companyName}
                    amount={company.operatingExpenses}
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
              label="Total Operating Expenses"
              amount={summary.totalOperatingExpenses}
              variant="total"
            />
          </div>

          {/* Final Net Profit */}
          <div className="pt-1">
            <StatementRow
              label="Net Group Profit"
              amount={summary.totalNetProfit}
              percentage={summary.averageProfitMargin}
              variant="grand-total"
            />
          </div>
        </div>

        {/* Company Performance Table (if detailed data available) */}
        {hasDetailedData && (
          <div className="pt-2 border-t">
            <h3 className="text-xs font-semibold mb-2">
              Company Performance Summary
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-[11px]">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 px-2 font-semibold">Company</th>
                    <th className="text-right py-2 px-2 font-semibold">Revenue</th>
                    <th className="text-right py-2 px-2 font-semibold">Gross Profit</th>
                    <th className="text-right py-2 px-2 font-semibold">Net Profit</th>
                    <th className="text-right py-2 px-2 font-semibold">Margin</th>
                  </tr>
                </thead>
                <tbody>
                  {companies.map((company, idx) => (
                    <tr
                      key={idx}
                      className="border-b border-border hover:bg-muted/30 transition-colors"
                    >
                      <td className="py-2 px-2">{company.companyName}</td>
                      <td className="py-2 px-2 text-right font-mono tabular-nums">
                        {company.revenue.toLocaleString()}
                      </td>
                      <td className="py-2 px-2 text-right font-mono tabular-nums">
                        {company.grossProfit.toLocaleString()}
                      </td>
                      <td className="py-2 px-2 text-right font-mono tabular-nums">
                        {company.netProfit.toLocaleString()}
                      </td>
                      <td className="py-2 px-2 text-right font-semibold">
                        {company.profitMargin}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-border bg-secondary font-semibold">
                    <td className="py-2 px-2">Total</td>
                    <td className="py-2 px-2 text-right font-mono tabular-nums">
                      {summary.totalRevenue.toLocaleString()}
                    </td>
                    <td className="py-2 px-2 text-right font-mono tabular-nums">
                      {summary.totalGrossProfit.toLocaleString()}
                    </td>
                    <td className="py-2 px-2 text-right font-mono tabular-nums">
                      {summary.totalNetProfit.toLocaleString()}
                    </td>
                    <td className="py-2 px-2 text-right">
                      {summary.averageProfitMargin}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}