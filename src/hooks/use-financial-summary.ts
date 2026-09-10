import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";

// =====================================================
// GLOBAL FINANCIAL SUMMARY — ported from the Next.js project
// =====================================================

export interface GlobalFinancialSummary {
  status: number;
  message: string;
  year: number;
  totalTransactions: number;
  summary: {
    totalCompanies: number;
    totalTransactions: number;
    totalRevenue: number;
    totalExpenses: number;
    totalNetProfit: number;
    averageProfitMargin: string;
    totalAssets: number;
    totalLiabilities: number;
    totalEquity: number;
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
      monthlyTrends: Array<{ month: number; revenue: number; expenses: number; netIncome: number }>;
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
        taxByCategory: Array<{ category: string; totalTax: number; averageTaxRate: string }>;
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

async function fetchGlobalFinancialSummary(year: number): Promise<GlobalFinancialSummary> {
  return apiFetch<GlobalFinancialSummary>(`transactions/reports/global/summary?year=${year}`);
}

export function useFinancialSummary(year: number) {
  return useQuery({
    queryKey: ["global-financial-summary", year],
    queryFn: () => fetchGlobalFinancialSummary(year),
  });
}
