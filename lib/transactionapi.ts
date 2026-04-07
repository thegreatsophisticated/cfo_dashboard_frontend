// API Base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || ""

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export enum TransactionType {
  DEBIT = 'debit',
  CREDIT = 'credit',
}

export enum TransactionStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  RECONCILED = 'reconciled',
  CANCELLED = 'cancelled',
}

export enum PaymentMethod {
  CASH = 'cash',
  BANK_TRANSFER = 'bank_transfer',
  CHEQUE = 'cheque',
  MOBILE_MONEY = 'mobile_money',
  CREDIT_CARD = 'credit_card',
  DEBIT_CARD = 'debit_card',
  OTHER = 'other',
}

export interface CreateTransactionDto {
  companyId: number
  date: string
  transactionType: TransactionType
  amount: number
  description: string
  categoryId: number
  referenceNumber?: string
  paymentMethod?: PaymentMethod
  status?: TransactionStatus
  counterparty?: string
  invoiceNumber?: string
  dueDate?: string
  taxRate?: number
  taxAmount?: number
  notes?: string
  attachments?: string[]
  isRecurring?: boolean
  recurringFrequency?: string
  createdBy: number
}

export interface UpdateTransactionDto {
  date?: string
  transactionType?: TransactionType
  amount?: number
  description?: string
  categoryId?: number
  referenceNumber?: string
  paymentMethod?: PaymentMethod
  status?: TransactionStatus
  counterparty?: string
  invoiceNumber?: string
  dueDate?: string
  taxRate?: number
  taxAmount?: number
  notes?: string
  attachments?: string[]
}

interface CategoryParent {
  id: number
  code: string | null
  name: string
  level: string
  categoryType: string | null
  parent?: CategoryParent
}

interface TransactionCategory {
  id: number
  code: string | null
  name: string
  description: string | null
  level: string
  categoryType: string | null
  sortOrder: number
  isActive: boolean
  allowTransactions: boolean
  parent?: CategoryParent
}

interface TransactionCompany {
  id: number
  name: string
  description: string | null
  email: string
  phoneNumber: string | null
  isActive: boolean
}

interface TransactionCreator {
  id: number
  name: string
  email: string
  role: string
  profile?: {
    id: number
    gender: string | null
    position: string | null
  }
}

export interface Transaction {
  id: number
  date: string
  transactionType: TransactionType
  amount: string
  description: string
  referenceNumber: string | null
  paymentMethod: PaymentMethod
  status: TransactionStatus
  counterparty: string | null
  invoiceNumber: string | null
  dueDate: string | null
  taxAmount: string
  taxRate: string
  totalAmount: string
  reconciledAt: string | null
  notes: string | null
  attachments: string[] | null
  isRecurring: boolean
  recurringFrequency: string | null
  financialYear: number
  financialPeriod: number
  createdAt: string
  updatedAt: string
  deletedAt: string | null
  company: TransactionCompany
  category: TransactionCategory
  createdBy: TransactionCreator
  categoryPath: string
}

// ============================================================================
// TRANSACTION API FUNCTIONS
// ============================================================================

/**
 * Create a new transaction
 */
export async function createTransaction(data: CreateTransactionDto): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/transactions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || "Failed to create transaction")
  }
  
  return response.json()
}

/**
 * Get all transactions
 */
export async function fetchAllTransactions(): Promise<Transaction[]> {
  const response = await fetch(`${API_BASE_URL}/transactions`)
  
  if (!response.ok) {
    throw new Error("Failed to fetch transactions")
  }
  
  const data = await response.json()
  return data.transactions || []
}

/**
 * Get transaction by ID
 */
export async function fetchTransactionById(id: number): Promise<Transaction> {
  const response = await fetch(`${API_BASE_URL}/transactions/${id}`)
  
  if (!response.ok) {
    throw new Error("Failed to fetch transaction")
  }
  
  const data = await response.json()
  return data.transaction
}

/**
 * Get transactions by company
 */
export async function fetchTransactionsByCompany(companyId: number): Promise<Transaction[]> {
  const response = await fetch(`${API_BASE_URL}/transactions/company/${companyId}`)
  
  if (!response.ok) {
    throw new Error("Failed to fetch company transactions")
  }
  
  const data = await response.json()
  return data.transactions || []
}

/**
 * Get transactions by category
 */
export async function fetchTransactionsByCategory(categoryId: number): Promise<Transaction[]> {
  const response = await fetch(`${API_BASE_URL}/transactions/category/${categoryId}`)
  
  if (!response.ok) {
    throw new Error("Failed to fetch category transactions")
  }
  
  const data = await response.json()
  return data.transactions || []
}

/**
 * Get transactions by date range
 */
export async function fetchTransactionsByDateRange(
  companyId: number,
  startDate: string,
  endDate: string
): Promise<Transaction[]> {
  const response = await fetch(
    `${API_BASE_URL}/transactions/company/${companyId}/date-range?startDate=${startDate}&endDate=${endDate}`
  )
  
  if (!response.ok) {
    throw new Error("Failed to fetch transactions by date range")
  }
  
  const data = await response.json()
  return data.transactions || []
}

