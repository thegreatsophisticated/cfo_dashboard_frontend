import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  FileText,
  Loader2,
  Calendar,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format, subDays } from "date-fns";
import { useGlobalCashBook } from "@/hooks/use-global-reports";

function formatCurrency(amount: number): string {
  return `RWF ${amount.toLocaleString()}`;
}

function StatementRow({
  label,
  amount,
  variant = "normal",
  isNegative = false,
}: {
  label: string;
  amount?: number | string;
  variant?:
    | "normal"
    | "indent"
    | "indent-2"
    | "total"
    | "grand-total"
    | "highlight";
  isNegative?: boolean;
}) {
  const baseStyles =
    "flex justify-between py-1.5 px-3 border-b border-border text-xs";
  const variantStyles = {
    normal: "",
    indent: "pl-8",
    "indent-2": "pl-12 text-muted-foreground text-[10px]",
    total: "font-semibold bg-secondary/50 border-t border-b border-border mt-1",
    "grand-total":
      "bg-primary text-primary-foreground font-semibold text-sm mt-2",
    highlight: "bg-secondary/30 mt-2",
  };

  const formatAmount = (amt: number | string | undefined) => {
    if (amt === undefined || amt === null) return "";
    const numAmount = typeof amt === "string" ? parseFloat(amt) : amt;
    return formatCurrency(numAmount);
  };

  return (
    <div className={`${baseStyles} ${variantStyles[variant]}`}>
      <span>{label}</span>
      {amount !== undefined && (
        <span
          className={`font-semibold tabular-nums text-xs ${isNegative ? "text-red-600 dark:text-red-400" : ""}`}
        >
          {formatAmount(amount)}
        </span>
      )}
    </div>
  );
}

