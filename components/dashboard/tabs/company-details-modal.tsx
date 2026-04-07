"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Building2,
  Users,
  Globe,
  Mail,
  Phone,
  Calendar,
  FileText,
  TrendingUp,
  Loader2,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react"
import type { Company } from "@/lib/api"
import { fetchIncomeStatement, fetchBalanceSheet, fetchCompanyTransactions } from "@/lib/api"
import { cn } from "@/lib/utils"

interface CompanyDetailsModalProps {
  company: Company | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

function formatCurrency(amount: number | null | string): string {
  if (amount === null || amount === undefined) return "RWF 0"
  const numAmount = typeof amount === "string" ? parseFloat(amount) : amount
  return `RWF ${numAmount.toLocaleString()}`
}

function formatDate(dateString: string | null): string {
  if (!dateString) return "N/A"
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

function formatDateTime(dateString: string | null): string {
  if (!dateString) return "N/A"
  return new Date(dateString).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

function CompanyInfoTab({ company }: { company: Company }) {
  return (
    <ScrollArea className="h-[600px] pr-4">
      <div className="space-y-6">
        {/* Header Info */}
        <div>
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-2xl font-semibold text-foreground">{company.name}</h3>
              <p className="text-muted-foreground capitalize">{company.industry}</p>
            </div>
            <Badge
              variant="outline"
              className={cn(
                "text-sm",
                company.isActive
                  ? "bg-chart-1/10 text-chart-1 border-chart-1/20"
                  : "bg-warning/10 text-warning border-warning/20"
              )}
            >
              {company.isActive ? "Active" : "Inactive"}
            </Badge>
          </div>

          {company.description && (
            <p className="text-sm text-muted-foreground">{company.description}</p>
          )}
        </div>

        <Separator />

        {/* Key Metrics */}
        <div>
          <h4 className="font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Key Metrics
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Annual Revenue</p>
              <p className="text-lg font-semibold tabular-nums">
                {formatCurrency(company.annualRevenue)}
              </p>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Employees</p>
              <p className="text-lg font-semibold tabular-nums">{company.employeeCount}</p>
            </div>
            {company.cashBalance && (
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Cash Balance</p>
                <p className="text-lg font-semibold tabular-nums">
                  {formatCurrency(company.cashBalance)}
                </p>
              </div>
            )}
            {company.todayProfit && (
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Today's Profit</p>
                <p className="text-lg font-semibold tabular-nums">
                  {formatCurrency(company.todayProfit)}
                </p>
              </div>
            )}
          </div>
        </div>

        <Separator />

        {/* Company Details */}
        <div>
          <h4 className="font-semibold mb-4 flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Company Details
          </h4>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-xs text-muted-foreground">Company Type</p>
                <p className="text-sm font-medium capitalize">{company.companyType}</p>
              </div>
            </div>

            {company.establishedDate && (
              <div className="flex items-start gap-3">
                <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground">Established</p>
                  <p className="text-sm font-medium">{formatDate(company.establishedDate)}</p>
                </div>
              </div>
            )}

            {company.ceo && (
              <div className="flex items-start gap-3">
                <Users className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground">CEO</p>
                  <p className="text-sm font-medium">{company.ceo}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <Separator />

        {/* Contact Information */}
        <div>
          <h4 className="font-semibold mb-4 flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Contact Information
          </h4>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Mail className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="text-sm font-medium">{company.email}</p>
              </div>
            </div>

            {company.phoneNumber && (
              <div className="flex items-start gap-3">
                <Phone className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground">Phone</p>
                  <p className="text-sm font-medium">{company.phoneNumber}</p>
                </div>
              </div>
            )}

            {company.website && (
              <div className="flex items-start gap-3">
                <Globe className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground">Website</p>
                  <a
                    href={company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-primary hover:underline"
                  >
                    {company.website}
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Legal Information */}
        {(company.taxId || company.registrationNumber) && (
          <>
            <Separator />
            <div>
              <h4 className="font-semibold mb-4 flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Legal Information
              </h4>
              <div className="space-y-3">
                {company.taxId && (
                  <div>
                    <p className="text-xs text-muted-foreground">Tax ID</p>
                    <p className="text-sm font-medium font-mono">{company.taxId}</p>
                  </div>
                )}
                {company.registrationNumber && (
                  <div>
                    <p className="text-xs text-muted-foreground">Registration Number</p>
                    <p className="text-sm font-medium font-mono">{company.registrationNumber}</p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* Notes */}
        {company.notes && (
          <>
            <Separator />
            <div>
              <h4 className="font-semibold mb-2">Notes</h4>
              <p className="text-sm text-muted-foreground">{company.notes}</p>
            </div>
          </>
        )}
      </div>
    </ScrollArea>
  )
}

function TransactionsTab({ companyId }: { companyId: number }) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [transactions, setTransactions] = useState<any[]>([])

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true)
        setError(null)
        const response = await fetchCompanyTransactions(companyId)
       let transactions=response.transactions
        console.log("fetchCompanyTransactions", response)
        // Handle the API response structure
        if (transactions && Array.isArray(transactions)) {
          setTransactions(transactions)
        } else if (Array.isArray(response)) {
          setTransactions(response)
        } else {
          setTransactions([])
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load transactions")
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [companyId])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[600px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[600px]">
        <div className="text-center">
          <p className="text-sm text-destructive">{error}</p>
          <p className="text-xs text-muted-foreground mt-2">
            Unable to load transactions. Please try again later.
          </p>
        </div>
      </div>
    )
  }

  if (!transactions || transactions.length === 0) {
    return (
      <div className="flex items-center justify-center h-[600px]">
        <div className="text-center">
          <p className="text-sm text-muted-foreground">No transactions found</p>
          <p className="text-xs text-muted-foreground mt-2">
            This company hasn't recorded any transactions yet.
          </p>
        </div>
      </div>
    )
  }

  return (
    <ScrollArea className="h-[600px] pr-4">
      <div className="space-y-3">
        {transactions.map((transaction) => (
          <div
            key={transaction.id}
            className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium text-sm">{transaction.description}</h4>
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-xs",
                      transaction.transactionType === "credit"
                        ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-950/20 dark:text-green-300 dark:border-green-800"
                        : "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/20 dark:text-red-300 dark:border-red-800"
                    )}
                  >
                    {transaction.transactionType === "credit" ? (
                      <ArrowUpRight className="h-3 w-3 mr-1" />
                    ) : (
                      <ArrowDownRight className="h-3 w-3 mr-1" />
                    )}
                    {transaction.transactionType}
                  </Badge>
                  {transaction.isRecurring && (
                    <Badge variant="secondary" className="text-xs">
                      Recurring
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  {transaction.category?.name || "Uncategorized"} • {formatDate(transaction.date)}
                </p>
              </div>
              <div className="text-right">
                <p
                  className={cn(
                    "font-semibold tabular-nums",
                    transaction.transactionType === "credit" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                  )}
                >
                  {transaction.transactionType === "credit" ? "+" : "-"}
                  {formatCurrency(transaction.amount)}
                </p>
                {transaction.taxAmount && parseFloat(transaction.taxAmount) > 0 && (
                  <p className="text-xs text-muted-foreground">
                    Tax: {formatCurrency(transaction.taxAmount)}
                  </p>
                )}
              </div>
            </div>

            {/* Additional Details */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-3 pt-3 border-t text-xs">
              {transaction.referenceNumber && (
                <div>
                  <span className="text-muted-foreground">Ref: </span>
                  <span className="font-mono">{transaction.referenceNumber}</span>
                </div>
              )}
              {transaction.paymentMethod && (
                <div>
                  <span className="text-muted-foreground">Payment: </span>
                  <span className="capitalize">{transaction.paymentMethod}</span>
                </div>
              )}
              {transaction.status && (
                <div>
                  <span className="text-muted-foreground">Status: </span>
                  <span className="capitalize">{transaction.status}</span>
                </div>
              )}
              {transaction.counterparty && (
                <div>
                  <span className="text-muted-foreground">Counterparty: </span>
                  <span>{transaction.counterparty}</span>
                </div>
              )}
              {transaction.invoiceNumber && (
                <div>
                  <span className="text-muted-foreground">Invoice: </span>
                  <span className="font-mono">{transaction.invoiceNumber}</span>
                </div>
              )}
              {transaction.dueDate && (
                <div>
                  <span className="text-muted-foreground">Due: </span>
                  <span>{formatDate(transaction.dueDate)}</span>
                </div>
              )}
              {transaction.recurringFrequency && (
                <div>
                  <span className="text-muted-foreground">Frequency: </span>
                  <span className="capitalize">{transaction.recurringFrequency}</span>
                </div>
              )}
              {transaction.createdBy && (
                <div>
                  <span className="text-muted-foreground">Created by: </span>
                  <span>{transaction.createdBy.name}</span>
                </div>
              )}
            </div>

            {transaction.notes && (
              <div className="mt-3 pt-3 border-t">
                <p className="text-xs text-muted-foreground">{transaction.notes}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </ScrollArea>
  )
}

function IncomeStatementTab({ companyId }: { companyId: number }) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<any | null>(null)
  const [year, setYear] = useState(new Date().getFullYear())

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true)
        setError(null)
        const response = await fetchIncomeStatement(companyId, year)
        console.log("fetchIncomeStatement", response)
        setData(response)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load income statement")
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [companyId, year])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[600px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[600px]">
        <div className="text-center">
          <p className="text-sm text-destructive">{error}</p>
          <p className="text-xs text-muted-foreground mt-2">
            Try selecting a different year or contact support
          </p>
        </div>
      </div>
    )
  }

  if (!data || !data.incomeStatement) {
    return (
      <div className="flex items-center justify-center h-[600px]">
        <div className="text-center">
          <p className="text-sm text-muted-foreground">No income statement data available</p>
          <p className="text-xs text-muted-foreground mt-2">for year {year}</p>
        </div>
      </div>
    )
  }

  const incomeStatement = data.incomeStatement

  return (
    <ScrollArea className="h-[600px] pr-4">
      <div className="space-y-1">
        {/* Header */}
        <div className="text-center mb-6 pb-4 border-b-2">
          <h3 className="text-xl font-bold">{incomeStatement.companyName}</h3>
          <h4 className="text-lg font-semibold mt-1">INCOME STATEMENT</h4>
          <p className="text-sm text-muted-foreground mt-1">
            For the Year Ended December 31, {incomeStatement.period}
          </p>
        </div>

        {/* Year Selector */}
        <div className="flex justify-end mb-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setYear(year - 1)}
              className="px-3 py-1.5 text-sm border rounded-md hover:bg-muted transition-colors"
            >
              ← Previous
            </button>
            <span className="px-4 py-1.5 text-sm font-medium border rounded-md bg-muted min-w-[80px] text-center">
              {year}
            </span>
            <button
              onClick={() => setYear(year + 1)}
              disabled={year >= new Date().getFullYear()}
              className="px-3 py-1.5 text-sm border rounded-md hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next →
            </button>
          </div>
        </div>

        {/* Revenue Section */}
        <div className="mb-6">
          <div className="bg-blue-50 dark:bg-blue-950/20 px-4 py-2 mb-2">
            <h5 className="font-bold text-blue-900 dark:text-blue-100">REVENUE</h5>
          </div>
          {incomeStatement.revenue.breakdown && incomeStatement.revenue.breakdown.length > 0 ? (
            <div className="space-y-1">
              {incomeStatement.revenue.breakdown.map((item: any, idx: number) => (
                <div key={idx} className="flex justify-between items-center px-4 py-1.5 hover:bg-muted/50">
                  <span className="text-sm pl-4">{item.categoryName || item.name}</span>
                  <span className="text-sm font-mono tabular-nums">
                    {formatCurrency(item.totalAmount || item.amount)}
                  </span>
                </div>
              ))}
              <div className="flex justify-between items-center px-4 py-2 bg-blue-100 dark:bg-blue-900/30 font-semibold border-t-2 border-blue-200 dark:border-blue-800">
                <span>Total Revenue</span>
                <span className="font-mono tabular-nums text-blue-700 dark:text-blue-300">
                  {formatCurrency(incomeStatement.revenue.total)}
                </span>
              </div>
            </div>
          ) : (
            <div className="flex justify-between items-center px-4 py-2 bg-blue-100 dark:bg-blue-900/30 font-semibold">
              <span>Total Revenue</span>
              <span className="font-mono tabular-nums text-blue-700 dark:text-blue-300">
                {formatCurrency(incomeStatement.revenue.total)}
              </span>
            </div>
          )}
        </div>

        {/* Cost of Sales Section */}
        <div className="mb-6">
          <div className="bg-orange-50 dark:bg-orange-950/20 px-4 py-2 mb-2">
            <h5 className="font-bold text-orange-900 dark:text-orange-100">COST OF SALES</h5>
          </div>
          {incomeStatement.costOfSales.breakdown && incomeStatement.costOfSales.breakdown.length > 0 ? (
            <div className="space-y-1">
              {incomeStatement.costOfSales.breakdown.map((item: any, idx: number) => (
                <div key={idx} className="flex justify-between items-center px-4 py-1.5 hover:bg-muted/50">
                  <span className="text-sm pl-4">{item.categoryName || item.name}</span>
                  <span className="text-sm font-mono tabular-nums">
                    {formatCurrency(item.totalAmount || item.amount)}
                  </span>
                </div>
              ))}
              <div className="flex justify-between items-center px-4 py-2 bg-orange-100 dark:bg-orange-900/30 font-semibold border-t-2 border-orange-200 dark:border-orange-800">
                <span>Total Cost of Sales</span>
                <span className="font-mono tabular-nums text-orange-700 dark:text-orange-300">
                  {formatCurrency(incomeStatement.costOfSales.total)}
                </span>
              </div>
            </div>
          ) : (
            <div className="flex justify-between items-center px-4 py-2 bg-orange-100 dark:bg-orange-900/30 font-semibold">
              <span>Total Cost of Sales</span>
              <span className="font-mono tabular-nums text-orange-700 dark:text-orange-300">
                {formatCurrency(incomeStatement.costOfSales.total)}
              </span>
            </div>
          )}
        </div>

        {/* Gross Profit */}
        <div className="flex justify-between items-center px-4 py-3 bg-emerald-100 dark:bg-emerald-900/30 font-bold text-lg border-y-2 border-emerald-300 dark:border-emerald-700 mb-6">
          <span>GROSS PROFIT</span>
          <span className="font-mono tabular-nums text-emerald-700 dark:text-emerald-300">
            {formatCurrency(incomeStatement.grossProfit)}
          </span>
        </div>

        {/* Operating Expenses Section */}
        <div className="mb-6">
          <div className="bg-red-50 dark:bg-red-950/20 px-4 py-2 mb-2">
            <h5 className="font-bold text-red-900 dark:text-red-100">OPERATING EXPENSES</h5>
          </div>
          {incomeStatement.operatingExpenses.breakdown && incomeStatement.operatingExpenses.breakdown.length > 0 ? (
            <div className="space-y-1">
              {incomeStatement.operatingExpenses.breakdown.map((item: any, idx: number) => (
                <div key={idx} className="flex justify-between items-center px-4 py-1.5 hover:bg-muted/50">
                  <span className="text-sm pl-4">{item.categoryName || item.name}</span>
                  <span className="text-sm font-mono tabular-nums">
                    {formatCurrency(item.totalAmount || item.amount)}
                  </span>
                </div>
              ))}
              <div className="flex justify-between items-center px-4 py-2 bg-red-100 dark:bg-red-900/30 font-semibold border-t-2 border-red-200 dark:border-red-800">
                <span>Total Operating Expenses</span>
                <span className="font-mono tabular-nums text-red-700 dark:text-red-300">
                  {formatCurrency(incomeStatement.operatingExpenses.total)}
                </span>
              </div>
            </div>
          ) : (
            <div className="flex justify-between items-center px-4 py-2 bg-red-100 dark:bg-red-900/30 font-semibold">
              <span>Total Operating Expenses</span>
              <span className="font-mono tabular-nums text-red-700 dark:text-red-300">
                {formatCurrency(incomeStatement.operatingExpenses.total)}
              </span>
            </div>
          )}
        </div>

        {/* Net Profit */}
        <div className="border-t-4 border-primary pt-4">
          <div className="flex justify-between items-center px-4 py-4 bg-primary/10 dark:bg-primary/20 font-bold text-xl rounded-lg">
            <span>NET PROFIT</span>
            <span className="font-mono tabular-nums text-primary">
              {formatCurrency(incomeStatement.netProfit)}
            </span>
          </div>
          <div className="flex justify-between items-center px-4 py-2 mt-2 text-sm bg-muted/50 rounded-lg">
            <span className="text-muted-foreground">Profit Margin</span>
            <span className="font-semibold">{incomeStatement.profitMargin}</span>
          </div>
        </div>
      </div>
    </ScrollArea>
  )
}

function BalanceSheetTab({ companyId }: { companyId: number }) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<any | null>(null)
  const [asOfDate, setAsOfDate] = useState(new Date().toISOString().split("T")[0])

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true)
        setError(null)
        const response = await fetchBalanceSheet(companyId, asOfDate)
        console.log("fetchBalanceSheet", response)
        setData(response)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load balance sheet")
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [companyId, asOfDate])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[600px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[600px]">
        <div className="text-center">
          <p className="text-sm text-destructive">{error}</p>
          <p className="text-xs text-muted-foreground mt-2">
            Try selecting a different date or contact support
          </p>
        </div>
      </div>
    )
  }

  if (!data || !data.balanceSheet) {
    return (
      <div className="flex items-center justify-center h-[600px]">
        <div className="text-center">
          <p className="text-sm text-muted-foreground">No balance sheet data available</p>
          <p className="text-xs text-muted-foreground mt-2">as of {formatDate(asOfDate)}</p>
        </div>
      </div>
    )
  }

  const balanceSheet = data.balanceSheet

  return (
    <ScrollArea className="h-[600px] pr-4">
      <div className="space-y-1">
        {/* Header */}
        <div className="text-center mb-6 pb-4 border-b-2">
          <h3 className="text-xl font-bold">{balanceSheet.companyName}</h3>
          <h4 className="text-lg font-semibold mt-1">BALANCE SHEET</h4>
          <p className="text-sm text-muted-foreground mt-1">As of {formatDate(balanceSheet.asOfDate)}</p>
        </div>

        {/* Date Selector */}
        <div className="flex justify-end mb-4">
          <input
            type="date"
            value={asOfDate}
            onChange={(e) => setAsOfDate(e.target.value)}
            max={new Date().toISOString().split("T")[0]}
            className="px-3 py-1.5 text-sm border rounded-md"
          />
        </div>

        {/* Assets Section */}
        <div className="mb-6">
          <div className="bg-green-50 dark:bg-green-950/20 px-4 py-2 mb-2">
            <h5 className="font-bold text-green-900 dark:text-green-100">ASSETS</h5>
          </div>
          {balanceSheet.assets.breakdown && balanceSheet.assets.breakdown.length > 0 ? (
            <div className="space-y-1">
              {balanceSheet.assets.breakdown.map((item: any, idx: number) => (
                <div key={idx} className="flex justify-between items-center px-4 py-1.5 hover:bg-muted/50">
                  <div className="flex-1">
                    <span className="text-sm pl-4">{item.categoryName || item.name}</span>
                    <span className="text-xs text-muted-foreground ml-2">
                      ({item.transactionCount} {item.transactionCount === 1 ? "transaction" : "transactions"})
                    </span>
                  </div>
                  <span className="text-sm font-mono tabular-nums">
                    {formatCurrency(item.totalAmount || item.amount)}
                  </span>
                </div>
              ))}
              <div className="flex justify-between items-center px-4 py-2 bg-green-100 dark:bg-green-900/30 font-semibold border-t-2 border-green-200 dark:border-green-800">
                <span>Total Assets</span>
                <span className="font-mono tabular-nums text-green-700 dark:text-green-300">
                  {formatCurrency(balanceSheet.assets.total)}
                </span>
              </div>
            </div>
          ) : (
            <div className="flex justify-between items-center px-4 py-2 bg-green-100 dark:bg-green-900/30 font-semibold">
              <span>Total Assets</span>
              <span className="font-mono tabular-nums text-green-700 dark:text-green-300">
                {formatCurrency(balanceSheet.assets.total)}
              </span>
            </div>
          )}
        </div>

        {/* Liabilities Section */}
        <div className="mb-6">
          <div className="bg-red-50 dark:bg-red-950/20 px-4 py-2 mb-2">
            <h5 className="font-bold text-red-900 dark:text-red-100">LIABILITIES</h5>
          </div>
          {balanceSheet.liabilities.breakdown && balanceSheet.liabilities.breakdown.length > 0 ? (
            <div className="space-y-1">
              {balanceSheet.liabilities.breakdown.map((item: any, idx: number) => (
                <div key={idx} className="flex justify-between items-center px-4 py-1.5 hover:bg-muted/50">
                  <div className="flex-1">
                    <span className="text-sm pl-4">{item.categoryName || item.name}</span>
                    <span className="text-xs text-muted-foreground ml-2">
                      ({item.transactionCount} {item.transactionCount === 1 ? "transaction" : "transactions"})
                    </span>
                  </div>
                  <span className="text-sm font-mono tabular-nums">
                    {formatCurrency(item.totalAmount || item.amount)}
                  </span>
                </div>
              ))}
              <div className="flex justify-between items-center px-4 py-2 bg-red-100 dark:bg-red-900/30 font-semibold border-t-2 border-red-200 dark:border-red-800">
                <span>Total Liabilities</span>
                <span className="font-mono tabular-nums text-red-700 dark:text-red-300">
                  {formatCurrency(balanceSheet.liabilities.total)}
                </span>
              </div>
            </div>
          ) : (
            <div className="flex justify-between items-center px-4 py-2 bg-red-100 dark:bg-red-900/30 font-semibold">
              <span>Total Liabilities</span>
              <span className="font-mono tabular-nums text-red-700 dark:text-red-300">
                {formatCurrency(balanceSheet.liabilities.total)}
              </span>
            </div>
          )}
        </div>

        {/* Equity Section */}
        <div className="mb-6">
          <div className="bg-blue-50 dark:bg-blue-950/20 px-4 py-2 mb-2">
            <h5 className="font-bold text-blue-900 dark:text-blue-100">EQUITY</h5>
          </div>
          <div className="space-y-1">
            {/* Capital Contributed */}
            <div className="flex justify-between items-center px-4 py-1.5 hover:bg-muted/50">
              <span className="text-sm pl-4">Capital Contributed</span>
              <span className="text-sm font-mono tabular-nums">
                {formatCurrency(balanceSheet.equity.capitalContributed)}
              </span>
            </div>
            
            {/* Retained Earnings */}
            <div className="flex justify-between items-center px-4 py-1.5 hover:bg-muted/50">
              <span className="text-sm pl-4">Retained Earnings</span>
              <span className="text-sm font-mono tabular-nums">
                {formatCurrency(balanceSheet.equity.retainedEarnings)}
              </span>
            </div>

            {/* Breakdown items */}
            {balanceSheet.equity.breakdown && balanceSheet.equity.breakdown.length > 0 && (
              <>
                {balanceSheet.equity.breakdown.map((item: any, idx: number) => (
                  <div key={idx} className="flex justify-between items-center px-4 py-1.5 hover:bg-muted/50">
                    <div className="flex-1">
                      <span className="text-sm pl-4">{item.categoryName || item.name}</span>
                      <span className="text-xs text-muted-foreground ml-2">
                        ({item.transactionCount} {item.transactionCount === 1 ? "transaction" : "transactions"})
                      </span>
                    </div>
                    <span className="text-sm font-mono tabular-nums">
                      {formatCurrency(item.totalAmount || item.amount)}
                    </span>
                  </div>
                ))}
              </>
            )}

            <div className="flex justify-between items-center px-4 py-2 bg-blue-100 dark:bg-blue-900/30 font-semibold border-t-2 border-blue-200 dark:border-blue-800">
              <span>Total Equity</span>
              <span className="font-mono tabular-nums text-blue-700 dark:text-blue-300">
                {formatCurrency(balanceSheet.equity.total)}
              </span>
            </div>
          </div>
        </div>

        {/* Total Liabilities and Equity */}
        <div className="flex justify-between items-center px-4 py-3 bg-purple-100 dark:bg-purple-900/30 font-bold text-lg border-y-2 border-purple-300 dark:border-purple-700 mb-6">
          <span>TOTAL LIABILITIES & EQUITY</span>
          <span className="font-mono tabular-nums text-purple-700 dark:text-purple-300">
            {formatCurrency(balanceSheet.totalLiabilitiesAndEquity)}
          </span>
        </div>

        {/* Balance Check */}
        <div className="border-t-4 border-primary pt-4">
          <div
            className={cn(
              "flex justify-between items-center px-4 py-4 font-bold text-xl rounded-lg",
              balanceSheet.balanceCheck === "BALANCED"
                ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300"
            )}
          >
            <span>BALANCE CHECK</span>
            <span className="font-mono tabular-nums">{balanceSheet.balanceCheck}</span>
          </div>
          <p className="text-xs text-muted-foreground text-center mt-2">
            Assets = Liabilities + Equity
          </p>
        </div>
      </div>
    </ScrollArea>
  )
}

export function CompanyDetailsModal({ company, open, onOpenChange }: CompanyDetailsModalProps) {
  if (!company) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[95vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Company Details
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="info" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="info">Company Info</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="income">Income Statement</TabsTrigger>
            <TabsTrigger value="balance">Balance Sheet</TabsTrigger>
          </TabsList>

          <TabsContent value="info" className="mt-6">
            <CompanyInfoTab company={company} />
          </TabsContent>

          <TabsContent value="transactions" className="mt-6">
            <TransactionsTab companyId={company.id} />
          </TabsContent>

          <TabsContent value="income" className="mt-6">
            <IncomeStatementTab companyId={company.id} />
          </TabsContent>

          <TabsContent value="balance" className="mt-6">
            <BalanceSheetTab companyId={company.id} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}