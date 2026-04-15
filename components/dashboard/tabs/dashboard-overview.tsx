"use client"

import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  CheckCircle2, 
  TrendingUp, 
  Calendar, 
  DollarSign,
  CreditCard,
  Activity,
  Users,
  PieChart,
  BarChart3,
  Wallet,
  Percent,
  Building2,
  Receipt,
  Handshake,
  TrendingDown
} from "lucide-react"
import { fetchGlobalFinancialSummary } from "@/lib/api"
import { useState } from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  CartesianGrid,
  Legend
} from "recharts"

interface DashboardOverviewProps {
  onNavigate: (tab: string) => void
}

// Custom tooltip for charts
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background border rounded-lg shadow-lg p-2 text-[10px]">
        <p className="font-medium mb-1">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-[10px]" style={{ color: entry.color }}>
            {entry.name}: RWF {entry.value?.toLocaleString()}
          </p>
        ))}
      </div>
    )
  }
  return null
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
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Activity className="h-4 w-4 animate-spin" />
          Loading analytics...
        </div>
      </div>
    )
  }

  const summary = financialSummary?.summary as any
  const analytics = summary?.analytics

  // Prepare monthly trends data for chart
  const monthlyData = analytics?.monthlyTrends?.map((month: any) => ({
    month: new Date(2024, month.month - 1).toLocaleString('default', { month: 'short' }),
    revenue: month.revenue,
    expenses: month.expenses,
    netIncome: month.netIncome
  })) || []

  // Prepare expense breakdown data
  const expenseData = summary?.expenses?.breakdown?.slice(0, 5).map((expense: any) => ({
    category: expense.category,
    amount: expense.amount,
    count: expense.count
  })) || []

  // Prepare revenue breakdown data
  const revenueData = summary?.revenue?.breakdown?.slice(0, 5).map((revenue: any) => ({
    category: revenue.category,
    amount: revenue.amount,
    count: revenue.count
  })) || []

  // Colors for charts
  const COLORS = {
    emerald: '#10b981',
    red: '#ef4444',
    blue: '#3b82f6',
    violet: '#8b5cf6',
    orange: '#f97316',
    yellow: '#eab308',
    gray: '#6b7280'
  }

  return (
    <div className="space-y-4 p-1">
      {/* Header - Compact */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-lg px-3 py-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
            <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium">
              {selectedYear} • {summary?.totalCompanies} companies • {summary?.totalTransactions.toLocaleString()} txns
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-1.5">
          <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="border rounded-md px-2 py-1 text-[11px] bg-background focus:outline-none focus:ring-1 focus:ring-primary"
          >
            {[currentYear - 2, currentYear - 1, currentYear, currentYear + 1].map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
      </div>

      {/* KPI Cards - Compact Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Revenue */}
        <Card className="border-0 shadow-sm bg-gradient-to-br from-emerald-50/50 to-white dark:from-emerald-950/20 dark:to-background">
          <CardContent className="p-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-1.5">
                <div className="p-1.5 rounded-md bg-emerald-100 dark:bg-emerald-900/50">
                  <DollarSign className="h-3.5 w-3.5 text-emerald-600" />
                </div>
                <span className="text-[10px] font-medium text-muted-foreground">Revenue</span>
              </div>
            </div>
            <div className="mt-2">
              <p className="text-sm font-bold text-emerald-700 dark:text-emerald-400">
                RWF {summary?.revenue?.total?.toLocaleString()}
              </p>
              <p className="text-[10px] text-muted-foreground mt-0.5">
                Avg: RWF {summary?.revenue?.averagePerCompany?.toLocaleString()}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Expenses */}
        <Card className="border-0 shadow-sm bg-gradient-to-br from-red-50/50 to-white dark:from-red-950/20 dark:to-background">
          <CardContent className="p-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-1.5">
                <div className="p-1.5 rounded-md bg-red-100 dark:bg-red-900/50">
                  <CreditCard className="h-3.5 w-3.5 text-red-600" />
                </div>
                <span className="text-[10px] font-medium text-muted-foreground">Expenses</span>
              </div>
            </div>
            <div className="mt-2">
              <p className="text-sm font-bold text-red-700 dark:text-red-400">
                RWF {summary?.expenses?.total?.toLocaleString()}
              </p>
              <p className="text-[10px] text-muted-foreground mt-0.5">
                Avg: RWF {summary?.expenses?.averagePerCompany?.toLocaleString()}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Net Profit */}
        <Card className="border-0 shadow-sm bg-gradient-to-br from-blue-50/50 to-white dark:from-blue-950/20 dark:to-background">
          <CardContent className="p-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-1.5">
                <div className="p-1.5 rounded-md bg-blue-100 dark:bg-blue-900/50">
                  {summary?.netProfit >= 0 ? (
                    <TrendingUp className="h-3.5 w-3.5 text-blue-600" />
                  ) : (
                    <TrendingDown className="h-3.5 w-3.5 text-red-600" />
                  )}
                </div>
                <span className="text-[10px] font-medium text-muted-foreground">Net Profit</span>
              </div>
            </div>
            <div className="mt-2">
              <p className={`text-sm font-bold ${summary?.netProfit >= 0 ? 'text-blue-700 dark:text-blue-400' : 'text-red-700 dark:text-red-400'}`}>
                RWF {summary?.netProfit?.toLocaleString()}
              </p>
              <p className="text-[10px] text-muted-foreground mt-0.5">
                Margin: {analytics?.financialRatios?.profitMargin}%
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Cash Flow */}
        <Card className="border-0 shadow-sm bg-gradient-to-br from-violet-50/50 to-white dark:from-violet-950/20 dark:to-background">
          <CardContent className="p-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-1.5">
                <div className="p-1.5 rounded-md bg-violet-100 dark:bg-violet-900/50">
                  <Activity className="h-3.5 w-3.5 text-violet-600" />
                </div>
                <span className="text-[10px] font-medium text-muted-foreground">Cash Flow</span>
              </div>
            </div>
            <div className="mt-2">
              <p className={`text-sm font-bold ${analytics?.cashFlowAnalysis?.netCashFlow >= 0 ? 'text-violet-700 dark:text-violet-400' : 'text-red-700 dark:text-red-400'}`}>
                RWF {analytics?.cashFlowAnalysis?.netCashFlow?.toLocaleString()}
              </p>
              <p className="text-[10px] text-muted-foreground mt-0.5">
                In: {analytics?.cashFlowAnalysis?.cashInTransactions} | Out: {analytics?.cashFlowAnalysis?.cashOutTransactions}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Two Column Layout for Related Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        
        {/* Left Column - Financial Health */}
        <div className="space-y-4">
          {/* Financial Ratios - Compact */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2 pt-3 px-3">
              <CardTitle className="text-[11px] font-semibold flex items-center gap-1.5 text-muted-foreground">
                <PieChart className="h-3.5 w-3.5" />
                Financial Ratios & KPIs
              </CardTitle>
            </CardHeader>
            <CardContent className="px-3 pb-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center justify-between p-2 rounded-lg bg-muted/30">
                  <div className="flex items-center gap-1.5">
                    <Percent className="h-3 w-3 text-muted-foreground" />
                    <span className="text-[10px] text-muted-foreground">Profit Margin</span>
                  </div>
                  <span className="text-[11px] font-bold">{analytics?.financialRatios?.profitMargin}%</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-muted/30">
                  <div className="flex items-center gap-1.5">
                    <Percent className="h-3 w-3 text-muted-foreground" />
                    <span className="text-[10px] text-muted-foreground">Gross Margin</span>
                  </div>
                  <span className="text-[11px] font-bold">{analytics?.financialRatios?.grossProfitMargin}%</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-muted/30">
                  <div className="flex items-center gap-1.5">
                    <Building2 className="h-3 w-3 text-muted-foreground" />
                    <span className="text-[10px] text-muted-foreground">Debt/Asset</span>
                  </div>
                  <span className="text-[11px] font-bold">{analytics?.financialRatios?.debtToAssetRatio}%</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-muted/30">
                  <div className="flex items-center gap-1.5">
                    <Wallet className="h-3 w-3 text-muted-foreground" />
                    <span className="text-[10px] text-muted-foreground">Current Ratio</span>
                  </div>
                  <span className="text-[11px] font-bold">{analytics?.financialRatios?.currentRatio}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Monthly Trends - Bar Chart */}
          {monthlyData.length > 0 && (
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-2 pt-3 px-3">
                <CardTitle className="text-[11px] font-semibold flex items-center gap-1.5 text-muted-foreground">
                  <BarChart3 className="h-3.5 w-3.5" />
                  Monthly Performance Trends
                </CardTitle>
              </CardHeader>
              <CardContent className="px-3 pb-3">
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                      <XAxis 
                        dataKey="month" 
                        tick={{ fontSize: 9, fill: '#6b7280' }} 
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis 
                        tick={{ fontSize: 9, fill: '#6b7280' }} 
                        axisLine={false}
                        tickLine={false}
                        tickFormatter={(value) => `RWF ${(value / 1000000).toFixed(0)}M`}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend wrapperStyle={{ fontSize: '10px' }} />
                      <Bar dataKey="revenue" name="Revenue" fill={COLORS.emerald} radius={[2, 2, 0, 0]} maxBarSize={20} />
                      <Bar dataKey="expenses" name="Expenses" fill={COLORS.red} radius={[2, 2, 0, 0]} maxBarSize={20} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Tax Analysis - Compact */}
          {analytics?.taxAnalysis && (
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-2 pt-3 px-3">
                <CardTitle className="text-[11px] font-semibold flex items-center gap-1.5 text-muted-foreground">
                  <Receipt className="h-3.5 w-3.5" />
                  Tax Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="px-3 pb-3">
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-muted/30">
                    <p className="text-[9px] text-muted-foreground">Total Tax</p>
                    <p className="text-sm font-bold">RWF {analytics.taxAnalysis.totalTaxCollected?.toLocaleString()}</p>
                  </div>
                  <div className="p-2 rounded-lg bg-muted/30">
                    <p className="text-[9px] text-muted-foreground">Avg Rate</p>
                    <p className="text-sm font-bold">{analytics.taxAnalysis.averageTaxRate}%</p>
                  </div>
                </div>
                {analytics.taxAnalysis.taxByCategory && analytics.taxAnalysis.taxByCategory.length > 0 && (
                  <div className="space-y-1">
                    <p className="text-[9px] font-medium text-muted-foreground mb-1">By Category</p>
                    {analytics.taxAnalysis.taxByCategory.slice(0, 3).map((tax: any) => (
                      <div key={tax.category} className="flex items-center justify-between py-1 px-2 rounded hover:bg-muted/50">
                        <span className="text-[10px]">{tax.category}</span>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-[9px] px-1 h-4">{tax.averageTaxRate}%</Badge>
                          <span className="text-[10px] font-medium">RWF {tax.totalTax.toLocaleString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column - Operations */}
        <div className="space-y-4">
          {/* Company Performance - Bar Chart */}
          {analytics?.companyPerformance && analytics.companyPerformance.length > 0 && (
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-2 pt-3 px-3">
                <CardTitle className="text-[11px] font-semibold flex items-center gap-1.5 text-muted-foreground">
                  <Users className="h-3.5 w-3.5" />
                  Top Companies by Net Income
                </CardTitle>
              </CardHeader>
              <CardContent className="px-3 pb-3">
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart 
                      data={analytics.companyPerformance.slice(0, 5).map((c: any) => ({
                        name: c.companyName.length > 15 ? c.companyName.substring(0, 15) + '...' : c.companyName,
                        netIncome: c.netIncome,
                        fullName: c.companyName
                      }))} 
                      layout="vertical"
                      margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" horizontal={true} vertical={false} />
                      <XAxis 
                        type="number" 
                        tick={{ fontSize: 9, fill: '#6b7280' }} 
                        axisLine={false}
                        tickLine={false}
                        tickFormatter={(value) => `RWF ${(value / 1000000).toFixed(0)}M`}
                      />
                      <YAxis 
                        type="category" 
                        dataKey="name" 
                        tick={{ fontSize: 9, fill: '#374151' }} 
                        axisLine={false}
                        tickLine={false}
                        width={80}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="netIncome" name="Net Income" radius={[0, 2, 2, 0]} maxBarSize={16}>
                        {analytics.companyPerformance.slice(0, 5).map((entry: any, index: number) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={entry.netIncome >= 0 ? COLORS.emerald : COLORS.red} 
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Expense Breakdown - Bar Chart */}
          {expenseData.length > 0 && (
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-2 pt-3 px-3">
                <CardTitle className="text-[11px] font-semibold flex items-center gap-1.5 text-muted-foreground">
                  <BarChart3 className="h-3.5 w-3.5" />
                  Top Expense Categories
                </CardTitle>
              </CardHeader>
              <CardContent className="px-3 pb-3">
                <div className="h-40">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart 
                      data={expenseData} 
                      layout="vertical"
                      margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" horizontal={true} vertical={false} />
                      <XAxis 
                        type="number" 
                        tick={{ fontSize: 9, fill: '#6b7280' }} 
                        axisLine={false}
                        tickLine={false}
                        tickFormatter={(value) => `RWF ${(value / 1000).toFixed(0)}K`}
                      />
                      <YAxis 
                        type="category" 
                        dataKey="category" 
                        tick={{ fontSize: 9, fill: '#374151' }} 
                        axisLine={false}
                        tickLine={false}
                        width={90}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="amount" name="Amount" fill={COLORS.red} radius={[0, 2, 2, 0]} maxBarSize={14} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Revenue Streams - Bar Chart */}
          {revenueData.length > 0 && (
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-2 pt-3 px-3">
                <CardTitle className="text-[11px] font-semibold flex items-center gap-1.5 text-muted-foreground">
                  <TrendingUp className="h-3.5 w-3.5" />
                  Revenue Streams
                </CardTitle>
              </CardHeader>
              <CardContent className="px-3 pb-3">
                <div className="h-40">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart 
                      data={revenueData} 
                      layout="vertical"
                      margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" horizontal={true} vertical={false} />
                      <XAxis 
                        type="number" 
                        tick={{ fontSize: 9, fill: '#6b7280' }} 
                        axisLine={false}
                        tickLine={false}
                        tickFormatter={(value) => `RWF ${(value / 1000).toFixed(0)}K`}
                      />
                      <YAxis 
                        type="category" 
                        dataKey="category" 
                        tick={{ fontSize: 9, fill: '#374151' }} 
                        axisLine={false}
                        tickLine={false}
                        width={90}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="amount" name="Amount" fill={COLORS.emerald} radius={[0, 2, 2, 0]} maxBarSize={14} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Top Counterparties - Bar Chart */}
          {analytics?.counterpartyAnalysis && analytics.counterpartyAnalysis.length > 0 && (
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-2 pt-3 px-3">
                <CardTitle className="text-[11px] font-semibold flex items-center gap-1.5 text-muted-foreground">
                  <Handshake className="h-3.5 w-3.5" />
                  Top Counterparties
                </CardTitle>
              </CardHeader>
              <CardContent className="px-3 pb-3">
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart 
                      data={analytics.counterpartyAnalysis.slice(0, 5).map((c: any) => ({
                        name: c.name.length > 15 ? c.name.substring(0, 15) + '...' : c.name,
                        revenue: c.revenue,
                        expenses: c.expenses,
                        total: c.totalAmount
                      }))} 
                      layout="vertical"
                      margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" horizontal={true} vertical={false} />
                      <XAxis 
                        type="number" 
                        tick={{ fontSize: 9, fill: '#6b7280' }} 
                        axisLine={false}
                        tickLine={false}
                        tickFormatter={(value) => `RWF ${(value / 1000).toFixed(0)}K`}
                      />
                      <YAxis 
                        type="category" 
                        dataKey="name" 
                        tick={{ fontSize: 9, fill: '#374151' }} 
                        axisLine={false}
                        tickLine={false}
                        width={80}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend wrapperStyle={{ fontSize: '10px' }} />
                      <Bar dataKey="revenue" name="Revenue" fill={COLORS.emerald} radius={[0, 2, 2, 0]} maxBarSize={12} stackId="a" />
                      <Bar dataKey="expenses" name="Expenses" fill={COLORS.red} radius={[0, 2, 2, 0]} maxBarSize={12} stackId="a" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
