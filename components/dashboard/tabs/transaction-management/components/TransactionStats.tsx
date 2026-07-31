import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  Repeat,
} from "lucide-react";

interface TransactionStatsProps {
  totalIncome: number;
  totalExpenses: number;
  recurringIncome: number;
  recurringExpenses: number;
}

export function TransactionStats({
  totalIncome,
  totalExpenses,
  recurringIncome,
  recurringExpenses,
}: TransactionStatsProps) {
  const netRecurring = recurringIncome - recurringExpenses;

  return (
    <div className="space-y-4">
      {/* Header Stats - All Transactions */}
      <div>
        <h3 className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
          All Transactions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Card className="shadow-sm">
            <CardContent className="pt-4 pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-medium text-muted-foreground mb-0.5">
                    Total Income
                  </p>
                  <p className="text-base font-bold text-green-600 font-serif">
                    RWF {totalIncome.toLocaleString()}
                  </p>
                </div>
                <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-950/30 flex items-center justify-center">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardContent className="pt-4 pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-medium text-muted-foreground mb-0.5">
                    Total Expenses
                  </p>
                  <p className="text-base font-bold text-red-600 font-serif">
                    RWF {totalExpenses.toLocaleString()}
                  </p>
                </div>
                <div className="h-8 w-8 rounded-full bg-red-100 dark:bg-red-950/30 flex items-center justify-center">
                  <TrendingDown className="h-4 w-4 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardContent className="pt-4 pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-medium text-muted-foreground mb-0.5">
                    Net Position
                  </p>
                  <p
                    className={`text-base font-bold font-serif ${totalIncome - totalExpenses >= 0 ? "text-green-600" : "text-red-600"}`}
                  >
                    RWF {(totalIncome - totalExpenses).toLocaleString()}
                  </p>
                </div>
                <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-950/30 flex items-center justify-center">
                  <BarChart3 className="h-4 w-4 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recurring Transaction Stats */}
      <div>
        <h3 className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide flex items-center gap-1.5">
          <Repeat className="h-3 w-3" />
          Recurring Transactions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Card className="shadow-sm border-green-200 dark:border-green-900">
            <CardContent className="pt-4 pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-medium text-muted-foreground mb-0.5">
                    Recurring Income
                  </p>
                  <p className="text-base font-bold text-green-600 font-serif">
                    RWF {recurringIncome.toLocaleString()}
                  </p>
                </div>
                <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-950/30 flex items-center justify-center">
                  <Repeat className="h-4 w-4 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-red-200 dark:border-red-900">
            <CardContent className="pt-4 pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-medium text-muted-foreground mb-0.5">
                    Recurring Out
                  </p>
                  <p className="text-base font-bold text-red-600 font-serif">
                    RWF {recurringExpenses.toLocaleString()}
                  </p>
                </div>
                <div className="h-8 w-8 rounded-full bg-red-100 dark:bg-red-950/30 flex items-center justify-center">
                  <Repeat className="h-4 w-4 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-blue-200 dark:border-blue-900">
            <CardContent className="pt-4 pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-medium text-muted-foreground mb-0.5">
                    Net Recurring
                  </p>
                  <p
                    className={`text-base font-bold font-serif ${netRecurring >= 0 ? "text-green-600" : "text-red-600"}`}
                  >
                    RWF {netRecurring.toLocaleString()}
                  </p>
                </div>
                <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-950/30 flex items-center justify-center">
                  <BarChart3 className="h-4 w-4 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}