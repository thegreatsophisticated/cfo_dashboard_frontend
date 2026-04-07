"use client"

import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Download, Building2, Landmark, PiggyBank } from "lucide-react"
import { fetchBalanceSheet, formatCurrency, type BalanceSheetReport } from "@/lib/api-enhanced"
import { useState } from "react"

interface BalanceSheetProps {
  companyId: number
  companyName: string
}

export function BalanceSheet({ companyId, companyName }: BalanceSheetProps) {
  const [asOfDate, setAsOfDate] = useState(new Date().toISOString().split('T')[0])

  const { data: report, isLoading, error } = useQuery({
    queryKey: ["balance-sheet", companyId, asOfDate],
    queryFn: () => fetchBalanceSheet(companyId, asOfDate),
  })

  const handleDownload = () => {
    console.log("Downloading balance sheet...")
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
          <p className="text-destructive">Failed to load balance sheet</p>
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
                Balance Sheet
              </CardTitle>
              <p className="text-muted-foreground mt-2 font-light">
                {companyName} • As of {new Date(asOfDate).toLocaleDateString()}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Label htmlFor="asOfDate" className="text-sm">As of Date:</Label>
                <Input
                  id="asOfDate"
                  type="date"
                  value={asOfDate}
                  onChange={(e) => setAsOfDate(e.target.value)}
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="shadow-lg border-border/40 bg-gradient-to-br from-violet-50 to-white dark:from-violet-950/20 dark:to-slate-900">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Total Assets</p>
                <p className="text-2xl font-bold font-serif tracking-tight">
                  {formatCurrency(report.assets.totalAssets)}
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-violet-500/10 flex items-center justify-center">
                <Building2 className="h-6 w-6 text-violet-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-border/40 bg-gradient-to-br from-rose-50 to-white dark:from-rose-950/20 dark:to-slate-900">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Total Liabilities</p>
                <p className="text-2xl font-bold font-serif tracking-tight">
                  {formatCurrency(report.liabilities.totalLiabilities)}
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-rose-500/10 flex items-center justify-center">
                <Landmark className="h-6 w-6 text-rose-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-border/40 bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-950/20 dark:to-slate-900">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Total Equity</p>
                <p className="text-2xl font-bold font-serif tracking-tight">
                  {formatCurrency(report.equity.totalEquity)}
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-emerald-500/10 flex items-center justify-center">
                <PiggyBank className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Balance Sheet */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Assets Column */}
        <Card className="shadow-xl border-border/40">
          <CardContent className="p-8">
            <h3 className="text-2xl font-bold mb-6 font-serif border-b pb-3">Assets</h3>
            
            <div className="space-y-6">
              {/* Current Assets */}
              <div>
                <h4 className="text-lg font-semibold mb-4 font-serif text-violet-700 dark:text-violet-400">
                  Current Assets
                </h4>
                <div className="space-y-3 pl-4">
                  <BalanceLine label="Cash at Bank" amount={report.assets.currentAssets.cashAtBank} />
                  <BalanceLine label="Petty Cash" amount={report.assets.currentAssets.pettyCash} />
                  <BalanceLine label="Mobile Money" amount={report.assets.currentAssets.mobileMoney} />
                  <BalanceLine label="Trade Debtors" amount={report.assets.currentAssets.tradeDebtors} />
                  <BalanceLine label="Inventory" amount={report.assets.currentAssets.inventory} />
                  <BalanceLine 
                    label="Total Current Assets" 
                    amount={report.assets.currentAssets.totalCurrentAssets} 
                    isSubTotal 
                  />
                </div>
              </div>

              {/* Fixed Assets */}
              <div>
                <h4 className="text-lg font-semibold mb-4 font-serif text-violet-700 dark:text-violet-400">
                  Fixed Assets
                </h4>
                <div className="space-y-3 pl-4">
                  <BalanceLine label="Land" amount={report.assets.fixedAssets.land} />
                  <BalanceLine label="Buildings" amount={report.assets.fixedAssets.buildings} />
                  <BalanceLine label="Motor Vehicles" amount={report.assets.fixedAssets.motorVehicles} />
                  <BalanceLine label="Furniture & Fittings" amount={report.assets.fixedAssets.furnitureFittings} />
                  <BalanceLine label="Office Equipment" amount={report.assets.fixedAssets.officeEquipment} />
                  <BalanceLine label="Computer Equipment" amount={report.assets.fixedAssets.computerEquipment} />
                  <BalanceLine 
                    label="Less: Accumulated Depreciation" 
                    amount={report.assets.fixedAssets.accumulatedDepreciation} 
                    isNegative 
                  />
                  <BalanceLine 
                    label="Total Fixed Assets" 
                    amount={report.assets.fixedAssets.totalFixedAssets} 
                    isSubTotal 
                  />
                </div>
              </div>

              {/* Total Assets */}
              <BalanceLine 
                label="TOTAL ASSETS" 
                amount={report.assets.totalAssets} 
                isTotal 
              />
            </div>
          </CardContent>
        </Card>

        {/* Liabilities & Equity Column */}
        <Card className="shadow-xl border-border/40">
          <CardContent className="p-8">
            <h3 className="text-2xl font-bold mb-6 font-serif border-b pb-3">Liabilities & Equity</h3>
            
            <div className="space-y-6">
              {/* Current Liabilities */}
              <div>
                <h4 className="text-lg font-semibold mb-4 font-serif text-rose-700 dark:text-rose-400">
                  Current Liabilities
                </h4>
                <div className="space-y-3 pl-4">
                  <BalanceLine label="Trade Creditors" amount={report.liabilities.currentLiabilities.tradeCreditors} />
                  <BalanceLine label="Bank Overdraft" amount={report.liabilities.currentLiabilities.bankOverdraft} />
                  <BalanceLine label="Short-term Loans" amount={report.liabilities.currentLiabilities.shortTermLoans} />
                  <BalanceLine 
                    label="Total Current Liabilities" 
                    amount={report.liabilities.currentLiabilities.totalCurrentLiabilities} 
                    isSubTotal 
                  />
                </div>
              </div>

              {/* Long-term Liabilities */}
              <div>
                <h4 className="text-lg font-semibold mb-4 font-serif text-rose-700 dark:text-rose-400">
                  Long-term Liabilities
                </h4>
                <div className="space-y-3 pl-4">
                  <BalanceLine label="Long-term Loans" amount={report.liabilities.longTermLiabilities.longTermLoans} />
                  <BalanceLine 
                    label="Total Long-term Liabilities" 
                    amount={report.liabilities.longTermLiabilities.totalLongTermLiabilities} 
                    isSubTotal 
                  />
                </div>
              </div>

              {/* Total Liabilities */}
              <BalanceLine 
                label="Total Liabilities" 
                amount={report.liabilities.totalLiabilities} 
                isSubTotal
                className="border-t pt-3"
              />

              {/* Equity */}
              <div className="mt-8">
                <h4 className="text-lg font-semibold mb-4 font-serif text-emerald-700 dark:text-emerald-400">
                  Equity
                </h4>
                <div className="space-y-3 pl-4">
                  <BalanceLine label="Share Capital" amount={report.equity.shareCapital} />
                  <BalanceLine label="Retained Earnings" amount={report.equity.retainedEarnings} />
                  <BalanceLine label="Current Year Profit" amount={report.equity.currentYearProfit} />
                  <BalanceLine 
                    label="Total Equity" 
                    amount={report.equity.totalEquity} 
                    isSubTotal 
                  />
                </div>
              </div>

              {/* Total Liabilities & Equity */}
              <BalanceLine 
                label="TOTAL LIABILITIES & EQUITY" 
                amount={report.totalLiabilitiesAndEquity} 
                isTotal 
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Balance Verification */}
      {Math.abs(report.assets.totalAssets - report.totalLiabilitiesAndEquity) < 0.01 && (
        <Card className="shadow-lg border-emerald-200 bg-emerald-50 dark:bg-emerald-950/20 dark:border-emerald-800">
          <CardContent className="py-4">
            <p className="text-center text-emerald-700 dark:text-emerald-400 font-medium">
              ✓ Balance Sheet is balanced
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

interface BalanceLineProps {
  label: string
  amount: number
  isSubTotal?: boolean
  isTotal?: boolean
  isNegative?: boolean
  className?: string
}

function BalanceLine({ label, amount, isSubTotal, isTotal, isNegative, className = "" }: BalanceLineProps) {
  const displayAmount = isNegative ? -Math.abs(amount) : amount

  return (
    <div className={`flex items-center justify-between ${className} ${
      isTotal ? 'border-t-2 border-b-2 py-3 font-bold text-lg' : 
      isSubTotal ? 'border-t pt-3 font-semibold' : ''
    }`}>
      <span className={isTotal || isSubTotal ? 'font-semibold' : 'text-muted-foreground'}>
        {label}
      </span>
      <span className={`font-serif tabular-nums ${
        isTotal || isSubTotal ? 'font-bold' : ''
      } ${isNegative ? 'text-red-600 dark:text-red-400' : ''}`}>
        {formatCurrency(displayAmount)}
      </span>
    </div>
  )
}