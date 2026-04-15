// API Base URL - Use NEXT_PUBLIC_ prefix for client-side access
// Set this in the v0 sidebar: Vars -> Add -> NEXT_PUBLIC_API_BASE_URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";
import { fetchWithAuth } from "./fetchWithAuth"

const USER_STORAGE_TOKENS = "irebe_tokens";

// =====================================================
// TYPE DEFINITIONS
// =====================================================

export interface GlobalIncomeStatementResponse {
  status: number;
  message: string;
  summary: {
    period: number;
    totalCompanies: number;
    totalRevenue: number;
    totalCostOfSales: number;
    totalGrossProfit: number;
    totalOperatingExpenses: number;
    totalNetProfit: number;
    averageProfitMargin: string;
  };
  companies: Array<{
    companyId: number;
    companyName: string;
    revenue: number;
    costOfSales: number;
    grossProfit: number;
    operatingExpenses: number;
    netProfit: number;
    profitMargin: string;
  }>;
}

export interface GlobalBalanceSheetResponse {
  status: number;
  message: string;
  summary: {
    asOfDate: string;
    totalCompanies: number;
    totalAssets: number;
    totalLiabilities: number;
    totalEquity: number;
    balanceCheck: string;
  };
  companies: Array<{
    companyId: number;
    companyName: string;
    totalAssets: number;
    totalLiabilities: number;
    totalEquity: number;
    retainedEarnings: number;
    balanceCheck: string;
  }>;
}

export interface CompanyComparisonResponse {
  status: number;
  message: string;
  summary: {
    year: number;
    totalCompanies: number;
    topPerformers: {
      byRevenue: Array<CompanyPerformance>;
      byProfit: Array<CompanyPerformance>;
      byProfitMargin: Array<CompanyPerformance>;
    };
    allCompanies: Array<CompanyPerformance>;
  };
}

interface CompanyPerformance {
  companyId: number;
  companyName: string;
  revenue: number;
  expenses: number;
  costOfSales: number;
  grossProfit: number;
  netProfit: number;
  profitMargin: string;
  assets: number;
  liabilities: number;
  equity: number;
  transactionCount: number;
  averageTransactionSize: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: "admin" | "cfo" | "accountant" | "viewer";
  avatar?: string;
  createdAt: string;
}

export interface CompanyCreator {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  profile: {
    id: number;
    gender: string | null;
    maritalStatus: string | null;
    position: string | null;
    dateOfBirth: string | null;
    profileImage: string | null;
  } | null;
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
  createdBy: CompanyCreator | null;
  cashBalance?: string;
  todayProfit?: string;
}

interface CompaniesApiResponse {
  status: number;
  message: string;
  count: number;
  companies: Company[];
  data?: Company[];
}

export interface Transaction {
  date: string;
  company: string;
  description: string;
  type: "income" | "expense";
  amount: string;
}

export interface TransactionRecord {
  id: number;
  companyId: number;
  categoryId: number;
  date: string;           // ← was transactionDate
  description: string;
  amount: number;
  transactionType: "debit" | "credit";
  referenceNumber: string | null;
  notes: string | null;
  isReconciled: boolean;
  attachments: string[] | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  company?: Company;
  category?: Category;
}

export interface RecurringTransaction {
  id: number;
  companyId: number;
  categoryId: number;
  description: string;
  amount: number;
  transactionType: "debit" | "credit";
  frequency: "daily" | "weekly" | "monthly" | "quarterly" | "yearly";
  startDate: string;
  endDate: string | null;
  nextExecutionDate: string;
  lastExecutionDate: string | null;
  isActive: boolean;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  company?: Company;
  category?: Category;
}

export interface CreateTransactionDto {
  companyId: number;
  categoryId: number;
  date: string;           // ← was transactionDate
  description: string;
  amount: number;
  transactionType: "debit" | "credit";
  referenceNumber?: string;
  notes?: string;
 attachments?: string[];
}

export interface CreateRecurringTransactionDto {
  companyId: number;
  categoryId: number;
  description: string;
  amount: number;
  transactionType: "debit" | "credit";
  frequency: "daily" | "weekly" | "monthly" | "quarterly" | "yearly";
  startDate: string;
  endDate?: string;
  notes?: string;
}