/**
 * Update a transaction
 */
export async function updateTransaction(
  id: number,
  data: UpdateTransactionDto
): Promise<Transaction> {
  const response = await fetch(`${API_BASE_URL}/transactions/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || "Failed to update transaction")
  }
  
  const result = await response.json()
  return result.transaction
}

/**
 * Delete a transaction (soft delete)
 */
export async function deleteTransaction(id: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/transactions/${id}`, {
    method: "DELETE",
  })
  
  if (!response.ok) {
    throw new Error("Failed to delete transaction")
  }
}

// ============================================================================
// RECURRING TRANSACTIONS
// ============================================================================

/**
 * Get all recurring transactions
 */
export async function fetchRecurringTransactions(): Promise<Transaction[]> {
  const response = await fetch(`${API_BASE_URL}/transactions/recurring`)
  
  if (!response.ok) {
    throw new Error("Failed to fetch recurring transactions")
  }
  
  const data = await response.json()
  return data.transactions || []
}

/**
 * Get recurring transactions by company
 */
export async function fetchRecurringTransactionsByCompany(
  companyId: number
): Promise<Transaction[]> {
  const response = await fetch(`${API_BASE_URL}/transactions/recurring/company/${companyId}`)
  
  if (!response.ok) {
    throw new Error("Failed to fetch recurring transactions")
  }
  
  const data = await response.json()
  return data.transactions || []
}

/**
 * Execute a recurring transaction
 */
