// ============================================================================
// TYPE DEFINITIONS (matching actual API response)
// ============================================================================

export enum TransactionType {
  DEBIT = "debit",
  CREDIT = "credit",
}

export enum TransactionStatus {
  PENDING = "pending",
  COMPLETED = "completed",
  RECONCILED = "reconciled",
  CANCELLED = "cancelled",
}

export enum PaymentMethod {
  CASH = "cash",
  BANK_TRANSFER = "bank_transfer",
  CHEQUE = "cheque",
  MOBILE_MONEY = "mobile_money",
  CREDIT_CARD = "credit_card",
  DEBIT_CARD = "debit_card",
  OTHER = "other",
}

interface CategoryParent {
  id: number;
  code: string | null;
  name: string;
  level: string;
  categoryType: string | null;
  parent?: CategoryParent;
}

export interface TransactionCategory {
  id: number;
  code: string | null;
  name: string;
  description: string | null;
  level: string;
  categoryType: string | null;
  sortOrder: number;
  isActive: boolean;
  allowTransactions: boolean;
  parent?: CategoryParent;
}

export interface TransactionCompany {
  id: number;
  name: string;
  description: string | null;
  email: string;
  isActive: boolean;
}

interface TransactionCreator {
  id: number;
  name: string;
  email: string;
  role: string;
  profile?: {
    id: number;
    gender: string | null;
    position: string | null;
  };
}

export interface Transaction {
  id: number;
  date: string;
  transactionType: TransactionType;
  amount: string;
  description: string;
  referenceNumber: string | null;
  paymentMethod: PaymentMethod;
  status: TransactionStatus;
  counterparty: string | null;
  invoiceNumber: string | null;
  dueDate: string | null;
  taxAmount: string;
  taxRate: string;
  totalAmount: string;
  reconciledAt: string | null;
  notes: string | null;
  attachments: string[] | null;
  isRecurring: boolean;
  recurringFrequency: string | null;
  financialYear: number;
  financialPeriod: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  company: TransactionCompany;
  category: TransactionCategory;
  createdBy: TransactionCreator;
  categoryPath: string;
}

export interface LeafCategory {
  id: number;
  name: string;
  code: string | null;
  categoryType: string | null;
  level: string;
  allowTransactions: boolean;
  parent?: {
    id: number;
    name: string;
    parent?: {
      id: number;
      name: string;
    };
  };
}

export interface Company {
  id: number;
  name: string;
  description: string | null;
  employeeCount: number;
  establishedDate: string | null;
  companyType: string;
  industry: string;
  email: string;
  phoneNumber: string | null;
  website: string | null;
  taxId: string | null;
  registrationNumber: string | null;
  isActive: boolean;
  annualRevenue: number | null;
  ceo: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface CreateTransactionDto {
  companyId: number;
  date: string;
  transactionType: TransactionType;
  amount: number;
  description: string;
  categoryId: number;
  referenceNumber?: string;
  paymentMethod?: PaymentMethod;
  status?: TransactionStatus;
  counterparty?: string;
  invoiceNumber?: string;
  dueDate?: string;
  taxRate?: number;
  taxAmount?: number;
  notes?: string;
  attachments?: string[];
  isRecurring?: boolean;
  recurringFrequency?: string;
  createdBy: number;
}