export interface CashBookEntry {
  date: string;
  description: string;
  referenceNumber: string | null;
  debit: number;
  credit: number;
  balance: number;
}

export interface CashBook {
  companyId: number;
  companyName: string;
  startDate: string;
  endDate: string;
  openingBalance: number;
  closingBalance: number;
  entries: CashBookEntry[];
}



// export interface GlobalFinancialSummary {
//   status: number;
//   message: string;
//   year: number;
//   summary: {
//     totalCompanies: number;
//     totalRevenue: number;
//     totalExpenses: number;
//     totalNetProfit: number;
//     averageProfitMargin: string;
//     totalAssets: number;
//     totalLiabilities: number;
//     totalEquity: number;
//   };
//   companies: Array<{
//     companyId: number;
//     companyName: string;
//     revenue: number;
//     expenses: number;
//     netProfit: number;
//     profitMargin: string;
//     assets: number;
//     liabilities: number;
//     equity: number;
//   }>;
// }
export interface GlobalFinancialSummary {
  status: number;
  message: string;
  year: number;
  totalTransactions: number;
  summary: {
    totalCompanies: number;
    totalTransactions: number;
    // Flat fields (original)
    totalRevenue: number;
    totalExpenses: number;
    totalNetProfit: number;
    averageProfitMargin: string;
    totalAssets: number;
    totalLiabilities: number;
    totalEquity: number;
    // Nested fields (used by dashboard-overview)
    netProfit: number;
    revenue: {
      total: number;
      averagePerCompany: number;
      breakdown: Array<{ category: string; amount: number; count: number }>;
    };
    expenses: {
      total: number;
      averagePerCompany: number;
      breakdown: Array<{ category: string; amount: number; count: number }>;
    };
    analytics: {
      financialRatios: {
        profitMargin: string;
        grossProfitMargin: string;
        debtToAssetRatio: string;
        currentRatio: string;
      };
      cashFlowAnalysis: {
        netCashFlow: number;
        cashInTransactions: number;
        cashOutTransactions: number;
      };
      monthlyTrends: Array<{
        month: number;
        revenue: number;
        expenses: number;
        netIncome: number;
      }>;
      companyPerformance: Array<{
        companyId: number;
        companyName: string;
        transactionCount: number;
        totalVolume: number;
        netIncome: number;
      }>;
      counterpartyAnalysis: Array<{
        name: string;
        transactionCount: number;
        totalAmount: number;
        revenue: number;
        expenses: number;
      }>;
      taxAnalysis: {
        totalTaxCollected: number;
        averageTaxRate: string;
        taxByCategory: Array<{
          category: string;
          totalTax: number;
          averageTaxRate: string;
        }>;
      };
    };
  };
  companies: Array<{
    companyId: number;
    companyName: string;
    revenue: number;
    expenses: number;
    netProfit: number;
    profitMargin: string;
    assets: number;
    liabilities: number;
    equity: number;
  }>;
}

export type CategoryLevel = "main" | "sub" | "sub_sub";
export type CategoryType =
  | "asset"
  | "liability"
  | "equity"
  | "income"
  | "expense"
  | null;

export interface Category {
  id: number;
  code: string | null;
  name: string;
  description: string | null;
  level: CategoryLevel;
  categoryType: CategoryType;
  sortOrder: number;
  isActive: boolean;
  allowTransactions: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  parent?: Category;
  children?: Category[];
  createdBy?: CompanyCreator | null;
}

export interface CreateCategoryDto {
  code: string;
  name: string;
  description?: string;
  level: CategoryLevel;
  categoryType: CategoryType;
  parentId?: number;
  sortOrder?: number;
  isActive?: boolean;
}

export interface CreateSubSubCategoryDto {
  code: string;
  name: string;
  description?: string;
  subCategoryId: number;
  sortOrder?: number;
}

export interface CompanyTransaction {
  time: string;
  description: string;
  category: string;
  type: "income" | "expense";
  amount: string;
}

// =====================================================
// HELPER FUNCTIONS
// =====================================================

