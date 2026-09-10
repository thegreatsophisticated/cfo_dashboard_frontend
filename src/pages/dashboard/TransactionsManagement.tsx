import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Plus, FileText, Repeat, Loader2, Sparkles } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { useCompanies } from "@/hooks/use-companies";
import { useLeafCategories } from "@/hooks/use-categories";
import {
  useTransactions,
  useCreateTransaction,
  useUpdateTransaction,
  useDeleteTransaction,
  useExecuteRecurringTransaction,
} from "@/hooks/use-transactions";

import {
  TransactionType,
  TransactionStatus,
  PaymentMethod,
  type CreateTransactionDto,
  type Transaction,
  type LeafCategory,
} from "@/types/transaction-management-types";

import { TransactionStats } from "@/components/transaction/TransactionStats";
import {
  TransactionStatsSkeleton,
  TransactionFormSkeleton,
  TransactionListSkeleton,
  RecurringTransactionSkeleton,
} from "@/components/transaction/TransactionSkeleton";
import { TransactionForm } from "@/components/transaction/TransactionForm";
import TransactionsTable from "@/components/transaction/TransactionsTable";
import RecurringTransactionsTable from "@/components/transaction/RecurringTransactionItem";

// Rounds to 2 decimal places — mirrors the backend's currency validation
// (@IsNumber({ maxDecimalPlaces: 2 })) so amount/taxAmount never get rejected
// for floating-point artifacts like 199.9977.
function roundMoney(value: number): number {
  return Math.round(value * 100) / 100;
}

