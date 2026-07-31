"use client";

import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Plus,
  FileText,
  Repeat,
  Loader2,
  Sparkles,
} from "lucide-react";
import { format } from "date-fns";
import { useAuth } from "@/lib/auth-context";
import {
  createTransaction,
  deleteTransaction,
  executeRecurringTransaction,
  fetchCompanies,
  fetchLeafCategories,
  fetchTransactions,
  updateTransaction,
} from "@/lib/api";
import {
  TransactionType,
  TransactionStatus,
  PaymentMethod,
  CreateTransactionDto,
  Transaction,
  LeafCategory,
} from "./transaction-management/types/index";
import { TransactionStats } from "./transaction-management/components/TransactionStats";
import { TransactionForm } from "./transaction-management/components/TransactionForm";
import { TransactionListItem } from "./transaction-management/components/TransactionListItem";
import { RecurringTransactionItem } from "./transaction-management/components/RecurringTransactionItem";
import {
  TransactionStatsSkeleton,
  TransactionFormSkeleton,
  TransactionListSkeleton,
  RecurringTransactionSkeleton,
} from "./transaction-management/components/TransactionSkeleton";
// ✅ Import toast
import { toast } from "sonner";

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

interface TransactionsApiResponse {
  status: number;
  message: string;
  data: Transaction[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function TransactionManagement() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState("create");
  const [selectedCompany, setSelectedCompany] = useState<number | undefined>();
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // Form state
  const [formData, setFormData] = useState<Partial<CreateTransactionDto>>({
    companyId: undefined,
    date: format(new Date(), "yyyy-MM-dd"),
    transactionType: TransactionType.DEBIT,
    amount: 0,
    description: "",
    categoryId: undefined,
    paymentMethod: PaymentMethod.CASH,
    status: TransactionStatus.COMPLETED,
    createdBy: user?.id || 1,
  });

  // Queries with loading states
  const {
    data: companies = [],
    isLoading: companiesLoading,
  } = useQuery({
    queryKey: ["companies"],
    queryFn: fetchCompanies,
  });

  const {
    data: categories = [],
    isLoading: categoriesLoading,
  } = useQuery({
    queryKey: ["leaf-categories"],
    queryFn: fetchLeafCategories,
  });

  const {
    data: transactionsData,
    isLoading: transactionsLoading,
    error: transactionsError,
    isError: isTransactionsError,
  } = useQuery<TransactionsApiResponse, Error>({
    queryKey: ["transactions"],
    queryFn: () => fetchTransactions(),
    retry: 2,
    staleTime: 30000,
  });

  // Extract transactions safely
  const transactions = React.useMemo((): Transaction[] => {
    return transactionsData?.data ?? [];
  }, [transactionsData]);

  // Handle error state with toast
  React.useEffect(() => {
    if (isTransactionsError && transactionsError) {
      toast.error(`Failed to load transactions: ${transactionsError.message}`);
    }
  }, [isTransactionsError, transactionsError]);

  // ✅ IMPROVED: Create mutation with toast notification
  const createMutation = useMutation({
    mutationFn: createTransaction,
    onSuccess: (response) => {
      // ✅ Show toast success message
      toast.success(`Transaction "${formData.description}" created successfully!`, {
        description: `Amount: RWF ${Number(formData.amount).toLocaleString()}`,
        duration: 5000,
      });
      
      // Reset form immediately for better UX
      resetForm();
      
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
    },
    onError: (error: Error) => {
      toast.error("Failed to create transaction", {
        description: error.message,
        duration: 5000,
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: Partial<CreateTransactionDto>;
    }) => updateTransaction(id, data),
    onSuccess: () => {
      toast.success("Transaction updated successfully!", {
        duration: 4000,
      });
      setIsEditDialogOpen(false);
      setEditingTransaction(null);
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
    onError: (error: Error) => {
      toast.error("Failed to update transaction", {
        description: error.message,
        duration: 5000,
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTransaction,
    onSuccess: () => {
      toast.success("Transaction deleted successfully!", {
        duration: 4000,
      });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
    onError: (error: Error) => {
      toast.error("Failed to delete transaction", {
        description: error.message,
        duration: 5000,
      });
    },
  });

  const executeMutation = useMutation({
    mutationFn: executeRecurringTransaction,
    onSuccess: () => {
      toast.success("Recurring transaction executed successfully!", {
        duration: 4000,
      });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
    onError: (error: Error) => {
      toast.error("Failed to execute recurring transaction", {
        description: error.message,
        duration: 5000,
      });
    },
  });

  // Handlers
  const resetForm = () => {
    setFormData({
      companyId: undefined,
      date: format(new Date(), "yyyy-MM-dd"),
      transactionType: TransactionType.DEBIT,
      amount: 0,
      description: "",
      categoryId: undefined,
      paymentMethod: PaymentMethod.CASH,
      status: TransactionStatus.COMPLETED,
      createdBy: user?.id || 1,
    });
  };

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
      createdBy: user?.id || 1,
    });
    setIsEditDialogOpen(true);
  };

  const handleDelete = (transaction: Transaction) => {
    if (
      confirm(
        `Are you sure you want to delete this transaction?\n\n${transaction.description}\nAmount: RWF ${Number(transaction.totalAmount).toLocaleString()}`,
      )
    ) {
      deleteMutation.mutate(transaction.id);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.companyId) {
      toast.error("Please select a company");
      return;
    }
    if (!formData.categoryId) {
      toast.error("Please select a category");
      return;
    }
    if (!formData.amount || formData.amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    if (!formData.description?.trim()) {
      toast.error("Please enter a description");
      return;
    }

    createMutation.mutate(formData as CreateTransactionDto);
  };

  const handleUpdate = () => {
    if (!editingTransaction) return;

    if (!formData.companyId) {
      toast.error("Please select a company");
      return;
    }
    if (!formData.categoryId) {
      toast.error("Please select a category");
      return;
    }
    if (!formData.amount || formData.amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    if (!formData.description?.trim()) {
      toast.error("Please enter a description");
      return;
    }

    updateMutation.mutate({
      id: editingTransaction.id,
      data: formData as Partial<CreateTransactionDto>,
    });
  };

  const updateField = (field: keyof CreateTransactionDto, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const calculateTax = () => {
    if (formData.taxRate && formData.amount) {
      const tax = (formData.amount * formData.taxRate) / 100;
      updateField("taxAmount", tax);
    }
  };

  // Group categories by type for better organization
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

  // Get category display name with full path
  const getCategoryDisplayName = (category: LeafCategory) => {
    const parts: string[] = [];
    if (category.parent?.parent?.name) parts.push(category.parent.parent.name);
    if (category.parent?.name) parts.push(category.parent.name);
    parts.push(category.name);
    return parts.join(" > ");
  };

  // Filter transactions
  const recurringTransactions = transactions.filter((t) => t.isRecurring);
  const regularTransactions = transactions.filter((t) => !t.isRecurring);

  // Stats - All Transactions (using categoryType for accuracy)
  const totalIncome = transactions
    .filter((t) => t.category?.categoryType === "revenue")
    .reduce((sum, t) => sum + Number(t.totalAmount), 0);

  const totalExpenses = transactions
    .filter((t) => t.category?.categoryType === "expense")
    .reduce((sum, t) => sum + Number(t.totalAmount), 0);

  // Stats - Recurring Transactions
  const recurringIncome = recurringTransactions
    .filter((t) => t.transactionType === TransactionType.DEBIT)
    .reduce((sum, t) => sum + Number(t.totalAmount), 0);

  const recurringExpenses = recurringTransactions
    .filter((t) => t.transactionType === TransactionType.CREDIT)
    .reduce((sum, t) => sum + Number(t.totalAmount), 0);

  // Loading state for initial data
  const isInitialLoading = companiesLoading || categoriesLoading;

  return (
    <div className="space-y-4">
      {/* ✅ Stats Section with Grey Skeleton */}
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

      {/* ✅ REMOVED: Alert components - now using toast */}

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 h-8 bg-gray-100">
          <TabsTrigger value="create" className="text-xs data-[state=active]:bg-white data-[state=active]:text-gray-900">
            <Plus className="h-3 w-3 mr-1" />
            Create
          </TabsTrigger>
          <TabsTrigger value="list" className="text-xs data-[state=active]:bg-white data-[state=active]:text-gray-900">
            <FileText className="h-3 w-3 mr-1" />
            All Transactions
          </TabsTrigger>
          <TabsTrigger value="recurring" className="text-xs data-[state=active]:bg-white data-[state=active]:text-gray-900">
            <Repeat className="h-3 w-3 mr-1" />
            Recurring
          </TabsTrigger>
        </TabsList>

        {/* CREATE TRANSACTION TAB */}
        <TabsContent value="create" className="mt-3">
          <Card className="shadow-sm border-gray-200">
            <CardHeader className="pb-3 pt-4 bg-gray-50/50">
              <CardTitle className="text-sm flex items-center gap-2 text-gray-700">
                <Sparkles className="h-4 w-4 text-gray-500" />
                Record New Transaction
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-4">
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

                  {/* Action Buttons */}
                  <div className="flex gap-2 mt-4">
                    <Button
                      type="submit"
                      size="sm"
                      disabled={createMutation.isPending}
                      className="text-xs h-7 bg-gray-900 hover:bg-gray-800 text-white"
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
                      className="text-xs h-7 border-gray-300 text-gray-600 hover:bg-gray-50"
                    >
                      Clear Form
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* TRANSACTIONS LIST TAB */}
        <TabsContent value="list" className="mt-3">
          <Card className="shadow-sm border-gray-200">
            <CardHeader className="pb-3 pt-4 bg-gray-50/50">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm text-gray-700">All Transactions</CardTitle>
                <Select
                  value={selectedCompany?.toString() || "all"}
                  onValueChange={(value) =>
                    setSelectedCompany(
                      value === "all" ? undefined : parseInt(value),
                    )
                  }
                >
                  <SelectTrigger className="w-[180px] h-7 text-xs border-gray-300">
                    <SelectValue placeholder="Filter by company" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all" className="text-xs">
                      All Companies
                    </SelectItem>
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
            </CardHeader>
            <CardContent className="pb-4">
              {transactionsLoading ? (
                <TransactionListSkeleton />
              ) : regularTransactions.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <FileText className="h-12 w-12 mx-auto mb-3 opacity-30" />
                  <p className="text-sm text-gray-500">No transactions found</p>
                  <p className="text-xs mt-1 text-gray-400">Create your first transaction to get started</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {regularTransactions.map((transaction) => (
                    <TransactionListItem
                      key={transaction.id}
                      transaction={transaction}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      isDeleting={deleteMutation.isPending}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* RECURRING TRANSACTIONS TAB */}
        <TabsContent value="recurring" className="mt-3">
          <Card className="shadow-sm border-gray-200">
            <CardHeader className="pb-3 pt-4 bg-gray-50/50">
              <CardTitle className="text-sm text-gray-700">Recurring Transactions</CardTitle>
            </CardHeader>
            <CardContent className="pb-4">
              {transactionsLoading ? (
                <RecurringTransactionSkeleton />
              ) : recurringTransactions.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <Repeat className="h-12 w-12 mx-auto mb-3 opacity-30" />
                  <p className="text-sm text-gray-500">No recurring transactions found</p>
                  <p className="text-xs mt-1 text-gray-400">Set up recurring transactions for regular payments</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {recurringTransactions.map((transaction) => (
                    <RecurringTransactionItem
                      key={transaction.id}
                      transaction={transaction}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      onExecute={(id) => executeMutation.mutate(id)}
                      isExecuting={executeMutation.isPending}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto border-gray-200">
          <DialogHeader className="pb-2 border-b border-gray-100">
            <DialogTitle className="text-sm text-gray-700">Edit Transaction</DialogTitle>
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

              <DialogFooter className="gap-2 pt-3 border-t border-gray-100">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setIsEditDialogOpen(false);
                    setEditingTransaction(null);
                    resetForm();
                  }}
                  className="text-xs h-7 border-gray-300 text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleUpdate}
                  disabled={updateMutation.isPending}
                  className="text-xs h-7 bg-gray-900 hover:bg-gray-800 text-white"
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
