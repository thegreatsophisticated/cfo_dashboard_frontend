(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/components/dashboard/tabs/record-transaction.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// "use client";
// import React, { useState } from "react";
// import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Alert, AlertDescription } from "@/components/ui/alert";
// import { Badge } from "@/components/ui/badge";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
// } from "@/components/ui/dialog";
// import {
//   CheckCircle2,
//   AlertCircle,
//   Plus,
//   Calendar,
//   DollarSign,
//   TrendingUp,
//   TrendingDown,
//   Repeat,
//   FileText,
//   Pencil,
//   Trash2,
//   Loader2,
//   Building2,
//   Tag,
//   Receipt,
//   CreditCard,
//   Hash,
//   User,
//   MessageSquare,
//   BarChart3,
// } from "lucide-react";
// import { format } from "date-fns";
// import { useAuth } from "@/lib/auth-context";
// import { createTransaction, deleteTransaction, executeRecurringTransaction, fetchCompanies, fetchLeafCategories, fetchTransactions, updateTransaction } from "@/lib/api";
// // ============================================================================
// // TYPE DEFINITIONS (matching actual API response)
// // ============================================================================
// export enum TransactionType {
//   DEBIT = "debit",
//   CREDIT = "credit",
// }
// export enum TransactionStatus {
//   PENDING = "pending",
//   COMPLETED = "completed",
//   RECONCILED = "reconciled",
//   CANCELLED = "cancelled",
// }
// export enum PaymentMethod {
//   CASH = "cash",
//   BANK_TRANSFER = "bank_transfer",
//   CHEQUE = "cheque",
//   MOBILE_MONEY = "mobile_money",
//   CREDIT_CARD = "credit_card",
//   DEBIT_CARD = "debit_card",
//   OTHER = "other",
// }
// interface CategoryParent {
//   id: number;
//   code: string | null;
//   name: string;
//   level: string;
//   categoryType: string | null;
//   parent?: CategoryParent;
// }
// interface TransactionCategory {
//   id: number;
//   code: string | null;
//   name: string;
//   description: string | null;
//   level: string;
//   categoryType: string | null;
//   sortOrder: number;
//   isActive: boolean;
//   allowTransactions: boolean;
//   parent?: CategoryParent;
// }
// interface TransactionCompany {
//   id: number;
//   name: string;
//   description: string | null;
//   email: string;
//   isActive: boolean;
// }
// interface TransactionCreator {
//   id: number;
//   name: string;
//   email: string;
//   role: string;
//   profile?: {
//     id: number;
//     gender: string | null;
//     position: string | null;
//   };
// }
// interface Transaction {
//   id: number;
//   date: string;
//   transactionType: TransactionType;
//   amount: string;
//   description: string;
//   referenceNumber: string | null;
//   paymentMethod: PaymentMethod;
//   status: TransactionStatus;
//   counterparty: string | null;
//   invoiceNumber: string | null;
//   dueDate: string | null;
//   taxAmount: string;
//   taxRate: string;
//   totalAmount: string;
//   reconciledAt: string | null;
//   notes: string | null;
//   attachments: string[] | null;
//   isRecurring: boolean;
//   recurringFrequency: string | null;
//   financialYear: number;
//   financialPeriod: number;
//   createdAt: string;
//   updatedAt: string;
//   deletedAt: string | null;
//   company: TransactionCompany;
//   category: TransactionCategory;
//   createdBy: TransactionCreator;
//   categoryPath: string;
// }
// interface LeafCategory {
//   id: number;
//   name: string;
//   code: string | null;
//   categoryType: string | null;
//   level: string;
//   allowTransactions: boolean;
//   parent?: {
//     id: number;
//     name: string;
//     parent?: {
//       id: number;
//       name: string;
//     };
//   };
// }
// interface CreateTransactionDto {
//   companyId: number;
//   date: string;
//   transactionType: TransactionType;
//   amount: number;
//   description: string;
//   categoryId: number;
//   referenceNumber?: string;
//   paymentMethod?: PaymentMethod;
//   status?: TransactionStatus;
//   counterparty?: string;
//   invoiceNumber?: string;
//   dueDate?: string;
//   taxRate?: number;
//   taxAmount?: number;
//   notes?: string;
//   attachments?: string[];
//   isRecurring?: boolean;
//   recurringFrequency?: string;
//   createdBy: number;
// }
// // ============================================================================
// // MAIN COMPONENT
// // ============================================================================
// export function TransactionManagement() {
//   const queryClient = useQueryClient();
//   const { user } = useAuth();
//   const [activeTab, setActiveTab] = useState("create");
//   const [selectedCompany, setSelectedCompany] = useState<number | undefined>();
//   const [success, setSuccess] = useState(false);
//   const [errorMsg, setErrorMsg] = useState("");
//   const [editingTransaction, setEditingTransaction] =
//     useState<Transaction | null>(null);
//   const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
//   // Form state
//   const [formData, setFormData] = useState<Partial<CreateTransactionDto>>({
//     companyId: undefined,
//     date: format(new Date(), "yyyy-MM-dd"),
//     transactionType: TransactionType.DEBIT,
//     amount: 0,
//     description: "",
//     categoryId: undefined,
//     paymentMethod: PaymentMethod.CASH,
//     status: TransactionStatus.COMPLETED,
//     createdBy: user?.id || 1,
//   });
//   // Queries
//   const { data: companies = [] } = useQuery({
//     queryKey: ["companies"],
//     queryFn: fetchCompanies,
//   });
//   const { data: categories = [] } = useQuery({
//     queryKey: ["leaf-categories"],
//     queryFn: fetchLeafCategories,
//   });
//   const { data: transactionsData, isLoading: transactionsLoading } = useQuery({
//     queryKey: ["transactions", selectedCompany],
//     queryFn: () => fetchTransactions(),
//   });
//   // Ensure transactions is always an array
//   const transactions = React.useMemo(() => {
//     if (!transactionsData) return [];
//     // Handle if API returns an object with transactions property
//     if (Array.isArray(transactionsData)) return transactionsData;
//     if (transactionsData.transactions && Array.isArray(transactionsData.transactions)) {
//       return transactionsData.transactions;
//     }
//     return [];
//   }, [transactionsData]);
//   // Mutations
//   const createMutation = useMutation({
//     mutationFn: createTransaction,
//     onSuccess: () => {
//       setSuccess(true);
//       setErrorMsg("");
//       resetForm();
//       queryClient.invalidateQueries({ queryKey: ["transactions"] });
//       queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
//       setTimeout(() => setSuccess(false), 5000);
//     },
//     onError: (error: Error) => {
//       setErrorMsg(error.message);
//       setSuccess(false);
//     },
//   });
//   const updateMutation = useMutation({
//     mutationFn: ({
//       id,
//       data,
//     }: {
//       id: number;
//       data: Partial<CreateTransactionDto>;
//     }) => updateTransaction(id, data),
//     onSuccess: () => {
//       setSuccess(true);
//       setErrorMsg("");
//       setIsEditDialogOpen(false);
//       setEditingTransaction(null);
//       queryClient.invalidateQueries({ queryKey: ["transactions"] });
//       setTimeout(() => setSuccess(false), 5000);
//     },
//     onError: (error: Error) => {
//       setErrorMsg(error.message);
//       setSuccess(false);
//     },
//   });
//   const deleteMutation = useMutation({
//     mutationFn: deleteTransaction,
//     onSuccess: () => {
//       setSuccess(true);
//       setErrorMsg("");
//       queryClient.invalidateQueries({ queryKey: ["transactions"] });
//       setTimeout(() => setSuccess(false), 5000);
//     },
//     onError: (error: Error) => {
//       setErrorMsg(error.message);
//       setSuccess(false);
//     },
//   });
//   const executeMutation = useMutation({
//     mutationFn: executeRecurringTransaction,
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["transactions"] });
//       setSuccess(true);
//       setTimeout(() => setSuccess(false), 3000);
//     },
//   });
//   // Handlers
//   const resetForm = () => {
//     setFormData({
//       companyId: undefined,
//       date: format(new Date(), "yyyy-MM-dd"),
//       transactionType: TransactionType.DEBIT,
//       amount: 0,
//       description: "",
//       categoryId: undefined,
//       paymentMethod: PaymentMethod.CASH,
//       status: TransactionStatus.COMPLETED,
//       createdBy: user?.id || 1,
//     });
//   };
//   const handleEdit = (transaction: Transaction) => {
//     setEditingTransaction(transaction);
//     setFormData({
//       companyId: transaction.company.id,
//       date: transaction.date,
//       transactionType: transaction.transactionType,
//       amount: Number(transaction.amount),
//       description: transaction.description,
//       categoryId: transaction.category.id,
//       referenceNumber: transaction.referenceNumber || undefined,
//       paymentMethod: transaction.paymentMethod,
//       status: transaction.status,
//       counterparty: transaction.counterparty || undefined,
//       invoiceNumber: transaction.invoiceNumber || undefined,
//       dueDate: transaction.dueDate || undefined,
//       taxRate: Number(transaction.taxRate) || undefined,
//       taxAmount: Number(transaction.taxAmount) || undefined,
//       notes: transaction.notes || undefined,
//       isRecurring: transaction.isRecurring,
//       recurringFrequency: transaction.recurringFrequency || undefined,
//       createdBy: user?.id || 1,
//     });
//     setIsEditDialogOpen(true);
//   };
//   const handleDelete = (transaction: Transaction) => {
//     if (
//       confirm(
//         `Are you sure you want to delete this transaction?\n\n${transaction.description}\nAmount: RWF ${Number(transaction.totalAmount).toLocaleString()}`,
//       )
//     ) {
//       deleteMutation.mutate(transaction.id);
//     }
//   };
//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     setErrorMsg("");
//     // Validation
//     if (!formData.companyId) {
//       setErrorMsg("Please select a company");
//       return;
//     }
//     if (!formData.categoryId) {
//       setErrorMsg("Please select a category");
//       return;
//     }
//     if (!formData.amount || formData.amount <= 0) {
//       setErrorMsg("Please enter a valid amount");
//       return;
//     }
//     if (!formData.description?.trim()) {
//       setErrorMsg("Please enter a description");
//       return;
//     }
//     createMutation.mutate(formData as CreateTransactionDto);
//   };
//   const handleUpdate = () => {
//     if (!editingTransaction) return;
//     setErrorMsg("");
//     // Validation
//     if (!formData.companyId) {
//       setErrorMsg("Please select a company");
//       return;
//     }
//     if (!formData.categoryId) {
//       setErrorMsg("Please select a category");
//       return;
//     }
//     if (!formData.amount || formData.amount <= 0) {
//       setErrorMsg("Please enter a valid amount");
//       return;
//     }
//     if (!formData.description?.trim()) {
//       setErrorMsg("Please enter a description");
//       return;
//     }
//     updateMutation.mutate({
//       id: editingTransaction.id,
//       data: formData as Partial<CreateTransactionDto>,
//     });
//   };
//   const updateField = (field: keyof CreateTransactionDto, value: any) => {
//     setFormData((prev) => ({ ...prev, [field]: value }));
//   };
//   // Calculate tax
//   const calculateTax = () => {
//     if (formData.taxRate && formData.amount) {
//       const tax = (formData.amount * formData.taxRate) / 100;
//       updateField("taxAmount", tax);
//     }
//   };
//   // Group categories by type for better organization
//   const categoriesByType = React.useMemo(() => {
//     const grouped: Record<string, LeafCategory[]> = {};
//     categories.forEach((cat) => {
//       if (!cat.allowTransactions) return;
//       const type = cat.categoryType || "other";
//       if (!grouped[type]) grouped[type] = [];
//       grouped[type].push(cat);
//     });
//     return grouped;
//   }, [categories]);
//   // Get category display name with full path
//   const getCategoryDisplayName = (category: LeafCategory) => {
//     const parts: string[] = [];
//     if (category.parent?.parent?.name) parts.push(category.parent.parent.name);
//     if (category.parent?.name) parts.push(category.parent.name);
//     parts.push(category.name);
//     return parts.join(" > ");
//   };
//   // Filter transactions
//   const recurringTransactions = transactions.filter((t) => t.isRecurring);
//   const regularTransactions = transactions.filter((t) => !t.isRecurring);
//   // Stats - All Transactions
//   const totalIncome = transactions
//     .filter((t) => t.transactionType === TransactionType.DEBIT)
//     .reduce((sum, t) => sum + Number(t.totalAmount), 0);
//   const totalExpenses = transactions
//     .filter((t) => t.transactionType === TransactionType.CREDIT)
//     .reduce((sum, t) => sum + Number(t.totalAmount), 0);
//   // Stats - Recurring Transactions
//   const recurringIncome = recurringTransactions
//     .filter((t) => t.transactionType === TransactionType.DEBIT)
//     .reduce((sum, t) => sum + Number(t.totalAmount), 0);
//   const recurringExpenses = recurringTransactions
//     .filter((t) => t.transactionType === TransactionType.CREDIT)
//     .reduce((sum, t) => sum + Number(t.totalAmount), 0);
//   const netRecurring = recurringIncome - recurringExpenses;
//   // Render transaction form (reusable for create and edit)
//   const renderTransactionForm = (isEdit = false) => (
//     <div className="space-y-4">
//       {/* Essential Transaction Details */}
//       <div>
//         <div className="flex items-center gap-1.5 mb-2">
//           <Receipt className="h-3 w-3 text-muted-foreground" />
//           <h4 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">
//             Transaction Details
//           </h4>
//         </div>
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
//           <div className="space-y-1">
//             <Label htmlFor="company" className="text-xs">
//               Company <span className="text-red-500">*</span>
//             </Label>
//             <Select
//               value={formData.companyId?.toString()}
//               onValueChange={(value) =>
//                 updateField("companyId", parseInt(value))
//               }
//             >
//               <SelectTrigger className="h-8 text-xs" style={{ width: "372px" }}>
//                 <SelectValue placeholder="Select company" />
//               </SelectTrigger>
//               <SelectContent>
//                 {companies.map((company) => (
//                   <SelectItem
//                     key={company.id}
//                     value={company.id.toString()}
//                     className="text-xs"
//                   >
//                     {company.name}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//           </div>
//           <div className="space-y-1">
//             <Label htmlFor="date" className="text-xs">
//               Date <span className="text-red-500">*</span>
//             </Label>
//             <Input
//               id="date"
//               type="date"
//               value={formData.date}
//               onChange={(e) => updateField("date", e.target.value)}
//               className="h-8 text-xs"
//               required
//             />
//           </div>
//           <div className="space-y-1">
//             <Label htmlFor="transactionType" className="text-xs">
//               Type <span className="text-red-500">*</span>
//             </Label>
//             <Select
//               value={formData.transactionType}
//               onValueChange={(value) => updateField("transactionType", value)}
//             >
//               <SelectTrigger className="h-8 text-xs" style={{ width: "372px" }}>
//                 <SelectValue />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value={TransactionType.DEBIT} className="text-xs">
//                   Income (Debit)
//                 </SelectItem>
//                 <SelectItem value={TransactionType.CREDIT} className="text-xs">
//                   Expense (Credit)
//                 </SelectItem>
//               </SelectContent>
//             </Select>
//           </div>
//         </div>
//       </div>
//       {/* Financial Details */}
//       <div>
//         <div className="flex items-center gap-1.5 mb-2">
//           <DollarSign className="h-3 w-3 text-muted-foreground" />
//           <h4 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">
//             Financial Details
//           </h4>
//         </div>
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
//           <div className="space-y-1">
//             <Label htmlFor="category" className="text-xs">
//               Category <span className="text-red-500">*</span>
//             </Label>
//             <Select
//               value={formData.categoryId?.toString()}
//               onValueChange={(value) =>
//                 updateField("categoryId", parseInt(value))
//               }
//             >
//               <SelectTrigger
//                 className="h-8 text-xs "
//                 style={{ width: "372px" }}
//               >
//                 <SelectValue placeholder="Select category" />
//               </SelectTrigger>
//               <SelectContent className="max-h-[300px]">
//                 {Object.entries(categoriesByType).map(([type, cats]) => (
//                   <React.Fragment key={type}>
//                     <div className="px-2 py-1 text-[10px] font-semibold text-muted-foreground uppercase bg-muted/50">
//                       {type.replace("_", " ")}
//                     </div>
//                     {cats.map((cat) => (
//                       <SelectItem
//                         key={cat.id}
//                         value={cat.id.toString()}
//                         className="text-xs"
//                       >
//                         <span className="text-[10px] text-muted-foreground mr-1.5">
//                           {cat.code}
//                         </span>
//                         <span className="truncate">
//                           {getCategoryDisplayName(cat)}
//                         </span>
//                       </SelectItem>
//                     ))}
//                   </React.Fragment>
//                 ))}
//               </SelectContent>
//             </Select>
//           </div>
//           <div className="space-y-1">
//             <Label htmlFor="amount" className="text-xs">
//               Amount (RWF) <span className="text-red-500">*</span>
//             </Label>
//             <Input
//               id="amount"
//               type="number"
//               step="0.01"
//               min="0"
//               value={formData.amount || ""}
//               onChange={(e) =>
//                 updateField("amount", parseFloat(e.target.value))
//               }
//               className="h-8 text-xs"
//               required
//             />
//           </div>
//           <div className="space-y-1">
//             <Label htmlFor="paymentMethod" className="text-xs">
//               Payment Method
//             </Label>
//             <Select
//               value={formData.paymentMethod}
//               onValueChange={(value) => updateField("paymentMethod", value)}
//             >
//               <SelectTrigger className="h-8 text-xs" style={{ width: "372px" }}>
//                 <SelectValue />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value={PaymentMethod.CASH} className="text-xs">
//                   Cash
//                 </SelectItem>
//                 <SelectItem
//                   value={PaymentMethod.BANK_TRANSFER}
//                   className="text-xs"
//                 >
//                   Bank Transfer
//                 </SelectItem>
//                 <SelectItem
//                   value={PaymentMethod.MOBILE_MONEY}
//                   className="text-xs"
//                 >
//                   Mobile Money
//                 </SelectItem>
//                 <SelectItem value={PaymentMethod.CHEQUE} className="text-xs">
//                   Cheque
//                 </SelectItem>
//                 <SelectItem
//                   value={PaymentMethod.CREDIT_CARD}
//                   className="text-xs"
//                 >
//                   Credit Card
//                 </SelectItem>
//                 <SelectItem
//                   value={PaymentMethod.DEBIT_CARD}
//                   className="text-xs"
//                 >
//                   Debit Card
//                 </SelectItem>
//               </SelectContent>
//             </Select>
//           </div>
//           <div className="space-y-1">
//             <Label htmlFor="taxRate" className="text-xs">
//               Tax Rate (%)
//             </Label>
//             <Input
//               id="taxRate"
//               type="number"
//               step="0.01"
//               min="0"
//               max="100"
//               value={formData.taxRate || ""}
//               onChange={(e) => {
//                 updateField("taxRate", parseFloat(e.target.value));
//                 setTimeout(calculateTax, 0);
//               }}
//               className="h-8 text-xs"
//             />
//           </div>
//           <div className="space-y-1">
//             <Label htmlFor="taxAmount" className="text-xs">
//               Tax Amount (Auto)
//             </Label>
//             <Input
//               id="taxAmount"
//               type="number"
//               value={formData.taxAmount || ""}
//               disabled
//               className="bg-muted h-8 text-xs"
//             />
//           </div>
//           <div className="space-y-1">
//             <Label htmlFor="status" className="text-xs">
//               Status
//             </Label>
//             <Select
//               value={formData.status}
//               onValueChange={(value) => updateField("status", value)}
//             >
//               <SelectTrigger className="h-8 text-xs" style={{ width: "372px" }}>
//                 <SelectValue />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem
//                   value={TransactionStatus.PENDING}
//                   className="text-xs"
//                 >
//                   Pending
//                 </SelectItem>
//                 <SelectItem
//                   value={TransactionStatus.COMPLETED}
//                   className="text-xs"
//                 >
//                   Completed
//                 </SelectItem>
//                 <SelectItem
//                   value={TransactionStatus.RECONCILED}
//                   className="text-xs"
//                 >
//                   Reconciled
//                 </SelectItem>
//               </SelectContent>
//             </Select>
//           </div>
//         </div>
//       </div>
//       {/* Reference & Party Information */}
//       <div>
//         <div className="flex items-center gap-1.5 mb-2">
//           <Hash className="h-3 w-3 text-muted-foreground" />
//           <h4 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">
//             Reference Information
//           </h4>
//         </div>
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
//           <div className="space-y-1">
//             <Label htmlFor="referenceNumber" className="text-xs">
//               Reference Number
//             </Label>
//             <Input
//               id="referenceNumber"
//               placeholder="e.g., INV-2026-001"
//               value={formData.referenceNumber || ""}
//               onChange={(e) => updateField("referenceNumber", e.target.value)}
//               className="h-8 text-xs"
//             />
//           </div>
//           <div className="space-y-1">
//             <Label htmlFor="counterparty" className="text-xs">
//               Counterparty
//             </Label>
//             <Input
//               id="counterparty"
//               placeholder="Customer/Supplier name"
//               value={formData.counterparty || ""}
//               onChange={(e) => updateField("counterparty", e.target.value)}
//               className="h-8 text-xs"
//             />
//           </div>
//           <div className="space-y-1">
//             <Label htmlFor="invoiceNumber" className="text-xs">
//               Invoice Number
//             </Label>
//             <Input
//               id="invoiceNumber"
//               placeholder="Invoice #"
//               value={formData.invoiceNumber || ""}
//               onChange={(e) => updateField("invoiceNumber", e.target.value)}
//               className="h-8 text-xs"
//             />
//           </div>
//         </div>
//       </div>
//       {/* Description & Notes */}
//       <div>
//         <div className="flex items-center gap-1.5 mb-2">
//           <MessageSquare className="h-3 w-3 text-muted-foreground" />
//           <h4 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">
//             Description & Notes
//           </h4>
//         </div>
//         <div className="space-y-2">
//           <div className="space-y-1">
//             <Label htmlFor="description" className="text-xs">
//               Description <span className="text-red-500">*</span>
//             </Label>
//             <Textarea
//               id="description"
//               placeholder="Enter transaction description"
//               value={formData.description}
//               onChange={(e) => updateField("description", e.target.value)}
//               className="text-xs min-h-[60px]"
//               required
//             />
//           </div>
//           <div className="space-y-1">
//             <Label htmlFor="notes" className="text-xs">
//               Additional Notes
//             </Label>
//             <Textarea
//               id="notes"
//               placeholder="Optional notes"
//               value={formData.notes || ""}
//               onChange={(e) => updateField("notes", e.target.value)}
//               className="text-xs min-h-[60px]"
//             />
//           </div>
//         </div>
//       </div>
//       {/* Recurring Options */}
//       <div>
//         <div className="flex items-center gap-1.5 mb-2">
//           <Repeat className="h-3 w-3 text-muted-foreground" />
//           <h4 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">
//             Recurring Settings
//           </h4>
//         </div>
//         <div className="space-y-2">
//           <div className="flex items-center space-x-2">
//             <input
//               type="checkbox"
//               id="isRecurring"
//               checked={formData.isRecurring || false}
//               onChange={(e) => updateField("isRecurring", e.target.checked)}
//               className="h-3 w-3"
//             />
//             <Label htmlFor="isRecurring" className="cursor-pointer text-xs">
//               Make this a recurring transaction
//             </Label>
//           </div>
//           {formData.isRecurring && (
//             <div className="space-y-1">
//               <Label htmlFor="recurringFrequency" className="text-xs">
//                 Frequency
//               </Label>
//               <Select
//                 value={formData.recurringFrequency}
//                 onValueChange={(value) =>
//                   updateField("recurringFrequency", value)
//                 }
//               >
//                 <SelectTrigger
//                   className="h-8 text-xs"
//                   style={{ width: "372px" }}
//                 >
//                   <SelectValue placeholder="Select frequency" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="daily" className="text-xs">
//                     Daily
//                   </SelectItem>
//                   <SelectItem value="weekly" className="text-xs">
//                     Weekly
//                   </SelectItem>
//                   <SelectItem value="monthly" className="text-xs">
//                     Monthly
//                   </SelectItem>
//                   <SelectItem value="quarterly" className="text-xs">
//                     Quarterly
//                   </SelectItem>
//                   <SelectItem value="yearly" className="text-xs">
//                     Yearly
//                   </SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
//   return (
//     <div className="space-y-4">
//       {/* Header Stats - All Transactions */}
//       <div>
//         <h3 className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
//           All Transactions
//         </h3>
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
//           <Card className="shadow-sm">
//             <CardContent className="pt-4 pb-3">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-[10px] font-medium text-muted-foreground mb-0.5">
//                     Total Income
//                   </p>
//                   <p className="text-base font-bold text-green-600 font-serif">
//                     RWF {totalIncome.toLocaleString()}
//                   </p>
//                 </div>
//                 <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-950/30 flex items-center justify-center">
//                   <TrendingUp className="h-4 w-4 text-green-600" />
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//           <Card className="shadow-sm">
//             <CardContent className="pt-4 pb-3">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-[10px] font-medium text-muted-foreground mb-0.5">
//                     Total Expenses
//                   </p>
//                   <p className="text-base font-bold text-red-600 font-serif">
//                     RWF {totalExpenses.toLocaleString()}
//                   </p>
//                 </div>
//                 <div className="h-8 w-8 rounded-full bg-red-100 dark:bg-red-950/30 flex items-center justify-center">
//                   <TrendingDown className="h-4 w-4 text-red-600" />
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//           <Card className="shadow-sm">
//             <CardContent className="pt-4 pb-3">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-[10px] font-medium text-muted-foreground mb-0.5">
//                     Net Position
//                   </p>
//                   <p
//                     className={`text-base font-bold font-serif ${totalIncome - totalExpenses >= 0 ? "text-green-600" : "text-red-600"}`}
//                   >
//                     RWF {(totalIncome - totalExpenses).toLocaleString()}
//                   </p>
//                 </div>
//                 <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-950/30 flex items-center justify-center">
//                   <BarChart3 className="h-4 w-4 text-blue-600" />
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//       {/* Recurring Transaction Stats */}
//       <div>
//         <h3 className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide flex items-center gap-1.5">
//           <Repeat className="h-3 w-3" />
//           Recurring Transactions
//         </h3>
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
//           <Card className="shadow-sm border-green-200 dark:border-green-900">
//             <CardContent className="pt-4 pb-3">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-[10px] font-medium text-muted-foreground mb-0.5">
//                     Recurring Income
//                   </p>
//                   <p className="text-base font-bold text-green-600 font-serif">
//                     RWF {recurringIncome.toLocaleString()}
//                   </p>
//                 </div>
//                 <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-950/30 flex items-center justify-center">
//                   <Repeat className="h-4 w-4 text-green-600" />
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//           <Card className="shadow-sm border-red-200 dark:border-red-900">
//             <CardContent className="pt-4 pb-3">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-[10px] font-medium text-muted-foreground mb-0.5">
//                     Recurring Expenses
//                   </p>
//                   <p className="text-base font-bold text-red-600 font-serif">
//                     RWF {recurringExpenses.toLocaleString()}
//                   </p>
//                 </div>
//                 <div className="h-8 w-8 rounded-full bg-red-100 dark:bg-red-950/30 flex items-center justify-center">
//                   <Repeat className="h-4 w-4 text-red-600" />
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//           <Card className="shadow-sm border-blue-200 dark:border-blue-900">
//             <CardContent className="pt-4 pb-3">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-[10px] font-medium text-muted-foreground mb-0.5">
//                     Net Recurring
//                   </p>
//                   <p
//                     className={`text-base font-bold font-serif ${netRecurring >= 0 ? "text-green-600" : "text-red-600"}`}
//                   >
//                     RWF {netRecurring.toLocaleString()}
//                   </p>
//                 </div>
//                 <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-950/30 flex items-center justify-center">
//                   <BarChart3 className="h-4 w-4 text-blue-600" />
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//       {/* Success/Error Messages */}
//       {success && (
//         <Alert className="bg-green-50 border-green-200 text-green-800 py-2">
//           <CheckCircle2 className="h-3 w-3" />
//           <AlertDescription className="text-xs">
//             Transaction {editingTransaction ? "updated" : "recorded"}{" "}
//             successfully!
//           </AlertDescription>
//         </Alert>
//       )}
//       {errorMsg && (
//         <Alert className="bg-red-50 border-red-200 text-red-800 py-2">
//           <AlertCircle className="h-3 w-3" />
//           <AlertDescription className="text-xs">{errorMsg}</AlertDescription>
//         </Alert>
//       )}
//       {/* Main Content */}
//       <Tabs value={activeTab} onValueChange={setActiveTab}>
//         <TabsList className="grid w-full grid-cols-3 h-8">
//           <TabsTrigger value="create" className="text-xs">
//             <Plus className="h-3 w-3 mr-1" />
//             Create
//           </TabsTrigger>
//           <TabsTrigger value="list" className="text-xs">
//             <FileText className="h-3 w-3 mr-1" />
//             All Transactions
//           </TabsTrigger>
//           <TabsTrigger value="recurring" className="text-xs">
//             <Repeat className="h-3 w-3 mr-1" />
//             Recurring
//           </TabsTrigger>
//         </TabsList>
//         {/* CREATE TRANSACTION TAB */}
//         <TabsContent value="create" className="mt-3">
//           <Card className="shadow-sm">
//             <CardHeader className="pb-3 pt-4">
//               <CardTitle className="text-sm">Record New Transaction</CardTitle>
//             </CardHeader>
//             <CardContent className="pb-4">
//               <form onSubmit={handleSubmit}>
//                 {renderTransactionForm()}
//                 {/* Action Buttons */}
//                 <div className="flex gap-2 mt-4">
//                   <Button
//                     type="submit"
//                     size="sm"
//                     disabled={createMutation.isPending}
//                     className="text-xs h-7"
//                   >
//                     {createMutation.isPending ? (
//                       <>
//                         <Loader2 className="h-3 w-3 mr-1 animate-spin" />
//                         Recording...
//                       </>
//                     ) : (
//                       "Record Transaction"
//                     )}
//                   </Button>
//                   <Button
//                     type="button"
//                     variant="outline"
//                     size="sm"
//                     onClick={resetForm}
//                     className="text-xs h-7"
//                   >
//                     Clear Form
//                   </Button>
//                 </div>
//               </form>
//             </CardContent>
//           </Card>
//         </TabsContent>
//         {/* TRANSACTIONS LIST TAB */}
//         <TabsContent value="list" className="mt-3">
//           <Card className="shadow-sm">
//             <CardHeader className="pb-3 pt-4">
//               <div className="flex items-center justify-between">
//                 <CardTitle className="text-sm">All Transactions</CardTitle>
//                 <Select
//                   value={selectedCompany?.toString() || "all"}
//                   onValueChange={(value) =>
//                     setSelectedCompany(
//                       value === "all" ? undefined : parseInt(value),
//                     )
//                   }
//                 >
//                   <SelectTrigger className="w-[180px] h-7 text-xs">
//                     <SelectValue placeholder="Filter by company" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="all" className="text-xs">
//                       All Companies
//                     </SelectItem>
//                     {companies.map((company) => (
//                       <SelectItem
//                         key={company.id}
//                         value={company.id.toString()}
//                         className="text-xs"
//                       >
//                         {company.name}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>
//             </CardHeader>
//             <CardContent className="pb-4">
//               {transactionsLoading ? (
//                 <div className="flex items-center justify-center py-8">
//                   <Loader2 className="h-6 w-6 animate-spin text-primary" />
//                 </div>
//               ) : regularTransactions.length === 0 ? (
//                 <p className="text-center py-6 text-xs text-muted-foreground">
//                   No transactions found
//                 </p>
//               ) : (
//                 <div className="space-y-2">
//                   {regularTransactions.map((transaction) => (
//                     <div
//                       key={transaction.id}
//                       className="p-3 border rounded-md hover:bg-muted/50 transition-colors"
//                     >
//                       <div className="flex items-start justify-between gap-3">
//                         <div className="flex-1 min-w-0">
//                           <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
//                             <Badge
//                               variant={
//                                 transaction.transactionType ===
//                                 TransactionType.DEBIT
//                                   ? "default"
//                                   : "destructive"
//                               }
//                               className="text-[9px] h-4 px-1"
//                             >
//                               {transaction.transactionType ===
//                               TransactionType.DEBIT
//                                 ? "Income"
//                                 : "Expense"}
//                             </Badge>
//                             <Badge
//                               variant="outline"
//                               className="text-[9px] h-4 px-1"
//                             >
//                               {transaction.status}
//                             </Badge>
//                             {transaction.company?.name && (
//                               <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
//                                 <Building2 className="h-2.5 w-2.5" />
//                                 {transaction.company.name}
//                               </span>
//                             )}
//                           </div>
//                           <h4 className="font-medium text-xs truncate mb-0.5">
//                             {transaction.description}
//                           </h4>
//                           <p className="text-[10px] text-muted-foreground truncate mb-1">
//                             <Tag className="h-2.5 w-2.5 inline mr-0.5" />
//                             {transaction.categoryPath}
//                           </p>
//                           <div className="flex items-center gap-3 flex-wrap text-[10px] text-muted-foreground">
//                             <span className="flex items-center gap-0.5">
//                               <Calendar className="h-2.5 w-2.5" />
//                               {format(
//                                 new Date(transaction.date),
//                                 "MMM dd, yyyy",
//                               )}
//                             </span>
//                             <span className="flex items-center gap-0.5">
//                               <CreditCard className="h-2.5 w-2.5" />
//                               {transaction.paymentMethod.replace(/_/g, " ")}
//                             </span>
//                             {transaction.counterparty && (
//                               <span className="flex items-center gap-0.5">
//                                 <User className="h-2.5 w-2.5" />
//                                 {transaction.counterparty}
//                               </span>
//                             )}
//                             {transaction.referenceNumber && (
//                               <span className="flex items-center gap-0.5">
//                                 <Hash className="h-2.5 w-2.5" />
//                                 {transaction.referenceNumber}
//                               </span>
//                             )}
//                           </div>
//                           {transaction.notes && (
//                             <p className="text-[10px] text-muted-foreground mt-1 italic truncate">
//                               {transaction.notes}
//                             </p>
//                           )}
//                         </div>
//                         <div className="text-right flex-shrink-0">
//                           <p
//                             className={`text-sm font-bold font-serif mb-0.5 ${transaction.transactionType === TransactionType.DEBIT ? "text-green-600" : "text-red-600"}`}
//                           >
//                             {transaction.transactionType ===
//                             TransactionType.DEBIT
//                               ? "+"
//                               : "-"}
//                             RWF{" "}
//                             {Number(transaction.totalAmount).toLocaleString()}
//                           </p>
//                           {Number(transaction.taxAmount) > 0 && (
//                             <p className="text-[9px] text-muted-foreground mb-1">
//                               Tax: RWF{" "}
//                               {Number(transaction.taxAmount).toLocaleString()} (
//                               {transaction.taxRate}%)
//                             </p>
//                           )}
//                           <div className="flex gap-1 mt-1.5">
//                             <Button
//                               size="sm"
//                               variant="outline"
//                               onClick={() => handleEdit(transaction)}
//                               className="h-6 w-6 p-0"
//                             >
//                               <Pencil className="h-2.5 w-2.5" />
//                             </Button>
//                             <Button
//                               size="sm"
//                               variant="outline"
//                               onClick={() => handleDelete(transaction)}
//                               className="text-destructive hover:text-destructive h-6 w-6 p-0"
//                               disabled={deleteMutation.isPending}
//                             >
//                               <Trash2 className="h-2.5 w-2.5" />
//                             </Button>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </CardContent>
//           </Card>
//         </TabsContent>
//         {/* RECURRING TRANSACTIONS TAB */}
//         <TabsContent value="recurring" className="mt-3">
//           <Card className="shadow-sm">
//             <CardHeader className="pb-3 pt-4">
//               <CardTitle className="text-sm">Recurring Transactions</CardTitle>
//             </CardHeader>
//             <CardContent className="pb-4">
//               {recurringTransactions.length === 0 ? (
//                 <p className="text-center py-6 text-xs text-muted-foreground">
//                   No recurring transactions found
//                 </p>
//               ) : (
//                 <div className="space-y-2">
//                   {recurringTransactions.map((transaction) => (
//                     <div key={transaction.id} className="p-3 border rounded-md">
//                       <div className="flex items-start justify-between gap-3">
//                         <div className="flex-1 min-w-0">
//                           <div className="flex items-center gap-1.5 mb-1.5">
//                             <Badge className="text-[9px] h-4 px-1">
//                               <Repeat className="h-2.5 w-2.5 mr-0.5" />
//                               {transaction.recurringFrequency}
//                             </Badge>
//                             <Badge
//                               variant={
//                                 transaction.transactionType ===
//                                 TransactionType.DEBIT
//                                   ? "default"
//                                   : "destructive"
//                               }
//                               className="text-[9px] h-4 px-1"
//                             >
//                               {transaction.transactionType ===
//                               TransactionType.DEBIT
//                                 ? "Income"
//                                 : "Expense"}
//                             </Badge>
//                           </div>
//                           <h4 className="font-medium text-xs mb-0.5">
//                             {transaction.description}
//                           </h4>
//                           <p className="text-[10px] text-muted-foreground">
//                             {transaction.categoryPath ||
//                               transaction.category?.name}
//                           </p>
//                         </div>
//                         <div className="text-right flex-shrink-0">
//                           <p className="text-sm font-bold font-serif mb-1.5">
//                             RWF{" "}
//                             {Number(transaction.totalAmount).toLocaleString()}
//                           </p>
//                           <div className="flex gap-1">
//                             <Button
//                               size="sm"
//                               onClick={() =>
//                                 executeMutation.mutate(transaction.id)
//                               }
//                               disabled={executeMutation.isPending}
//                               className="text-[10px] h-6 px-2"
//                             >
//                               {executeMutation.isPending ? (
//                                 <Loader2 className="h-2.5 w-2.5 animate-spin" />
//                               ) : (
//                                 "Execute"
//                               )}
//                             </Button>
//                             <Button
//                               size="sm"
//                               variant="outline"
//                               onClick={() => handleEdit(transaction)}
//                               className="h-6 w-6 p-0"
//                             >
//                               <Pencil className="h-2.5 w-2.5" />
//                             </Button>
//                             <Button
//                               size="sm"
//                               variant="outline"
//                               onClick={() => handleDelete(transaction)}
//                               className="text-destructive hover:text-destructive h-6 w-6 p-0"
//                             >
//                               <Trash2 className="h-2.5 w-2.5" />
//                             </Button>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </CardContent>
//           </Card>
//         </TabsContent>
//       </Tabs>
//       {/* Edit Dialog */}
//       <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
//         <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
//           <DialogHeader className="pb-2">
//             <DialogTitle className="text-sm">Edit Transaction</DialogTitle>
//           </DialogHeader>
//           {renderTransactionForm(true)}
//           <DialogFooter className="gap-2 pt-3 border-t">
//             <Button
//               variant="outline"
//               size="sm"
//               onClick={() => {
//                 setIsEditDialogOpen(false);
//                 setEditingTransaction(null);
//                 resetForm();
//               }}
//               className="text-xs h-7"
//             >
//               Cancel
//             </Button>
//             <Button
//               size="sm"
//               onClick={handleUpdate}
//               disabled={updateMutation.isPending}
//               className="text-xs h-7"
//             >
//               {updateMutation.isPending ? (
//                 <>
//                   <Loader2 className="h-3 w-3 mr-1 animate-spin" />
//                   Updating...
//                 </>
//               ) : (
//                 "Update Transaction"
//               )}
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }
__turbopack_context__.s([
    "TransactionManagement",
    ()=>TransactionManagement
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/useMutation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/useQuery.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/QueryClientProvider.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/card.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/select.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/alert.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tabs$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/tabs.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/dialog.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-check.js [app-client] (ecmascript) <export default as CheckCircle2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-alert.js [app-client] (ecmascript) <export default as AlertCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/plus.js [app-client] (ecmascript) <export default as Plus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/file-text.js [app-client] (ecmascript) <export default as FileText>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$repeat$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Repeat$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/repeat.js [app-client] (ecmascript) <export default as Repeat>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/loader-circle.js [app-client] (ecmascript) <export default as Loader2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$format$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/date-fns/format.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/auth-context.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/api.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$dashboard$2f$tabs$2f$transaction$2d$management$2f$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/dashboard/tabs/transaction-management/types/index.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$dashboard$2f$tabs$2f$transaction$2d$management$2f$components$2f$TransactionStats$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/dashboard/tabs/transaction-management/components/TransactionStats.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$dashboard$2f$tabs$2f$transaction$2d$management$2f$components$2f$TransactionForm$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/dashboard/tabs/transaction-management/components/TransactionForm.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$dashboard$2f$tabs$2f$transaction$2d$management$2f$components$2f$TransactionListItem$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/dashboard/tabs/transaction-management/components/TransactionListItem.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$dashboard$2f$tabs$2f$transaction$2d$management$2f$components$2f$RecurringTransactionItem$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/dashboard/tabs/transaction-management/components/RecurringTransactionItem.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
function TransactionManagement() {
    _s();
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"])();
    const { user } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"])();
    const [activeTab, setActiveTab] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("create");
    const [selectedCompany, setSelectedCompany] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])();
    const [success, setSuccess] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [errorMsg, setErrorMsg] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [editingTransaction, setEditingTransaction] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // Form state
    const [formData, setFormData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        companyId: undefined,
        date: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$format$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["format"])(new Date(), "yyyy-MM-dd"),
        transactionType: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$dashboard$2f$tabs$2f$transaction$2d$management$2f$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TransactionType"].DEBIT,
        amount: 0,
        description: "",
        categoryId: undefined,
        paymentMethod: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$dashboard$2f$tabs$2f$transaction$2d$management$2f$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PaymentMethod"].CASH,
        status: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$dashboard$2f$tabs$2f$transaction$2d$management$2f$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TransactionStatus"].COMPLETED,
        createdBy: user?.id || 1
    });
    // Queries
    const { data: companies = [] } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: [
            "companies"
        ],
        queryFn: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchCompanies"]
    });
    const { data: categories = [] } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: [
            "leaf-categories"
        ],
        queryFn: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchLeafCategories"]
    });
    const { data: transactionsData, isLoading: transactionsLoading } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: [
            "transactions",
            selectedCompany
        ],
        queryFn: {
            "TransactionManagement.useQuery": ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchTransactions"])()
        }["TransactionManagement.useQuery"]
    });
    // Ensure transactions is always an array
    const transactions = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useMemo({
        "TransactionManagement.useMemo[transactions]": ()=>{
            if (!transactionsData) return [];
            if (Array.isArray(transactionsData)) return transactionsData;
            if (transactionsData.transactions && Array.isArray(transactionsData.transactions)) {
                return transactionsData.transactions;
            }
            return [];
        }
    }["TransactionManagement.useMemo[transactions]"], [
        transactionsData
    ]);
    // Mutations
    const createMutation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createTransaction"],
        onSuccess: {
            "TransactionManagement.useMutation[createMutation]": ()=>{
                setSuccess(true);
                setErrorMsg("");
                resetForm();
                queryClient.invalidateQueries({
                    queryKey: [
                        "transactions"
                    ]
                });
                queryClient.invalidateQueries({
                    queryKey: [
                        "dashboard-stats"
                    ]
                });
                setTimeout({
                    "TransactionManagement.useMutation[createMutation]": ()=>setSuccess(false)
                }["TransactionManagement.useMutation[createMutation]"], 5000);
            }
        }["TransactionManagement.useMutation[createMutation]"],
        onError: {
            "TransactionManagement.useMutation[createMutation]": (error)=>{
                setErrorMsg(error.message);
                setSuccess(false);
            }
        }["TransactionManagement.useMutation[createMutation]"]
    });
    const updateMutation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: {
            "TransactionManagement.useMutation[updateMutation]": ({ id, data })=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updateTransaction"])(id, data)
        }["TransactionManagement.useMutation[updateMutation]"],
        onSuccess: {
            "TransactionManagement.useMutation[updateMutation]": ()=>{
                setSuccess(true);
                setErrorMsg("");
                setIsEditDialogOpen(false);
                setEditingTransaction(null);
                queryClient.invalidateQueries({
                    queryKey: [
                        "transactions"
                    ]
                });
                setTimeout({
                    "TransactionManagement.useMutation[updateMutation]": ()=>setSuccess(false)
                }["TransactionManagement.useMutation[updateMutation]"], 5000);
            }
        }["TransactionManagement.useMutation[updateMutation]"],
        onError: {
            "TransactionManagement.useMutation[updateMutation]": (error)=>{
                setErrorMsg(error.message);
                setSuccess(false);
            }
        }["TransactionManagement.useMutation[updateMutation]"]
    });
    const deleteMutation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["deleteTransaction"],
        onSuccess: {
            "TransactionManagement.useMutation[deleteMutation]": ()=>{
                setSuccess(true);
                setErrorMsg("");
                queryClient.invalidateQueries({
                    queryKey: [
                        "transactions"
                    ]
                });
                setTimeout({
                    "TransactionManagement.useMutation[deleteMutation]": ()=>setSuccess(false)
                }["TransactionManagement.useMutation[deleteMutation]"], 5000);
            }
        }["TransactionManagement.useMutation[deleteMutation]"],
        onError: {
            "TransactionManagement.useMutation[deleteMutation]": (error)=>{
                setErrorMsg(error.message);
                setSuccess(false);
            }
        }["TransactionManagement.useMutation[deleteMutation]"]
    });
    const executeMutation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["executeRecurringTransaction"],
        onSuccess: {
            "TransactionManagement.useMutation[executeMutation]": ()=>{
                queryClient.invalidateQueries({
                    queryKey: [
                        "transactions"
                    ]
                });
                setSuccess(true);
                setTimeout({
                    "TransactionManagement.useMutation[executeMutation]": ()=>setSuccess(false)
                }["TransactionManagement.useMutation[executeMutation]"], 3000);
            }
        }["TransactionManagement.useMutation[executeMutation]"]
    });
    // Handlers
    const resetForm = ()=>{
        setFormData({
            companyId: undefined,
            date: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$format$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["format"])(new Date(), "yyyy-MM-dd"),
            transactionType: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$dashboard$2f$tabs$2f$transaction$2d$management$2f$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TransactionType"].DEBIT,
            amount: 0,
            description: "",
            categoryId: undefined,
            paymentMethod: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$dashboard$2f$tabs$2f$transaction$2d$management$2f$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PaymentMethod"].CASH,
            status: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$dashboard$2f$tabs$2f$transaction$2d$management$2f$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TransactionStatus"].COMPLETED,
            createdBy: user?.id || 1
        });
    };
    const handleEdit = (transaction)=>{
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
            createdBy: user?.id || 1
        });
        setIsEditDialogOpen(true);
    };
    const handleDelete = (transaction)=>{
        if (confirm(`Are you sure you want to delete this transaction?\n\n${transaction.description}\nAmount: RWF ${Number(transaction.totalAmount).toLocaleString()}`)) {
            deleteMutation.mutate(transaction.id);
        }
    };
    const handleSubmit = (e)=>{
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
        createMutation.mutate(formData);
    };
    const handleUpdate = ()=>{
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
        updateMutation.mutate({
            id: editingTransaction.id,
            data: formData
        });
    };
    const updateField = (field, value)=>{
        setFormData((prev)=>({
                ...prev,
                [field]: value
            }));
    };
    const calculateTax = ()=>{
        if (formData.taxRate && formData.amount) {
            const tax = formData.amount * formData.taxRate / 100;
            updateField("taxAmount", tax);
        }
    };
    // Group categories by type for better organization
    const categoriesByType = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useMemo({
        "TransactionManagement.useMemo[categoriesByType]": ()=>{
            const grouped = {};
            categories.forEach({
                "TransactionManagement.useMemo[categoriesByType]": (cat)=>{
                    if (!cat.allowTransactions) return;
                    const type = cat.categoryType || "other";
                    if (!grouped[type]) grouped[type] = [];
                    grouped[type].push(cat);
                }
            }["TransactionManagement.useMemo[categoriesByType]"]);
            return grouped;
        }
    }["TransactionManagement.useMemo[categoriesByType]"], [
        categories
    ]);
    // Get category display name with full path
    const getCategoryDisplayName = (category)=>{
        const parts = [];
        if (category.parent?.parent?.name) parts.push(category.parent.parent.name);
        if (category.parent?.name) parts.push(category.parent.name);
        parts.push(category.name);
        return parts.join(" > ");
    };
    // Filter transactions
    // const recurringTransactions = transactions.filter((t) => t.isRecurring);
    // const regularTransactions = transactions.filter((t) => !t.isRecurring);
    const recurringTransactions = transactions.filter((t)=>t.isRecurring);
    const regularTransactions = transactions.filter((t)=>!t.isRecurring);
    // // Stats - All Transactions
    // const totalIncome = transactions
    //   .filter((t) => t.transactionType === TransactionType.DEBIT)
    //   .reduce((sum, t) => sum + Number(t.totalAmount), 0);
    // const totalExpenses = transactions
    //   .filter((t) => t.transactionType === TransactionType.CREDIT)
    //   .reduce((sum, t) => sum + Number(t.totalAmount), 0);
    // // Stats - Recurring Transactions
    const recurringIncome = recurringTransactions.filter((t)=>t.transactionType === __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$dashboard$2f$tabs$2f$transaction$2d$management$2f$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TransactionType"].DEBIT).reduce((sum, t)=>sum + Number(t.totalAmount), 0);
    const recurringExpenses = recurringTransactions.filter((t)=>t.transactionType === __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$dashboard$2f$tabs$2f$transaction$2d$management$2f$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TransactionType"].CREDIT).reduce((sum, t)=>sum + Number(t.totalAmount), 0);
    // ✅ CORRECTED Stats - All Transactions
    // Using category.categoryType instead of transactionType
    const totalIncome = transactions.filter((t)=>t.category?.categoryType === 'revenue').reduce((sum, t)=>sum + Number(t.totalAmount), 0);
    const totalExpenses = transactions.filter((t)=>t.category?.categoryType === 'expense').reduce((sum, t)=>sum + Number(t.totalAmount), 0);
    // ✅ CORRECTED Stats - Recurring Transactions
    // const recurringIncome = recurringTransactions
    //   .filter((t) => t.category?.categoryType === 'revenue')
    //   .reduce((sum, t) => sum + Number(t.totalAmount), 0);
    // const recurringExpenses = recurringTransactions
    //   .filter((t) => t.category?.categoryType === 'expense')
    //   .reduce((sum, t) => sum + Number(t.totalAmount), 0);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-4",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$dashboard$2f$tabs$2f$transaction$2d$management$2f$components$2f$TransactionStats$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TransactionStats"], {
                totalIncome: totalIncome,
                totalExpenses: totalExpenses,
                recurringIncome: recurringIncome,
                recurringExpenses: recurringExpenses
            }, void 0, false, {
                fileName: "[project]/components/dashboard/tabs/record-transaction.tsx",
                lineNumber: 1766,
                columnNumber: 7
            }, this),
            success && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Alert"], {
                className: "bg-green-50 border-green-200 text-green-800 py-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__["CheckCircle2"], {
                        className: "h-3 w-3"
                    }, void 0, false, {
                        fileName: "[project]/components/dashboard/tabs/record-transaction.tsx",
                        lineNumber: 1776,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AlertDescription"], {
                        className: "text-xs",
                        children: [
                            "Transaction ",
                            editingTransaction ? "updated" : "recorded",
                            " ",
                            "successfully!"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/dashboard/tabs/record-transaction.tsx",
                        lineNumber: 1777,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/dashboard/tabs/record-transaction.tsx",
                lineNumber: 1775,
                columnNumber: 9
            }, this),
            errorMsg && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Alert"], {
                className: "bg-red-50 border-red-200 text-red-800 py-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__["AlertCircle"], {
                        className: "h-3 w-3"
                    }, void 0, false, {
                        fileName: "[project]/components/dashboard/tabs/record-transaction.tsx",
                        lineNumber: 1786,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AlertDescription"], {
                        className: "text-xs",
                        children: errorMsg
                    }, void 0, false, {
                        fileName: "[project]/components/dashboard/tabs/record-transaction.tsx",
                        lineNumber: 1787,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/dashboard/tabs/record-transaction.tsx",
                lineNumber: 1785,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tabs$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Tabs"], {
                value: activeTab,
                onValueChange: setActiveTab,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tabs$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TabsList"], {
                        className: "grid w-full grid-cols-3 h-8",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tabs$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TabsTrigger"], {
                                value: "create",
                                className: "text-xs",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                        className: "h-3 w-3 mr-1"
                                    }, void 0, false, {
                                        fileName: "[project]/components/dashboard/tabs/record-transaction.tsx",
                                        lineNumber: 1795,
                                        columnNumber: 13
                                    }, this),
                                    "Create"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/dashboard/tabs/record-transaction.tsx",
                                lineNumber: 1794,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tabs$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TabsTrigger"], {
                                value: "list",
                                className: "text-xs",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"], {
                                        className: "h-3 w-3 mr-1"
                                    }, void 0, false, {
                                        fileName: "[project]/components/dashboard/tabs/record-transaction.tsx",
                                        lineNumber: 1799,
                                        columnNumber: 13
                                    }, this),
                                    "All Transactions"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/dashboard/tabs/record-transaction.tsx",
                                lineNumber: 1798,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tabs$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TabsTrigger"], {
                                value: "recurring",
                                className: "text-xs",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$repeat$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Repeat$3e$__["Repeat"], {
                                        className: "h-3 w-3 mr-1"
                                    }, void 0, false, {
                                        fileName: "[project]/components/dashboard/tabs/record-transaction.tsx",
                                        lineNumber: 1803,
                                        columnNumber: 13
                                    }, this),
                                    "Recurring"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/dashboard/tabs/record-transaction.tsx",
                                lineNumber: 1802,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/dashboard/tabs/record-transaction.tsx",
                        lineNumber: 1793,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tabs$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TabsContent"], {
                        value: "create",
                        className: "mt-3",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                            className: "shadow-sm",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardHeader"], {
                                    className: "pb-3 pt-4",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardTitle"], {
                                        className: "text-sm",
                                        children: "Record New Transaction"
                                    }, void 0, false, {
                                        fileName: "[project]/components/dashboard/tabs/record-transaction.tsx",
                                        lineNumber: 1812,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/dashboard/tabs/record-transaction.tsx",
                                    lineNumber: 1811,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardContent"], {
                                    className: "pb-4",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                                        onSubmit: handleSubmit,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$dashboard$2f$tabs$2f$transaction$2d$management$2f$components$2f$TransactionForm$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TransactionForm"], {
                                                formData: formData,
                                                companies: companies,
                                                categories: categories,
                                                categoriesByType: categoriesByType,
                                                onFieldUpdate: updateField,
                                                onTaxCalculate: calculateTax,
                                                getCategoryDisplayName: getCategoryDisplayName
                                            }, void 0, false, {
                                                fileName: "[project]/components/dashboard/tabs/record-transaction.tsx",
                                                lineNumber: 1816,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex gap-2 mt-4",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                        type: "submit",
                                                        size: "sm",
                                                        disabled: createMutation.isPending,
                                                        className: "text-xs h-7",
                                                        children: createMutation.isPending ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                                                                    className: "h-3 w-3 mr-1 animate-spin"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/dashboard/tabs/record-transaction.tsx",
                                                                    lineNumber: 1836,
                                                                    columnNumber: 25
                                                                }, this),
                                                                "Recording..."
                                                            ]
                                                        }, void 0, true) : "Record Transaction"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/dashboard/tabs/record-transaction.tsx",
                                                        lineNumber: 1828,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                        type: "button",
                                                        variant: "outline",
                                                        size: "sm",
                                                        onClick: resetForm,
                                                        className: "text-xs h-7",
                                                        children: "Clear Form"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/dashboard/tabs/record-transaction.tsx",
                                                        lineNumber: 1843,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/dashboard/tabs/record-transaction.tsx",
                                                lineNumber: 1827,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/dashboard/tabs/record-transaction.tsx",
                                        lineNumber: 1815,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/dashboard/tabs/record-transaction.tsx",
                                    lineNumber: 1814,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/dashboard/tabs/record-transaction.tsx",
                            lineNumber: 1810,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/dashboard/tabs/record-transaction.tsx",
                        lineNumber: 1809,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tabs$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TabsContent"], {
                        value: "list",
                        className: "mt-3",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                            className: "shadow-sm",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardHeader"], {
                                    className: "pb-3 pt-4",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center justify-between",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardTitle"], {
                                                className: "text-sm",
                                                children: "All Transactions"
                                            }, void 0, false, {
                                                fileName: "[project]/components/dashboard/tabs/record-transaction.tsx",
                                                lineNumber: 1863,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Select"], {
                                                value: selectedCompany?.toString() || "all",
                                                onValueChange: (value)=>setSelectedCompany(value === "all" ? undefined : parseInt(value)),
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectTrigger"], {
                                                        className: "w-[180px] h-7 text-xs",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectValue"], {
                                                            placeholder: "Filter by company"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/dashboard/tabs/record-transaction.tsx",
                                                            lineNumber: 1873,
                                                            columnNumber: 21
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/dashboard/tabs/record-transaction.tsx",
                                                        lineNumber: 1872,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectContent"], {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectItem"], {
                                                                value: "all",
                                                                className: "text-xs",
                                                                children: "All Companies"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/dashboard/tabs/record-transaction.tsx",
                                                                lineNumber: 1876,
                                                                columnNumber: 21
                                                            }, this),
                                                            companies.map((company)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectItem"], {
                                                                    value: company.id.toString(),
                                                                    className: "text-xs",
                                                                    children: company.name
                                                                }, company.id, false, {
                                                                    fileName: "[project]/components/dashboard/tabs/record-transaction.tsx",
                                                                    lineNumber: 1880,
                                                                    columnNumber: 23
                                                                }, this))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/dashboard/tabs/record-transaction.tsx",
                                                        lineNumber: 1875,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/dashboard/tabs/record-transaction.tsx",
                                                lineNumber: 1864,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/dashboard/tabs/record-transaction.tsx",
                                        lineNumber: 1862,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/dashboard/tabs/record-transaction.tsx",
                                    lineNumber: 1861,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardContent"], {
                                    className: "pb-4",
                                    children: transactionsLoading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center justify-center py-8",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                                            className: "h-6 w-6 animate-spin text-primary"
                                        }, void 0, false, {
                                            fileName: "[project]/components/dashboard/tabs/record-transaction.tsx",
                                            lineNumber: 1895,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/components/dashboard/tabs/record-transaction.tsx",
                                        lineNumber: 1894,
                                        columnNumber: 17
                                    }, this) : regularTransactions.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-center py-6 text-xs text-muted-foreground",
                                        children: "No transactions found"
                                    }, void 0, false, {
                                        fileName: "[project]/components/dashboard/tabs/record-transaction.tsx",
                                        lineNumber: 1898,
                                        columnNumber: 17
                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "space-y-2",
                                        children: regularTransactions.map((transaction)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$dashboard$2f$tabs$2f$transaction$2d$management$2f$components$2f$TransactionListItem$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TransactionListItem"], {
                                                transaction: transaction,
                                                onEdit: handleEdit,
                                                onDelete: handleDelete,
                                                isDeleting: deleteMutation.isPending
                                            }, transaction.id, false, {
                                                fileName: "[project]/components/dashboard/tabs/record-transaction.tsx",
                                                lineNumber: 1904,
                                                columnNumber: 21
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/components/dashboard/tabs/record-transaction.tsx",
                                        lineNumber: 1902,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/dashboard/tabs/record-transaction.tsx",
                                    lineNumber: 1892,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/dashboard/tabs/record-transaction.tsx",
                            lineNumber: 1860,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/dashboard/tabs/record-transaction.tsx",
                        lineNumber: 1859,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tabs$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TabsContent"], {
                        value: "recurring",
                        className: "mt-3",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                            className: "shadow-sm",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardHeader"], {
                                    className: "pb-3 pt-4",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardTitle"], {
                                        className: "text-sm",
                                        children: "Recurring Transactions"
                                    }, void 0, false, {
                                        fileName: "[project]/components/dashboard/tabs/record-transaction.tsx",
                                        lineNumber: 1922,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/dashboard/tabs/record-transaction.tsx",
                                    lineNumber: 1921,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardContent"], {
                                    className: "pb-4",
                                    children: recurringTransactions.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-center py-6 text-xs text-muted-foreground",
                                        children: "No recurring transactions found"
                                    }, void 0, false, {
                                        fileName: "[project]/components/dashboard/tabs/record-transaction.tsx",
                                        lineNumber: 1926,
                                        columnNumber: 17
                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "space-y-2",
                                        children: recurringTransactions.map((transaction)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$dashboard$2f$tabs$2f$transaction$2d$management$2f$components$2f$RecurringTransactionItem$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RecurringTransactionItem"], {
                                                transaction: transaction,
                                                onEdit: handleEdit,
                                                onDelete: handleDelete,
                                                onExecute: (id)=>executeMutation.mutate(id),
                                                isExecuting: executeMutation.isPending
                                            }, transaction.id, false, {
                                                fileName: "[project]/components/dashboard/tabs/record-transaction.tsx",
                                                lineNumber: 1932,
                                                columnNumber: 21
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/components/dashboard/tabs/record-transaction.tsx",
                                        lineNumber: 1930,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/dashboard/tabs/record-transaction.tsx",
                                    lineNumber: 1924,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/dashboard/tabs/record-transaction.tsx",
                            lineNumber: 1920,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/dashboard/tabs/record-transaction.tsx",
                        lineNumber: 1919,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/dashboard/tabs/record-transaction.tsx",
                lineNumber: 1792,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Dialog"], {
                open: isEditDialogOpen,
                onOpenChange: setIsEditDialogOpen,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogContent"], {
                    className: "max-w-3xl max-h-[90vh] overflow-y-auto",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogHeader"], {
                            className: "pb-2",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogTitle"], {
                                className: "text-sm",
                                children: "Edit Transaction"
                            }, void 0, false, {
                                fileName: "[project]/components/dashboard/tabs/record-transaction.tsx",
                                lineNumber: 1952,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/dashboard/tabs/record-transaction.tsx",
                            lineNumber: 1951,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$dashboard$2f$tabs$2f$transaction$2d$management$2f$components$2f$TransactionForm$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TransactionForm"], {
                            formData: formData,
                            companies: companies,
                            categories: categories,
                            categoriesByType: categoriesByType,
                            onFieldUpdate: updateField,
                            onTaxCalculate: calculateTax,
                            getCategoryDisplayName: getCategoryDisplayName
                        }, void 0, false, {
                            fileName: "[project]/components/dashboard/tabs/record-transaction.tsx",
                            lineNumber: 1955,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogFooter"], {
                            className: "gap-2 pt-3 border-t",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                    variant: "outline",
                                    size: "sm",
                                    onClick: ()=>{
                                        setIsEditDialogOpen(false);
                                        setEditingTransaction(null);
                                        resetForm();
                                    },
                                    className: "text-xs h-7",
                                    children: "Cancel"
                                }, void 0, false, {
                                    fileName: "[project]/components/dashboard/tabs/record-transaction.tsx",
                                    lineNumber: 1966,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                    size: "sm",
                                    onClick: handleUpdate,
                                    disabled: updateMutation.isPending,
                                    className: "text-xs h-7",
                                    children: updateMutation.isPending ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                                                className: "h-3 w-3 mr-1 animate-spin"
                                            }, void 0, false, {
                                                fileName: "[project]/components/dashboard/tabs/record-transaction.tsx",
                                                lineNumber: 1986,
                                                columnNumber: 19
                                            }, this),
                                            "Updating..."
                                        ]
                                    }, void 0, true) : "Update Transaction"
                                }, void 0, false, {
                                    fileName: "[project]/components/dashboard/tabs/record-transaction.tsx",
                                    lineNumber: 1978,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/dashboard/tabs/record-transaction.tsx",
                            lineNumber: 1965,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/dashboard/tabs/record-transaction.tsx",
                    lineNumber: 1950,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/dashboard/tabs/record-transaction.tsx",
                lineNumber: 1949,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/dashboard/tabs/record-transaction.tsx",
        lineNumber: 1764,
        columnNumber: 5
    }, this);
}
_s(TransactionManagement, "9c+C5IrufO5hKGsnRvWFZQyke28=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"],
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"]
    ];
});
_c = TransactionManagement;
var _c;
__turbopack_context__.k.register(_c, "TransactionManagement");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=components_dashboard_tabs_record-transaction_tsx_f2e7bb8c._.js.map