/**
 * Get authentication tokens from localStorage
 */
function getAuthTokens(): { accessToken: string; refreshToken: string } | null {
  if (typeof window === "undefined") return null;

  try {
    const storedTokens = localStorage.getItem(USER_STORAGE_TOKENS);
    if (!storedTokens) return null;
    return JSON.parse(storedTokens);
  } catch (error) {
    console.error("Failed to parse auth tokens:", error);
    return null;
  }
}

/**
 * Get authorization header with access token
 */
function getAuthHeaders(): HeadersInit {
  const tokens = getAuthTokens();

  if (tokens?.accessToken) {
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${tokens.accessToken}`,
    };
  }
  return {
    "Content-Type": "application/json",
  };
}

async function apiCall<T>(endpoint: string, options?: RequestInit): Promise<T> {
  if (!API_BASE_URL) {
    throw new Error("API_BASE_URL is not configured");
  }

  // Use fetchWithAuth instead of native fetch
  const response = await fetchWithAuth(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `API error: ${response.status}`);
  }

  return response.json();
}

// =====================================================
// DASHBOARD API FUNCTIONS
// =====================================================

export async function fetchDashboardStats() {
  return apiCall<{
    totalCash: string;
    dailyRevenue: string;
    dailyExpenses: string;
    netProfit: string;
  }>("/api/dashboard/stats");
}

export async function fetchRecentTransactions(): Promise<Transaction[]> {
  return apiCall<Transaction[]>("/transactions/recent");
}

export async function fetchConsolidatedIncome() {
  return apiCall<{
    revenue: {
      construction: string;
      trading: string;
      logistics: string;
      tech: string;
      total: string;
    };
    expenses: {
      salaries: string;
      materials: string;
      transport: string;
      rent: string;
      marketing: string;
      other: string;
      total: string;
    };
    netProfit: string;
  }>("/reports/consolidated-income");
}

// =====================================================
// COMPANY API FUNCTIONS
// =====================================================

export async function fetchCompanies(): Promise<Company[]> {
  try {
    // Use fetchWithAuth instead of native fetch
    const response = await fetchWithAuth(`${API_BASE_URL}company`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch companies: ${response.status}`);
    }

    const data: CompaniesApiResponse = await response.json();
    return data?.data || data?.companies || [];
  } catch (error) {
    console.error("Error fetching companies:", error);
    throw error;
  }
}

export async function fetchCompanyById(id: number): Promise<Company> {
  try {
    // Use fetchWithAuth instead of native fetch
    const response = await fetchWithAuth(`${API_BASE_URL}company/${id}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch company: ${response.status}`);
    }

    const data = await response.json();
    return data.company || data;
  } catch (error) {
    console.error("Error fetching company:", error);
    throw error;
  }
}

export async function fetchCompanyDetail(companyId: string) {
  return apiCall<{
    id: number;
    name: string;
    description: string | null;
    openingBalance: string;
    closingBalance: string;
    netChange: string;
    revenueTransactions: number;
    expenseTransactions: number;
    transactions: CompanyTransaction[];
  }>(`/company/${companyId}/detail`);
}

export async function createCompany(data: {
  name: string;
  description?: string;
  employeeCount?: number;
  establishedDate?: string;
  companyType: string;
  industry?: string;
  email?: string;
  phoneNumber?: string;
  website?: string;
  taxId?: string;
  registrationNumber?: string;
  annualRevenue?: number;
  ceo?: string;
  notes?: string;
  createdBy: number;
}): Promise<Company> {
  try {
    // Use fetchWithAuth instead of native fetch
    const response = await fetchWithAuth(`${API_BASE_URL}company/create`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Failed to create company: ${response.status}`
      );
    }

    const result = await response.json();
    return result.company;
  } catch (error) {
    console.error("Error creating company:", error);
    throw error;
  }
}

export async function updateCompany(
  id: number,
  data: Partial<{
    name: string;
    description?: string;
    employeeCount?: number;
    establishedDate?: string;
    companyType: string;
    industry?: string;
    email?: string;
    phoneNumber?: string;
    website?: string;
    taxId?: string;
    registrationNumber?: string;
    annualRevenue?: number;
    ceo?: string;
    notes?: string;
    createdBy?: number;
  }>
): Promise<Company> {
  try {
    // Use fetchWithAuth instead of native fetch
    const response = await fetchWithAuth(`${API_BASE_URL}company/${id}`, {
      method: "PATCH",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Failed to update company: ${response.status}`
      );
    }

    const result = await response.json();
    return result.company;
  } catch (error) {
    console.error("Error updating company:", error);
    throw error;
  }
}