export function TransactionsManagement() {
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState("create");
  const [selectedCompany, setSelectedCompany] = useState<number | undefined>();
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [executingId, setExecutingId] = useState<number | null>(null);

  const emptyFormData: Partial<CreateTransactionDto> = {
    companyId: undefined,
    date: format(new Date(), "yyyy-MM-dd"),
    transactionType: TransactionType.DEBIT,
    amount: 0,
    description: "",
    categoryId: undefined,
    paymentMethod: PaymentMethod.CASH,
    status: TransactionStatus.COMPLETED,
    createdBy: user?.id ?? 1,
  };

  const [formData, setFormData] = useState<Partial<CreateTransactionDto>>(emptyFormData);

  // Queries
  const { data: companies = [], isLoading: companiesLoading } = useCompanies();
  const { data: categories = [], isLoading: categoriesLoading } = useLeafCategories();
  const { data: transactionsData, isLoading: transactionsLoading } = useTransactions();

  const transactions = React.useMemo((): Transaction[] => transactionsData?.data ?? [], [transactionsData]);

  // Mutations
  const createMutation = useCreateTransaction();
  const updateMutation = useUpdateTransaction();
  const deleteMutation = useDeleteTransaction();
  const executeMutation = useExecuteRecurringTransaction();

  const resetForm = () => setFormData(emptyFormData);

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setFormData({
      companyId: transaction.company.id,
      date: transaction.date,
      transactionType: transaction.transactionType,
      amount: Number(transaction.amount),
      description: transaction.description,
      categoryId: transaction.category.id,
      referenceNumber: transaction.referenceNumber || undefined,
      paymentMethod: transaction.paymentMethod,
      status: transaction.status,
      counterparty: transaction.counterparty || undefined,
      invoiceNumber: transaction.invoiceNumber || undefined,
      dueDate: transaction.dueDate || undefined,
      taxRate: Number(transaction.taxRate) || undefined,
      taxAmount: Number(transaction.taxAmount) || undefined,
      notes: transaction.notes || undefined,
      isRecurring: transaction.isRecurring,
      recurringFrequency: transaction.recurringFrequency || undefined,
      createdBy: user?.id ?? 1,
    });
    setIsEditDialogOpen(true);
  };

  const handleDelete = (transaction: Transaction) => {
    if (
      confirm(
        `Are you sure you want to delete this transaction?\n\n${transaction.description}\nAmount: RWF ${Number(
          transaction.totalAmount
        ).toLocaleString()}`
      )
    ) {
      deleteMutation.mutate(transaction.id, {
        onSuccess: () => toast.success("Transaction deleted successfully!"),
        onError: (error: Error) => toast.error("Failed to delete transaction", { description: error.message }),
      });
    }
  };

  const validateForm = () => {
    if (!formData.companyId) return toast.error("Please select a company"), false;
    if (!formData.categoryId) return toast.error("Please select a category"), false;
    if (!formData.amount || formData.amount <= 0) return toast.error("Please enter a valid amount"), false;
    if (!formData.description?.trim()) return toast.error("Please enter a description"), false;
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    createMutation.mutate(formData as CreateTransactionDto, {
      onSuccess: () => {
        toast.success(`Transaction "${formData.description}" created successfully!`, {
          description: `Amount: RWF ${Number(formData.amount).toLocaleString()}`,
        });
        resetForm();
      },
      onError: (error: Error) => toast.error("Failed to create transaction", { description: error.message }),
    });
  };

  const handleUpdate = () => {
    if (!editingTransaction || !validateForm()) return;

    updateMutation.mutate(
      { id: editingTransaction.id, data: formData },
      {
        onSuccess: () => {
          toast.success("Transaction updated successfully!");
          setIsEditDialogOpen(false);
          setEditingTransaction(null);
        },
        onError: (error: Error) => toast.error("Failed to update transaction", { description: error.message }),
      }
    );
  };

  const updateField = <K extends keyof CreateTransactionDto>(
    field: K,
    value: CreateTransactionDto[K],
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const calculateTax = () => {
    if (formData.taxRate && formData.amount) {
      const tax = (formData.amount * formData.taxRate) / 100;
      updateField("taxAmount", roundMoney(tax));
    }
  };

  const categoriesByType = React.useMemo(() => {
    const grouped: Record<string, LeafCategory[]> = {};
    categories.forEach((cat) => {
      if (!cat.allowTransactions) return;
      const type = cat.categoryType || "other";
      if (!grouped[type]) grouped[type] = [];
      grouped[type].push(cat);
    });
    return grouped;
  }, [categories]);

  const getCategoryDisplayName = (category: LeafCategory) => {
    const parts: string[] = [];
    if (category.parent?.parent?.name) parts.push(category.parent.parent.name);
    if (category.parent?.name) parts.push(category.parent.name);
    parts.push(category.name);
    return parts.join(" > ");
  };

  const recurringTransactions = transactions.filter((t) => t.isRecurring);
  const regularTransactions = transactions.filter((t) => !t.isRecurring);

  const totalIncome = transactions
    .filter((t) => t.category?.categoryType === "revenue")
    .reduce((sum, t) => sum + Number(t.totalAmount), 0);
  const totalExpenses = transactions
    .filter((t) => t.category?.categoryType === "expense")
    .reduce((sum, t) => sum + Number(t.totalAmount), 0);
  const recurringIncome = recurringTransactions
    .filter((t) => t.transactionType === TransactionType.DEBIT)
    .reduce((sum, t) => sum + Number(t.totalAmount), 0);
  const recurringExpenses = recurringTransactions
    .filter((t) => t.transactionType === TransactionType.CREDIT)
    .reduce((sum, t) => sum + Number(t.totalAmount), 0);

  const isInitialLoading = companiesLoading || categoriesLoading;

  return (
    <div className="space-y-4">
      {transactionsLoading ? (
        <TransactionStatsSkeleton />
      ) : (
        <TransactionStats
          totalIncome={totalIncome}
          totalExpenses={totalExpenses}
          recurringIncome={recurringIncome}
          recurringExpenses={recurringExpenses}
        />
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 h-8 bg-muted">
          <TabsTrigger value="create" className="text-[11.5px] data-[state=active]:bg-background data-[state=active]:text-foreground">
            <Plus className="h-3 w-3 mr-1" />
            Create
          </TabsTrigger>
          <TabsTrigger value="list" className="text-[11.5px] data-[state=active]:bg-background data-[state=active]:text-foreground">
            <FileText className="h-3 w-3 mr-1" />
            All Transactions
          </TabsTrigger>
          <TabsTrigger value="recurring" className="text-[11.5px] data-[state=active]:bg-background data-[state=active]:text-foreground">
            <Repeat className="h-3 w-3 mr-1" />
            Recurring
          </TabsTrigger>
        </TabsList>

        <TabsContent value="create" className="mt-3">
          <Card className="shadow-sm border-border/60">
            <CardHeader className="pb-3 pt-4 bg-muted/30">
              <CardTitle className="text-[12.5px] font-semibold flex items-center gap-2 text-foreground/90">
                <Sparkles className="h-3.5 w-3.5 text-muted-foreground" />
                Record New Transaction
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-4 pt-4">
              {isInitialLoading ? (
                <TransactionFormSkeleton />
              ) : (
                <form onSubmit={handleSubmit}>
                  <TransactionForm
                    formData={formData}
                    companies={companies}
                    categories={categories}
                    categoriesByType={categoriesByType}
                    onFieldUpdate={updateField}
                    onTaxCalculate={calculateTax}
                    getCategoryDisplayName={getCategoryDisplayName}
                  />
                  <div className="flex gap-2 mt-4">
                    <Button
                      type="submit"
                      size="sm"
                      disabled={createMutation.isPending}
                      className="text-[12px] h-8"
                    >
                      {createMutation.isPending ? (
                        <>
                          <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                          Recording...
                        </>
                      ) : (
                        "Record Transaction"
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={resetForm}
                      disabled={createMutation.isPending}
                      className="text-[12px] h-8"
                    >
                      Clear Form
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="list" className="mt-3">
          <Card className="shadow-sm border-border/60">
            <CardHeader className="pb-3 pt-4 bg-muted/30">
              <div className="flex items-center justify-between">
                <CardTitle className="text-[12.5px] font-semibold text-foreground/90">All Transactions</CardTitle>
                <Select
                  value={selectedCompany?.toString() || "all"}
                  onValueChange={(value) => setSelectedCompany(value === "all" ? undefined : parseInt(value))}
                >
                  <SelectTrigger className="w-[180px] h-7 text-[11.5px]">
                    <SelectValue placeholder="Filter by company" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all" className="text-[12px]">
                      All Companies
                    </SelectItem>
                    {companies.map((company) => (
                      <SelectItem key={company.id} value={company.id.toString()} className="text-[12px]">
                        {company.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent className="pb-4 pt-4">
              {transactionsLoading ? (
                <TransactionListSkeleton />
              ) : (
                <TransactionsTable
                  transactions={
                    selectedCompany
                      ? regularTransactions.filter((t) => t.company.id === selectedCompany)
                      : regularTransactions
                  }
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  isDeleting={deleteMutation.isPending}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recurring" className="mt-3">
          <Card className="shadow-sm border-border/60">
            <CardHeader className="pb-3 pt-4 bg-muted/30">
              <CardTitle className="text-[12.5px] font-semibold text-foreground/90">Recurring Transactions</CardTitle>
            </CardHeader>
            <CardContent className="pb-4 pt-4">
              {transactionsLoading ? (
                <RecurringTransactionSkeleton />
              ) : (
                <RecurringTransactionsTable
                  transactions={recurringTransactions}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  executingId={executingId}
                  onExecute={(id) => {
                    setExecutingId(id);
                    executeMutation.mutate(id, {
                      onSuccess: () => toast.success("Recurring transaction executed successfully!"),
                      onError: (error: Error) =>
                        toast.error("Failed to execute recurring transaction", { description: error.message }),
                      onSettled: () => setExecutingId(null),
                    });
                  }}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto border-border/60">
          <DialogHeader className="pb-2 border-b border-border/60">
            <DialogTitle className="text-[14px] font-semibold text-foreground/90">Edit Transaction</DialogTitle>
          </DialogHeader>

          {isInitialLoading ? (
            <TransactionFormSkeleton />
          ) : (
            <>
              <TransactionForm
                formData={formData}
                companies={companies}
                categories={categories}
                categoriesByType={categoriesByType}
                onFieldUpdate={updateField}
                onTaxCalculate={calculateTax}
                getCategoryDisplayName={getCategoryDisplayName}
              />
              <DialogFooter className="gap-2 pt-3 border-t border-border/60">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setIsEditDialogOpen(false);
                    setEditingTransaction(null);
                    resetForm();
                  }}
                  className="text-[12px] h-8"
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleUpdate}
                  disabled={updateMutation.isPending}
                  className="text-[12px] h-8"
                >
                  {updateMutation.isPending ? (
                    <>
                      <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    "Update Transaction"
                  )}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default TransactionsManagement;
