import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Repeat, Pencil, Trash2, Loader2 } from "lucide-react";
import { Transaction, TransactionType } from "../types";

interface RecurringTransactionItemProps {
  transaction: Transaction;
  onEdit: (transaction: Transaction) => void;
  onDelete: (transaction: Transaction) => void;
  onExecute: (id: number) => void;
  isExecuting?: boolean;
}

export function RecurringTransactionItem({
  transaction,
  onEdit,
  onDelete,
  onExecute,
  isExecuting = false,
}: RecurringTransactionItemProps) {
  // ✅ Helper function to get badge variant based on category type
  const getCategoryBadgeVariant = (categoryType: string | null) => {
    switch (categoryType?.toLowerCase()) {
      case 'revenue':
        return 'default'; // Green/Blue
      case 'expense':
        return 'destructive'; // Red
      case 'asset':
        return 'secondary'; // Gray
      case 'liability':
        return 'outline'; // Outlined
      case 'equity':
        return 'outline'; // Outlined
      default:
        return 'outline';
    }
  };

  // ✅ Helper function to get category label
  const getCategoryLabel = (categoryType: string | null) => {
    switch (categoryType?.toLowerCase()) {
      case 'revenue':
        return 'Revenue';
      case 'expense':
        return 'Expense';
      case 'asset':
        return 'Asset';
      case 'liability':
        return 'Liability';
      case 'equity':
        return 'Equity';
      default:
        return categoryType || 'Other';
    }
  };

  return (
    <div className="p-3 border rounded-md hover:bg-muted/50 transition-colors">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
            {/* Recurring Frequency Badge */}
            <Badge className="text-[9px] h-4 px-1 bg-violet-100 text-violet-700 border-violet-300 dark:bg-violet-950/30 dark:text-violet-400">
              <Repeat className="h-2.5 w-2.5 mr-0.5" />
              {transaction.recurringFrequency}
            </Badge>

            {/* ✅ CORRECTED: Category Type Badge (Primary - Business Purpose) */}
            <Badge
              variant={getCategoryBadgeVariant(transaction.category?.categoryType)}
              className="text-[9px] h-4 px-1 font-semibold"
            >
              {getCategoryLabel(transaction.category?.categoryType)}
            </Badge>

            {/* ✅ NEW: Transaction Direction Badge (Secondary - Money Flow) */}
            <Badge
              variant="outline"
              className={`text-[9px] h-4 px-1 ${
                transaction.transactionType === TransactionType.DEBIT
                  ? "border-green-500 text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-950"
                  : "border-red-500 text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-950"
              }`}
            >
              {transaction.transactionType === TransactionType.DEBIT ? "↑ In" : "↓ Out"}
            </Badge>
          </div>

          <h4 className="font-medium text-xs mb-0.5">
            {transaction.description}
          </h4>
          <p className="text-[10px] text-muted-foreground">
            {transaction.categoryPath || transaction.category?.name}
          </p>
        </div>

        <div className="text-right flex-shrink-0">
          {/* ✅ Amount - keeping neutral styling for recurring templates */}
          <p className="text-sm font-bold font-serif mb-1.5">
            RWF {Number(transaction.totalAmount).toLocaleString()}
          </p>
          <div className="flex gap-1">
            <Button
              size="sm"
              onClick={() => onExecute(transaction.id)}
              disabled={isExecuting}
              className="text-[10px] h-6 px-2"
            >
              {isExecuting ? (
                <Loader2 className="h-2.5 w-2.5 animate-spin" />
              ) : (
                "Execute"
              )}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onEdit(transaction)}
              className="h-6 w-6 p-0"
            >
              <Pencil className="h-2.5 w-2.5" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onDelete(transaction)}
              className="text-destructive hover:text-destructive h-6 w-6 p-0"
            >
              <Trash2 className="h-2.5 w-2.5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}