export async function executeRecurringTransaction(id: number): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/transactions/recurring/${id}/execute`, {
    method: "POST",
  })
  
  if (!response.ok) {
    throw new Error("Failed to execute recurring transaction")
  }
  
  return response.json()
}

// ============================================================================
// FINANCIAL REPORTS
// ============================================================================

/**
 * Get Income Statement for a company
 */
export async function fetchIncomeStatement(companyId: number, year: number): Promise<any> {
  const response = await fetch(
    `${API_BASE_URL}/transactions/reports/income-statement/${companyId}?year=${year}`
  )
  
  if (!response.ok) {
    throw new Error("Failed to fetch income statement")
  }
  
  return response.json()
}

/**
 * Get Balance Sheet for a company
 */
export async function fetchBalanceSheet(companyId: number, asOfDate: string): Promise<any> {
  const response = await fetch(
    `${API_BASE_URL}/transactions/reports/balance-sheet/${companyId}?asOfDate=${asOfDate}`
  )
  
  if (!response.ok) {
    throw new Error("Failed to fetch balance sheet")
  }
  
  return response.json()
}

/**
 * Get Cash Book for a company
 */
export async function fetchCashBook(
  companyId: number,
  startDate: string,
  endDate: string
): Promise<any> {
  const response = await fetch(
    `${API_BASE_URL}/transactions/reports/cash-book/${companyId}?startDate=${startDate}&endDate=${endDate}`
  )
  
  if (!response.ok) {
    throw new Error("Failed to fetch cash book")
  }
  
  return response.json()
}

/**
 * Get Global Income Statement (all companies)
 */
export async function fetchGlobalIncomeStatement(year: number): Promise<any> {
  const response = await fetch(
    `${API_BASE_URL}/transactions/reports/global/income-statement?year=${year}`
  )
  
  if (!response.ok) {
    throw new Error("Failed to fetch global income statement")
  }
  
  return response.json()
}

/**
 * Get Global Balance Sheet (all companies)
 */
export async function fetchGlobalBalanceSheet(asOfDate: string): Promise<any> {
  const response = await fetch(
    `${API_BASE_URL}/transactions/reports/global/balance-sheet?asOfDate=${asOfDate}`
  )
  
  if (!response.ok) {
    throw new Error("Failed to fetch global balance sheet")
  }
  
  return response.json()
}

/**
 * Get Global Cash Book (all companies)
 */
export async function fetchGlobalCashBook(startDate: string, endDate: string): Promise<any> {
  const response = await fetch(
    `${API_BASE_URL}/transactions/reports/global/cash-book?startDate=${startDate}&endDate=${endDate}`
  )
  
  if (!response.ok) {
    throw new Error("Failed to fetch global cash book")
  }
  
  return response.json()
}

/**
 * Get Global Financial Summary
 */
export async function fetchGlobalFinancialSummary(year: number): Promise<any> {
  const response = await fetch(
    `${API_BASE_URL}/transactions/reports/global/financial-summary?year=${year}`
  )
  
  if (!response.ok) {
    throw new Error("Failed to fetch global financial summary")
  }
  
  return response.json()
}

/**
 * Get Company Comparison
 */
export async function fetchCompanyComparison(year: number): Promise<any> {
  const response = await fetch(
    `${API_BASE_URL}/transactions/reports/global/company-comparison?year=${year}`
  )
  
  if (!response.ok) {
    throw new Error("Failed to fetch company comparison")
  }
  
  return response.json()
}

// ============================================================================
// CATEGORY API FUNCTIONS
// ============================================================================

export type CategoryLevel = "main" | "sub" | "sub_sub"
export type CategoryType = "asset" | "liability" | "equity" | "revenue" | "expense" | "cost_of_sales" | null

export interface Category {
  id: number
  code: string | null
  name: string
  description: string | null
  level: CategoryLevel
  categoryType: CategoryType
  sortOrder: number
  isActive: boolean
  allowTransactions: boolean
  createdAt: string
  updatedAt: string
  deletedAt: string | null
  parent?: Category
  children?: Category[]
}

/**
 * Get all leaf categories (transaction-level categories)
 */
export async function fetchLeafCategories(): Promise<Category[]> {
  const response = await fetch(`${API_BASE_URL}/categories/leaf`)
  
  if (!response.ok) {
    throw new Error("Failed to fetch leaf categories")
  }
  
  return response.json()
}

/**
 * Get full category tree
 */
export async function fetchCategoryTree(): Promise<Category[]> {
  const response = await fetch(`${API_BASE_URL}/categories/tree`)
  
  if (!response.ok) {
    throw new Error("Failed to fetch category tree")
  }
  
  return response.json()
}

// ============================================================================
// COMPANY API FUNCTIONS
// ============================================================================

export interface Company {
  id: number
  name: string
  description: string | null
  employeeCount: number
  companyType: string
  industry: string
  email: string
  phoneNumber: string | null
  website: string | null
  isActive: boolean
  createdAt: string
}

/**
 * Get all companies
 */
export async function fetchCompanies(): Promise<Company[]> {
  const response = await fetch(`${API_BASE_URL}/company`)
  
  if (!response.ok) {
    throw new Error("Failed to fetch companies")
  }
  
  const data = await response.json()
  return data.companies || []
}

/**
 * Get company by ID
 */
export async function fetchCompanyById(id: number): Promise<Company> {
  const response = await fetch(`${API_BASE_URL}/company/${id}`)
  
  if (!response.ok) {
    throw new Error("Failed to fetch company")
  }
  
  const data = await response.json()
  return data.company
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Format currency (RWF)
 */
export function formatCurrency(amount: number): string {
  return `RWF ${amount.toLocaleString('en-RW', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`
}

/**
 * Format date
 */
export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-RW', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

/**
 * Get transaction type label
 */
export function getTransactionTypeLabel(type: TransactionType): string {
  return type === TransactionType.DEBIT ? 'Income' : 'Expense'
}

/**
 * Get transaction status badge variant
 */
export function getStatusVariant(status: TransactionStatus): 'default' | 'secondary' | 'destructive' {
  switch (status) {
    case TransactionStatus.COMPLETED:
      return 'default'
    case TransactionStatus.RECONCILED:
      return 'secondary'
    case TransactionStatus.PENDING:
      return 'secondary'
    case TransactionStatus.CANCELLED:
      return 'destructive'
    default:
      return 'default'
  }
}

/**
 * Calculate total amount with tax
 */
export function calculateTotalAmount(amount: number, taxRate: number = 0): number {
  const taxAmount = (amount * taxRate) / 100
  return amount + taxAmount
}

/**
 * Group transactions by period
 */
export function groupTransactionsByPeriod(
  transactions: Transaction[],
  period: 'day' | 'week' | 'month' | 'year' = 'month'
): Record<string, Transaction[]> {
  return transactions.reduce((acc, transaction) => {
    const date = new Date(transaction.date)
    let key: string
    
    switch (period) {
      case 'day':
        key = date.toISOString().split('T')[0]
        break
      case 'week':
        const weekNumber = Math.ceil(date.getDate() / 7)
        key = `${date.getFullYear()}-W${weekNumber}`
        break
      case 'month':
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
        break
      case 'year':
        key = String(date.getFullYear())
        break
    }
    
    if (!acc[key]) {
      acc[key] = []
    }
    acc[key].push(transaction)
    
    return acc
  }, {} as Record<string, Transaction[]>)
}

/**
 * Calculate summary statistics from transactions
 */
export function calculateTransactionStats(transactions: Transaction[]) {
  const income = transactions
    .filter(t => t.transactionType === TransactionType.DEBIT)
    .reduce((sum, t) => sum + Number(t.totalAmount), 0)
  
  const expenses = transactions
    .filter(t => t.transactionType === TransactionType.CREDIT)
    .reduce((sum, t) => sum + Number(t.totalAmount), 0)
  
  const netPosition = income - expenses
  
  return {
    income,
    expenses,
    netPosition,
    transactionCount: transactions.length,
    incomeCount: transactions.filter(t => t.transactionType === TransactionType.DEBIT).length,
    expenseCount: transactions.filter(t => t.transactionType === TransactionType.CREDIT).length,
  }
}