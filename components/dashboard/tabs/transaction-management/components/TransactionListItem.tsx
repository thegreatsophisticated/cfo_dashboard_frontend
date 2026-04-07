import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  CreditCard,
  Hash,
  User,
  Tag,
  Building2,
  Pencil,
  Trash2,
} from "lucide-react";
import { format } from "date-fns";
import { Transaction, TransactionType } from "../types";

interface TransactionListItemProps {
  transaction: Transaction;
  onEdit: (transaction: Transaction) => void;
  onDelete: (transaction: Transaction) => void;
  isDeleting?: boolean;
}

export function TransactionListItem({
  transaction,
  onEdit,
  onDelete,
  isDeleting = false,
}: TransactionListItemProps) {
  // ✅ Helper function to get badge variant based on category type
  const getCategoryBadgeVariant = (categoryType: string | null) => {
    switch (categoryType?.toLowerCase()) {
      case 'revenue':
        return 'default'; // Green/Blue (income)
      case 'expense':
        return 'destructive'; // Red (expense)
      case 'asset':
        return 'secondary'; // Gray (asset purchase)
      case 'liability':
        return 'outline'; // Outlined (debt)
      case 'equity':
        return 'outline'; // Outlined (capital)
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

  // ✅ Helper to determine amount color based on category type
  const getAmountColor = (categoryType: string | null) => {
    switch (categoryType?.toLowerCase()) {
      case 'revenue':
        return 'text-green-600 dark:text-green-400';
      case 'expense':
        return 'text-red-600 dark:text-red-400';
      case 'asset':
        return 'text-blue-600 dark:text-blue-400';
      case 'liability':
        return 'text-orange-600 dark:text-orange-400';
      case 'equity':
        return 'text-purple-600 dark:text-purple-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  return (
    <div className="p-3 border rounded-md hover:bg-muted/50 transition-colors">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
            {/* ✅ PRIMARY: Category Type Badge - Most Important for Business Logic */}
            <Badge
              variant={getCategoryBadgeVariant(transaction.category?.categoryType)}
              className="text-[9px] h-4 px-1.5 font-semibold"
            >
              {getCategoryLabel(transaction.category?.categoryType)}
            </Badge>

            {/* ✅ SECONDARY: Transaction Direction Badge - Shows money flow */}
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

            {/* Status Badge */}
            <Badge variant="outline" className="text-[9px] h-4 px-1">
              {transaction.status}
            </Badge>

            {/* Company Name */}
            {transaction.company?.name && (
              <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                <Building2 className="h-2.5 w-2.5" />
                {transaction.company.name}
              </span>
            )}
          </div>

          <h4 className="font-medium text-xs truncate mb-0.5">
            {transaction.description}
          </h4>

          <p className="text-[10px] text-muted-foreground truncate mb-1">
            <Tag className="h-2.5 w-2.5 inline mr-0.5" />
            {transaction.categoryPath}
          </p>

          <div className="flex items-center gap-3 flex-wrap text-[10px] text-muted-foreground">
            <span className="flex items-center gap-0.5">
              <Calendar className="h-2.5 w-2.5" />
              {format(new Date(transaction.date), "MMM dd, yyyy")}
            </span>
            <span className="flex items-center gap-0.5">
              <CreditCard className="h-2.5 w-2.5" />
              {transaction.paymentMethod.replace(/_/g, " ")}
            </span>
            {transaction.counterparty && (
              <span className="flex items-center gap-0.5">
                <User className="h-2.5 w-2.5" />
                {transaction.counterparty}
              </span>
            )}
            {transaction.referenceNumber && (
              <span className="flex items-center gap-0.5">
                <Hash className="h-2.5 w-2.5" />
                {transaction.referenceNumber}
              </span>
            )}
          </div>

          {transaction.notes && (
            <p className="text-[10px] text-muted-foreground mt-1 italic truncate">
              {transaction.notes}
            </p>
          )}
        </div>

        <div className="text-right flex-shrink-0">
          {/* ✅ Amount colored by category type, not transaction type */}
          <p className={`text-sm font-bold font-serif mb-0.5 ${getAmountColor(transaction.category?.categoryType)}`}>
            {transaction.transactionType === TransactionType.DEBIT ? "+" : "-"}
            RWF {Number(transaction.totalAmount).toLocaleString()}
          </p>

          {Number(transaction.taxAmount) > 0 && (
            <p className="text-[9px] text-muted-foreground mb-1">
              Tax: RWF {Number(transaction.taxAmount).toLocaleString()} (
              {transaction.taxRate}%)
            </p>
          )}

          <div className="flex gap-1 mt-1.5">
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
              disabled={isDeleting}
            >
              <Trash2 className="h-2.5 w-2.5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}