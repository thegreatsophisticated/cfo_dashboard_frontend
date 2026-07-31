// Enhanced API functions for transactions and financial reports
// This extends the existing api.ts file with proper transaction and report integrations

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || ""

// Transaction Types
export interface TransactionPayload {
  companyId: number
  date: string
  transactionType: "debit" | "credit"
  amount: number
  description: string
  categoryId: number
  taxRate?: number
  taxAmount?: number
  totalAmount?: number
  paymentMethod?: "cash" | "bank_transfer" | "mobile_money" | "cheque" | "credit_card"
  status?: "pending" | "completed" | "cancelled"
  counterparty?: string
  invoiceNumber?: string
  referenceNumber?: string
  dueDate?: string
  notes?: string
  attachments?: string[]
  isRecurring?: boolean
  recurringFrequency?: "daily" | "weekly" | "monthly" | "quarterly" | "yearly"
  createdBy: number
}

export interface TransactionResponse extends TransactionPayload {
  id: number
  createdAt: string
  updatedAt: string
  deletedAt?: string | null
  category?: {
    id: number
    name: string
    code: string
    categoryType: string
  }
  company?: {
    id: number
    name: string
  }
}

export interface IncomeStatementReport {
  companyId: number
  companyName: string
  year: number
  period: string
  revenue: {
    tradingRevenue: number
    serviceRevenue: number
    rentRevenue: number
    interestIncome: number
    commissionIncome: number
    otherIncome: number
    totalRevenue: number
  }
  expenses: {
    salariesWages: number
    rent: number
    utilities: number
    officeSupplies: number
    telephoneInternet: number
    insurance: number
    depreciation: number
    advertising: number
    travelExpenses: number
    entertainment: number
    otherExpenses: number
    totalExpenses: number
  }
  costOfSales: {
    purchases: number
    directLabor: number
    manufacturingOverhead: number
    totalCostOfSales: number
  }
  grossProfit: number
  operatingProfit: number
  netProfit: number
  profitMargin: number
}

export interface BalanceSheetReport {
  companyId: number
  companyName: string
  asOfDate: string
  assets: {
    currentAssets: {
      cashAtBank: number
      pettyCash: number
      mobileMoney: number
      tradeDebtors: number
      inventory: number
      totalCurrentAssets: number
    }
    fixedAssets: {
      land: number
      buildings: number
      motorVehicles: number
      furnitureFittings: number
      officeEquipment: number
      computerEquipment: number
      accumulatedDepreciation: number
      totalFixedAssets: number
    }
    totalAssets: number
  }
  liabilities: {
    currentLiabilities: {
      tradeCreditors: number
      bankOverdraft: number
      shortTermLoans: number
      totalCurrentLiabilities: number
    }
    longTermLiabilities: {
      longTermLoans: number
      totalLongTermLiabilities: number
    }
    totalLiabilities: number
  }
  equity: {
    shareCapital: number
    retainedEarnings: number
    currentYearProfit: number
    totalEquity: number
  }
  totalLiabilitiesAndEquity: number
}

export interface CashBookReport {
  companyId: number
  companyName: string
  startDate: string
  endDate: string
  openingBalance: number
  receipts: Array<{
    date: string
    description: string
    category: string
    amount: number
    reference?: string
  }>
  payments: Array<{
    date: string
    description: string
    category: string
    amount: number
    reference?: string
  }>
  totalReceipts: number
  totalPayments: number
  closingBalance: number
  netChange: number
}

export interface CompanyComparisonReport {
  year: number
  period: string
  companies: Array<{
    id: number
    name: string
    revenue: number
    expenses: number
    profit: number
    profitMargin: number
    cashBalance: number
    assets: number
    liabilities: number
    equity: number
  }>
  totals: {
    revenue: number
    expenses: number
    profit: number
    cashBalance: number
    assets: number
    liabilities: number
    equity: number
  }
}

// Transaction API Functions
export async function createTransaction(data: TransactionPayload): Promise<TransactionResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/transactions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || `Failed to create transaction: ${response.status}`)
    }
    
    return response.json()
  } catch (error) {
    console.error("Error creating transaction:", error)
    throw error
  }
}