export async function deleteCompany(id: number): Promise<void> {
  try {
    // Use fetchWithAuth instead of native fetch
    const response = await fetchWithAuth(`${API_BASE_URL}company/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Failed to delete company: ${response.status}`
      );
    }
  } catch (error) {
    console.error("Error deleting company:", error);
    throw error;
  }
}

// =====================================================
// TRANSACTION API FUNCTIONS
// =====================================================

export async function fetchTransactions() {
  try {
    // Use fetchWithAuth instead of native fetch
    const response = await fetchWithAuth(`${API_BASE_URL}transactions`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    const transactions = await response.json();
    console.log("Fetched transactions:", transactions);
    if (!response.ok)
      throw new Error(`Failed to fetch transactions: ${response.status}`);
    return transactions;
  } catch (error) {
    console.error("Error fetching transactions:", error);
    throw error;
  }
}

export async function fetchTransactionById(
  id: number
): Promise<TransactionRecord> {
  try {
    // Use fetchWithAuth instead of native fetch
    const response = await fetchWithAuth(`${API_BASE_URL}transactions/${id}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    if (!response.ok)
      throw new Error(`Failed to fetch transaction: ${response.status}`);
    return response.json();
  } catch (error) {
    console.error("Error fetching transaction:", error);
    throw error;
  }
}

export async function fetchCompanyTransactions(
  companyId: number
): Promise<TransactionRecord[]> {
  try {
    // Use fetchWithAuth instead of native fetch
    const response = await fetchWithAuth(
      `${API_BASE_URL}transactions/company/${companyId}`,
      {
        method: "GET",
        headers: getAuthHeaders(),
      }
    );
    if (!response.ok)
      throw new Error(
        `Failed to fetch company transactions: ${response.status}`
      );
    return response.json();
  } catch (error) {
    console.error("Error fetching company transactions:", error);
    throw error;
  }
}

export async function fetchTransactionsByCategory(
  categoryId: number
): Promise<TransactionRecord[]> {
  try {
    // Use fetchWithAuth instead of native fetch
    const response = await fetchWithAuth(
      `${API_BASE_URL}transactions/category/${categoryId}`,
      {
        method: "GET",
        headers: getAuthHeaders(),
      }
    );
    if (!response.ok)
      throw new Error(
        `Failed to fetch transactions by category: ${response.status}`
      );
    return response.json();
  } catch (error) {
    console.error("Error fetching transactions by category:", error);
    throw error;
  }
}

export async function fetchTransactionsByDateRange(
  companyId: number,
  startDate: string,
  endDate: string
): Promise<TransactionRecord[]> {
  try {
    // Use fetchWithAuth instead of native fetch
    const response = await fetchWithAuth(
      `${API_BASE_URL}transactions/date-range/${companyId}?startDate=${startDate}&endDate=${endDate}`,
      {
        method: "GET",
        headers: getAuthHeaders(),
      }
    );
    if (!response.ok)
      throw new Error(
        `Failed to fetch transactions by date range: ${response.status}`
      );
    return response.json();
  } catch (error) {
    console.error("Error fetching transactions by date range:", error);
    throw error;
  }
}

export async function createTransactionRecord(
  data: CreateTransactionDto
): Promise<TransactionRecord> {
  try {
    // Use fetchWithAuth instead of native fetch
    const response = await fetchWithAuth(`${API_BASE_URL}transactions`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Failed to create transaction: ${response.status}`
      );
    }
    return response.json();
  } catch (error) {
    console.error("Error creating transaction:", error);
    throw error;
  }
}

