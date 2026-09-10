import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import { CreateTransactionDto, Transaction } from "@/types/transaction-management-types";

interface TransactionsApiResponse {
  status: number;
  message: string;
  data: Transaction[];
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
// HELPERS
// =====================================================

// Rounds to 2 decimal places, matching backend's maxDecimalPlaces validation
// for currency fields (amount, taxAmount). Prevents floating-point artifacts
// like 199.9977 from failing @IsNumber({ maxDecimalPlaces: 2 }).
function roundMoney(value: number): number {
  return Math.round(value * 100) / 100;
}

function sanitizeTransactionPayload<T extends Partial<CreateTransactionDto>>(data: T): T {
  const sanitized = { ...data };
  if (typeof sanitized.amount === "number") {
    sanitized.amount = roundMoney(sanitized.amount);
  }
  if (typeof sanitized.taxAmount === "number") {
    sanitized.taxAmount = roundMoney(sanitized.taxAmount);
  }
  return sanitized;
}

// =====================================================
// API CALLS
// =====================================================

async function fetchTransactions(): Promise<TransactionsApiResponse> {
  return apiFetch<TransactionsApiResponse>("transactions");
}

async function fetchTransactionById(id: number): Promise<Transaction> {
  return apiFetch<Transaction>(`transactions/${id}`);
}

async function fetchCompanyTransactions(companyId: number): Promise<Transaction[]> {
  const data = await apiFetch<TransactionsApiResponse | Transaction[]>(`transactions/company/${companyId}`);
  return Array.isArray(data) ? data : data?.data ?? [];
}

async function createTransaction(data: CreateTransactionDto): Promise<Transaction> {
  return apiFetch<Transaction>("transactions", {
    method: "POST",
    body: JSON.stringify(sanitizeTransactionPayload(data)),
  });
}

async function updateTransaction(id: number, data: Partial<CreateTransactionDto>): Promise<Transaction> {
  return apiFetch<Transaction>(`transactions/${id}`, {
    method: "PATCH",
    body: JSON.stringify(sanitizeTransactionPayload(data)),
  });
}

async function deleteTransaction(id: number): Promise<void> {
  await apiFetch<void>(`transactions/${id}`, { method: "DELETE" });
}

async function executeRecurringTransaction(id: number): Promise<Transaction> {
  return apiFetch<Transaction>(`transactions/recurring/${id}/execute`, { method: "POST" });
}

// =====================================================
// HOOKS
// =====================================================

const TRANSACTIONS_KEY = ["transactions"] as const;

export function useTransactions() {
  return useQuery({
    queryKey: TRANSACTIONS_KEY,
    queryFn: fetchTransactions,
    retry: 2,
    staleTime: 30_000,
  });
}

export function useCompanyTransactions(companyId: number) {
  return useQuery({
    queryKey: ["transactions", "company", companyId],
    queryFn: () => fetchCompanyTransactions(companyId),
    enabled: !!companyId,
  });
}

export function useTransaction(id: number) {
  return useQuery({
    queryKey: [...TRANSACTIONS_KEY, id],
    queryFn: () => fetchTransactionById(id),
    enabled: !!id,
  });
}

export function useCreateTransaction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateTransactionDto) => createTransaction(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TRANSACTIONS_KEY });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
    },
  });
}

export function useUpdateTransaction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<CreateTransactionDto> }) => updateTransaction(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TRANSACTIONS_KEY });
    },
  });
}

export function useDeleteTransaction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteTransaction(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TRANSACTIONS_KEY });
    },
  });
}

export function useExecuteRecurringTransaction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => executeRecurringTransaction(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TRANSACTIONS_KEY });
    },
  });
}

export type { TransactionsApiResponse };
