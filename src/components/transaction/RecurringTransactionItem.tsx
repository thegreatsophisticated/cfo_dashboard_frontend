import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Repeat, Pencil, Trash2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Transaction, TransactionType } from "@/types/transaction-management-types";

interface RecurringTransactionsTableProps {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (transaction: Transaction) => void;
  onExecute: (id: number) => void;
  executingId?: number | null;
}

// -----------------------------------------------------
// Badge helpers (shared naming with TransactionsTable)
// -----------------------------------------------------
function getCategoryBadgeVariant(categoryType: string | null | undefined) {
  switch (categoryType?.toLowerCase()) {
    case "revenue":
      return "default" as const;
    case "expense":
      return "destructive" as const;
    case "asset":
      return "secondary" as const;
    default:
      return "outline" as const;
  }
}

function getCategoryLabel(categoryType: string | null | undefined) {
  switch (categoryType?.toLowerCase()) {
    case "revenue":
      return "Revenue";
    case "expense":
      return "Expense";
    case "asset":
      return "Asset";
    case "liability":
      return "Liability";
    case "equity":
      return "Equity";
    default:
      return categoryType || "Other";
  }
}

// -----------------------------------------------------
// Row
// -----------------------------------------------------
function RecurringTransactionRow({
  transaction,
  onEdit,
  onDelete,
  onExecute,
  isExecuting,
}: {
  transaction: Transaction;
  onEdit: (transaction: Transaction) => void;
  onDelete: (transaction: Transaction) => void;
  onExecute: (id: number) => void;
  isExecuting?: boolean;
}) {
  const categoryType = transaction.category?.categoryType;
  const isDebit = transaction.transactionType === TransactionType.DEBIT;

  return (
    <TableRow className="hover:bg-muted/30 border-b border-border/60">
      <TableCell className="py-2.5">
        <Badge className="text-[9px] h-4 px-1.5 bg-violet-100 text-violet-700 border-violet-300 dark:bg-violet-950/30 dark:text-violet-400">
          <Repeat className="h-2.5 w-2.5 mr-0.5" />
          <span className="capitalize">{transaction.recurringFrequency}</span>
        </Badge>
      </TableCell>

      <TableCell className="py-2.5 max-w-[240px]">
        <div className="text-[11.5px] font-medium truncate">{transaction.description}</div>
        <div className="text-[10px] text-muted-foreground/80 truncate">
          {transaction.categoryPath || transaction.category?.name}
        </div>
      </TableCell>

      <TableCell className="py-2.5">
        <Badge variant={getCategoryBadgeVariant(categoryType)} className="text-[9px] h-4 px-1.5 font-semibold">
          {getCategoryLabel(categoryType)}
        </Badge>
      </TableCell>

      <TableCell className="py-2.5">
        <Badge
          variant="outline"
          className={cn(
            "text-[9px] h-4 px-1",
            isDebit
              ? "border-green-500 text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-950"
              : "border-red-500 text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-950"
          )}
        >
          {isDebit ? "↑ In" : "↓ Out"}
        </Badge>
      </TableCell>

      <TableCell className="text-right py-2.5">
        <span className="font-mono tabular-nums text-[12px] font-bold text-foreground">
          RWF {Number(transaction.totalAmount).toLocaleString()}
        </span>
      </TableCell>

      <TableCell className="py-2.5">
        <div className="flex justify-end items-center gap-1">
          <Button
            size="sm"
            onClick={() => onExecute(transaction.id)}
            disabled={isExecuting}
            className="text-[10.5px] h-6 px-2.5"
          >
            {isExecuting ? <Loader2 className="h-3 w-3 animate-spin" /> : "Execute"}
          </Button>
          <Button size="sm" variant="ghost" onClick={() => onEdit(transaction)} className="h-6 w-6 p-0">
            <Pencil className="h-3 w-3" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onDelete(transaction)}
            className="h-6 w-6 p-0 text-destructive hover:text-destructive"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}

// -----------------------------------------------------
// Table
// -----------------------------------------------------
export function RecurringTransactionsTable({
  transactions,
  onEdit,
  onDelete,
  onExecute,
  executingId = null,
}: RecurringTransactionsTableProps) {
  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Repeat className="h-10 w-10 text-muted-foreground/40 mb-2" />
        <p className="text-[12.5px] text-muted-foreground">No recurring transactions found</p>
        <p className="text-[11px] mt-1 text-muted-foreground/70">Set up recurring transactions for regular payments</p>
      </div>
    );
  }

  return (
    <div className="border border-border/60 rounded-md overflow-hidden overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50 border-b border-border/60 hover:bg-muted/50">
            <TableHead className="text-[9.5px] uppercase tracking-wide h-8">Frequency</TableHead>
            <TableHead className="text-[9.5px] uppercase tracking-wide h-8">Description</TableHead>
            <TableHead className="text-[9.5px] uppercase tracking-wide h-8">Category</TableHead>
            <TableHead className="text-[9.5px] uppercase tracking-wide h-8">Flow</TableHead>
            <TableHead className="text-right text-[9.5px] uppercase tracking-wide h-8">Amount</TableHead>
            <TableHead className="w-40 h-8" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction) => (
            <RecurringTransactionRow
              key={transaction.id}
              transaction={transaction}
              onEdit={onEdit}
              onDelete={onDelete}
              onExecute={onExecute}
              isExecuting={executingId === transaction.id}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default RecurringTransactionsTable;
