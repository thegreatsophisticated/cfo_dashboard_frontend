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
import { Pencil, Trash2, FileText } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

import { Transaction, TransactionType } from "@/types/transaction-management-types";

interface TransactionsTableProps {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (transaction: Transaction) => void;
  isDeleting?: boolean;
}

// -----------------------------------------------------
// Badge / color helpers (category-type driven, not just debit/credit)
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

function getAmountColor(categoryType: string | null | undefined) {
  switch (categoryType?.toLowerCase()) {
    case "revenue":
      return "text-emerald-600 dark:text-emerald-400";
    case "expense":
      return "text-red-600 dark:text-red-400";
    case "asset":
      return "text-blue-600 dark:text-blue-400";
    case "liability":
      return "text-orange-600 dark:text-orange-400";
    case "equity":
      return "text-purple-600 dark:text-purple-400";
    default:
      return "text-foreground";
  }
}

// -----------------------------------------------------
// Row
// -----------------------------------------------------
function TransactionRow({
  transaction,
  onEdit,
  onDelete,
  isDeleting,
}: {
  transaction: Transaction;
  onEdit: (transaction: Transaction) => void;
  onDelete: (transaction: Transaction) => void;
  isDeleting?: boolean;
}) {
  const categoryType = transaction.category?.categoryType;
  const isDebit = transaction.transactionType === TransactionType.DEBIT;

  return (
    <TableRow className="hover:bg-muted/30 border-b border-border/60">
      <TableCell className="text-[11px] py-2.5 whitespace-nowrap">
        {format(new Date(transaction.date), "MMM dd, yyyy")}
      </TableCell>

      <TableCell className="py-2.5 max-w-[220px]">
        <div className="text-[11.5px] font-medium truncate">{transaction.description}</div>
        <div className="text-[10px] text-muted-foreground/80 truncate">{transaction.categoryPath}</div>
      </TableCell>

      <TableCell className="text-[11px] py-2.5 whitespace-nowrap">
        {transaction.company?.name || "—"}
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

      <TableCell className="text-[11px] py-2.5 whitespace-nowrap capitalize">
        {transaction.paymentMethod.replace(/_/g, " ").toLowerCase()}
      </TableCell>

      <TableCell className="py-2.5">
        <Badge variant="outline" className="text-[9px] h-4 px-1 capitalize">
          {transaction.status.toLowerCase()}
        </Badge>
      </TableCell>

      <TableCell className="text-right py-2.5">
        <div className={cn("font-mono tabular-nums text-[12px] font-bold", getAmountColor(categoryType))}>
          {isDebit ? "+" : "-"}RWF {Number(transaction.totalAmount).toLocaleString()}
        </div>
        {Number(transaction.taxAmount) > 0 && (
          <div className="text-[9px] text-muted-foreground/70">
            Tax RWF {Number(transaction.taxAmount).toLocaleString()} ({transaction.taxRate}%)
          </div>
        )}
      </TableCell>

      <TableCell className="py-2.5">
        <div className="flex justify-end gap-1">
          <Button size="sm" variant="ghost" onClick={() => onEdit(transaction)} className="h-6 w-6 p-0">
            <Pencil className="h-3 w-3" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onDelete(transaction)}
            className="h-6 w-6 p-0 text-destructive hover:text-destructive"
            disabled={isDeleting}
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
export function TransactionsTable({ transactions, onEdit, onDelete, isDeleting = false }: TransactionsTableProps) {
  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <FileText className="h-10 w-10 text-muted-foreground/40 mb-2" />
        <p className="text-[12.5px] text-muted-foreground">No transactions found</p>
        <p className="text-[11px] mt-1 text-muted-foreground/70">Create your first transaction to get started</p>
      </div>
    );
  }

  return (
    <div className="border border-border/60 rounded-md overflow-hidden overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50 border-b border-border/60 hover:bg-muted/50">
            <TableHead className="text-[9.5px] uppercase tracking-wide h-8">Date</TableHead>
            <TableHead className="text-[9.5px] uppercase tracking-wide h-8">Description</TableHead>
            <TableHead className="text-[9.5px] uppercase tracking-wide h-8">Company</TableHead>
            <TableHead className="text-[9.5px] uppercase tracking-wide h-8">Category</TableHead>
            <TableHead className="text-[9.5px] uppercase tracking-wide h-8">Flow</TableHead>
            <TableHead className="text-[9.5px] uppercase tracking-wide h-8">Payment</TableHead>
            <TableHead className="text-[9.5px] uppercase tracking-wide h-8">Status</TableHead>
            <TableHead className="text-right text-[9.5px] uppercase tracking-wide h-8">Amount</TableHead>
            <TableHead className="w-16 h-8" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction) => (
            <TransactionRow
              key={transaction.id}
              transaction={transaction}
              onEdit={onEdit}
              onDelete={onDelete}
              isDeleting={isDeleting}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default TransactionsTable;