export async function createTransaction(
  data: CreateTransactionDto
): Promise<any> {
  // Use fetchWithAuth instead of native fetch
  const response = await fetchWithAuth(`${API_BASE_URL}transactions`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to create transaction");
  }
  return response.json();
}

export async function updateTransaction(
  id: number,
  data: any
): Promise<TransactionRecord> {
  try {
    // Use fetchWithAuth instead of native fetch
    const response = await fetchWithAuth(`${API_BASE_URL}transactions/${id}`, {
      method: "PATCH",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Failed to update transaction: ${response.status}`
      );
    }
    return response.json();
  } catch (error) {
    console.error("Error updating transaction:", error);
    throw error;
  }
}

export async function deleteTransaction(id: number): Promise<void> {
  try {
    // Use fetchWithAuth instead of native fetch
    const response = await fetchWithAuth(`${API_BASE_URL}transactions/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    if (!response.ok)
      throw new Error(`Failed to delete transaction: ${response.status}`);
  } catch (error) {
    console.error("Error deleting transaction:", error);
    throw error;
  }
}

// =====================================================
// RECURRING TRANSACTION API FUNCTIONS
// =====================================================

export async function fetchRecurringTransactions(): Promise<
  RecurringTransaction[]
> {
  try {
    // Use fetchWithAuth instead of native fetch
    const response = await fetchWithAuth(`${API_BASE_URL}transactions/recurring`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    if (!response.ok)
      throw new Error(
        `Failed to fetch recurring transactions: ${response.status}`
      );
    return response.json();
  } catch (error) {
    console.error("Error fetching recurring transactions:", error);
    throw error;
  }
}

export async function fetchRecurringTransactionById(
  id: number
): Promise<RecurringTransaction> {
  try {
    // Use fetchWithAuth instead of native fetch
    const response = await fetchWithAuth(
      `${API_BASE_URL}transactions/recurring/${id}`,
      {
        method: "GET",
        headers: getAuthHeaders(),
      }
    );
    if (!response.ok)
      throw new Error(
        `Failed to fetch recurring transaction: ${response.status}`
      );
    return response.json();
  } catch (error) {
    console.error("Error fetching recurring transaction:", error);
    throw error;
  }
}

export async function fetchRecurringTransactionsByCompany(
  companyId: number
): Promise<RecurringTransaction[]> {
  try {
    // Use fetchWithAuth instead of native fetch
    const response = await fetchWithAuth(
      `${API_BASE_URL}transactions/recurring/company/${companyId}`,
      {
        method: "GET",
        headers: getAuthHeaders(),
      }
    );
    if (!response.ok)
      throw new Error(
        `Failed to fetch recurring transactions by company: ${response.status}`
      );
    return response.json();
  } catch (error) {
    console.error("Error fetching recurring transactions by company:", error);
    throw error;
  }
}

export async function createRecurringTransaction(
  data: CreateRecurringTransactionDto
): Promise<RecurringTransaction> {
  try {
    // Use fetchWithAuth instead of native fetch
    const response = await fetchWithAuth(`${API_BASE_URL}transactions/recurring`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message ||
          `Failed to create recurring transaction: ${response.status}`
      );
    }
    return response.json();
  } catch (error) {
    console.error("Error creating recurring transaction:", error);
    throw error;
  }
}

export async function updateRecurringTransaction(
  id: number,
  data: Partial<CreateRecurringTransactionDto>
): Promise<RecurringTransaction> {
  try {
    // Use fetchWithAuth instead of native fetch
    const response = await fetchWithAuth(
      `${API_BASE_URL}transactions/recurring/${id}`,
      {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      }
    );
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message ||
          `Failed to update recurring transaction: ${response.status}`
      );
    }
    return response.json();
  } catch (error) {
    console.error("Error updating recurring transaction:", error);
    throw error;
  }
}

export async function deleteRecurringTransaction(id: number): Promise<void> {
  try {
    // Use fetchWithAuth instead of native fetch
    const response = await fetchWithAuth(
      `${API_BASE_URL}transactions/recurring/${id}`,
      {
        method: "DELETE",
        headers: getAuthHeaders(),
      }
    );
    if (!response.ok)
      throw new Error(
        `Failed to delete recurring transaction: ${response.status}`
      );
  } catch (error) {
    console.error("Error deleting recurring transaction:", error);
    throw error;
  }
}