function CashFlowAnalysis() {
  const [startDate, setStartDate] = useState<Date>(subDays(new Date(), 30));
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [isStartCalendarOpen, setIsStartCalendarOpen] = useState(false);
  const [isEndCalendarOpen, setIsEndCalendarOpen] = useState(false);

  const startDateString = format(startDate, "yyyy-MM-dd");
  const endDateString = format(endDate, "yyyy-MM-dd");

  const { data, isLoading, error } = useGlobalCashBook(
    startDateString,
    endDateString,
  );

  const handleExportPDF = () => {
    // TODO: Implement PDF export
    console.log("Export PDF clicked");
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="text-xs text-destructive">
              {error instanceof Error
                ? error.message
                : "Failed to load cash book"}
            </p>
            <p className="text-[10px] text-muted-foreground mt-2">
              Please try again or contact support
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data || !data.summary || !data.data || data.data.length === 0) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              No cash book data available
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const { summary, data: companies, meta } = data;

  return (
    <div className="space-y-3">
      {/* Header Card with Summary */}
      <Card>
        <CardHeader className="pb-2 pt-3 px-3">
          <div className="flex flex-row items-start justify-between">
            <div>
              <CardTitle className="text-sm font-semibold">
                Global Cash Book
              </CardTitle>
              <p className="text-[10px] text-muted-foreground mt-0.5">
                {format(new Date(summary.period.startDate), "dd MMM yyyy")} -{" "}
                {format(new Date(summary.period.endDate), "dd MMM yyyy")} •{" "}
                {meta.total} {meta.total === 1 ? "Company" : "Companies"}
              </p>
            </div>
            <div className="flex gap-1.5">
              <div className="flex gap-1 items-center">
                <Popover
                  open={isStartCalendarOpen}
                  onOpenChange={setIsStartCalendarOpen}
                >
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="h-7 text-[11px] px-2">
                      <Calendar className="h-3 w-3 mr-1" />
                      {format(startDate, "dd MMM yy")}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="end">
                    <CalendarComponent
                      mode="single"
                      selected={startDate}
                      onSelect={(date) => {
                        if (date) {
                          setStartDate(date);
                          setIsStartCalendarOpen(false);
                        }
                      }}
                      disabled={(date) => date > endDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>

                <Popover
                  open={isEndCalendarOpen}
                  onOpenChange={setIsEndCalendarOpen}
                >
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="h-7 text-[11px] px-2">
                      <Calendar className="h-3 w-3 mr-1" />
                      {format(endDate, "dd MMM yy")}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="end">
                    <CalendarComponent
                      mode="single"
                      selected={endDate}
                      onSelect={(date) => {
                        if (date) {
                          setEndDate(date);
                          setIsEndCalendarOpen(false);
                        }
                      }}
                      disabled={(date) => date > new Date() || date < startDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <Button
                onClick={handleExportPDF}
                size="sm"
                className="h-7 text-[11px] px-2"
              >
                <FileText className="h-3 w-3 mr-1" />
                Export PDF
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0 px-3 pb-3">
          <div className="grid grid-cols-3 gap-2 p-2.5 bg-muted/30 rounded-md">
            <div className="space-y-0.5">
              <div className="flex items-center gap-1">
                <TrendingUp className="h-3 w-3 text-green-600 dark:text-green-400" />
                <p className="text-[9px] uppercase tracking-wide text-muted-foreground font-medium">
                  Cash In
                </p>
              </div>
              <p className="text-sm font-bold tabular-nums text-green-600 dark:text-green-400">
                {formatCurrency(summary.totalCashIn)}
              </p>
            </div>

            <div className="space-y-0.5">
              <div className="flex items-center gap-1">
                <TrendingDown className="h-3 w-3 text-red-600 dark:text-red-400" />
                <p className="text-[9px] uppercase tracking-wide text-muted-foreground font-medium">
                  Cash Out
                </p>
              </div>
              <p className="text-sm font-bold tabular-nums text-red-600 dark:text-red-400">
                {formatCurrency(summary.totalCashOut)}
              </p>
            </div>

            <div className="space-y-0.5">
              <p className="text-[9px] uppercase tracking-wide text-muted-foreground font-medium">
                Net Flow
              </p>
              <p
                className={`text-sm font-bold tabular-nums ${
                  summary.netCashFlow >= 0
                    ? "text-green-600 dark:text-green-400"
                    : "text-red-600 dark:text-red-400"
                }`}
              >
                {summary.netCashFlow >= 0 ? "+" : ""}
                {formatCurrency(summary.netCashFlow)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Company Breakdown */}
      <Card>
        <CardHeader className="pb-2 pt-3 px-3">
          <CardTitle className="text-xs font-semibold">
            Company Performance
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 px-3 pb-3">
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="h-7 text-[10px] font-semibold">
                    Company
                  </TableHead>
                  <TableHead className="h-7 text-[10px] font-semibold text-right">
                    Transactions
                  </TableHead>
                  <TableHead className="h-7 text-[10px] font-semibold text-right">
                    Cash In
                  </TableHead>
                  <TableHead className="h-7 text-[10px] font-semibold text-right">
                    Cash Out
                  </TableHead>
                  <TableHead className="h-7 text-[10px] font-semibold text-right">
                    Net Flow
                  </TableHead>
                  <TableHead className="h-7 text-[10px] font-semibold text-right">
                    Avg/Trans
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[...companies]
                  .sort(
                    (a, b) => Math.abs(b.netCashFlow) - Math.abs(a.netCashFlow),
                  )
                  .map((company) => {
                    const avgTransaction =
                      company.transactionCount > 0
                        ? (company.totalCashIn + company.totalCashOut) /
                          company.transactionCount
                        : 0;
                    return (
                      <TableRow key={company.companyId} className="text-[11px]">
                        <TableCell className="font-medium py-1.5">
                          {company.companyName}
                        </TableCell>
                        <TableCell className="text-right tabular-nums py-1.5 text-muted-foreground">
                          {company.transactionCount}
                        </TableCell>
                        <TableCell className="text-right tabular-nums py-1.5 text-green-600 dark:text-green-400">
                          {formatCurrency(company.totalCashIn)}
                        </TableCell>
                        <TableCell className="text-right tabular-nums py-1.5 text-red-600 dark:text-red-400">
                          {formatCurrency(company.totalCashOut)}
                        </TableCell>
                        <TableCell
                          className={`text-right tabular-nums font-semibold py-1.5 ${
                            company.netCashFlow >= 0
                              ? "text-green-600 dark:text-green-400"
                              : "text-red-600 dark:text-red-400"
                          }`}
                        >
                          {company.netCashFlow >= 0 ? "+" : ""}
                          {formatCurrency(company.netCashFlow)}
                        </TableCell>
                        <TableCell className="text-right tabular-nums py-1.5 text-muted-foreground">
                          {formatCurrency(avgTransaction)}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                <TableRow className="bg-secondary/50 font-semibold border-t-2 text-[11px]">
                  <TableCell className="py-1.5">Total</TableCell>
                  <TableCell className="text-right tabular-nums py-1.5">
                    {companies.reduce((sum, c) => sum + c.transactionCount, 0)}
                  </TableCell>
                  <TableCell className="text-right tabular-nums py-1.5 text-green-600 dark:text-green-400">
                    {formatCurrency(summary.totalCashIn)}
                  </TableCell>
                  <TableCell className="text-right tabular-nums py-1.5 text-red-600 dark:text-red-400">
                    {formatCurrency(summary.totalCashOut)}
                  </TableCell>
                  <TableCell
                    className={`text-right tabular-nums py-1.5 ${
                      summary.netCashFlow >= 0
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    {summary.netCashFlow >= 0 ? "+" : ""}
                    {formatCurrency(summary.netCashFlow)}
                  </TableCell>
                  <TableCell className="text-right tabular-nums py-1.5 text-muted-foreground">
                    {formatCurrency(
                      companies.reduce(
                        (sum, c) => sum + c.transactionCount,
                        0,
                      ) > 0
                        ? (summary.totalCashIn + summary.totalCashOut) /
                            companies.reduce(
                              (sum, c) => sum + c.transactionCount,
                              0,
                            )
                        : 0,
                    )}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Analysis Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <Card>
          <CardHeader className="pb-2 pt-3 px-3">
            <CardTitle className="text-xs font-semibold">
              Cash Flow Contribution
            </CardTitle>
            <p className="text-[10px] text-muted-foreground">
              % of total cash movement
            </p>
          </CardHeader>
          <CardContent className="pt-0 px-3 pb-3">
            <div className="space-y-1.5">
              {[...companies]
                .sort(
                  (a, b) => Math.abs(b.netCashFlow) - Math.abs(a.netCashFlow),
                )
                .map((company) => {
                  const totalAbsoluteFlow = companies.reduce(
                    (sum, c) => sum + Math.abs(c.netCashFlow),
                    0,
                  );
                  const percentage =
                    totalAbsoluteFlow > 0
                      ? (
                          (Math.abs(company.netCashFlow) / totalAbsoluteFlow) *
                          100
                        ).toFixed(1)
                      : "0.0";
                  return (
                    <div
                      key={company.companyId}
                      className="flex items-center justify-between py-1.5 px-2.5 bg-muted/20 rounded text-[11px]"
                    >
                      <span className="font-medium">{company.companyName}</span>
                      <div className="flex items-center gap-2.5">
                        <span
                          className={`tabular-nums font-semibold ${
                            company.netCashFlow >= 0
                              ? "text-green-600 dark:text-green-400"
                              : "text-red-600 dark:text-red-400"
                          }`}
                        >
                          {company.netCashFlow >= 0 ? "+" : ""}
                          {formatCurrency(company.netCashFlow)}
                        </span>
                        <span className="font-semibold tabular-nums w-10 text-right">
                          {percentage}%
                        </span>
                      </div>
                    </div>
                  );
                })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2 pt-3 px-3">
            <CardTitle className="text-xs font-semibold">
              Transaction Activity
            </CardTitle>
            <p className="text-[10px] text-muted-foreground">Sorted by volume</p>
          </CardHeader>
          <CardContent className="pt-0 px-3 pb-3">
            <div className="space-y-1.5">
              {[...companies]
                .sort((a, b) => b.transactionCount - a.transactionCount)
                .map((company) => {
                  const avgTransaction =
                    company.transactionCount > 0
                      ? (company.totalCashIn + company.totalCashOut) /
                        company.transactionCount
                      : 0;
                  return (
                    <div
                      key={company.companyId}
                      className="flex items-center justify-between py-1.5 px-2.5 bg-muted/20 rounded text-[11px]"
                    >
                      <span className="font-medium">{company.companyName}</span>
                      <div className="flex items-center gap-2.5">
                        <span className="tabular-nums text-muted-foreground">
                          {company.transactionCount} trans
                        </span>
                        <span className="tabular-nums font-semibold w-24 text-right">
                          {formatCurrency(avgTransaction)}
                        </span>
                      </div>
                    </div>
                  );
                })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Consolidated Summary */}
      <Card>
        <CardHeader className="pb-2 pt-3 px-3">
          <CardTitle className="text-xs font-semibold">
            Consolidated Cash Flow Statement
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 px-3 pb-3">
          <div className="border rounded-md overflow-hidden">
            <StatementRow
              label="Total Cash Inflows"
              amount={summary.totalCashIn}
              variant="indent"
            />
            <StatementRow
              label="Total Cash Outflows"
              amount={summary.totalCashOut}
              variant="indent"
              isNegative
            />
            <StatementRow
              label="Net Cash Flow"
              amount={summary.netCashFlow}
              variant="grand-total"
              isNegative={summary.netCashFlow < 0}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default CashFlowAnalysis;
