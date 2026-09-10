import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, BarChart3, Repeat } from "lucide-react";

interface TransactionStatsProps {
  totalIncome: number;
  totalExpenses: number;
  recurringIncome: number;
  recurringExpenses: number;
}

interface StatCardProps {
  label: string;
  value: number;
  tone: "green" | "red" | "blue";
  icon: React.ReactNode;
  border?: boolean;
}

const toneClasses: Record<
  StatCardProps["tone"],
  { text: string; bg: string; border: string }
> = {
  green: {
    text: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-100 dark:bg-emerald-950/30",
    border: "border-emerald-200 dark:border-emerald-900",
  },
  red: {
    text: "text-red-600 dark:text-red-400",
    bg: "bg-red-100 dark:bg-red-950/30",
    border: "border-red-200 dark:border-red-900",
  },
  blue: {
    text: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-100 dark:bg-blue-950/30",
    border: "border-blue-200 dark:border-blue-900",
  },
};

function StatCard({ label, value, tone, icon, border = false }: StatCardProps) {
  const t = toneClasses[tone];
  return (
    <Card className={`shadow-sm border-border/60 ${border ? t.border : ""}`}>
      <CardContent className="pt-3.5 pb-3 px-3.5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[9.5px] font-semibold uppercase tracking-wide text-muted-foreground/80 mb-0.5">
              {label}
            </p>
            <p className={`text-[15px] font-bold  tabular-nums ${t.text}`}>
              RWF {value.toLocaleString()}
            </p>
          </div>
          <div
            className={`h-7 w-7 shrink-0 rounded-full ${t.bg} flex items-center justify-center`}
          >
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function TransactionStats({
  totalIncome,
  totalExpenses,
  recurringIncome,
  recurringExpenses,
}: TransactionStatsProps) {
  const netPosition = totalIncome - totalExpenses;
  const netRecurring = recurringIncome - recurringExpenses;

  return (
    <div className="space-y-4">
      {/* Header Stats - All Transactions */}
      <div>
        <h3 className="text-[10px] font-semibold text-muted-foreground/80 mb-2 uppercase tracking-wide">
          All Transactions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <StatCard
            label="Total Income"
            value={totalIncome}
            tone="green"
            icon={<TrendingUp className="h-3.5 w-3.5 text-emerald-600" />}
          />
          <StatCard
            label="Total Expenses"
            value={totalExpenses}
            tone="red"
            icon={<TrendingDown className="h-3.5 w-3.5 text-red-600" />}
          />
          <StatCard
            label="Net Position"
            value={netPosition}
            tone={netPosition >= 0 ? "green" : "red"}
            icon={<BarChart3 className="h-3.5 w-3.5 text-blue-600" />}
          />
        </div>
      </div>

      {/* Recurring Transaction Stats */}
      <div>
        <h3 className="text-[10px] font-semibold text-muted-foreground/80 mb-2 uppercase tracking-wide flex items-center gap-1.5">
          <Repeat className="h-3 w-3" />
          Recurring Transactions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <StatCard
            label="Recurring Income"
            value={recurringIncome}
            tone="green"
            border
            icon={<Repeat className="h-3.5 w-3.5 text-emerald-600" />}
          />
          <StatCard
            label="Recurring Out"
            value={recurringExpenses}
            tone="red"
            border
            icon={<Repeat className="h-3.5 w-3.5 text-red-600" />}
          />
          <StatCard
            label="Net Recurring"
            value={netRecurring}
            tone={netRecurring >= 0 ? "green" : "red"}
            border
            icon={<BarChart3 className="h-3.5 w-3.5 text-blue-600" />}
          />
        </div>
      </div>
    </div>
  );
}