export async function executeRecurringTransaction(
  id: number
): Promise<TransactionRecord> {
  try {
    // Use fetchWithAuth instead of native fetch
    const response = await fetchWithAuth(
      `${API_BASE_URL}transactions/recurring/${id}/execute`,
      {
        method: "POST",
        headers: getAuthHeaders(),
      }
    );
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message ||
          `Failed to execute recurring transaction: ${response.status}`
      );
    }
    return response.json();
  } catch (error) {
    console.error("Error executing recurring transaction:", error);
    throw error;
  }
}

// =====================================================
// FINANCIAL REPORTS API FUNCTIONS - COMPANY SPECIFIC
// =====================================================

export async function fetchIncomeStatement(
  companyId: number,
  year: number
): Promise<GlobalIncomeStatementResponse> {
  try {
    // Use fetchWithAuth instead of native fetch
    const response = await fetchWithAuth(
      `${API_BASE_URL}transactions/reports/income-statement/${companyId}?year=${year}`,
      {
        method: "GET",
        headers: getAuthHeaders(),
      }
    );
    if (!response.ok)
      throw new Error(`Failed to fetch income statement: ${response.status}`);
    return response.json();
  } catch (error) {
    console.error("Error fetching income statement:", error);
    throw error;
  }
}

export async function fetchBalanceSheet(
  companyId: number,
  asOfDate: string
): Promise<GlobalBalanceSheetResponse> {
  try {
    // Use fetchWithAuth instead of native fetch
    const response = await fetchWithAuth(
      `${API_BASE_URL}transactions/reports/balance-sheet/${companyId}?asOfDate=${asOfDate}`,
      {
        method: "GET",
        headers: getAuthHeaders(),
      }
    );
    if (!response.ok)
      throw new Error(`Failed to fetch balance sheet: ${response.status}`);
    return response.json();
  } catch (error) {
    console.error("Error fetching balance sheet:", error);
    throw error;
  }
}

export async function fetchCashBook(
  companyId: number,
  startDate: string,
  endDate: string
): Promise<CashBook> {
  try {
    // Use fetchWithAuth instead of native fetch
    const response = await fetchWithAuth(
      `${API_BASE_URL}transactions/reports/cash-book/${companyId}?startDate=${startDate}&endDate=${endDate}`,
      {
        method: "GET",
        headers: getAuthHeaders(),
      }
    );
    if (!response.ok)
      throw new Error(`Failed to fetch cash book: ${response.status}`);
    return response.json();
  } catch (error) {
    console.error("Error fetching cash book:", error);
    throw error;
  }
}

// =====================================================
// FINANCIAL REPORTS API FUNCTIONS - GLOBAL (ALL COMPANIES)
// =====================================================

export async function fetchGlobalIncomeStatement(
  year: number
): Promise<GlobalIncomeStatementResponse> {
  try {
    // Use fetchWithAuth instead of native fetch
    const response = await fetchWithAuth(
      `${API_BASE_URL}transactions/reports/global/income-statement?year=${year}`,
      {
        method: "GET",
        headers: getAuthHeaders(),
      }
    );
    if (!response.ok)
      throw new Error(
        `Failed to fetch global income statement: ${response.status}`
      );
    return response.json();
  } catch (error) {
    console.error("Error fetching global income statement:", error);
    throw error;
  }
}

export async function fetchGlobalBalanceSheet(
  asOfDate: string
): Promise<GlobalBalanceSheetResponse> {
  try {
    // Use fetchWithAuth instead of native fetch
    const response = await fetchWithAuth(
      `${API_BASE_URL}transactions/reports/global/balance-sheet?asOfDate=${asOfDate}`,
      {
        method: "GET",
        headers: getAuthHeaders(),
      }
    );
    if (!response.ok)
      throw new Error(
        `Failed to fetch global balance sheet: ${response.status}`
      );
    return response.json();
  } catch (error) {
    console.error("Error fetching global balance sheet:", error);
    throw error;
  }
}

