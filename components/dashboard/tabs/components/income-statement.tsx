"use client"

import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, TrendingUp, TrendingDown, DollarSign } from "lucide-react"
import { fetchIncomeStatement, formatCurrency, type IncomeStatementReport } from "@/lib/api-enhanced"
import { useState } from "react"

interface IncomeStatementProps {
  companyId: number
  companyName: string
}

export function IncomeStatement({ companyId, companyName }: IncomeStatementProps) {
  const currentYear = new Date().getFullYear()
  const [selectedYear, setSelectedYear] = useState(currentYear)

  const { data: report, isLoading, error } = useQuery({
    queryKey: ["income-statement", companyId, selectedYear],
    queryFn: () => fetchIncomeStatement(companyId, selectedYear),
  })

  const handleDownload = () => {
    // Generate and download report as PDF
    console.log("Downloading income statement...")
  }

  if (isLoading) {
    return (
      <Card className="shadow-lg border-border/40">
        <CardContent className="p-12 text-center">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-3/4 mx-auto"></div>
            <div className="h-4 bg-muted rounded w-1/2 mx-auto"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error || !report) {
    return (
      <Card className="shadow-lg border-destructive/20">
        <CardContent className="p-12 text-center">
          <p className="text-destructive">Failed to load income statement</p>
        </CardContent>
      </Card>
    )
  }

  const profitColor = report.netProfit >= 0 ? "text-emerald-600" : "text-red-600"
  const profitIcon = report.netProfit >= 0 ? TrendingUp : TrendingDown

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <Card className="shadow-xl border-border/40 bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-3xl font-serif tracking-tight">
                Income Statement
              </CardTitle>
              <p className="text-muted-foreground mt-2 font-light">
                {companyName} • {selectedYear}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Select value={selectedYear.toString()} onValueChange={(v) => setSelectedYear(parseInt(v))}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 5 }, (_, i) => currentYear - i).map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button onClick={handleDownload} variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export PDF
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="shadow-lg border-border/40 bg-gradient-to-br from-blue-50 to-white dark:from-blue-950/20 dark:to-slate-900">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Total Revenue</p>
                <p className="text-2xl font-bold font-serif tracking-tight">
                  {formatCurrency(report.revenue.totalRevenue)}
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-border/40 bg-gradient-to-br from-amber-50 to-white dark:from-amber-950/20 dark:to-slate-900">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Total Expenses</p>
                <p className="text-2xl font-bold font-serif tracking-tight">
                  {formatCurrency(report.expenses.totalExpenses + report.costOfSales.totalCostOfSales)}
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-amber-500/10 flex items-center justify-center">
                <TrendingDown className="h-6 w-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={`shadow-lg border-border/40 bg-gradient-to-br ${
          report.netProfit >= 0 
            ? 'from-emerald-50 to-white dark:from-emerald-950/20 dark:to-slate-900' 
            : 'from-red-50 to-white dark:from-red-950/20 dark:to-slate-900'
        }`}>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Net Profit</p>
                <p className={`text-2xl font-bold font-serif tracking-tight ${profitColor}`}>
                  {formatCurrency(report.netProfit)}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {report.profitMargin.toFixed(2)}% margin
                </p>
              </div>
              <div className={`h-12 w-12 rounded-full flex items-center justify-center ${
                report.netProfit >= 0 ? 'bg-emerald-500/10' : 'bg-red-500/10'
              }`}>
                {report.netProfit >= 0 ? (
                  <TrendingUp className="h-6 w-6 text-emerald-600" />
                ) : (
                  <TrendingDown className="h-6 w-6 text-red-600" />
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Statement */}
      <Card className="shadow-xl border-border/40">
        <CardContent className="p-8">
          <div className="space-y-8">
            {/* Revenue Section */}
            <div>
              <h3 className="text-lg font-semibold mb-4 font-serif border-b pb-2">Revenue</h3>
              <div className="space-y-3">
                <ReportLine label="Trading Revenue" amount={report.revenue.tradingRevenue} />
                <ReportLine label="Service Revenue" amount={report.revenue.serviceRevenue} />
                <ReportLine label="Rent Revenue" amount={report.revenue.rentRevenue} />
                <ReportLine label="Interest Income" amount={report.revenue.interestIncome} />
                <ReportLine label="Commission Income" amount={report.revenue.commissionIncome} />
                <ReportLine label="Other Income" amount={report.revenue.otherIncome} />
                <ReportLine 
                  label="Total Revenue" 
                  amount={report.revenue.totalRevenue} 
                  isTotal 
                  className="border-t pt-3"
                />
              </div>
            </div>

            {/* Cost of Sales Section */}
            <div>
              <h3 className="text-lg font-semibold mb-4 font-serif border-b pb-2">Cost of Sales</h3>
              <div className="space-y-3">
                <ReportLine label="Purchases" amount={report.costOfSales.purchases} />
                <ReportLine label="Direct Labor" amount={report.costOfSales.directLabor} />
                <ReportLine label="Manufacturing Overhead" amount={report.costOfSales.manufacturingOverhead} />
                <ReportLine 
                  label="Total Cost of Sales" 
                  amount={report.costOfSales.totalCostOfSales} 
                  isTotal 
                  className="border-t pt-3"
                />
              </div>
            </div>

            {/* Gross Profit */}
            <ReportLine 
              label="Gross Profit" 
              amount={report.grossProfit} 
              isTotal 
              className="text-lg border-y py-3"
              highlight
            />

            {/* Operating Expenses Section */}
            <div>
              <h3 className="text-lg font-semibold mb-4 font-serif border-b pb-2">Operating Expenses</h3>
              <div className="space-y-3">
                <ReportLine label="Salaries & Wages" amount={report.expenses.salariesWages} />
                <ReportLine label="Rent" amount={report.expenses.rent} />
                <ReportLine label="Utilities" amount={report.expenses.utilities} />
                <ReportLine label="Office Supplies" amount={report.expenses.officeSupplies} />
                <ReportLine label="Telephone & Internet" amount={report.expenses.telephoneInternet} />
                <ReportLine label="Insurance" amount={report.expenses.insurance} />
                <ReportLine label="Depreciation" amount={report.expenses.depreciation} />
                <ReportLine label="Advertising" amount={report.expenses.advertising} />
                <ReportLine label="Travel Expenses" amount={report.expenses.travelExpenses} />
                <ReportLine label="Entertainment" amount={report.expenses.entertainment} />
                <ReportLine label="Other Expenses" amount={report.expenses.otherExpenses} />
                <ReportLine 
                  label="Total Operating Expenses" 
                  amount={report.expenses.totalExpenses} 
                  isTotal 
                  className="border-t pt-3"
                />
              </div>
            </div>

            {/* Operating Profit */}
            <ReportLine 
              label="Operating Profit" 
              amount={report.operatingProfit} 
              isTotal 
              className="text-lg border-y py-3"
              highlight
            />

            {/* Net Profit */}
            <ReportLine 
              label="Net Profit" 
              amount={report.netProfit} 
              isTotal 
              className="text-2xl font-bold border-t-2 border-b-2 py-4"
              highlight
              colored
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

interface ReportLineProps {
  label: string
  amount: number
  isTotal?: boolean
  className?: string
  highlight?: boolean
  colored?: boolean
}

function ReportLine({ label, amount, isTotal, className = "", highlight, colored }: ReportLineProps) {
  const amountClass = colored 
    ? amount >= 0 
      ? "text-emerald-600 dark:text-emerald-400" 
      : "text-red-600 dark:text-red-400"
    : ""

  return (
    <div className={`flex items-center justify-between ${className} ${highlight ? 'bg-muted/30 px-4 py-2 rounded-lg' : ''}`}>
      <span className={`${isTotal ? 'font-semibold' : 'text-muted-foreground'}`}>
        {label}
      </span>
      <span className={`font-serif tabular-nums ${isTotal ? 'font-bold text-lg' : ''} ${amountClass}`}>
        {formatCurrency(amount)}
      </span>
    </div>
  )
}