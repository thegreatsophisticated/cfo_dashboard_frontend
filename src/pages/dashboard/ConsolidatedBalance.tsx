import { useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Loader2, Calendar } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { useGlobalBalanceSheet } from "@/hooks/use-global-reports";

function StatementRow({
  label,
  amount,
  variant = "normal",
  transactionCount,
}: {
  label: string;
  amount?: string | number;
  variant?: "normal" | "indent" | "subtitle" | "total" | "grand-total";
  transactionCount?: number;
}) {
  const baseStyles = "flex justify-between py-1.5 px-3 border-b border-border";
  const variantStyles = {
    normal: "text-[11px]",
    indent: "pl-8 text-[10px] text-muted-foreground",
    subtitle: "font-semibold text-[11px] text-primary bg-secondary mt-1",
    total:
      "font-semibold text-[11px] bg-secondary border-t-2 border-b-2 border-border mt-1",
    "grand-total":
      "bg-primary text-primary-foreground font-semibold text-xs mt-2 py-2",
  };

  const formatAmount = (amt: string | number | undefined) => {
    if (amt === undefined || amt === null) return "";
    const numAmount = typeof amt === "string" ? parseFloat(amt) : amt;
    return `RWF ${numAmount.toLocaleString()}`;
  };

  return (
    <div className={`${baseStyles} ${variantStyles[variant]}`}>
      <div className="flex items-center gap-1.5">
        <span>{label}</span>
        {transactionCount !== undefined && variant === "indent" && (
          <span className="text-[9px] text-muted-foreground">
            ({transactionCount} {transactionCount === 1 ? "tx" : "txs"})
          </span>
        )}
      </div>
      {amount !== undefined && (
        <span className="font-semibold tabular-nums">
          {formatAmount(amount)}
        </span>
      )}
    </div>
  );
}