export async function fetchGlobalCashBook(
  startDate: string,
  endDate: string
){
  try {
    // Use fetchWithAuth instead of native fetch
    const response = await fetchWithAuth(
      `${API_BASE_URL}transactions/reports/global/cash-book?startDate=${startDate}&endDate=${endDate}`,
      {
        method: "GET",
        headers: getAuthHeaders(),
      }
    );
    if (!response.ok)
      throw new Error(`Failed to fetch global cash book: ${response.status}`);
    return response.json();
  } catch (error) {
    console.error("Error fetching global cash book:", error);
    throw error;
  }
}

export async function fetchGlobalFinancialSummary(
  year: number
): Promise<GlobalFinancialSummary> {
  try {
    // Use fetchWithAuth instead of native fetch
    const response = await fetchWithAuth(
      `${API_BASE_URL}transactions/reports/global/summary?year=${year}`,
      {
        method: "GET",
        headers: getAuthHeaders(),
      }
    );
    if (!response.ok)
      throw new Error(
        `Failed to fetch global financial summary: ${response.status}`
      );
    return response.json();
  } catch (error) {
    console.error("Error fetching global financial summary:", error);
    throw error;
  }
}

export async function fetchCompanyComparison(
  year: number
): Promise<CompanyComparisonResponse> {
  try {
    // Use fetchWithAuth instead of native fetch
    const response = await fetchWithAuth(
      `${API_BASE_URL}transactions/reports/global/company-comparison?year=${year}`,
      {
        method: "GET",
        headers: getAuthHeaders(),
      }
    );
    if (!response.ok)
      throw new Error(`Failed to fetch company comparison: ${response.status}`);
    return response.json();
  } catch (error) {
    console.error("Error fetching company comparison:", error);
    throw error;
  }
}

// =====================================================
// CATEGORY API FUNCTIONS
// =====================================================

export async function fetchMainCategories(): Promise<Category[]> {
  try {
    // Use fetchWithAuth instead of native fetch
    const response = await fetchWithAuth(`${API_BASE_URL}categories/main`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    if (!response.ok)
      throw new Error(`Failed to fetch main categories: ${response.status}`);
    return response.json();
  } catch (error) {
    console.error("Error fetching main categories:", error);
    throw error;
  }
}

export async function fetchSubCategories(
  mainCategoryId: number
): Promise<Category[]> {
  try {
    // Use fetchWithAuth instead of native fetch
    const response = await fetchWithAuth(
      `${API_BASE_URL}categories/main/${mainCategoryId}/sub`,
      {
        method: "GET",
        headers: getAuthHeaders(),
      }
    );
    if (!response.ok)
      throw new Error(`Failed to fetch sub categories: ${response.status}`);
    return response.json();
  } catch (error) {
    console.error("Error fetching sub categories:", error);
    throw error;
  }
}

export async function fetchSubSubCategories(
  subCategoryId: number
): Promise<Category[]> {
  try {
    // Use fetchWithAuth instead of native fetch
    const response = await fetchWithAuth(
      `${API_BASE_URL}categories/sub/${subCategoryId}/sub-sub`,
      {
        method: "GET",
        headers: getAuthHeaders(),
      }
    );
    if (!response.ok)
      throw new Error(`Failed to fetch sub-sub categories: ${response.status}`);
    return response.json();
  } catch (error) {
    console.error("Error fetching sub-sub categories:", error);
    throw error;
  }
}

export async function fetchCategoryTree(): Promise<Category[]> {
  try {
    // Use fetchWithAuth instead of native fetch
    const response = await fetchWithAuth(`${API_BASE_URL}categories/tree`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    if (!response.ok)
      throw new Error(`Failed to fetch category tree: ${response.status}`);
    return response.json();
  } catch (error) {
    console.error("Error fetching category tree:", error);
    throw error;
  }
}

export async function fetchLeafCategories(): Promise<Category[]> {
  try {
    // Use fetchWithAuth instead of native fetch
    const response = await fetchWithAuth(`${API_BASE_URL}categories/leaf`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    if (!response.ok)
      throw new Error(`Failed to fetch leaf categories: ${response.status}`);
    return response.json();
  } catch (error) {
    console.error("Error fetching leaf categories:", error);
    throw error;
  }
}

export async function fetchCategoryById(id: number): Promise<Category> {
  try {
    // Use fetchWithAuth instead of native fetch
    const response = await fetchWithAuth(`${API_BASE_URL}categories/${id}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    if (!response.ok)
      throw new Error(`Failed to fetch category: ${response.status}`);
    return response.json();
  } catch (error) {
    console.error("Error fetching category:", error);
    throw error;
  }
}

export async function createCategory(data: CreateCategoryDto): Promise<Category> {
  try {
    // Use fetchWithAuth instead of native fetch
    const response = await fetchWithAuth(`${API_BASE_URL}categories`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Failed to create category: ${response.status}`
      );
    }
    return response.json();
  } catch (error) {
    console.error("Error creating category:", error);
    throw error;
  }
}

export async function createSubSubCategory(
  data: CreateSubSubCategoryDto
): Promise<Category> {
  try {
    // Use fetchWithAuth instead of native fetch
    const response = await fetchWithAuth(`${API_BASE_URL}categories/sub-sub`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message ||
          `Failed to create sub-sub category: ${response.status}`
      );
    }
    return response.json();
  } catch (error) {
    console.error("Error creating sub-sub category:", error);
    throw error;
  }
}

export async function deleteCategory(id: number): Promise<{ message: string }> {
  try {
    // Use fetchWithAuth instead of native fetch
    const response = await fetchWithAuth(`${API_BASE_URL}categories/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Failed to delete category: ${response.status}`
      );
    }
    return response.json();
  } catch (error) {
    console.error("Error deleting category:", error);
    throw error;
  }
}

