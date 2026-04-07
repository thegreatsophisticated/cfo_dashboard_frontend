import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DollarSign,
  Hash,
  MessageSquare,
  Receipt,
  Repeat,
} from "lucide-react";
import {
  TransactionType,
  TransactionStatus,
  PaymentMethod,
  CreateTransactionDto,
  LeafCategory,
  Company,
} from "../types";
import { CategorySelect } from "./CategorySelect";

interface TransactionFormProps {
  formData: Partial<CreateTransactionDto>;
  companies: Company[];
  categories: LeafCategory[];
  categoriesByType: Record<string, LeafCategory[]>;
  onFieldUpdate: (field: keyof CreateTransactionDto, value: any) => void;
  onTaxCalculate: () => void;
  getCategoryDisplayName: (category: LeafCategory) => string;
}

export function TransactionForm({
  formData,
  companies,
  categories,
  categoriesByType,
  onFieldUpdate,
  onTaxCalculate,
  getCategoryDisplayName,
}: TransactionFormProps) {
  return (
    <div className="space-y-4">
      {/* Essential Transaction Details */}
      <div>
        <div className="flex items-center gap-1.5 mb-2">
          <Receipt className="h-3 w-3 text-muted-foreground" />
          <h4 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">
            Transaction Details
          </h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          <div className="space-y-1">
            <Label htmlFor="company" className="text-xs">
              Company <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.companyId?.toString()}
              onValueChange={(value) =>
                onFieldUpdate("companyId", parseInt(value))
              }
            >
              <SelectTrigger className="h-8 text-xs" style={{ width: "372px" }}>
                <SelectValue placeholder="Select company" />
              </SelectTrigger>
              <SelectContent>
                {companies.map((company) => (
                  <SelectItem
                    key={company.id}
                    value={company.id.toString()}
                    className="text-xs"
                  >
                    {company.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label htmlFor="date" className="text-xs">
              Date <span className="text-red-500">*</span>
            </Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => onFieldUpdate("date", e.target.value)}
              className="h-8 text-xs"
              required
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="transactionType" className="text-xs">
              Type <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.transactionType}
              onValueChange={(value) => onFieldUpdate("transactionType", value)}
            >
              <SelectTrigger className="h-8 text-xs" style={{ width: "372px" }}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={TransactionType.DEBIT} className="text-xs">
                  Income (Debit)
                </SelectItem>
                <SelectItem value={TransactionType.CREDIT} className="text-xs">
                  Expense (Credit)
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Financial Details */}
      <div>
        <div className="flex items-center gap-1.5 mb-2">
          <DollarSign className="h-3 w-3 text-muted-foreground" />
          <h4 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">
            Financial Details
          </h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          <div className="space-y-1">
            <Label htmlFor="category" className="text-xs">
              Category <span className="text-red-500">*</span>
            </Label>
            <CategorySelect
              value={formData.categoryId}
              onValueChange={(value) => onFieldUpdate("categoryId", value)}
              categories={categories}
              categoriesByType={categoriesByType}
              getCategoryDisplayName={getCategoryDisplayName}
              placeholder="Search and select category..."
              className="w-full"
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="amount" className="text-xs">
              Amount (RWF) <span className="text-red-500">*</span>
            </Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0"
              value={formData.amount || ""}
              onChange={(e) =>
                onFieldUpdate("amount", parseFloat(e.target.value))
              }
              className="h-8 text-xs"
              required
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="paymentMethod" className="text-xs">
              Payment Method
            </Label>
            <Select
              value={formData.paymentMethod}
              onValueChange={(value) => onFieldUpdate("paymentMethod", value)}
            >
              <SelectTrigger className="h-8 text-xs" style={{ width: "372px" }}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={PaymentMethod.CASH} className="text-xs">
                  Cash
                </SelectItem>
                <SelectItem
                  value={PaymentMethod.BANK_TRANSFER}
                  className="text-xs"
                >
                  Bank Transfer
                </SelectItem>
                <SelectItem
                  value={PaymentMethod.MOBILE_MONEY}
                  className="text-xs"
                >
                  Mobile Money
                </SelectItem>
                <SelectItem value={PaymentMethod.CHEQUE} className="text-xs">
                  Cheque
                </SelectItem>
                <SelectItem
                  value={PaymentMethod.CREDIT_CARD}
                  className="text-xs"
                >
                  Credit Card
                </SelectItem>
                <SelectItem
                  value={PaymentMethod.DEBIT_CARD}
                  className="text-xs"
                >
                  Debit Card
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label htmlFor="taxRate" className="text-xs">
              Tax Rate (%)
            </Label>
            <Input
              id="taxRate"
              type="number"
              step="0.01"
              min="0"
              max="100"
              value={formData.taxRate || ""}
              onChange={(e) => {
                onFieldUpdate("taxRate", parseFloat(e.target.value));
                setTimeout(onTaxCalculate, 0);
              }}
              className="h-8 text-xs"
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="taxAmount" className="text-xs">
              Tax Amount (Auto)
            </Label>
            <Input
              id="taxAmount"
              type="number"
              value={formData.taxAmount || ""}
              disabled
              className="bg-muted h-8 text-xs"
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="status" className="text-xs">
              Status
            </Label>
            <Select
              value={formData.status}
              onValueChange={(value) => onFieldUpdate("status", value)}
            >
              <SelectTrigger className="h-8 text-xs" style={{ width: "372px" }}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem
                  value={TransactionStatus.PENDING}
                  className="text-xs"
                >
                  Pending
                </SelectItem>
                <SelectItem
                  value={TransactionStatus.COMPLETED}
                  className="text-xs"
                >
                  Completed
                </SelectItem>
                <SelectItem
                  value={TransactionStatus.RECONCILED}
                  className="text-xs"
                >
                  Reconciled
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Reference & Party Information */}
      <div>
        <div className="flex items-center gap-1.5 mb-2">
          <Hash className="h-3 w-3 text-muted-foreground" />
          <h4 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">
            Reference Information
          </h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="space-y-1">
            <Label htmlFor="referenceNumber" className="text-xs">
              Reference Number
            </Label>
            <Input
              id="referenceNumber"
              placeholder="e.g., INV-2026-001"
              value={formData.referenceNumber || ""}
              onChange={(e) => onFieldUpdate("referenceNumber", e.target.value)}
              className="h-8 text-xs"
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="counterparty" className="text-xs">
              Counterparty
            </Label>
            <Input
              id="counterparty"
              placeholder="Customer/Supplier name"
              value={formData.counterparty || ""}
              onChange={(e) => onFieldUpdate("counterparty", e.target.value)}
              className="h-8 text-xs"
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="invoiceNumber" className="text-xs">
              Invoice Number
            </Label>
            <Input
              id="invoiceNumber"
              placeholder="Invoice #"
              value={formData.invoiceNumber || ""}
              onChange={(e) => onFieldUpdate("invoiceNumber", e.target.value)}
              className="h-8 text-xs"
            />
          </div>
        </div>
      </div>

      {/* Description & Notes */}
      <div>
        <div className="flex items-center gap-1.5 mb-2">
          <MessageSquare className="h-3 w-3 text-muted-foreground" />
          <h4 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">
            Description & Notes
          </h4>
        </div>
        <div className="space-y-2">
          <div className="space-y-1">
            <Label htmlFor="description" className="text-xs">
              Description <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="description"
              placeholder="Enter transaction description"
              value={formData.description}
              onChange={(e) => onFieldUpdate("description", e.target.value)}
              className="text-xs min-h-[60px]"
              required
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="notes" className="text-xs">
              Additional Notes
            </Label>
            <Textarea
              id="notes"
              placeholder="Optional notes"
              value={formData.notes || ""}
              onChange={(e) => onFieldUpdate("notes", e.target.value)}
              className="text-xs min-h-[60px]"
            />
          </div>
        </div>
      </div>

      {/* Recurring Options */}
      <div>
        <div className="flex items-center gap-1.5 mb-2">
          <Repeat className="h-3 w-3 text-muted-foreground" />
          <h4 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">
            Recurring Settings
          </h4>
        </div>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isRecurring"
              checked={formData.isRecurring || false}
              onChange={(e) => onFieldUpdate("isRecurring", e.target.checked)}
              className="h-3 w-3"
            />
            <Label htmlFor="isRecurring" className="cursor-pointer text-xs">
              Make this a recurring transaction
            </Label>
          </div>

          {formData.isRecurring && (
            <div className="space-y-1">
              <Label htmlFor="recurringFrequency" className="text-xs">
                Frequency
              </Label>
              <Select
                value={formData.recurringFrequency}
                onValueChange={(value) =>
                  onFieldUpdate("recurringFrequency", value)
                }
              >
                <SelectTrigger
                  className="h-8 text-xs"
                  style={{ width: "372px" }}
                >
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily" className="text-xs">
                    Daily
                  </SelectItem>
                  <SelectItem value="weekly" className="text-xs">
                    Weekly
                  </SelectItem>
                  <SelectItem value="monthly" className="text-xs">
                    Monthly
                  </SelectItem>
                  <SelectItem value="quarterly" className="text-xs">
                    Quarterly
                  </SelectItem>
                  <SelectItem value="yearly" className="text-xs">
                    Yearly
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}