export async function fetchAllTransactions(): Promise<TransactionResponse[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/transactions`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
    
    if (!response.ok) {
      throw new Error(`Failed to fetch transactions: ${response.status}`)
    }
    
    return response.json()
  } catch (error) {
    console.error("Error fetching transactions:", error)
    throw error
  }
}

export async function fetchCompanyTransactions(companyId: number): Promise<TransactionResponse[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/transactions/company/${companyId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
    
    if (!response.ok) {
      throw new Error(`Failed to fetch company transactions: ${response.status}`)
    }
    
    return response.json()
  } catch (error) {
    console.error("Error fetching company transactions:", error)
    throw error
  }
}

export async function fetchRecurringTransactions(): Promise<TransactionResponse[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/transactions/recurring`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
    
    if (!response.ok) {
      throw new Error(`Failed to fetch recurring transactions: ${response.status}`)
    }
    
    return response.json()
  } catch (error) {
    console.error("Error fetching recurring transactions:", error)
    throw error
  }
}

export async function executeRecurringTransaction(transactionId: number): Promise<TransactionResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/transactions/recurring/${transactionId}/execute`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    })
    
    if (!response.ok) {
      throw new Error(`Failed to execute recurring transaction: ${response.status}`)
    }
    
    return response.json()
  } catch (error) {
    console.error("Error executing recurring transaction:", error)
    throw error
  }
}

// Financial Reports API Functions
export async function fetchIncomeStatement(
  companyId: number,
  year: number
): Promise<IncomeStatementReport> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/transactions/reports/income-statement/${companyId}?year=${year}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    )
    
    if (!response.ok) {
      throw new Error(`Failed to fetch income statement: ${response.status}`)
    }
    
    return response.json()
  } catch (error) {
    console.error("Error fetching income statement:", error)
    throw error
  }
}

export async function fetchBalanceSheet(
  companyId: number,
  asOfDate: string
): Promise<BalanceSheetReport> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/transactions/reports/balance-sheet/${companyId}?asOfDate=${asOfDate}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    )
    
    if (!response.ok) {
      throw new Error(`Failed to fetch balance sheet: ${response.status}`)
    }
    
    return response.json()
  } catch (error) {
    console.error("Error fetching balance sheet:", error)
    throw error
  }
}

export async function fetchCashBook(
  companyId: number,
  startDate: string,
  endDate: string
): Promise<CashBookReport> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/transactions/reports/cash-book/${companyId}?startDate=${startDate}&endDate=${endDate}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    )
    
    if (!response.ok) {
      throw new Error(`Failed to fetch cash book: ${response.status}`)
    }
    
    return response.json()
  } catch (error) {
    console.error("Error fetching cash book:", error)
    throw error
  }
}

// Global Reports API Functions
export async function fetchGlobalIncomeStatement(year: number): Promise<IncomeStatementReport> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/transactions/reports/global/income-statement?year=${year}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    )
    
    if (!response.ok) {
      throw new Error(`Failed to fetch global income statement: ${response.status}`)
    }
    
    return response.json()
  } catch (error) {
    console.error("Error fetching global income statement:", error)
    throw error
  }
}

export async function fetchGlobalBalanceSheet(asOfDate: string): Promise<BalanceSheetReport> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/transactions/reports/global/balance-sheet?asOfDate=${asOfDate}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    )
    
    if (!response.ok) {
      throw new Error(`Failed to fetch global balance sheet: ${response.status}`)
    }
    
    return response.json()
  } catch (error) {
    console.error("Error fetching global balance sheet:", error)
    throw error
  }
}

export async function fetchCompanyComparison(year: number): Promise<CompanyComparisonReport> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/transactions/reports/global/company-comparison?year=${year}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    )
    
    if (!response.ok) {
      throw new Error(`Failed to fetch company comparison: ${response.status}`)
    }
    
    return response.json()
  } catch (error) {
    console.error("Error fetching company comparison:", error)
    throw error
  }
}

// Utility function to format currency
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-RW", {
    style: "currency",
    currency: "RWF",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

// Utility function to format date
export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("en-RW", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

// Utility function to calculate percentage change
export function calculatePercentageChange(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0
  return ((current - previous) / previous) * 100
}