export async function restoreCategory(id: number): Promise<Category> {
  try {
    // Use fetchWithAuth instead of native fetch
    const response = await fetchWithAuth(`${API_BASE_URL}categories/${id}/restore`, {
      method: "PATCH",
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Failed to restore category: ${response.status}`
      );
    }
    return response.json();
  } catch (error) {
    console.error("Error restoring category:", error);
    throw error;
  }
}

export async function validateCategoryCode(
  code: string
): Promise<{ available: boolean }> {
  try {
    // Use fetchWithAuth instead of native fetch
    const response = await fetchWithAuth(
      `${API_BASE_URL}categories/validate/code?code=${encodeURIComponent(code)}`,
      {
        method: "GET",
        headers: getAuthHeaders(),
      }
    );
    if (!response.ok)
      throw new Error(`Failed to validate code: ${response.status}`);
    return response.json();
  } catch (error) {
    console.error("Error validating category code:", error);
    throw error;
  }
}

export async function getNextCategoryCode(
  parentId: number
): Promise<{ nextCode: string }> {
  try {
    // Use fetchWithAuth instead of native fetch
    const response = await fetchWithAuth(
      `${API_BASE_URL}categories/parent/${parentId}/next-code`,
      {
        method: "GET",
        headers: getAuthHeaders(),
      }
    );
    if (!response.ok)
      throw new Error(`Failed to get next code: ${response.status}`);
    return response.json();
  } catch (error) {
    console.error("Error getting next category code:", error);
    throw error;
  }
}

// =====================================================
// USER MANAGEMENT API FUNCTIONS
// =====================================================

// export async function fetchUsers(filters: any): Promise<User[]> {
//   console.log(filters);
//   return apiCall<User[]>("users");
// }
export async function fetchUsers(filters: any): Promise<{ data: User[]; meta: { total: number; page: number; limit: number; totalPages: number } }> {
  console.log(filters);
  return apiCall<{ data: User[]; meta: { total: number; page: number; limit: number; totalPages: number } }>(`users?page=${filters.page}&limit=${filters.limit}&name=${filters.name}`);
}

export async function createUser(data: {
  name: string;
  email: string;
  role: User["role"];
  password: string;
}): Promise<User> {
  return apiCall<User>("users/create", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateUser(id: number, data: any): Promise<User> {
  return apiCall<User>(`users/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function deleteUser(id: number): Promise<void> {
  await apiCall<void>(`users/${id}`, {

    method: "DELETE",
  });
}
