import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  TrendingDown,
  LayoutGrid,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  CartesianGrid,
  Legend,
} from "recharts";
import { useFinancialSummary } from "@/hooks/use-financial-summary";

import type { TooltipProps } from "recharts";
import type { ValueType, NameType } from "recharts/types/component/DefaultTooltipContent";

const CustomTooltip = ({ active, payload, label }: TooltipProps<ValueType, NameType>) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background border border-border/60 rounded-lg shadow-lg p-2 text-[9px]">
        <p className="font-medium mb-1">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-[9px]" style={{ color: entry.color }}>
            {entry.name}: RWF {Number(entry.value)?.toLocaleString()}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const COLORS = {
  emerald: "#10b981",
  red: "#ef4444",
  blue: "#3b82f6",
  violet: "#8b5cf6",
};

// Shared axis styling so every chart in the dashboard matches
const axisTick = { fontSize: 8, fill: "#6b7280" };
const axisTickCategory = { fontSize: 8, fill: "#374151" };
const gridStroke = "#e5e7eb";

function ChartCard({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-1.5 pt-2.5 px-2.5">
        <CardTitle className="text-[10px] font-semibold flex items-center gap-1.5 text-muted-foreground">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-2.5 pb-2.5">{children}</CardContent>
    </Card>
  );
}

