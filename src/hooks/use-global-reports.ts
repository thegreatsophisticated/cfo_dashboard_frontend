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

// =====================================================
// API CALLS
// =====================================================

async function fetchGlobalIncomeStatement(year: number): Promise<GlobalIncomeStatementResponse> {
  return apiFetch<GlobalIncomeStatementResponse>(`transactions/reports/global/income-statement?year=${year}`);
}

async function fetchGlobalBalanceSheet(asOfDate: string): Promise<GlobalBalanceSheetResponse> {
  return apiFetch<GlobalBalanceSheetResponse>(`transactions/reports/global/balance-sheet?asOfDate=${asOfDate}`);
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





// Add these types and hook to the existing file

export interface CashBookCompanyData {
  companyId: number;
  companyName: string;
  totalCashIn: number;
  totalCashOut: number;
  netCashFlow: number;
  transactionCount: number;
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
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

async function fetchGlobalCashBook(startDate: string, endDate: string): Promise<GlobalCashBookResponse> {
  return apiFetch<GlobalCashBookResponse>(
    `transactions/reports/global/cash-book?startDate=${startDate}&endDate=${endDate}`
  );
}

export function useGlobalCashBook(startDate: string, endDate: string) {
  return useQuery({
    queryKey: ["reports", "global-cash-book", startDate, endDate],
    queryFn: () => fetchGlobalCashBook(startDate, endDate),
    enabled: !!startDate && !!endDate,
  });
}
