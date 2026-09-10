import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";

// =====================================================
// TYPES
// =====================================================

export interface TransactionCategory {
  id: number;
  name: string;
  categoryType: "asset" | "liability" | "equity" | "income" | "expense" | null;
}

export interface TransactionRecord {
  id: number;
  companyId: number;
  categoryId: number;
  date: string;
  description: string;
  amount: number;
  totalAmount?: number;
  transactionType: "debit" | "credit";
  referenceNumber: string | null;
  notes: string | null;
  isReconciled: boolean;
  attachments: string[] | null;
  status?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  category?: TransactionCategory;
  categoryPath?: string;
}

interface TransactionsApiResponse {
  data?: TransactionRecord[];
}

export interface StatementLineItem {
  categoryName?: string;
  name?: string;
  totalAmount?: number;
  amount?: number;
  transactionCount?: number;
}

interface StatementSectionData {
  total: number;
  breakdown: StatementLineItem[];
}

export interface IncomeStatement {
  companyName: string;
  period: number;
  revenue: StatementSectionData;
  costOfSales: StatementSectionData;
  grossProfit: number;
  operatingExpenses: StatementSectionData;
  netProfit: number;
  profitMargin: string;
}

interface IncomeStatementApiResponse {
  incomeStatement: IncomeStatement;
}

export interface BalanceSheet {
  companyName: string;
  asOfDate: string;
  assets: StatementSectionData;
  liabilities: StatementSectionData;
  equity: StatementSectionData & {
    capitalContributed: number;
    retainedEarnings: number;
  };
  totalLiabilitiesAndEquity: number;
  balanceCheck: "BALANCED" | "UNBALANCED";
}

interface BalanceSheetApiResponse {
  balanceSheet?: BalanceSheet;
  summary?: {
    asOfDate: string;
    totalAssets: number;
    totalLiabilities: number;
    totalEquity: number;
    balanceCheck: string;
  };
  companies?: Array<{ companyName: string; retainedEarnings: number }>;
}

// =====================================================
// API CALLS
// =====================================================

async function fetchCompanyTransactions(companyId: number): Promise<TransactionRecord[]> {
  const data = await apiFetch<TransactionsApiResponse | TransactionRecord[]>(
    `transactions/company/${companyId}`
  );
  return Array.isArray(data) ? data : data?.data ?? [];
}

async function fetchIncomeStatement(companyId: number, year: number): Promise<IncomeStatement | null> {
  const data = await apiFetch<IncomeStatementApiResponse>(
    `transactions/reports/income-statement/${companyId}?year=${year}`
  );
  return data?.incomeStatement ?? null;
}

function normalizeBalanceSheet(data: BalanceSheetApiResponse, fallbackDate: string): BalanceSheet | null {
  const raw = data.balanceSheet ?? data;
  if (!raw) return null;

  const companyName = ("companyName" in raw && raw.companyName) || data.companies?.[0]?.companyName || "";
  if (!companyName) return null;

  return {
    companyName,
    asOfDate: ("asOfDate" in raw && raw.asOfDate) || data.summary?.asOfDate || fallbackDate,
    assets: {
      total: ("assets" in raw && raw.assets?.total) ?? data.summary?.totalAssets ?? 0,
      breakdown: ("assets" in raw && raw.assets?.breakdown) ?? [],
    },
    liabilities: {
      total: ("liabilities" in raw && raw.liabilities?.total) ?? data.summary?.totalLiabilities ?? 0,
      breakdown: ("liabilities" in raw && raw.liabilities?.breakdown) ?? [],
    },
    equity: {
      total: ("equity" in raw && raw.equity?.total) ?? data.summary?.totalEquity ?? 0,
      capitalContributed: ("equity" in raw && raw.equity?.capitalContributed) ?? 0,
      retainedEarnings:
        ("equity" in raw && raw.equity?.retainedEarnings) ?? data.companies?.[0]?.retainedEarnings ?? 0,
      breakdown: ("equity" in raw && raw.equity?.breakdown) ?? [],
    },
    totalLiabilitiesAndEquity:
      ("totalLiabilitiesAndEquity" in raw && raw.totalLiabilitiesAndEquity) ?? data.summary?.totalAssets ?? 0,
    balanceCheck: (("balanceCheck" in raw && raw.balanceCheck) ?? data.summary?.balanceCheck ?? "UNBALANCED") as
      | "BALANCED"
      | "UNBALANCED",
  };
}

async function fetchBalanceSheet(companyId: number, asOfDate: string): Promise<BalanceSheet | null> {
  const data = await apiFetch<BalanceSheetApiResponse>(
    `transactions/reports/balance-sheet/${companyId}?asOfDate=${asOfDate}`
  );
  return normalizeBalanceSheet(data, asOfDate);
}

// =====================================================
// HOOKS
// =====================================================

export function useCompanyTransactions(companyId: number) {
  return useQuery({
    queryKey: ["company-financials", "transactions", companyId],
    queryFn: () => fetchCompanyTransactions(companyId),
    enabled: !!companyId,
  });
}

export function useIncomeStatement(companyId: number, year: number) {
  return useQuery({
    queryKey: ["company-financials", "income-statement", companyId, year],
    queryFn: () => fetchIncomeStatement(companyId, year),
    enabled: !!companyId,
  });
}

export function useBalanceSheet(companyId: number, asOfDate: string) {
  return useQuery({
    queryKey: ["company-financials", "balance-sheet", companyId, asOfDate],
    queryFn: () => fetchBalanceSheet(companyId, asOfDate),
    enabled: !!companyId,
  });
}