export function DashboardOverview() {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);

  const { data: financialSummary, isLoading, isError } = useFinancialSummary(selectedYear);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
          <Activity className="h-3.5 w-3.5 animate-spin" />
          Loading analytics...
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-[11px] text-destructive">Couldn't load the financial summary. Try again shortly.</p>
      </div>
    );
  }

  const summary = financialSummary?.summary;
  const analytics = summary?.analytics;

  // Bug fix: this used to hardcode `new Date(2024, ...)` regardless of the
  // selected year, so month labels never reflected the year actually being viewed.
  const monthlyData =
    analytics?.monthlyTrends?.map((month) => ({
      month: new Date(selectedYear, month.month - 1).toLocaleString("default", { month: "short" }),
      revenue: month.revenue,
      expenses: month.expenses,
      netIncome: month.netIncome,
    })) || [];

  const expenseData =
    summary?.expenses?.breakdown?.slice(0, 5).map((expense) => ({
      category: expense.category,
      amount: expense.amount,
      count: expense.count,
    })) || [];

  const revenueData =
    summary?.revenue?.breakdown?.slice(0, 5).map((revenue) => ({
      category: revenue.category,
      amount: revenue.amount,
      count: revenue.count,
    })) || [];

  const companyData = analytics?.companyPerformance?.slice(0, 5).map((c) => ({
    name: c.companyName.length > 15 ? c.companyName.substring(0, 15) + "..." : c.companyName,
    netIncome: c.netIncome,
  }));

  const counterpartyData = analytics?.counterpartyAnalysis?.slice(0, 5).map((c) => ({
    name: c.name.length > 15 ? c.name.substring(0, 15) + "..." : c.name,
    revenue: c.revenue,
    expenses: c.expenses,
  }));

  return (
    <div className="space-y-3 p-1">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-lg px-2.5 py-1.5">
          <CheckCircle2 className="h-3 w-3 text-emerald-600" />
          <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-medium">
            {selectedYear} • {summary?.totalCompanies} companies • {summary?.totalTransactions.toLocaleString()} txns
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <Calendar className="h-3 w-3 text-muted-foreground/70" />
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="border border-border/60 rounded-md px-2 py-1 text-[10px] bg-background focus:outline-none focus:ring-1 focus:ring-primary"
          >
            {[currentYear - 2, currentYear - 1, currentYear, currentYear + 1].map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* KPI Cards — always visible above the tabs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
        <Card className="border-0 shadow-sm bg-gradient-to-br from-emerald-50/50 to-white dark:from-emerald-950/20 dark:to-background">
          <CardContent className="p-2.5">
            <div className="flex items-center gap-1.5">
              <div className="p-1.5 rounded-md bg-emerald-100 dark:bg-emerald-900/50">
                <DollarSign className="h-3 w-3 text-emerald-600" />
              </div>
              <span className="text-[9px] font-medium text-muted-foreground">Revenue</span>
            </div>
            <div className="mt-1.5">
              <p className="text-[13px] font-bold text-emerald-700 dark:text-emerald-400">
                RWF {summary?.revenue?.total?.toLocaleString()}
              </p>
              <p className="text-[9px] text-muted-foreground mt-0.5">
                Avg: RWF {summary?.revenue?.averagePerCompany?.toLocaleString()}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-br from-red-50/50 to-white dark:from-red-950/20 dark:to-background">
          <CardContent className="p-2.5">
            <div className="flex items-center gap-1.5">
              <div className="p-1.5 rounded-md bg-red-100 dark:bg-red-900/50">
                <CreditCard className="h-3 w-3 text-red-600" />
              </div>
              <span className="text-[9px] font-medium text-muted-foreground">Expenses</span>
            </div>
            <div className="mt-1.5">
              <p className="text-[13px] font-bold text-red-700 dark:text-red-400">
                RWF {summary?.expenses?.total?.toLocaleString()}
              </p>
              <p className="text-[9px] text-muted-foreground mt-0.5">
                Avg: RWF {summary?.expenses?.averagePerCompany?.toLocaleString()}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-br from-blue-50/50 to-white dark:from-blue-950/20 dark:to-background">
          <CardContent className="p-2.5">
            <div className="flex items-center gap-1.5">
              <div className="p-1.5 rounded-md bg-blue-100 dark:bg-blue-900/50">
                {(summary?.netProfit ?? 0) >= 0 ? (
                  <TrendingUp className="h-3 w-3 text-blue-600" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-red-600" />
                )}
              </div>
              <span className="text-[9px] font-medium text-muted-foreground">Net Profit</span>
            </div>
            <div className="mt-1.5">
              <p
                className={`text-[13px] font-bold ${
                  (summary?.netProfit ?? 0) >= 0
                    ? "text-blue-700 dark:text-blue-400"
                    : "text-red-700 dark:text-red-400"
                }`}
              >
                RWF {summary?.netProfit?.toLocaleString()}
              </p>
              <p className="text-[9px] text-muted-foreground mt-0.5">
                Margin: {analytics?.financialRatios?.profitMargin}%
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-br from-violet-50/50 to-white dark:from-violet-950/20 dark:to-background">
          <CardContent className="p-2.5">
            <div className="flex items-center gap-1.5">
              <div className="p-1.5 rounded-md bg-violet-100 dark:bg-violet-900/50">
                <Activity className="h-3 w-3 text-violet-600" />
              </div>
              <span className="text-[9px] font-medium text-muted-foreground">Cash Flow</span>
            </div>
            <div className="mt-1.5">
              <p
                className={`text-[13px] font-bold ${
                  (analytics?.cashFlowAnalysis?.netCashFlow ?? 0) >= 0
                    ? "text-violet-700 dark:text-violet-400"
                    : "text-red-700 dark:text-red-400"
                }`}
              >
                RWF {analytics?.cashFlowAnalysis?.netCashFlow?.toLocaleString()}
              </p>
              <p className="text-[9px] text-muted-foreground mt-0.5">
                In: {analytics?.cashFlowAnalysis?.cashInTransactions} | Out:{" "}
                {analytics?.cashFlowAnalysis?.cashOutTransactions}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detail views, grouped into tabs instead of one long scroll */}
      <Tabs defaultValue="overview">
        <TabsList className="h-7 bg-muted">
          <TabsTrigger value="overview" className="text-[10px] gap-1.5 data-[state=active]:bg-background data-[state=active]:text-foreground">
            <LayoutGrid className="h-3 w-3" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="companies" className="text-[10px] gap-1.5 data-[state=active]:bg-background data-[state=active]:text-foreground">
            <Users className="h-3 w-3" />
            Companies
          </TabsTrigger>
          <TabsTrigger value="categories" className="text-[10px] gap-1.5 data-[state=active]:bg-background data-[state=active]:text-foreground">
            <BarChart3 className="h-3 w-3" />
            Revenue &amp; Expenses
          </TabsTrigger>
          <TabsTrigger value="tax" className="text-[10px] gap-1.5 data-[state=active]:bg-background data-[state=active]:text-foreground">
            <Receipt className="h-3 w-3" />
            Tax
          </TabsTrigger>
          <TabsTrigger value="counterparties" className="text-[10px] gap-1.5 data-[state=active]:bg-background data-[state=active]:text-foreground">
            <Handshake className="h-3 w-3" />
            Counterparties
          </TabsTrigger>
        </TabsList>

        {/* ---------------- Overview: ratios + monthly trend ---------------- */}
        <TabsContent value="overview" className="mt-2.5 space-y-3">
          <ChartCard icon={<PieChart className="h-3 w-3" />} title="Financial Ratios & KPIs">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
              <div className="flex items-center justify-between p-1.5 rounded-lg bg-muted/30">
                <div className="flex items-center gap-1.5">
                  <Percent className="h-3 w-3 text-muted-foreground/70" />
                  <span className="text-[9px] text-muted-foreground">Profit Margin</span>
                </div>
                <span className="text-[10px] font-bold">{analytics?.financialRatios?.profitMargin}%</span>
              </div>
              <div className="flex items-center justify-between p-1.5 rounded-lg bg-muted/30">
                <div className="flex items-center gap-1.5">
                  <Percent className="h-3 w-3 text-muted-foreground/70" />
                  <span className="text-[9px] text-muted-foreground">Gross Margin</span>
                </div>
                <span className="text-[10px] font-bold">{analytics?.financialRatios?.grossProfitMargin}%</span>
              </div>
              <div className="flex items-center justify-between p-1.5 rounded-lg bg-muted/30">
                <div className="flex items-center gap-1.5">
                  <Building2 className="h-3 w-3 text-muted-foreground/70" />
                  <span className="text-[9px] text-muted-foreground">Debt/Asset</span>
                </div>
                <span className="text-[10px] font-bold">{analytics?.financialRatios?.debtToAssetRatio}%</span>
              </div>
              <div className="flex items-center justify-between p-1.5 rounded-lg bg-muted/30">
                <div className="flex items-center gap-1.5">
                  <Wallet className="h-3 w-3 text-muted-foreground/70" />
                  <span className="text-[9px] text-muted-foreground">Current Ratio</span>
                </div>
                <span className="text-[10px] font-bold">{analytics?.financialRatios?.currentRatio}</span>
              </div>
            </div>
          </ChartCard>

          {monthlyData.length > 0 && (
            <ChartCard icon={<BarChart3 className="h-3 w-3" />} title="Monthly Performance Trends">
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
                    <XAxis dataKey="month" tick={axisTick} axisLine={false} tickLine={false} />
                    <YAxis
                      tick={axisTick}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(value) => `RWF ${(value / 1000000).toFixed(0)}M`}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize: "9px" }} />
                    <Bar dataKey="revenue" name="Revenue" fill={COLORS.emerald} radius={[2, 2, 0, 0]} maxBarSize={20} />
                    <Bar dataKey="expenses" name="Expenses" fill={COLORS.red} radius={[2, 2, 0, 0]} maxBarSize={20} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>
          )}
        </TabsContent>

        {/* ---------------- Companies ---------------- */}
        <TabsContent value="companies" className="mt-2.5">
          {companyData && companyData.length > 0 ? (
            <ChartCard icon={<Users className="h-3 w-3" />} title="Top Companies by Net Income">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={companyData} layout="vertical" margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} horizontal vertical={false} />
                    <XAxis
                      type="number"
                      tick={axisTick}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(value) => `RWF ${(value / 1000000).toFixed(0)}M`}
                    />
                    <YAxis type="category" dataKey="name" tick={axisTickCategory} axisLine={false} tickLine={false} width={100} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="netIncome" name="Net Income" radius={[0, 2, 2, 0]} maxBarSize={18}>
                      {companyData.map((entry, index) => (
                        <Cell key={index} fill={entry.netIncome >= 0 ? COLORS.emerald : COLORS.red} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>
          ) : (
            <p className="text-[11px] text-muted-foreground/70 text-center py-8">No company performance data for {selectedYear}.</p>
          )}
        </TabsContent>

        {/* ---------------- Revenue & Expenses ---------------- */}
        <TabsContent value="categories" className="mt-2.5">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {expenseData.length > 0 && (
              <ChartCard icon={<BarChart3 className="h-3 w-3" />} title="Top Expense Categories">
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={expenseData} layout="vertical" margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} horizontal vertical={false} />
                      <XAxis
                        type="number"
                        tick={axisTick}
                        axisLine={false}
                        tickLine={false}
                        tickFormatter={(value) => `RWF ${(value / 1000).toFixed(0)}K`}
                      />
                      <YAxis type="category" dataKey="category" tick={axisTickCategory} axisLine={false} tickLine={false} width={90} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="amount" name="Amount" fill={COLORS.red} radius={[0, 2, 2, 0]} maxBarSize={16} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </ChartCard>
            )}

            {revenueData.length > 0 && (
              <ChartCard icon={<TrendingUp className="h-3 w-3" />} title="Revenue Streams">
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={revenueData} layout="vertical" margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} horizontal vertical={false} />
                      <XAxis
                        type="number"
                        tick={axisTick}
                        axisLine={false}
                        tickLine={false}
                        tickFormatter={(value) => `RWF ${(value / 1000).toFixed(0)}K`}
                      />
                      <YAxis type="category" dataKey="category" tick={axisTickCategory} axisLine={false} tickLine={false} width={90} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="amount" name="Amount" fill={COLORS.emerald} radius={[0, 2, 2, 0]} maxBarSize={16} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </ChartCard>
            )}

            {expenseData.length === 0 && revenueData.length === 0 && (
              <p className="text-[11px] text-muted-foreground/70 text-center py-8 lg:col-span-2">
                No revenue or expense breakdown for {selectedYear}.
              </p>
            )}
          </div>
        </TabsContent>

        {/* ---------------- Tax ---------------- */}
        <TabsContent value="tax" className="mt-2.5">
          {analytics?.taxAnalysis ? (
            <ChartCard icon={<Receipt className="h-3 w-3" />} title="Tax Overview">
              <div className="grid grid-cols-2 gap-2.5 mb-2.5">
                <div className="p-2 rounded-lg bg-muted/30">
                  <p className="text-[9px] text-muted-foreground">Total Tax</p>
                  <p className="text-[13px] font-bold">RWF {analytics.taxAnalysis.totalTaxCollected?.toLocaleString()}</p>
                </div>
                <div className="p-2 rounded-lg bg-muted/30">
                  <p className="text-[9px] text-muted-foreground">Avg Rate</p>
                  <p className="text-[13px] font-bold">{analytics.taxAnalysis.averageTaxRate}%</p>
                </div>
              </div>
              {analytics.taxAnalysis.taxByCategory?.length > 0 && (
                <div className="space-y-1">
                  <p className="text-[9px] font-medium text-muted-foreground mb-1 uppercase tracking-wide">By Category</p>
                  {analytics.taxAnalysis.taxByCategory.slice(0, 6).map((tax) => (
                    <div key={tax.category} className="flex items-center justify-between py-1.5 px-2 rounded-md hover:bg-muted/50">
                      <span className="text-[10px]">{tax.category}</span>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-[9px] px-1 h-4">
                          {tax.averageTaxRate}%
                        </Badge>
                        <span className="text-[10px] font-medium font-mono tabular-nums">
                          RWF {tax.totalTax.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ChartCard>
          ) : (
            <p className="text-[11px] text-muted-foreground/70 text-center py-8">No tax data for {selectedYear}.</p>
          )}
        </TabsContent>

        {/* ---------------- Counterparties ---------------- */}
        <TabsContent value="counterparties" className="mt-2.5">
          {counterpartyData && counterpartyData.length > 0 ? (
            <ChartCard icon={<Handshake className="h-3 w-3" />} title="Top Counterparties">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={counterpartyData} layout="vertical" margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} horizontal vertical={false} />
                    <XAxis
                      type="number"
                      tick={axisTick}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(value) => `RWF ${(value / 1000).toFixed(0)}K`}
                    />
                    <YAxis type="category" dataKey="name" tick={axisTickCategory} axisLine={false} tickLine={false} width={100} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize: "9px" }} />
                    <Bar dataKey="revenue" name="Revenue" fill={COLORS.emerald} radius={[0, 2, 2, 0]} maxBarSize={14} stackId="a" />
                    <Bar dataKey="expenses" name="Expenses" fill={COLORS.red} radius={[0, 2, 2, 0]} maxBarSize={14} stackId="a" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>
          ) : (
            <p className="text-[11px] text-muted-foreground/70 text-center py-8">No counterparty data for {selectedYear}.</p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
