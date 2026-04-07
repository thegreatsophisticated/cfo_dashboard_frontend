"use client"

import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Download, ArrowDownCircle, ArrowUpCircle, Wallet } from "lucide-react"
import { fetchCashBook, formatCurrency, formatDate, type CashBookReport } from "@/lib/api-enhanced"
import { useState } from "react"

interface CashBookProps {
  companyId: number
  companyName: string
}

export function CashBook({ companyId, companyName }: CashBookProps) {
  const today = new Date().toISOString().split('T')[0]
  const firstDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0]
  
  const [startDate, setStartDate] = useState(firstDayOfMonth)
  const [endDate, setEndDate] = useState(today)

  const { data: report, isLoading, error } = useQuery({
    queryKey: ["cash-book", companyId, startDate, endDate],
    queryFn: () => fetchCashBook(companyId, startDate, endDate),
  })

  const handleDownload = () => {
    console.log("Downloading cash book...")
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
          <p className="text-destructive">Failed to load cash book</p>
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
                Cash Book
              </CardTitle>
              <p className="text-muted-foreground mt-2 font-light">
                {companyName} • {formatDate(startDate)} to {formatDate(endDate)}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Label htmlFor="startDate" className="text-sm">From:</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-40"
                />
              </div>
              <div className="flex items-center gap-2">
                <Label htmlFor="endDate" className="text-sm">To:</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-40"
                />
              </div>
              <Button onClick={handleDownload} variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export PDF
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="shadow-lg border-border/40 bg-gradient-to-br from-blue-50 to-white dark:from-blue-950/20 dark:to-slate-900">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Opening Balance</p>
                <p className="text-xl font-bold font-serif tracking-tight">
                  {formatCurrency(report.openingBalance)}
                </p>
              </div>
              <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                <Wallet className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-border/40 bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-950/20 dark:to-slate-900">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Total Receipts</p>
                <p className="text-xl font-bold font-serif tracking-tight text-emerald-600 dark:text-emerald-400">
                  {formatCurrency(report.totalReceipts)}
                </p>
              </div>
              <div className="h-10 w-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
                <ArrowDownCircle className="h-5 w-5 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-border/40 bg-gradient-to-br from-red-50 to-white dark:from-red-950/20 dark:to-slate-900">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Total Payments</p>
                <p className="text-xl font-bold font-serif tracking-tight text-red-600 dark:text-red-400">
                  {formatCurrency(report.totalPayments)}
                </p>
              </div>
              <div className="h-10 w-10 rounded-full bg-red-500/10 flex items-center justify-center">
                <ArrowUpCircle className="h-5 w-5 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={`shadow-lg border-border/40 bg-gradient-to-br ${
          report.closingBalance >= report.openingBalance
            ? 'from-violet-50 to-white dark:from-violet-950/20 dark:to-slate-900'
            : 'from-amber-50 to-white dark:from-amber-950/20 dark:to-slate-900'
        }`}>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Closing Balance</p>
                <p className="text-xl font-bold font-serif tracking-tight">
                  {formatCurrency(report.closingBalance)}
                </p>
                <p className={`text-xs mt-1 ${
                  report.netChange >= 0 ? 'text-emerald-600' : 'text-red-600'
                }`}>
                  {report.netChange >= 0 ? '+' : ''}{formatCurrency(report.netChange)} net change
                </p>
              </div>
              <div className="h-10 w-10 rounded-full bg-violet-500/10 flex items-center justify-center">
                <Wallet className="h-5 w-5 text-violet-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Receipts Section */}
      <Card className="shadow-xl border-border/40">
        <CardHeader className="bg-gradient-to-r from-emerald-50 to-transparent dark:from-emerald-950/20">
          <CardTitle className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
            <ArrowDownCircle className="h-5 w-5" />
            Receipts (Money In)
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Reference</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {report.receipts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                    No receipts recorded for this period
                  </TableCell>
                </TableRow>
              ) : (
                report.receipts.map((receipt, index) => (
                  <TableRow key={index} className="hover:bg-emerald-50/50 dark:hover:bg-emerald-950/20">
                    <TableCell className="font-medium">
                      {new Date(receipt.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{receipt.description}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400">
                        {receipt.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {receipt.reference || '—'}
                    </TableCell>
                    <TableCell className="text-right font-serif font-semibold text-emerald-600 dark:text-emerald-400 tabular-nums">
                      {formatCurrency(receipt.amount)}
                    </TableCell>
                  </TableRow>
                ))
              )}
              {report.receipts.length > 0 && (
                <TableRow className="bg-emerald-50 dark:bg-emerald-950/20 font-semibold">
                  <TableCell colSpan={4} className="text-right">Total Receipts:</TableCell>
                  <TableCell className="text-right font-serif text-lg text-emerald-700 dark:text-emerald-400 tabular-nums">
                    {formatCurrency(report.totalReceipts)}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Payments Section */}
      <Card className="shadow-xl border-border/40">
        <CardHeader className="bg-gradient-to-r from-red-50 to-transparent dark:from-red-950/20">
          <CardTitle className="flex items-center gap-2 text-red-700 dark:text-red-400">
            <ArrowUpCircle className="h-5 w-5" />
            Payments (Money Out)
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Reference</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {report.payments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                    No payments recorded for this period
                  </TableCell>
                </TableRow>
              ) : (
                report.payments.map((payment, index) => (
                  <TableRow key={index} className="hover:bg-red-50/50 dark:hover:bg-red-950/20">
                    <TableCell className="font-medium">
                      {new Date(payment.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{payment.description}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 dark:bg-red-950/30 dark:text-red-400">
                        {payment.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {payment.reference || '—'}
                    </TableCell>
                    <TableCell className="text-right font-serif font-semibold text-red-600 dark:text-red-400 tabular-nums">
                      {formatCurrency(payment.amount)}
                    </TableCell>
                  </TableRow>
                ))
              )}
              {report.payments.length > 0 && (
                <TableRow className="bg-red-50 dark:bg-red-950/20 font-semibold">
                  <TableCell colSpan={4} className="text-right">Total Payments:</TableCell>
                  <TableCell className="text-right font-serif text-lg text-red-700 dark:text-red-400 tabular-nums">
                    {formatCurrency(report.totalPayments)}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Summary */}
      <Card className="shadow-xl border-border/40 bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
        <CardContent className="p-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between text-lg">
              <span className="font-medium">Opening Balance</span>
              <span className="font-serif font-semibold tabular-nums">{formatCurrency(report.openingBalance)}</span>
            </div>
            <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400">
              <span>Add: Total Receipts</span>
              <span className="font-serif font-semibold tabular-nums">{formatCurrency(report.totalReceipts)}</span>
            </div>
            <div className="flex items-center justify-between text-red-600 dark:text-red-400">
              <span>Less: Total Payments</span>
              <span className="font-serif font-semibold tabular-nums">{formatCurrency(report.totalPayments)}</span>
            </div>
            <div className="flex items-center justify-between text-2xl font-bold border-t-2 pt-3">
              <span className="font-serif">Closing Balance</span>
              <span className={`font-serif tabular-nums ${
                report.closingBalance >= 0 ? 'text-foreground' : 'text-red-600 dark:text-red-400'
              }`}>
                {formatCurrency(report.closingBalance)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}