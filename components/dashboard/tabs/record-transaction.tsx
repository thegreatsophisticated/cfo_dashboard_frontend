




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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  CheckCircle2,
  AlertCircle,
  Plus,
  FileText,
  Repeat,
  Loader2,
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

// ============================================================================
// MAIN COMPONENT
// ============================================================================


export function TransactionManagement() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState("create");
  const [selectedCompany, setSelectedCompany] = useState<number | undefined>();
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
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

  // Queries
  const { data: companies = [] } = useQuery({
    queryKey: ["companies"],
    queryFn: fetchCompanies,
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["leaf-categories"],
    queryFn: fetchLeafCategories,
  });

  // const { data: transactionsData, isLoading: transactionsLoading } = useQuery({
  //   queryKey: ["transactions", selectedCompany],
  //   queryFn: () => fetchTransactions(),
  // });

  const { data: transactionsData, isLoading: transactionsLoading } = useQuery({
    queryKey: ["transactions", selectedCompany],
    // queryFn: () => fetchTransactions() as Promise<Transaction[]>,
    queryFn: () => fetchTransactions() as unknown as Promise<Transaction[]>,
  });


//   const transactions = React.useMemo(() => {
//     return transactionsData ?? [];
// }, [transactionsData]);

const transactions = React.useMemo((): Transaction[] => {
  if (!transactionsData) return [];
  if (Array.isArray(transactionsData)) return transactionsData as Transaction[];
  return [];
}, [transactionsData]);

  // Mutations
  const createMutation = useMutation({
    mutationFn: createTransaction,
    onSuccess: () => {
      setSuccess(true);
      setErrorMsg("");
      resetForm();
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
      setTimeout(() => setSuccess(false), 5000);
    },
    onError: (error: Error) => {
      setErrorMsg(error.message);
      setSuccess(false);
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
      setSuccess(true);
      setErrorMsg("");
      setIsEditDialogOpen(false);
      setEditingTransaction(null);
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      setTimeout(() => setSuccess(false), 5000);
    },
    onError: (error: Error) => {
      setErrorMsg(error.message);
      setSuccess(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTransaction,
    onSuccess: () => {
      setSuccess(true);
      setErrorMsg("");
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      setTimeout(() => setSuccess(false), 5000);
    },
    onError: (error: Error) => {
      setErrorMsg(error.message);
      setSuccess(false);
    },
  });

  const executeMutation = useMutation({
    mutationFn: executeRecurringTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
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
    setErrorMsg("");

    if (!formData.companyId) {
      setErrorMsg("Please select a company");
      return;
    }
    if (!formData.categoryId) {
      setErrorMsg("Please select a category");
      return;
    }
    if (!formData.amount || formData.amount <= 0) {
      setErrorMsg("Please enter a valid amount");
      return;
    }
    if (!formData.description?.trim()) {
      setErrorMsg("Please enter a description");
      return;
    }

    // createMutation.mutate(formData as CreateTransactionDto);
  const { date, ...rest } = formData as CreateTransactionDto;
createMutation.mutate({ ...rest, transactionDate: date } as any);
  };

  const handleUpdate = () => {
    if (!editingTransaction) return;

    setErrorMsg("");

    if (!formData.companyId) {
      setErrorMsg("Please select a company");
      return;
    }
    if (!formData.categoryId) {
      setErrorMsg("Please select a category");
      return;
    }
    if (!formData.amount || formData.amount <= 0) {
      setErrorMsg("Please enter a valid amount");
      return;
    }
    if (!formData.description?.trim()) {
      setErrorMsg("Please enter a description");
      return;
    }

    // updateMutation.mutate({
    //   id: editingTransaction.id,
    //   data: formData as Partial<CreateTransactionDto>,
    // });
   
    const { date, ...rest } = formData as CreateTransactionDto;
updateMutation.mutate({
  id: editingTransaction.id,
  data: { ...rest, transactionDate: date } as any,
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
  // const recurringTransactions = transactions.filter((t) => t.isRecurring);
  // const regularTransactions = transactions.filter((t) => !t.isRecurring);
   const recurringTransactions = transactions.filter((t) => t.isRecurring);
  const regularTransactions = transactions.filter((t) => !t.isRecurring);


  // // Stats - All Transactions


  // const totalIncome = transactions
  //   .filter((t) => t.transactionType === TransactionType.DEBIT)
  //   .reduce((sum, t) => sum + Number(t.totalAmount), 0);

  // const totalExpenses = transactions
  //   .filter((t) => t.transactionType === TransactionType.CREDIT)
  //   .reduce((sum, t) => sum + Number(t.totalAmount), 0);

  // // Stats - Recurring Transactions
  const recurringIncome = recurringTransactions
    .filter((t) => t.transactionType === TransactionType.DEBIT)
    .reduce((sum, t) => sum + Number(t.totalAmount), 0);

  const recurringExpenses = recurringTransactions
    .filter((t) => t.transactionType === TransactionType.CREDIT)
    .reduce((sum, t) => sum + Number(t.totalAmount), 0);


  // ✅ CORRECTED Stats - All Transactions

  // Using category.categoryType instead of transactionType
  const totalIncome = transactions
    .filter((t) => t.category?.categoryType === 'revenue')
    .reduce((sum, t) => sum + Number(t.totalAmount), 0);

  const totalExpenses = transactions
    .filter((t) => t.category?.categoryType === 'expense')
    .reduce((sum, t) => sum + Number(t.totalAmount), 0);



  // ✅ CORRECTED Stats - Recurring Transactions
  // const recurringIncome = recurringTransactions
  //   .filter((t) => t.category?.categoryType === 'revenue')
  //   .reduce((sum, t) => sum + Number(t.totalAmount), 0);

  // const recurringExpenses = recurringTransactions
  //   .filter((t) => t.category?.categoryType === 'expense')
  //   .reduce((sum, t) => sum + Number(t.totalAmount), 0);


  return (
    <div className="space-y-4">
      {/* Stats Section */}
      <TransactionStats
        totalIncome={totalIncome}
        totalExpenses={totalExpenses}
        recurringIncome={recurringIncome}
        recurringExpenses={recurringExpenses}
      />

      {/* Success/Error Messages */}
      {success && (
        <Alert className="bg-green-50 border-green-200 text-green-800 py-2">
          <CheckCircle2 className="h-3 w-3" />
          <AlertDescription className="text-xs">
            Transaction {editingTransaction ? "updated" : "recorded"}{" "}
            successfully!
          </AlertDescription>
        </Alert>
      )}

      {errorMsg && (
        <Alert className="bg-red-50 border-red-200 text-red-800 py-2">
          <AlertCircle className="h-3 w-3" />
          <AlertDescription className="text-xs">{errorMsg}</AlertDescription>
        </Alert>
      )}

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 h-8">
          <TabsTrigger value="create" className="text-xs">
            <Plus className="h-3 w-3 mr-1" />
            Create
          </TabsTrigger>
          <TabsTrigger value="list" className="text-xs">
            <FileText className="h-3 w-3 mr-1" />
            All Transactions
          </TabsTrigger>
          <TabsTrigger value="recurring" className="text-xs">
            <Repeat className="h-3 w-3 mr-1" />
            Recurring
          </TabsTrigger>
        </TabsList>

        {/* CREATE TRANSACTION TAB */}
        <TabsContent value="create" className="mt-3">
          <Card className="shadow-sm">
            <CardHeader className="pb-3 pt-4">
              <CardTitle className="text-sm">Record New Transaction</CardTitle>
            </CardHeader>
            <CardContent className="pb-4">
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
                    className="text-xs h-7"
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
                    className="text-xs h-7"
                  >
                    Clear Form
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TRANSACTIONS LIST TAB */}
        <TabsContent value="list" className="mt-3">
          <Card className="shadow-sm">
            <CardHeader className="pb-3 pt-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm">All Transactions</CardTitle>
                <Select
                  value={selectedCompany?.toString() || "all"}
                  onValueChange={(value) =>
                    setSelectedCompany(
                      value === "all" ? undefined : parseInt(value),
                    )
                  }
                >
                  <SelectTrigger className="w-[180px] h-7 text-xs">
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
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : regularTransactions.length === 0 ? (
                <p className="text-center py-6 text-xs text-muted-foreground">
                  No transactions found
                </p>
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
          <Card className="shadow-sm">
            <CardHeader className="pb-3 pt-4">
              <CardTitle className="text-sm">Recurring Transactions</CardTitle>
            </CardHeader>
            <CardContent className="pb-4">
              {recurringTransactions.length === 0 ? (
                <p className="text-center py-6 text-xs text-muted-foreground">
                  No recurring transactions found
                </p>
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
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="pb-2">
            <DialogTitle className="text-sm">Edit Transaction</DialogTitle>
          </DialogHeader>

          <TransactionForm
            formData={formData}
            companies={companies}
            categories={categories}
            categoriesByType={categoriesByType}
            onFieldUpdate={updateField}
            onTaxCalculate={calculateTax}
            getCategoryDisplayName={getCategoryDisplayName}
          />

          <DialogFooter className="gap-2 pt-3 border-t">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setIsEditDialogOpen(false);
                setEditingTransaction(null);
                resetForm();
              }}
              className="text-xs h-7"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleUpdate}
              disabled={updateMutation.isPending}
              className="text-xs h-7"
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
        </DialogContent>
      </Dialog>
    </div>
  );
}