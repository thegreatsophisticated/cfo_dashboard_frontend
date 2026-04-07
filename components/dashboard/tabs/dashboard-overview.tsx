"use client"

import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  CheckCircle2, 
  TrendingUp, 
  TrendingDown,
  Calendar, 
  DollarSign,
  CreditCard,
  Activity,
  Users,
  PieChart,
  BarChart3,
  LineChart
} from "lucide-react"
import { fetchGlobalFinancialSummary } from "@/lib/api"
import { useState } from "react"

interface DashboardOverviewProps {
  onNavigate: (tab: string) => void
}

export function DashboardOverview({ onNavigate }: DashboardOverviewProps) {
  const currentYear = new Date().getFullYear()
  const [selectedYear, setSelectedYear] = useState(currentYear)

  const { data: financialSummary, isLoading } = useQuery({
    queryKey: ["global-financial-summary", selectedYear],
    queryFn: () => fetchGlobalFinancialSummary(selectedYear),
  })

  if (isLoading) {
    return (
      <div className="text-center py-12 text-xs text-muted-foreground">
        Loading advanced analytics...
      </div>
    )
  }

  // const summary = financialSummary?.summary
  // const analytics = summary?.analytics
  const summary = financialSummary?.summary as any
const analytics = summary?.analytics

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <Alert className="flex-1 bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800 py-2">
          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
          <AlertDescription className="text-xs text-emerald-700 dark:text-emerald-400">
            <strong className="font-semibold">Global Analytics</strong> — {selectedYear} • {summary?.totalCompanies} companies • {summary?.totalTransactions.toLocaleString()} transactions
          </AlertDescription>
        </Alert>
        
        <div className="flex items-center gap-1.5">
          <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="border rounded px-2 py-1 text-xs bg-background focus:outline-none focus:ring-1 focus:ring-primary"
          >
            {[currentYear - 2, currentYear - 1, currentYear, currentYear + 1].map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Key Financial Metrics - Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Revenue */}
        <Card className="border-l-4 border-l-emerald-500">
          <CardHeader className="">
            <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Total Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm font-bold text-emerald-600">
              RWF {summary?.revenue?.total?.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Avg per company: RWF {summary?.revenue?.averagePerCompany?.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        {/* Expenses */}
        <Card className="border-l-4 border-l-red-500">
          <CardHeader className="">
            <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Total Expenses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm font-bold text-red-600">
              RWF {summary?.expenses?.total?.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Avg per company: RWF {summary?.expenses?.averagePerCompany?.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        {/* Net Profit */}
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="">
            <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Net Profit
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-sm font-bold ${summary?.netProfit >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
              RWF {summary?.netProfit?.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Margin: {analytics?.financialRatios?.profitMargin}%
            </p>
          </CardContent>
        </Card>

        {/* Cash Flow */}
        <Card className="border-l-4 border-l-violet-500">
          <CardHeader className="">
            <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Net Cash Flow
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-sm font-bold ${analytics?.cashFlowAnalysis?.netCashFlow >= 0 ? 'text-violet-600' : 'text-red-600'}`}>
              RWF {analytics?.cashFlowAnalysis?.netCashFlow?.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              In: {analytics?.cashFlowAnalysis?.cashInTransactions} | Out: {analytics?.cashFlowAnalysis?.cashOutTransactions}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Financial Ratios */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <PieChart className="h-4 w-4" />
            Financial Ratios & KPIs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Profit Margin</p>
              <p className="text-sm font-bold">{analytics?.financialRatios?.profitMargin}%</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Gross Margin</p>
              <p className="text-sm font-bold">{analytics?.financialRatios?.grossProfitMargin}%</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Debt to Asset</p>
              <p className="text-sm font-bold">{analytics?.financialRatios?.debtToAssetRatio}%</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Current Ratio</p>
              <p className="text-sm font-bold">{analytics?.financialRatios?.currentRatio}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Monthly Trends */}
      {analytics?.monthlyTrends && analytics.monthlyTrends.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <LineChart className="h-4 w-4" />
              Monthly Performance Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics.monthlyTrends.map((month: any) => (
                <div key={month.month} className="flex items-center gap-4">
                  <div className="w-16 text-xs font-medium">
                    {new Date(2024, month.month - 1).toLocaleString('default', { month: 'short' })}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
                        <div 
                          className="h-full bg-emerald-500" 
                          style={{ width: `${Math.min((month.revenue / Math.max(...analytics.monthlyTrends.map((m: any) => m.revenue))) * 100, 100)}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium w-24 text-right text-emerald-600">
                        {month.revenue.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
                        <div 
                          className="h-full bg-red-500" 
                          style={{ width: `${Math.min((month.expenses / Math.max(...analytics.monthlyTrends.map((m: any) => m.expenses))) * 100, 100)}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium w-24 text-right text-red-600">
                        {month.expenses.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <Badge variant={month.netIncome >= 0 ? "default" : "destructive"} className="text-xs">
                    {month.netIncome >= 0 ? '+' : ''}{month.netIncome.toLocaleString()}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Company Performance */}
      {analytics?.companyPerformance && analytics.companyPerformance.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Users className="h-4 w-4" />
              Company Performance Ranking
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics.companyPerformance.slice(0, 5).map((company: any, index: number) => (
                <div key={company.companyId} className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold
                    ${index === 0 ? 'bg-yellow-100 text-yellow-700' : 
                      index === 1 ? 'bg-gray-100 text-gray-700' : 
                      index === 2 ? 'bg-orange-100 text-orange-700' : 
                      'bg-blue-100 text-blue-700'}`}>
                    #{index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{company.companyName}</p>
                    <p className="text-xs text-muted-foreground">
                      {company.transactionCount} transactions • RWF {company.totalVolume.toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-bold ${company.netIncome >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                      RWF {company.netIncome.toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground">Net Income</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Expense Breakdown */}
      {summary?.expenses?.breakdown && summary.expenses.breakdown.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Top Expense Categories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {summary.expenses.breakdown.slice(0, 5).map((expense: any) => {
                const total = summary.expenses.total
                const percentage = total > 0 ? ((expense.amount / total) * 100).toFixed(1) : '0'
                return (
                  <div key={expense.category} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium">{expense.category}</span>
                      <span className="text-muted-foreground">{expense.count} txns</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
                        <div 
                          className="h-full bg-red-500" 
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-xs font-bold w-24 text-right">
                        RWF {expense.amount.toLocaleString()}
                      </span>
                      <span className="text-xs text-muted-foreground w-12 text-right">
                        {percentage}%
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Revenue Streams */}
      {summary?.revenue?.breakdown && summary.revenue.breakdown.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Revenue Streams
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {summary.revenue.breakdown.slice(0, 5).map((revenue: any) => {
                const total = summary.revenue.total
                const percentage = total > 0 ? ((revenue.amount / total) * 100).toFixed(1) : '0'
                return (
                  <div key={revenue.category} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium">{revenue.category}</span>
                      <span className="text-muted-foreground">{revenue.count} txns</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
                        <div 
                          className="h-full bg-emerald-500" 
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-xs font-bold w-24 text-right">
                        RWF {revenue.amount.toLocaleString()}
                      </span>
                      <span className="text-xs text-muted-foreground w-12 text-right">
                        {percentage}%
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Top Counterparties */}
      {analytics?.counterpartyAnalysis && analytics.counterpartyAnalysis.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold">Top Counterparties</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {analytics.counterpartyAnalysis.slice(0, 5).map((counterparty: any) => (
                <div key={counterparty.name} className="flex items-center justify-between p-2 rounded hover:bg-muted/50">
                  <div>
                    <p className="text-sm font-medium">{counterparty.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {counterparty.transactionCount} transactions
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold">RWF {counterparty.totalAmount.toLocaleString()}</p>
                    <div className="flex gap-2 text-xs">
                      <span className="text-emerald-600">+{counterparty.revenue.toLocaleString()}</span>
                      <span className="text-red-600">-{counterparty.expenses.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tax Analysis */}
      {analytics?.taxAnalysis && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold">Tax Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-xs text-muted-foreground">Total Tax Collected</p>
                <p className="text-xl font-bold">RWF {analytics.taxAnalysis.totalTaxCollected?.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Average Tax Rate</p>
                <p className="text-xl font-bold">{analytics.taxAnalysis.averageTaxRate}%</p>
              </div>
            </div>
            {analytics.taxAnalysis.taxByCategory && analytics.taxAnalysis.taxByCategory.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground">By Category</p>
                {analytics.taxAnalysis.taxByCategory.slice(0, 3).map((tax: any) => (
                  <div key={tax.category} className="flex items-center justify-between text-xs">
                    <span>{tax.category}</span>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">{tax.averageTaxRate}%</Badge>
                      <span className="font-medium">RWF {tax.totalTax.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}