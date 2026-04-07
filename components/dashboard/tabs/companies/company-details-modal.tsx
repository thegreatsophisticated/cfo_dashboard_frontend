"use client"

import { useState, useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Building2,
  Users,
  Globe,
  Mail,
  Phone,
  Calendar,
  FileText,
  TrendingUp,
  Receipt,
  BarChart3,
  Scale,
  Loader2,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  Edit,
  Trash2,
  Briefcase,
  User,
  Hash,
  Wallet,
  MessageSquare,
  UserCircle,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { Company } from "@/lib/api"
import {
  fetchCompanyTransactions,
  fetchIncomeStatement,
  fetchBalanceSheet,
} from "@/lib/api"

interface CompanyDetailsModalProps {
  company: Company | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onEdit: (company: Company) => void
  onDelete: (company: Company) => void
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
    month: "short",
    day: "numeric",
  })
}

function formatDateTime(dateString: string | null): string {
  if (!dateString) return "N/A"
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

// Company Info Tab Component
function CompanyInfoTab({ company }: { company: Company }) {
  return (
    <ScrollArea className="h-[500px] pr-3">
      <div className="space-y-3">
        {/* Header - Company Identity */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-md p-4 border border-blue-200 dark:border-blue-800">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex items-start gap-2 flex-1 min-w-0">
              <Building2 className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-bold text-foreground truncate">{company.name}</h3>
                <p className="text-[10px] text-muted-foreground capitalize mt-0.5">
                  {company.industry} • {company.companyType?.replace(/_/g, " ")}
                </p>
              </div>
            </div>
            <Badge
              variant="outline"
              className={cn(
                "text-[9px] h-4 px-1.5 flex-shrink-0",
                company.isActive
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400"
                  : "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/20 dark:text-orange-400"
              )}
            >
              {company.isActive ? "Active" : "Inactive"}
            </Badge>
          </div>

          {company.description && (
            <p className="text-xs text-muted-foreground leading-relaxed mt-2">
              {company.description}
            </p>
          )}
        </div>

        {/* Key Financial Metrics */}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5">
            <TrendingUp className="h-3 w-3 text-muted-foreground" />
            <h4 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">
              Key Metrics
            </h4>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 rounded-md p-3 border border-emerald-200 dark:border-emerald-800">
              <div className="flex items-start justify-between mb-1.5">
                <div className="h-6 w-6 rounded bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center flex-shrink-0">
                  <DollarSign className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                </div>
              </div>
              <p className="text-[9px] text-muted-foreground font-medium mb-0.5">Annual Revenue</p>
              <p className="text-sm font-bold font-serif tabular-nums text-emerald-600 dark:text-emerald-400">
                {formatCurrency(company.annualRevenue)}
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 rounded-md p-3 border border-blue-200 dark:border-blue-800">
              <div className="flex items-start justify-between mb-1.5">
                <div className="h-6 w-6 rounded bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center flex-shrink-0">
                  <Users className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <p className="text-[9px] text-muted-foreground font-medium mb-0.5">Employees</p>
              <p className="text-sm font-bold font-serif tabular-nums text-blue-600 dark:text-blue-400">
                {company.employeeCount || "N/A"}
              </p>
            </div>

            {company.cashBalance && (
              <div className="bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-950/20 dark:to-purple-950/20 rounded-md p-3 border border-violet-200 dark:border-violet-800">
                <div className="flex items-start justify-between mb-1.5">
                  <div className="h-6 w-6 rounded bg-violet-100 dark:bg-violet-900/40 flex items-center justify-center flex-shrink-0">
                    <Wallet className="h-3.5 w-3.5 text-violet-600 dark:text-violet-400" />
                  </div>
                </div>
                <p className="text-[9px] text-muted-foreground font-medium mb-0.5">Cash Balance</p>
                <p className="text-sm font-bold font-serif tabular-nums text-violet-600 dark:text-violet-400">
                  {formatCurrency(company.cashBalance)}
                </p>
              </div>
            )}

            {company.todayProfit && (
              <div className="bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-950/20 dark:to-yellow-950/20 rounded-md p-3 border border-amber-200 dark:border-amber-800">
                <div className="flex items-start justify-between mb-1.5">
                  <div className="h-6 w-6 rounded bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center flex-shrink-0">
                    <BarChart3 className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                  </div>
                </div>
                <p className="text-[9px] text-muted-foreground font-medium mb-0.5">Today's Profit</p>
                <p className="text-sm font-bold font-serif tabular-nums text-amber-600 dark:text-amber-400">
                  {formatCurrency(company.todayProfit)}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Contact Information */}
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <Mail className="h-3 w-3 text-muted-foreground" />
            <h4 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">
              Contact Information
            </h4>
          </div>
          <div className="bg-muted/20 rounded-md p-3 space-y-2">
            {company.email && (
              <div className="flex items-center gap-2">
                <div className="h-5 w-5 rounded bg-background flex items-center justify-center flex-shrink-0">
                  <Mail className="h-2.5 w-2.5 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[9px] text-muted-foreground font-medium">Email</p>
                  <a
                    href={`mailto:${company.email}`}
                    className="text-xs text-primary hover:underline truncate block"
                  >
                    {company.email}
                  </a>
                </div>
              </div>
            )}

            {company.phoneNumber && (
              <div className="flex items-center gap-2">
                <div className="h-5 w-5 rounded bg-background flex items-center justify-center flex-shrink-0">
                  <Phone className="h-2.5 w-2.5 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[9px] text-muted-foreground font-medium">Phone</p>
                  <a
                    href={`tel:${company.phoneNumber}`}
                    className="text-xs text-primary hover:underline"
                  >
                    {company.phoneNumber}
                  </a>
                </div>
              </div>
            )}

            {company.website && (
              <div className="flex items-center gap-2">
                <div className="h-5 w-5 rounded bg-background flex items-center justify-center flex-shrink-0">
                  <Globe className="h-2.5 w-2.5 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[9px] text-muted-foreground font-medium">Website</p>
                  <a
                    href={company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-primary hover:underline inline-flex items-center gap-0.5 truncate"
                  >
                    {company.website}
                    <ArrowUpRight className="h-2.5 w-2.5 flex-shrink-0" />
                  </a>
                </div>
              </div>
            )}

            {!company.email && !company.phoneNumber && !company.website && (
              <p className="text-xs text-muted-foreground text-center py-2">No contact information available</p>
            )}
          </div>
        </div>

        {/* Company Details */}
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <Briefcase className="h-3 w-3 text-muted-foreground" />
            <h4 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">
              Company Details
            </h4>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {company.ceo && (
              <div className="bg-muted/20 rounded-md p-2">
                <div className="flex items-center gap-1 mb-0.5">
                  <User className="h-2.5 w-2.5 text-muted-foreground" />
                  <p className="text-[9px] text-muted-foreground font-medium">CEO</p>
                </div>
                <p className="text-xs font-medium truncate">{company.ceo}</p>
              </div>
            )}
            {company.establishedDate && (
              <div className="bg-muted/20 rounded-md p-2">
                <div className="flex items-center gap-1 mb-0.5">
                  <Calendar className="h-2.5 w-2.5 text-muted-foreground" />
                  <p className="text-[9px] text-muted-foreground font-medium">Established</p>
                </div>
                <p className="text-xs font-medium">
                  {formatDate(company.establishedDate)}
                </p>
              </div>
            )}
            {company.taxId && (
              <div className="bg-muted/20 rounded-md p-2">
                <div className="flex items-center gap-1 mb-0.5">
                  <Hash className="h-2.5 w-2.5 text-muted-foreground" />
                  <p className="text-[9px] text-muted-foreground font-medium">Tax ID</p>
                </div>
                <p className="text-xs font-medium font-mono truncate">{company.taxId}</p>
              </div>
            )}
            {company.registrationNumber && (
              <div className="bg-muted/20 rounded-md p-2">
                <div className="flex items-center gap-1 mb-0.5">
                  <Hash className="h-2.5 w-2.5 text-muted-foreground" />
                  <p className="text-[9px] text-muted-foreground font-medium">Registration No.</p>
                </div>
                <p className="text-xs font-medium font-mono truncate">{company.registrationNumber}</p>
              </div>
            )}
          </div>
        </div>

        {/* Notes */}
        {company.notes && (
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <MessageSquare className="h-3 w-3 text-muted-foreground" />
              <h4 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">
                Notes
              </h4>
            </div>
            <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-md p-3">
              <p className="text-xs text-muted-foreground leading-relaxed">{company.notes}</p>
            </div>
          </div>
        )}

        {/* Created By */}
        {company.createdBy && (
          <div className="pt-2 border-t border-border/50">
            <div className="flex items-center gap-1.5 mb-2">
              <UserCircle className="h-3 w-3 text-muted-foreground" />
              <h4 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">
                Created By
              </h4>
            </div>
            <div className="flex items-center gap-2 bg-muted/20 rounded-md p-2">
              <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <span className="text-[10px] font-semibold text-primary">
                  {company.createdBy.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium truncate">{company.createdBy.name}</p>
                <p className="text-[10px] text-muted-foreground truncate">
                  {company.createdBy.email}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </ScrollArea>
  )
}

// Transactions Tab Component
// Corrected Transactions Tab Component
function TransactionsTab({ companyId }: { companyId: number }) {
  const { data: transactionsData, isLoading } = useQuery({
    queryKey: ["company-transactions", companyId],
    queryFn: () => fetchCompanyTransactions(companyId),
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[500px]">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  const transactions = transactionsData?.transactions || []

  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[500px] text-center">
        <Receipt className="h-12 w-12 text-muted-foreground/50 mb-3" />
        <p className="text-sm font-medium text-muted-foreground">No Transactions Found</p>
        <p className="text-xs text-muted-foreground/70 mt-1">
          This company has no transaction history yet.
        </p>
      </div>
    )
  }

  // ✅ CORRECTED: Calculate stats based on categoryType instead of transactionType
  const revenueCount = transactions.filter((t: any) => t.category?.categoryType === 'revenue').length
  const expenseCount = transactions.filter((t: any) => t.category?.categoryType === 'expense').length
  const assetCount = transactions.filter((t: any) => t.category?.categoryType === 'asset').length
  const liabilityCount = transactions.filter((t: any) => t.category?.categoryType === 'liability').length
  const equityCount = transactions.filter((t: any) => t.category?.categoryType === 'equity').length

  // Helper function to get category badge variant
  const getCategoryBadgeVariant = (categoryType: string | null) => {
    switch (categoryType?.toLowerCase()) {
      case 'revenue':
        return { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', darkBg: 'dark:bg-emerald-950/20', darkText: 'dark:text-emerald-400' }
      case 'expense':
        return { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', darkBg: 'dark:bg-red-950/20', darkText: 'dark:text-red-400' }
      case 'asset':
        return { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', darkBg: 'dark:bg-blue-950/20', darkText: 'dark:text-blue-400' }
      case 'liability':
        return { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200', darkBg: 'dark:bg-orange-950/20', darkText: 'dark:text-orange-400' }
      case 'equity':
        return { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', darkBg: 'dark:bg-purple-950/20', darkText: 'dark:text-purple-400' }
      default:
        return { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200', darkBg: 'dark:bg-gray-950/20', darkText: 'dark:text-gray-400' }
    }
  }

  const getCategoryLabel = (categoryType: string | null) => {
    switch (categoryType?.toLowerCase()) {
      case 'revenue':
        return 'Revenue'
      case 'expense':
        return 'Expense'
      case 'asset':
        return 'Asset'
      case 'liability':
        return 'Liability'
      case 'equity':
        return 'Equity'
      default:
        return categoryType || 'Other'
    }
  }

  const getAmountColor = (categoryType: string | null) => {
    switch (categoryType?.toLowerCase()) {
      case 'revenue':
        return 'text-emerald-600 dark:text-emerald-400'
      case 'expense':
        return 'text-red-600 dark:text-red-400'
      case 'asset':
        return 'text-blue-600 dark:text-blue-400'
      case 'liability':
        return 'text-orange-600 dark:text-orange-400'
      case 'equity':
        return 'text-purple-600 dark:text-purple-400'
      default:
        return 'text-gray-600 dark:text-gray-400'
    }
  }

  return (
    <ScrollArea className="h-[500px] pr-3">
      <div className="space-y-3">
        {/* ✅ Enhanced Summary Cards - Now shows all 5 category types */}
        <div className="grid grid-cols-3 gap-2">
          {/* Total Transactions */}
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 rounded-md p-3 border border-blue-200 dark:border-blue-800">
            <p className="text-[9px] text-muted-foreground mb-0.5 font-medium">Total Transactions</p>
            <p className="text-lg font-bold font-serif">{transactions.length}</p>
          </div>

          {/* Revenue */}
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 rounded-md p-3 border border-emerald-200 dark:border-emerald-800">
            <p className="text-[9px] text-muted-foreground mb-0.5 font-medium">Revenue</p>
            <p className="text-lg font-bold font-serif text-emerald-600 dark:text-emerald-400">
              {revenueCount}
            </p>
          </div>

          {/* Expenses */}
          <div className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20 rounded-md p-3 border border-red-200 dark:border-red-800">
            <p className="text-[9px] text-muted-foreground mb-0.5 font-medium">Expenses</p>
            <p className="text-lg font-bold font-serif text-red-600 dark:text-red-400">
              {expenseCount}
            </p>
          </div>

          {/* Assets (if any) */}
          {assetCount > 0 && (
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-md p-3 border border-blue-200 dark:border-blue-800">
              <p className="text-[9px] text-muted-foreground mb-0.5 font-medium">Assets</p>
              <p className="text-lg font-bold font-serif text-blue-600 dark:text-blue-400">
                {assetCount}
              </p>
            </div>
          )}

          {/* Liabilities (if any) */}
          {liabilityCount > 0 && (
            <div className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20 rounded-md p-3 border border-orange-200 dark:border-orange-800">
              <p className="text-[9px] text-muted-foreground mb-0.5 font-medium">Liabilities</p>
              <p className="text-lg font-bold font-serif text-orange-600 dark:text-orange-400">
                {liabilityCount}
              </p>
            </div>
          )}

          {/* Equity (if any) */}
          {equityCount > 0 && (
            <div className="bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950/20 dark:to-violet-950/20 rounded-md p-3 border border-purple-200 dark:border-purple-800">
              <p className="text-[9px] text-muted-foreground mb-0.5 font-medium">Equity</p>
              <p className="text-lg font-bold font-serif text-purple-600 dark:text-purple-400">
                {equityCount}
              </p>
            </div>
          )}
        </div>

        {/* Transactions Table */}
        <div className="border rounded-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 border-b">
                <TableHead className="text-[10px] h-7">Date</TableHead>
                <TableHead className="text-[10px] h-7">Description</TableHead>
                <TableHead className="text-[10px] h-7">Category</TableHead>
                <TableHead className="text-[10px] h-7">Type</TableHead>
                <TableHead className="text-[10px] h-7">Flow</TableHead>
                <TableHead className="text-right text-[10px] h-7">Amount</TableHead>
                <TableHead className="text-[10px] h-7">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction: any) => {
                const categoryStyle = getCategoryBadgeVariant(transaction.category?.categoryType)
                
                return (
                  <TableRow key={transaction.id} className="hover:bg-muted/30 border-b">
                    <TableCell className="font-medium text-xs py-2">
                      {formatDate(transaction.date || transaction.transactionDate)}
                    </TableCell>
                    <TableCell className="max-w-[150px] py-2">
                      <div className="truncate text-xs">{transaction.description}</div>
                      {transaction.referenceNumber && (
                        <div className="text-[10px] text-muted-foreground font-mono truncate">
                          {transaction.referenceNumber}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="py-2">
                      <div className="text-xs truncate max-w-[120px]">
                        {transaction.categoryPath || transaction.category?.name || "N/A"}
                      </div>
                    </TableCell>

                    {/* ✅ CORRECTED: Category Type Badge (Primary) */}
                    <TableCell className="py-2">
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-[9px] h-4 px-1 font-semibold",
                          categoryStyle.bg,
                          categoryStyle.text,
                          categoryStyle.border,
                          categoryStyle.darkBg,
                          categoryStyle.darkText
                        )}
                      >
                        {getCategoryLabel(transaction.category?.categoryType)}
                      </Badge>
                    </TableCell>

                    {/* ✅ NEW: Transaction Direction Badge (Secondary) */}
                    <TableCell className="py-2">
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-[9px] h-4 px-1",
                          transaction.transactionType === "debit"
                            ? "border-green-500 text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-950"
                            : "border-red-500 text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-950"
                        )}
                      >
                        <span className="flex items-center gap-0.5">
                          {transaction.transactionType === "debit" ? (
                            <ArrowUpRight className="h-2.5 w-2.5" />
                          ) : (
                            <ArrowDownRight className="h-2.5 w-2.5" />
                          )}
                          {transaction.transactionType === "debit" ? "In" : "Out"}
                        </span>
                      </Badge>
                    </TableCell>

                    {/* ✅ CORRECTED: Amount colored by category type */}
                    <TableCell className={cn(
                      "text-right font-serif font-semibold tabular-nums text-xs py-2",
                      getAmountColor(transaction.category?.categoryType)
                    )}>
                      {transaction.transactionType === "credit" ? "-" : "+"}
                      {formatCurrency(transaction.amount || transaction.totalAmount)}
                    </TableCell>

                    <TableCell className="py-2">
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-[9px] h-4 px-1",
                          transaction.status === "completed"
                            ? "bg-green-50 text-green-700 border-green-200"
                            : "bg-yellow-50 text-yellow-700 border-yellow-200"
                        )}
                      >
                        {transaction.status || "completed"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </ScrollArea>
  )
}

// Income Statement Tab Component
function IncomeStatementTab({ companyId }: { companyId: number }) {
  const [year, setYear] = useState(new Date().getFullYear())
  
  const { data, isLoading, error } = useQuery({
    queryKey: ["company-income-statement", companyId, year],
    queryFn: () => fetchIncomeStatement(companyId, year),
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[500px]">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[500px] text-center">
        <BarChart3 className="h-12 w-12 text-destructive/50 mb-3" />
        <p className="text-sm font-medium text-destructive">Error Loading Income Statement</p>
        <p className="text-xs text-muted-foreground mt-1">
          {error instanceof Error ? error.message : "Please try again later"}
        </p>
      </div>
    )
  }

  const incomeStatement = data?.incomeStatement

  if (!incomeStatement) {
    return (
      <div className="flex flex-col items-center justify-center h-[500px] text-center">
        <BarChart3 className="h-12 w-12 text-muted-foreground/50 mb-3" />
        <p className="text-sm font-medium text-muted-foreground">No Data Available</p>
        <p className="text-xs text-muted-foreground/70 mt-1">
          No income statement data for year {year}
        </p>
      </div>
    )
  }

  return (
    <ScrollArea className="h-[500px] pr-3">
      <div className="space-y-3">
        {/* Header */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-md p-4 border border-blue-200 dark:border-blue-800">
          <div className="text-center">
            <h3 className="text-base font-bold truncate">{incomeStatement.companyName}</h3>
            <h4 className="text-xs font-semibold mt-0.5 text-muted-foreground uppercase tracking-wide">Income Statement</h4>
            <p className="text-[10px] text-muted-foreground mt-0.5">
              For the Year Ended December 31, {incomeStatement.period}
            </p>
          </div>

          {/* Year Selector */}
          <div className="flex justify-center mt-3">
            <div className="flex items-center gap-1 bg-background rounded-md p-0.5 border">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setYear(year - 1)}
                className="h-6 text-[10px] px-2"
              >
                ← Prev
              </Button>
              <span className="px-3 py-1 text-xs font-semibold min-w-[60px] text-center">
                {year}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setYear(year + 1)}
                disabled={year >= new Date().getFullYear()}
                className="h-6 text-[10px] px-2"
              >
                Next →
              </Button>
            </div>
          </div>
        </div>

        {/* Revenue */}
        <StatementSection
          title="REVENUE"
          items={incomeStatement.revenue.breakdown}
          total={incomeStatement.revenue.total}
          colorClass="blue"
          icon={<TrendingUp className="h-3 w-3" />}
        />

        {/* Cost of Sales */}
        <StatementSection
          title="COST OF SALES"
          items={incomeStatement.costOfSales.breakdown}
          total={incomeStatement.costOfSales.total}
          colorClass="orange"
        />

        {/* Gross Profit */}
        <div className="bg-gradient-to-r from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30 rounded-md p-3 border-2 border-emerald-300 dark:border-emerald-700">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold">GROSS PROFIT</span>
            <span className="text-base font-bold font-serif tabular-nums text-emerald-700 dark:text-emerald-300">
              {formatCurrency(incomeStatement.grossProfit)}
            </span>
          </div>
        </div>

        {/* Operating Expenses */}
        <StatementSection
          title="OPERATING EXPENSES"
          items={incomeStatement.operatingExpenses.breakdown}
          total={incomeStatement.operatingExpenses.total}
          colorClass="red"
        />

        {/* Net Profit */}
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-md p-3 border-2 border-primary">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-bold">NET PROFIT</span>
            <span className="text-lg font-bold font-serif tabular-nums text-primary">
              {formatCurrency(incomeStatement.netProfit)}
            </span>
          </div>
          <div className="flex justify-between items-center text-xs bg-background/50 rounded p-2">
            <span className="text-muted-foreground">Profit Margin</span>
            <span className="font-semibold">{incomeStatement.profitMargin}</span>
          </div>
        </div>
      </div>
    </ScrollArea>
  )
}

// Balance Sheet Tab Component
function BalanceSheetTab({ companyId }: { companyId: number }) {
  const [asOfDate, setAsOfDate] = useState(new Date().toISOString().split("T")[0])
  
  const { data, isLoading, error } = useQuery({
    queryKey: ["company-balance-sheet", companyId, asOfDate],
    queryFn: () => fetchBalanceSheet(companyId, asOfDate),
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[500px]">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[500px] text-center">
        <Scale className="h-12 w-12 text-destructive/50 mb-3" />
        <p className="text-sm font-medium text-destructive">Error Loading Balance Sheet</p>
        <p className="text-xs text-muted-foreground mt-1">
          {error instanceof Error ? error.message : "Please try again later"}
        </p>
      </div>
    )
  }

  const balanceSheet = data?.balanceSheet

  if (!balanceSheet) {
    return (
      <div className="flex flex-col items-center justify-center h-[500px] text-center">
        <Scale className="h-12 w-12 text-muted-foreground/50 mb-3" />
        <p className="text-sm font-medium text-muted-foreground">No Data Available</p>
        <p className="text-xs text-muted-foreground/70 mt-1">
          No balance sheet data as of {formatDate(asOfDate)}
        </p>
      </div>
    )
  }

  return (
    <ScrollArea className="h-[500px] pr-3">
      <div className="space-y-3">
        {/* Header */}
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 rounded-md p-4 border border-purple-200 dark:border-purple-800">
          <div className="text-center">
            <h3 className="text-base font-bold truncate">{balanceSheet.companyName}</h3>
            <h4 className="text-xs font-semibold mt-0.5 text-muted-foreground uppercase tracking-wide">Balance Sheet</h4>
            <p className="text-[10px] text-muted-foreground mt-0.5">
              As of {formatDate(balanceSheet.asOfDate)}
            </p>
          </div>

          {/* Date Selector */}
          <div className="flex justify-center mt-3">
            <input
              type="date"
              value={asOfDate}
              onChange={(e) => setAsOfDate(e.target.value)}
              max={new Date().toISOString().split("T")[0]}
              className="px-3 py-1 text-xs border rounded-md bg-background"
            />
          </div>
        </div>

        {/* Assets */}
        <StatementSection
          title="ASSETS"
          items={balanceSheet.assets.breakdown}
          total={balanceSheet.assets.total}
          colorClass="green"
          icon={<ArrowUpRight className="h-3 w-3" />}
          showTransactionCount
        />

        {/* Liabilities */}
        <StatementSection
          title="LIABILITIES"
          items={balanceSheet.liabilities.breakdown}
          total={balanceSheet.liabilities.total}
          colorClass="red"
          icon={<ArrowDownRight className="h-3 w-3" />}
          showTransactionCount
        />

        {/* Equity */}
        <div className="space-y-1.5">
          <div className="bg-blue-50 dark:bg-blue-950/20 rounded-md p-3 border border-blue-200 dark:border-blue-800">
            <h5 className="text-xs font-bold text-blue-900 dark:text-blue-100 flex items-center gap-1.5 mb-2">
              <Scale className="h-3 w-3" />
              EQUITY
            </h5>
            <div className="space-y-1.5">
              <div className="flex justify-between items-center p-2 bg-background/50 rounded text-xs">
                <span>Capital Contributed</span>
                <span className="font-mono tabular-nums font-semibold">
                  {formatCurrency(balanceSheet.equity.capitalContributed)}
                </span>
              </div>
              <div className="flex justify-between items-center p-2 bg-background/50 rounded text-xs">
                <span>Retained Earnings</span>
                <span className="font-mono tabular-nums font-semibold">
                  {formatCurrency(balanceSheet.equity.retainedEarnings)}
                </span>
              </div>
              
              {balanceSheet.equity.breakdown?.map((item: any, idx: number) => (
                <div key={idx} className="flex justify-between items-center p-2 bg-background/50 rounded hover:bg-muted/50 text-xs">
                  <div className="flex-1 truncate">
                    <span>{item.categoryName || item.name}</span>
                    {item.transactionCount && (
                      <span className="text-[10px] text-muted-foreground ml-1">
                        ({item.transactionCount} txn)
                      </span>
                    )}
                  </div>
                  <span className="font-mono tabular-nums font-semibold ml-2">
                    {formatCurrency(item.totalAmount || item.amount)}
                  </span>
                </div>
              ))}

              <div className="flex justify-between items-center p-2.5 bg-blue-100 dark:bg-blue-900/30 rounded font-bold border-t border-blue-300 dark:border-blue-700 text-xs">
                <span>Total Equity</span>
                <span className="font-mono tabular-nums text-blue-700 dark:text-blue-300">
                  {formatCurrency(balanceSheet.equity.total)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Total Liabilities and Equity */}
        <div className="bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-md p-3 border-2 border-purple-300 dark:border-purple-700">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold">TOTAL LIABILITIES & EQUITY</span>
            <span className="text-base font-bold font-serif tabular-nums text-purple-700 dark:text-purple-300">
              {formatCurrency(balanceSheet.totalLiabilitiesAndEquity)}
            </span>
          </div>
        </div>

        {/* Balance Check */}
        <div className={cn(
          "rounded-md p-3 border-2",
          balanceSheet.balanceCheck === "BALANCED"
            ? "bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 border-green-400 dark:border-green-600"
            : "bg-gradient-to-r from-red-100 to-orange-100 dark:from-red-900/30 dark:to-orange-900/30 border-red-400 dark:border-red-600"
        )}>
          <div className="flex justify-between items-center">
            <span className="text-sm font-bold">BALANCE CHECK</span>
            <span className={cn(
              "text-base font-bold font-mono tabular-nums",
              balanceSheet.balanceCheck === "BALANCED"
                ? "text-green-700 dark:text-green-300"
                : "text-red-700 dark:text-red-300"
            )}>
              {balanceSheet.balanceCheck}
            </span>
          </div>
          <p className="text-[9px] text-muted-foreground text-center mt-1">
            Assets = Liabilities + Equity
          </p>
        </div>
      </div>
    </ScrollArea>
  )
}

// Helper Component for Statement Sections
function StatementSection({
  title,
  items,
  total,
  colorClass,
  icon,
  showTransactionCount = false,
}: {
  title: string
  items?: any[]
  total: number
  colorClass: "blue" | "green" | "orange" | "red"
  icon?: React.ReactNode
  showTransactionCount?: boolean
}) {
  const colorClasses = {
    blue: {
      bg: "bg-blue-50 dark:bg-blue-950/20",
      border: "border-blue-200 dark:border-blue-800",
      text: "text-blue-900 dark:text-blue-100",
      totalBg: "bg-blue-100 dark:bg-blue-900/30",
      totalBorder: "border-blue-300 dark:border-blue-700",
      totalText: "text-blue-700 dark:text-blue-300",
    },
    green: {
      bg: "bg-green-50 dark:bg-green-950/20",
      border: "border-green-200 dark:border-green-800",
      text: "text-green-900 dark:text-green-100",
      totalBg: "bg-green-100 dark:bg-green-900/30",
      totalBorder: "border-green-300 dark:border-green-700",
      totalText: "text-green-700 dark:text-green-300",
    },
    orange: {
      bg: "bg-orange-50 dark:bg-orange-950/20",
      border: "border-orange-200 dark:border-orange-800",
      text: "text-orange-900 dark:text-orange-100",
      totalBg: "bg-orange-100 dark:bg-orange-900/30",
      totalBorder: "border-orange-300 dark:border-orange-700",
      totalText: "text-orange-700 dark:text-orange-300",
    },
    red: {
      bg: "bg-red-50 dark:bg-red-950/20",
      border: "border-red-200 dark:border-red-800",
      text: "text-red-900 dark:text-red-100",
      totalBg: "bg-red-100 dark:bg-red-900/30",
      totalBorder: "border-red-300 dark:border-red-700",
      totalText: "text-red-700 dark:text-red-300",
    },
  }

  const colors = colorClasses[colorClass]

  return (
    <div className="space-y-1.5">
      <div className={cn("rounded-md p-3 border", colors.bg, colors.border)}>
        <h5 className={cn("text-xs font-bold flex items-center gap-1.5 mb-2", colors.text)}>
          {icon}
          {title}
        </h5>
        {items && items.length > 0 ? (
          <div className="space-y-1.5">
            {items.map((item: any, idx: number) => (
              <div
                key={idx}
                className="flex justify-between items-center p-2 bg-background/50 rounded hover:bg-muted/50 transition-colors text-xs"
              >
                <div className="flex-1 truncate">
                  <span className="font-medium">{item.categoryName || item.name}</span>
                  {showTransactionCount && item.transactionCount && (
                    <span className="text-[10px] text-muted-foreground ml-1">
                      ({item.transactionCount} {item.transactionCount === 1 ? "txn" : "txns"})
                    </span>
                  )}
                </div>
                <span className="font-mono tabular-nums font-semibold ml-2">
                  {formatCurrency(item.totalAmount || item.amount)}
                </span>
              </div>
            ))}
            <div className={cn(
              "flex justify-between items-center p-2.5 rounded font-bold border-t text-xs",
              colors.totalBg,
              colors.totalBorder
            )}>
              <span>Total {title.charAt(0) + title.slice(1).toLowerCase()}</span>
              <span className={cn("font-mono tabular-nums", colors.totalText)}>
                {formatCurrency(total)}
              </span>
            </div>
          </div>
        ) : (
          <div className={cn(
            "flex justify-between items-center p-2.5 rounded font-bold text-xs",
            colors.totalBg
          )}>
            <span>Total {title.charAt(0) + title.slice(1).toLowerCase()}</span>
            <span className={cn("font-mono tabular-nums", colors.totalText)}>
              {formatCurrency(total)}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

// Main Modal Component
export function CompanyDetailsModal({ 
  company, 
  open, 
  onOpenChange, 
  onEdit, 
  onDelete 
}: CompanyDetailsModalProps) {
  if (!company) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[95vh] overflow-hidden">
        <DialogHeader className="pb-3">
          <DialogTitle className="flex items-center gap-2 text-base">
            <div className="p-1.5 bg-primary/10 rounded">
              <Building2 className="h-4 w-4 text-primary" />
            </div>
            <span className="truncate">Company Details - {company.name}</span>
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="info" className="w-full">
          <TabsList className="grid w-full grid-cols-4 h-9">
            <TabsTrigger value="info" className="text-xs">
              <Building2 className="h-3 w-3 mr-1" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="transactions" className="text-xs">
              <Receipt className="h-3 w-3 mr-1" />
              Transactions
            </TabsTrigger>
            <TabsTrigger value="income" className="text-xs">
              <BarChart3 className="h-3 w-3 mr-1" />
              Income
            </TabsTrigger>
            <TabsTrigger value="balance" className="text-xs">
              <Scale className="h-3 w-3 mr-1" />
              Balance
            </TabsTrigger>
          </TabsList>

          <TabsContent value="info" className="mt-4">
            <CompanyInfoTab company={company} />
          </TabsContent>

          <TabsContent value="transactions" className="mt-4">
            <TransactionsTab companyId={company.id} />
          </TabsContent>

          <TabsContent value="income" className="mt-4">
            <IncomeStatementTab companyId={company.id} />
          </TabsContent>

          <TabsContent value="balance" className="mt-4">
            <BalanceSheetTab companyId={company.id} />
          </TabsContent>
        </Tabs>

        <DialogFooter className="gap-2 border-t pt-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(company)}
            className="text-destructive hover:text-destructive hover:bg-destructive/10 text-xs h-7"
          >
            <Trash2 className="mr-1 h-3 w-3" />
            Delete
          </Button>
          <Button size="sm" onClick={() => onEdit(company)} className="text-xs h-7">
            <Edit className="mr-1 h-3 w-3" />
            Edit Company
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}