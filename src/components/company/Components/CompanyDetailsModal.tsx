import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Building2,
  Receipt,
  BarChart3,
  Scale,
  Loader2,
  ArrowUpRight,
  ArrowDownRight,
  Pencil,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Company } from "@/hooks/use-companies";
import {
  useCompanyTransactions,
  useIncomeStatement,
  useBalanceSheet,
  type StatementLineItem,
} from "@/hooks/use-company-financials";

interface CompanyDetailsModalProps {
  company: Company | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: (company: Company) => void;
  onDelete: (company: Company) => void;
}

function formatCurrency(amount: number | string | null | undefined): string {
  if (amount === null || amount === undefined) return "RWF 0";
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  if (isNaN(num)) return "RWF 0";
  return `RWF ${num.toLocaleString()}`;
}

function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return "N/A";
  try {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return "N/A";
  }
}

const field = (label: string, value: string | number | null | undefined) => (
  <div>
    <p className="text-[9px] uppercase text-muted-foreground/80 font-semibold tracking-wide">
      {label}
    </p>
    <p className="text-[11px] text-foreground mt-0.5">{value ?? "—"}</p>
  </div>
);

// -----------------------------------------------------
// Overview tab
// -----------------------------------------------------
function OverviewTab({ company }: { company: Company }) {
  return (
    <ScrollArea className="h-[440px] pr-3">
      <div className="space-y-2.5">
        <div className="bg-muted/20 rounded-md p-3 border border-border/60">
          {company.description && (
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              {company.description}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {field("Type", company.companyType?.replace(/_/g, " "))}
          {field("Industry", company.industry)}
          {field("Email", company.email)}
          {field("Phone", company.phoneNumber)}
          {field("Website", company.website)}
          {field("CEO", company.ceo)}
          {field("Employees", company.employeeCount)}
          {field("Tax ID", company.taxId)}
          {field("Registration No.", company.registrationNumber)}
          {field("Annual Revenue", formatCurrency(company.annualRevenue))}
          {company.cashBalance &&
            field("Cash Balance", formatCurrency(company.cashBalance))}
          {company.todayProfit &&
            field("Today's Profit", formatCurrency(company.todayProfit))}
        </div>

        {company.notes && (
          <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-md p-2.5">
            <p className="text-[9px] uppercase text-muted-foreground/80 font-semibold tracking-wide mb-1">
              Notes
            </p>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              {company.notes}
            </p>
          </div>
        )}

        {company.createdBy && (
          <div className="pt-1.5 border-t border-border/60">
            <p className="text-[9px] uppercase text-muted-foreground/80 font-semibold tracking-wide mb-1">
              Created By
            </p>
            <p className="text-[11px] font-medium">{company.createdBy.name}</p>
            <p className="text-[9px] text-muted-foreground/80">
              {company.createdBy.email}
            </p>
          </div>
        )}
      </div>
    </ScrollArea>
  );
}

// -----------------------------------------------------
// Transactions tab
// -----------------------------------------------------
function TransactionsTab({ companyId }: { companyId: number }) {
  const { data: transactions = [], isLoading } =
    useCompanyTransactions(companyId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[440px]">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[440px] text-center">
        <Receipt className="h-8 w-8 text-muted-foreground/40 mb-2" />
        <p className="text-[11px] font-medium text-muted-foreground">
          No transactions yet
        </p>
      </div>
    );
  }

  const getAmountColor = (type: string | undefined) =>
    type?.toLowerCase() === "revenue" || type?.toLowerCase() === "income"
      ? "text-emerald-600 dark:text-emerald-400"
      : type?.toLowerCase() === "expense"
        ? "text-red-600 dark:text-red-400"
        : "text-foreground";

  return (
    <ScrollArea className="h-[440px] pr-3">
      <div className="border border-border/60 rounded-md overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 border-b border-border/60 hover:bg-muted/50">
              <TableHead className="text-[9px] uppercase tracking-wide h-7">
                Date
              </TableHead>
              <TableHead className="text-[9px] uppercase tracking-wide h-7">
                Description
              </TableHead>
              <TableHead className="text-[9px] uppercase tracking-wide h-7">
                Category
              </TableHead>
              <TableHead className="text-[9px] uppercase tracking-wide h-7">
                Flow
              </TableHead>
              <TableHead className="text-right text-[9px] uppercase tracking-wide h-7">
                Amount
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((t) => (
              <TableRow
                key={t.id}
                className="hover:bg-muted/30 border-b border-border/60"
              >
                <TableCell className="text-[10px] py-1.5">
                  {formatDate(t.date)}
                </TableCell>
                <TableCell className="py-1.5">
                  <div className="text-[10px] truncate max-w-[160px]">
                    {t.description}
                  </div>
                </TableCell>
                <TableCell className="text-[10px] py-1.5">
                  {t.categoryPath || t.category?.name || "N/A"}
                </TableCell>
                <TableCell className="py-1.5">
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-[9px] h-4 px-1",
                      t.transactionType === "debit"
                        ? "border-green-500 text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-950"
                        : "border-red-500 text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-950",
                    )}
                  >
                    <span className="flex items-center gap-0.5">
                      {t.transactionType === "debit" ? (
                        <ArrowUpRight className="h-2.5 w-2.5" />
                      ) : (
                        <ArrowDownRight className="h-2.5 w-2.5" />
                      )}
                      {t.transactionType === "debit" ? "In" : "Out"}
                    </span>
                  </Badge>
                </TableCell>
                <TableCell
                  className={cn(
                    "text-right tabular-nums text-[10px] py-1.5",
                    getAmountColor(t.category?.categoryType ?? undefined),
                  )}
                >
                  {formatCurrency(t.amount ?? t.totalAmount)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </ScrollArea>
  );
}

// -----------------------------------------------------
// Statement section helper (shared by income + balance tabs)
// -----------------------------------------------------
function StatementSection({
  title,
  items,
  total,
}: {
  title: string;
  items?: StatementLineItem[];
  total: number;
}) {
  return (
    <div className="rounded-md p-2.5 border border-border/60 bg-muted/10">
      <h5 className="text-[9px] font-bold uppercase tracking-wide mb-1.5 text-foreground/80">
        {title}
      </h5>
      <div className="space-y-1">
        {items?.map((item, idx) => (
          <div
            key={idx}
            className="flex justify-between items-center p-1.5 bg-background/50 rounded-md text-[10px]"
          >
            <span className="truncate">{item.categoryName || item.name}</span>
            <span className="tabular-nums font-medium ml-2">
              {formatCurrency(item.totalAmount ?? item.amount)}
            </span>
          </div>
        ))}
        <div className="flex justify-between items-center p-1.5 rounded-md bg-muted font-bold text-[10px]">
          <span>Total {title}</span>
          <span className="tabular-nums">{formatCurrency(total)}</span>
        </div>
      </div>
    </div>
  );
}

// -----------------------------------------------------
// Income statement tab
// -----------------------------------------------------
function IncomeStatementTab({ companyId }: { companyId: number }) {
  const [year, setYear] = useState(new Date().getFullYear());
  const { data: incomeStatement, isLoading } = useIncomeStatement(
    companyId,
    year,
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[440px]">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!incomeStatement) {
    return (
      <div className="flex flex-col items-center justify-center h-[440px] text-center">
        <BarChart3 className="h-8 w-8 text-muted-foreground/40 mb-2" />
        <p className="text-[11px] font-medium text-muted-foreground">
          No income data for {year}
        </p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[440px] pr-3">
      <div className="space-y-2.5">
        <div className="flex justify-center items-center gap-1 bg-muted/20 rounded-md p-1 border border-border/60 w-fit mx-auto">
          <Button
            variant="ghost"
            size="sm"
            className="h-6 text-[9px] px-2"
            onClick={() => setYear(year - 1)}
          >
            ← Prev
          </Button>
          <span className="px-3 text-[11px] font-semibold">{year}</span>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 text-[9px] px-2"
            disabled={year >= new Date().getFullYear()}
            onClick={() => setYear(year + 1)}
          >
            Next →
          </Button>
        </div>

        <StatementSection
          title="Revenue"
          items={incomeStatement.revenue?.breakdown}
          total={incomeStatement.revenue?.total ?? 0}
        />
        <StatementSection
          title="Cost of Sales"
          items={incomeStatement.costOfSales?.breakdown}
          total={incomeStatement.costOfSales?.total ?? 0}
        />

        <div className="rounded-md p-2.5 border-2 border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-950/20">
          <div className="flex justify-between items-center text-[11px] font-bold">
            <span>Gross Profit</span>
            <span className="tabular-nums text-emerald-700 dark:text-emerald-300">
              {formatCurrency(incomeStatement.grossProfit)}
            </span>
          </div>
        </div>

        <StatementSection
          title="Operating Expenses"
          items={incomeStatement.operatingExpenses?.breakdown}
          total={incomeStatement.operatingExpenses?.total ?? 0}
        />

        <div className="rounded-md p-2.5 border-2 border-primary bg-primary/5">
          <div className="flex justify-between items-center text-xs font-bold mb-1">
            <span>Net Profit</span>
            <span className="tabular-nums text-primary">
              {formatCurrency(incomeStatement.netProfit)}
            </span>
          </div>
          <div className="flex justify-between items-center text-[10px] text-muted-foreground">
            <span>Profit Margin</span>
            <span className="font-semibold">
              {incomeStatement.profitMargin}
            </span>
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}

// -----------------------------------------------------
// Balance sheet tab
// -----------------------------------------------------
function BalanceSheetTab({ companyId }: { companyId: number }) {
  const [asOfDate, setAsOfDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const { data: balanceSheet, isLoading } = useBalanceSheet(
    companyId,
    asOfDate,
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[440px]">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!balanceSheet) {
    return (
      <div className="flex flex-col items-center justify-center h-[440px] text-center">
        <Scale className="h-8 w-8 text-muted-foreground/40 mb-2" />
        <p className="text-[11px] font-medium text-muted-foreground">
          No balance sheet data as of {formatDate(asOfDate)}
        </p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[440px] pr-3">
      <div className="space-y-2.5">
        <div className="flex justify-center">
          <input
            type="date"
            value={asOfDate}
            onChange={(e) => setAsOfDate(e.target.value)}
            max={new Date().toISOString().split("T")[0]}
            className="px-2.5 py-1 text-[11px] border border-border/60 rounded-md bg-background"
          />
        </div>

        <StatementSection
          title="Assets"
          items={balanceSheet.assets.breakdown}
          total={balanceSheet.assets.total}
        />
        <StatementSection
          title="Liabilities"
          items={balanceSheet.liabilities.breakdown}
          total={balanceSheet.liabilities.total}
        />

        <div className="rounded-md p-2.5 border border-border/60 bg-muted/10 space-y-1">
          <h5 className="text-[9px] font-bold uppercase tracking-wide text-foreground/80">
            Equity
          </h5>
          <div className="flex justify-between items-center p-1.5 bg-background/50 rounded-md text-[10px]">
            <span>Capital Contributed</span>
            <span className="tabular-nums font-medium">
              {formatCurrency(balanceSheet.equity.capitalContributed)}
            </span>
          </div>
          <div className="flex justify-between items-center p-1.5 bg-background/50 rounded-md text-[10px]">
            <span>Retained Earnings</span>
            <span className="tabular-nums font-medium">
              {formatCurrency(balanceSheet.equity.retainedEarnings)}
            </span>
          </div>
          <div className="flex justify-between items-center p-1.5 rounded-md bg-muted font-bold text-[10px]">
            <span>Total Equity</span>
            <span className="tabular-nums">
              {formatCurrency(balanceSheet.equity.total)}
            </span>
          </div>
        </div>

        <div className="rounded-md p-2.5 border-2 border-border/60 bg-muted/20">
          <div className="flex justify-between items-center text-[11px] font-bold">
            <span>Total Liabilities &amp; Equity</span>
            <span className="tabular-nums">
              {formatCurrency(balanceSheet.totalLiabilitiesAndEquity)}
            </span>
          </div>
        </div>

        <div
          className={cn(
            "rounded-md p-2.5 border-2",
            balanceSheet.balanceCheck === "BALANCED"
              ? "border-green-400 bg-green-50 dark:bg-green-950/20"
              : "border-red-400 bg-red-50 dark:bg-red-950/20",
          )}
        >
          <div className="flex justify-between items-center text-[11px] font-bold">
            <span>Balance Check</span>
            <span
              className={cn(
                "",
                balanceSheet.balanceCheck === "BALANCED"
                  ? "text-green-700 dark:text-green-300"
                  : "text-red-700 dark:text-red-300",
              )}
            >
              {balanceSheet.balanceCheck}
            </span>
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}

// -----------------------------------------------------
// Main modal
// -----------------------------------------------------
export function CompanyDetailsModal({
  company,
  open,
  onOpenChange,
  onEdit,
  onDelete,
}: CompanyDetailsModalProps) {
  if (!company) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden">
        <DialogHeader className="pb-2">
          <DialogTitle className="flex items-center gap-2 text-[13px] font-semibold">
            <div className="p-1.5 bg-primary/10 rounded-md">
              <Building2 className="h-3.5 w-3.5 text-primary" />
            </div>
            <span className="truncate">{company.name}</span>
            <Badge
              variant={company.isActive ? "default" : "outline"}
              className="text-[9px] h-4 px-1.5"
            >
              {company.isActive ? "Active" : "Inactive"}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="info" className="w-full">
          <TabsList className="grid w-full grid-cols-4 h-7">
            <TabsTrigger value="info" className="text-[10px]">
              Overview
            </TabsTrigger>
            <TabsTrigger value="transactions" className="text-[10px]">
              Transactions
            </TabsTrigger>
            <TabsTrigger value="income" className="text-[10px]">
              Income
            </TabsTrigger>
            <TabsTrigger value="balance" className="text-[10px]">
              Balance
            </TabsTrigger>
          </TabsList>

          <TabsContent value="info" className="mt-2.5">
            <OverviewTab company={company} />
          </TabsContent>
          <TabsContent value="transactions" className="mt-2.5">
            <TransactionsTab companyId={company.id} />
          </TabsContent>
          <TabsContent value="income" className="mt-2.5">
            <IncomeStatementTab companyId={company.id} />
          </TabsContent>
          <TabsContent value="balance" className="mt-2.5">
            <BalanceSheetTab companyId={company.id} />
          </TabsContent>
        </Tabs>

        <DialogFooter className="gap-2 border-t border-border/60 pt-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(company)}
            className="text-destructive hover:text-destructive hover:bg-destructive/10 text-[11px] h-7"
          >
            <Trash2 className="mr-1 h-3 w-3" />
            Delete
          </Button>
          <Button
            size="sm"
            onClick={() => onEdit(company)}
            className="text-[11px] h-7"
          >
            <Pencil className="mr-1 h-3 w-3" />
            Edit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


