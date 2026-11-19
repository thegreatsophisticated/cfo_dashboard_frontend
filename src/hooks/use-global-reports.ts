import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";

// =====================================================
// TYPES
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

export interface CashBookCompanyData {
  companyId: number;
  companyName: string;
  totalCashIn: number;
  totalCashOut: number;
  netCashFlow: number;
  transactionCount: number;
}

export interface CashBookStatementLine {
  id: number;
  date: string;
  description: string;
  counterparty?: string | null;
  referenceNumber?: string | null;
  category?: string;
  companyName?: string;
  amount: number;
}

export interface CashBookStatement {
  cashIn: CashBookStatementLine[];
  cashOut: CashBookStatementLine[];
}

export interface GlobalCashBookResponse {
  status: number;
  message: string;
  summary: {
    period: {
      startDate: string;
      endDate: string;
    };
    totalCashIn: number;
    totalCashOut: number;
    netCashFlow: number;
  };
  data: CashBookCompanyData[];
  // Individual dated transactions for the Cash In / Cash Out sections.
  // Optional: the UI and PDF fall back to totals only when it is missing.
  statement?: CashBookStatement;
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

// =====================================================
// API CALLS
// =====================================================

async function fetchGlobalIncomeStatement(
  year: number,
): Promise<GlobalIncomeStatementResponse> {
  return apiFetch<GlobalIncomeStatementResponse>(
    `transactions/reports/global/income-statement?year=${year}`,
  );
}

async function fetchGlobalBalanceSheet(
  asOfDate: string,
): Promise<GlobalBalanceSheetResponse> {
  return apiFetch<GlobalBalanceSheetResponse>(
    `transactions/reports/global/balance-sheet?asOfDate=${asOfDate}`,
  );
}

async function fetchGlobalCashBook(
  startDate: string,
  endDate: string,
): Promise<GlobalCashBookResponse> {
  return apiFetch<GlobalCashBookResponse>(
    `transactions/reports/global/cash-book?startDate=${startDate}&endDate=${endDate}`,
  );
}

// =====================================================
// HOOKS
// =====================================================

export function useGlobalIncomeStatement(year: number) {
  return useQuery({
    queryKey: ["reports", "global-income-statement", year],
    queryFn: () => fetchGlobalIncomeStatement(year),
  });
}

export function useGlobalBalanceSheet(asOfDate: string) {
  return useQuery({
    queryKey: ["reports", "global-balance-sheet", asOfDate],
    queryFn: () => fetchGlobalBalanceSheet(asOfDate),
    enabled: !!asOfDate,
  });
}

export function useGlobalCashBook(startDate: string, endDate: string) {
  return useQuery({
    queryKey: ["reports", "global-cash-book", startDate, endDate],
    queryFn: () => fetchGlobalCashBook(startDate, endDate),
    enabled: !!startDate && !!endDate,
  });
}