export function ConsolidatedBalance() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const dateString = format(selectedDate, "yyyy-MM-dd");
  const { data, isLoading, error } = useGlobalBalanceSheet(dateString);

  const handleExportPDF = async () => {
    if (!data?.summary) return;

    setIsExporting(true);
    try {
      // Load the PDF library only when needed
      const { exportBalanceSheetPDF } = await import(
        "@/lib/export-balance-pdf"
      );
      exportBalanceSheetPDF(selectedDate, data.summary, data.companies ?? []);
      toast.success("PDF exported successfully");
    } catch (err) {
      console.error("PDF export failed:", err);
      toast.error("Failed to export PDF. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center min-h-[300px]">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center min-h-[300px]">
          <div className="text-center">
            <p className="text-[11px] text-destructive">
              {error instanceof Error
                ? error.message
                : "Failed to load balance sheet"}
            </p>
            <p className="text-[9px] text-muted-foreground mt-1">
              Please try again or contact support
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data || !data.summary) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center min-h-[300px]">
          <div className="text-center">
            <p className="text-[11px] text-muted-foreground">
              No balance sheet data available
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const { summary, companies } = data;
  const hasDetailedData = companies && companies.length > 0;

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between pb-2 pt-3 px-3">
        <div>
          <CardTitle className="text-xs font-semibold">
            Consolidated Balance Sheet
          </CardTitle>
          <div className="flex items-center gap-1.5 mt-0.5">
            <p className="text-[10px] text-muted-foreground ">
              As at {format(selectedDate, "MMM dd, yyyy")}
            </p>
            <span className="text-[9px] text-muted-foreground">•</span>
            <p className="text-[9px] text-muted-foreground">
              {summary.totalCompanies}{" "}
              {summary.totalCompanies === 1 ? "Company" : "Companies"}
            </p>
          </div>
        </div>
        <div className="flex gap-1.5">
          <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-7 text-[11px] px-2"
              >
                <Calendar className="h-3 w-3 mr-1" />
                Change Date
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <CalendarComponent
                mode="single"
                selected={selectedDate}
                onSelect={(date) => {
                  if (date) {
                    setSelectedDate(date);
                    setIsCalendarOpen(false);
                  }
                }}
                disabled={(date) => date > new Date()}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <Button
            onClick={handleExportPDF}
            disabled={isExporting}
            variant="outline"
            size="sm"
            className="h-7 text-[11px] px-2"
          >
            {isExporting ? (
              <Loader2 className="h-3 w-3 mr-1 animate-spin" />
            ) : (
              <FileText className="h-3 w-3 mr-1" />
            )}
            {isExporting ? "Exporting..." : "Export PDF"}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 px-3 pb-3">
        {/* Balance Sheet Equation */}
        <div className="grid grid-cols-2 gap-2">
          <div className="p-2.5 bg-green-50 dark:bg-green-950/30 rounded-md border border-green-200 dark:border-green-800">
            <p className="text-[9px] text-green-700 dark:text-green-400 font-medium mb-0.5">
              Total Assets
            </p>
            <p className="text-sm font-bold tabular-nums text-green-600 dark:text-green-400">
              RWF {summary.totalAssets.toLocaleString()}
            </p>
          </div>

          <div className="space-y-1.5">
            <div className="p-2 bg-red-50 dark:bg-red-950/30 rounded-md border border-red-200 dark:border-red-800">
              <p className="text-[9px] text-red-700 dark:text-red-400 font-medium mb-0.5">
                Total Liabilities
              </p>
              <p className="text-xs font-bold tabular-nums text-red-600 dark:text-red-400">
                RWF {summary.totalLiabilities.toLocaleString()}
              </p>
            </div>
            <div className="p-2 bg-blue-50 dark:bg-blue-950/30 rounded-md border border-blue-200 dark:border-blue-800">
              <p className="text-[9px] text-blue-700 dark:text-blue-400 font-medium mb-0.5">
                Total Equity
              </p>
              <p className="text-xs font-bold tabular-nums text-blue-600 dark:text-blue-400">
                RWF {summary.totalEquity.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Balance Check Indicator */}
        <div
          className={`p-2 rounded-md border ${
            summary.balanceCheck === "BALANCED"
              ? "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-700"
              : "bg-amber-50 dark:bg-amber-950/20 border-amber-300 dark:border-amber-700"
          }`}
        >
          <div className="flex justify-between items-center">
            <span className="text-[9px] font-medium text-muted-foreground">
              Balance Check:
            </span>
            <span
              className={`font-bold text-[11px] ${
                summary.balanceCheck === "BALANCED"
                  ? "text-emerald-700 dark:text-emerald-400"
                  : "text-amber-700 dark:text-amber-400"
              }`}
            >
              {summary.balanceCheck}
            </span>
          </div>
          <p className="text-[9px] text-muted-foreground mt-0.5">
            Assets = Liabilities ({summary.totalLiabilities.toLocaleString()}) +
            Equity ({summary.totalEquity.toLocaleString()})
          </p>
        </div>

        {/* Detailed Breakdown */}
        <div className="space-y-2.5 pt-1.5">
          <div>
            <h3 className="text-[11px] font-semibold text-green-700 dark:text-green-400 border-b border-green-300 dark:border-green-700 pb-1 mb-1.5">
              Assets Breakdown
            </h3>
            {hasDetailedData ? (
              companies.map((company, idx) => (
                <StatementRow
                  key={`asset-${idx}`}
                  label={company.companyName}
                  amount={company.totalAssets}
                  variant="indent"
                />
              ))
            ) : (
              <div className="px-3 py-1 text-[10px] text-muted-foreground ">
                No detailed breakdown available
              </div>
            )}
            <StatementRow
              label="Total Assets"
              amount={summary.totalAssets}
              variant="total"
            />
          </div>

          <div>
            <h3 className="text-[11px] font-semibold text-red-700 dark:text-red-400 border-b border-red-300 dark:border-red-700 pb-1 mb-1.5">
              Liabilities Breakdown
            </h3>
            {hasDetailedData ? (
              companies.map((company, idx) => (
                <StatementRow
                  key={`liab-${idx}`}
                  label={company.companyName}
                  amount={company.totalLiabilities}
                  variant="indent"
                />
              ))
            ) : (
              <div className="px-3 py-1 text-[10px] text-muted-foreground ">
                No detailed breakdown available
              </div>
            )}
            <StatementRow
              label="Total Liabilities"
              amount={summary.totalLiabilities}
              variant="total"
            />
          </div>

          <div>
            <h3 className="text-[11px] font-semibold text-blue-700 dark:text-blue-400 border-b border-blue-300 dark:border-blue-700 pb-1 mb-1.5">
              Equity Breakdown
            </h3>
            {hasDetailedData ? (
              companies.map((company, idx) => (
                <div key={`equity-${idx}`}>
                  <StatementRow
                    label={company.companyName}
                    amount={company.totalEquity}
                    variant="indent"
                  />
                  {company.retainedEarnings !== undefined &&
                    company.retainedEarnings !== 0 && (
                      <div className="pl-12 py-1 text-[10px] text-muted-foreground flex justify-between px-3">
                        <span className="">└─ Retained Earnings</span>
                        <span className="tabular-nums">
                          RWF {company.retainedEarnings.toLocaleString()}
                        </span>
                      </div>
                    )}
                </div>
              ))
            ) : (
              <div className="px-3 py-1 text-[10px] text-muted-foreground ">
                No detailed breakdown available
              </div>
            )}
            <StatementRow
              label="Total Equity"
              amount={summary.totalEquity}
              variant="total"
            />
          </div>

          <div className="pt-0.5">
            <StatementRow
              label="Total Liabilities & Equity"
              amount={summary.totalLiabilities + summary.totalEquity}
              variant="grand-total"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default ConsolidatedBalance;
