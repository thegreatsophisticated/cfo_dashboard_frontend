"use client"

import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Download, Building2, TrendingUp, TrendingDown } from "lucide-react"
import { fetchCompanyComparison, formatCurrency, type CompanyComparisonReport } from "@/lib/api-enhanced"
import { useState } from "react"

export function CompanyComparison() {
  const currentYear = new Date().getFullYear()
  const [selectedYear, setSelectedYear] = useState(currentYear)

  const { data: report, isLoading, error } = useQuery({
    queryKey: ["company-comparison", selectedYear],
    queryFn: () => fetchCompanyComparison(selectedYear),
  })

  const handleDownload = () => {
    console.log("Downloading company comparison report...")
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
          <p className="text-destructive">Failed to load company comparison</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <Card className="shadow-xl border-border/40 bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-3xl font-serif tracking-tight">
                Company Comparison Report
              </CardTitle>
              <p className="text-muted-foreground mt-2 font-light">
                Year {selectedYear} • All Companies
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

      {/* Group Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="shadow-lg border-border/40 bg-gradient-to-br from-blue-50 to-white dark:from-blue-950/20 dark:to-slate-900">
          <CardContent className="pt-6">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Group Revenue</p>
              <p className="text-2xl font-bold font-serif tracking-tight">
                {formatCurrency(report.totals.revenue)}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-border/40 bg-gradient-to-br from-amber-50 to-white dark:from-amber-950/20 dark:to-slate-900">
          <CardContent className="pt-6">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Group Expenses</p>
              <p className="text-2xl font-bold font-serif tracking-tight">
                {formatCurrency(report.totals.expenses)}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-border/40 bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-950/20 dark:to-slate-900">
          <CardContent className="pt-6">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Group Profit</p>
              <p className="text-2xl font-bold font-serif tracking-tight text-emerald-600 dark:text-emerald-400">
                {formatCurrency(report.totals.profit)}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-border/40 bg-gradient-to-br from-violet-50 to-white dark:from-violet-950/20 dark:to-slate-900">
          <CardContent className="pt-6">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Group Cash</p>
              <p className="text-2xl font-bold font-serif tracking-tight">
                {formatCurrency(report.totals.cashBalance)}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Table */}
      <Card className="shadow-xl border-border/40">
        <CardHeader>
          <CardTitle className="font-serif">Income Statement Comparison</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[250px]">Company</TableHead>
                  <TableHead className="text-right">Revenue</TableHead>
                  <TableHead className="text-right">Expenses</TableHead>
                  <TableHead className="text-right">Profit</TableHead>
                  <TableHead className="text-right">Profit Margin</TableHead>
                  <TableHead className="text-center">Performance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {report.companies
                  .sort((a, b) => b.profit - a.profit)
                  .map((company, index) => {
                    const isProfit = company.profit >= 0
                    return (
                      <TableRow key={company.id} className="hover:bg-muted/50">
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                              index === 0 ? 'bg-amber-100 dark:bg-amber-950/30' :
                              index === 1 ? 'bg-slate-100 dark:bg-slate-800' :
                              index === 2 ? 'bg-orange-100 dark:bg-orange-950/30' :
                              'bg-muted'
                            }`}>
                              {index < 3 ? (
                                <span className="text-sm font-bold">#{index + 1}</span>
                              ) : (
                                <Building2 className="h-4 w-4" />
                              )}
                            </div>
                            <span>{company.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-serif tabular-nums">
                          {formatCurrency(company.revenue)}
                        </TableCell>
                        <TableCell className="text-right font-serif tabular-nums text-muted-foreground">
                          {formatCurrency(company.expenses)}
                        </TableCell>
                        <TableCell className={`text-right font-serif font-semibold tabular-nums ${
                          isProfit ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
                        }`}>
                          {formatCurrency(company.profit)}
                        </TableCell>
                        <TableCell className="text-right font-mono text-sm">
                          {company.profitMargin.toFixed(2)}%
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center">
                            {isProfit ? (
                              <TrendingUp className="h-5 w-5 text-emerald-600" />
                            ) : (
                              <TrendingDown className="h-5 w-5 text-red-600" />
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                <TableRow className="bg-muted/50 font-bold">
                  <TableCell className="font-serif text-lg">Group Total</TableCell>
                  <TableCell className="text-right font-serif tabular-nums">
                    {formatCurrency(report.totals.revenue)}
                  </TableCell>
                  <TableCell className="text-right font-serif tabular-nums">
                    {formatCurrency(report.totals.expenses)}
                  </TableCell>
                  <TableCell className="text-right font-serif text-emerald-600 dark:text-emerald-400 tabular-nums">
                    {formatCurrency(report.totals.profit)}
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {((report.totals.profit / report.totals.revenue) * 100).toFixed(2)}%
                  </TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Financial Position Table */}
      <Card className="shadow-xl border-border/40">
        <CardHeader>
          <CardTitle className="font-serif">Financial Position Comparison</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[250px]">Company</TableHead>
                  <TableHead className="text-right">Cash Balance</TableHead>
                  <TableHead className="text-right">Total Assets</TableHead>
                  <TableHead className="text-right">Total Liabilities</TableHead>
                  <TableHead className="text-right">Equity</TableHead>
                  <TableHead className="text-right">Asset Coverage</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {report.companies
                  .sort((a, b) => b.assets - a.assets)
                  .map((company) => {
                    const assetCoverage = company.liabilities > 0 
                      ? (company.assets / company.liabilities).toFixed(2)
                      : '∞'
                    return (
                      <TableRow key={company.id} className="hover:bg-muted/50">
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <Building2 className="h-4 w-4 text-muted-foreground" />
                            {company.name}
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-serif tabular-nums">
                          {formatCurrency(company.cashBalance)}
                        </TableCell>
                        <TableCell className="text-right font-serif tabular-nums">
                          {formatCurrency(company.assets)}
                        </TableCell>
                        <TableCell className="text-right font-serif tabular-nums text-muted-foreground">
                          {formatCurrency(company.liabilities)}
                        </TableCell>
                        <TableCell className="text-right font-serif tabular-nums text-emerald-600 dark:text-emerald-400">
                          {formatCurrency(company.equity)}
                        </TableCell>
                        <TableCell className="text-right font-mono text-sm">
                          {assetCoverage}x
                        </TableCell>
                      </TableRow>
                    )
                  })}
                <TableRow className="bg-muted/50 font-bold">
                  <TableCell className="font-serif text-lg">Group Total</TableCell>
                  <TableCell className="text-right font-serif tabular-nums">
                    {formatCurrency(report.totals.cashBalance)}
                  </TableCell>
                  <TableCell className="text-right font-serif tabular-nums">
                    {formatCurrency(report.totals.assets)}
                  </TableCell>
                  <TableCell className="text-right font-serif tabular-nums">
                    {formatCurrency(report.totals.liabilities)}
                  </TableCell>
                  <TableCell className="text-right font-serif text-emerald-600 dark:text-emerald-400 tabular-nums">
                    {formatCurrency(report.totals.equity)}
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {report.totals.liabilities > 0 
                      ? (report.totals.assets / report.totals.liabilities).toFixed(2)
                      : '∞'
                    }x
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Performance Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="shadow-lg border-border/40">
          <CardHeader>
            <CardTitle className="text-lg font-serif">Top Performers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {report.companies
                .filter(c => c.profit > 0)
                .sort((a, b) => b.profitMargin - a.profitMargin)
                .slice(0, 3)
                .map((company, index) => (
                  <div key={company.id} className="flex items-center justify-between p-3 bg-emerald-50 dark:bg-emerald-950/20 rounded-lg">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}</span>
                      <span className="font-medium">{company.name}</span>
                    </div>
                    <span className="font-mono text-sm text-emerald-600 dark:text-emerald-400">
                      {company.profitMargin.toFixed(2)}% margin
                    </span>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-border/40">
          <CardHeader>
            <CardTitle className="text-lg font-serif">Needs Attention</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {report.companies
                .filter(c => c.profit < 0 || c.profitMargin < 5)
                .sort((a, b) => a.profitMargin - b.profitMargin)
                .slice(0, 3)
                .map((company) => (
                  <div key={company.id} className="flex items-center justify-between p-3 bg-amber-50 dark:bg-amber-950/20 rounded-lg">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">⚠️</span>
                      <span className="font-medium">{company.name}</span>
                    </div>
                    <span className={`font-mono text-sm ${
                      company.profit < 0 ? 'text-red-600 dark:text-red-400' : 'text-amber-600 dark:text-amber-400'
                    }`}>
                      {company.profitMargin.toFixed(2)}% margin
                    </span>
                  </div>
                ))}
              {report.companies.filter(c => c.profit < 0 || c.profitMargin < 5).length === 0 && (
                <div className="text-center py-4 text-muted-foreground">
                  All companies performing well! 🎉
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}