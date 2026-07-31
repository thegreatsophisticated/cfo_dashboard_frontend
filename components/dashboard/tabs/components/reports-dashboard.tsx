"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { FileText, BarChart3, Wallet, Building2 } from "lucide-react"
import { fetchCompanies, type Company } from "@/lib/api"
import { IncomeStatement } from "./income-statement"
import { BalanceSheet } from "./balance-sheet"
import { CashBook } from "./cash-book"
import { CompanyComparison } from "./company-comparison"

export function ReportsDashboard() {
  const [selectedCompanyId, setSelectedCompanyId] = useState<number | null>(null)
  const [reportType, setReportType] = useState<"income" | "balance" | "cash" | "comparison">("income")

  const { data: companies, isLoading: companiesLoading } = useQuery({
    queryKey: ["companies"],
    queryFn: fetchCompanies,
  })

  const selectedCompany = companies?.find(c => c.id === selectedCompanyId)

  // Auto-select first company if none selected
  if (!selectedCompanyId && companies && companies.length > 0) {
    setSelectedCompanyId(companies[0].id)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold font-serif tracking-tight">Financial Reports</h1>
          <p className="text-muted-foreground mt-2">
            Comprehensive financial analysis and reporting
          </p>
        </div>
      </div>

      {/* Report Selection Card */}
      <Card className="shadow-lg border-border/40 bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
        <CardContent className="pt-6">
          <div className="flex items-end gap-4">
            <div className="flex-1">
              <Label htmlFor="company-select" className="text-sm font-medium mb-2 block">
                Select Company
              </Label>
              {companiesLoading ? (
                <div className="h-10 bg-muted animate-pulse rounded-md"></div>
              ) : (
                <Select
                  value={selectedCompanyId?.toString()}
                  onValueChange={(value) => setSelectedCompanyId(parseInt(value))}
                >
                  <SelectTrigger id="company-select" className="w-full">
                    <SelectValue placeholder="Choose a company" />
                  </SelectTrigger>
                  <SelectContent>
                    {companies?.map((company) => (
                      <SelectItem key={company.id} value={company.id.toString()}>
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-muted-foreground" />
                          {company.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            <div className="flex-1">
              <Label htmlFor="report-type" className="text-sm font-medium mb-2 block">
                Report Type
              </Label>
              <Select value={reportType} onValueChange={(v) => setReportType(v as any)}>
                <SelectTrigger id="report-type" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="income">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Income Statement
                    </div>
                  </SelectItem>
                  <SelectItem value="balance">
                    <div className="flex items-center gap-2">
                      <BarChart3 className="h-4 w-4" />
                      Balance Sheet
                    </div>
                  </SelectItem>
                  <SelectItem value="cash">
                    <div className="flex items-center gap-2">
                      <Wallet className="h-4 w-4" />
                      Cash Book
                    </div>
                  </SelectItem>
                  <SelectItem value="comparison">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4" />
                      Company Comparison
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Report Content */}
      <Tabs value={reportType} onValueChange={(v) => setReportType(v as any)} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 h-auto p-1 bg-muted/50">
          <TabsTrigger value="income" className="flex items-center gap-2 py-3">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Income Statement</span>
            <span className="sm:hidden">Income</span>
          </TabsTrigger>
          <TabsTrigger value="balance" className="flex items-center gap-2 py-3">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Balance Sheet</span>
            <span className="sm:hidden">Balance</span>
          </TabsTrigger>
          <TabsTrigger value="cash" className="flex items-center gap-2 py-3">
            <Wallet className="h-4 w-4" />
            <span className="hidden sm:inline">Cash Book</span>
            <span className="sm:hidden">Cash</span>
          </TabsTrigger>
          <TabsTrigger value="comparison" className="flex items-center gap-2 py-3">
            <Building2 className="h-4 w-4" />
            <span className="hidden sm:inline">Comparison</span>
            <span className="sm:hidden">Compare</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="income" className="space-y-6">
          {selectedCompanyId && selectedCompany ? (
            <IncomeStatement 
              companyId={selectedCompanyId} 
              companyName={selectedCompany.name}
            />
          ) : (
            <Card className="shadow-lg">
              <CardContent className="p-12 text-center text-muted-foreground">
                Please select a company to view the income statement
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="balance" className="space-y-6">
          {selectedCompanyId && selectedCompany ? (
            <BalanceSheet 
              companyId={selectedCompanyId} 
              companyName={selectedCompany.name}
            />
          ) : (
            <Card className="shadow-lg">
              <CardContent className="p-12 text-center text-muted-foreground">
                Please select a company to view the balance sheet
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="cash" className="space-y-6">
          {selectedCompanyId && selectedCompany ? (
            <CashBook 
              companyId={selectedCompanyId} 
              companyName={selectedCompany.name}
            />
          ) : (
            <Card className="shadow-lg">
              <CardContent className="p-12 text-center text-muted-foreground">
                Please select a company to view the cash book
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="comparison" className="space-y-6">
          <CompanyComparison />
        </TabsContent>
      </Tabs>

      {/* Help Card */}
      <Card className="shadow-lg border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/20">
        <CardContent className="p-6">
          <h3 className="font-semibold mb-2 flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600" />
            Report Guide
          </h3>
          <div className="text-sm text-muted-foreground space-y-1">
            {reportType === "income" && (
              <p>
                The <strong>Income Statement</strong> shows revenue, expenses, and profitability over a selected period.
                Use the year selector to compare different periods.
              </p>
            )}
            {reportType === "balance" && (
              <p>
                The <strong>Balance Sheet</strong> presents assets, liabilities, and equity at a specific point in time.
                Adjust the "As of Date" to view historical snapshots.
              </p>
            )}
            {reportType === "cash" && (
              <p>
                The <strong>Cash Book</strong> tracks all cash receipts and payments for a date range.
                Perfect for reconciliation and cash flow analysis.
              </p>
            )}
            {reportType === "comparison" && (
              <p>
                The <strong>Company Comparison</strong> report provides side-by-side performance metrics across all companies,
                highlighting top performers and areas needing attention.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}