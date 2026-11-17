import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import { LeafCategory } from "@/types/transaction-management-types";
import type { CompanyCreator } from "@/hooks/use-companies";

// =====================================================
// Leaf categories (used by transaction management)
// =====================================================

async function fetchLeafCategories(): Promise<LeafCategory[]> {
  return apiFetch<LeafCategory[]>("categories/leaf");
}

export function useLeafCategories() {
  return useQuery({
    queryKey: ["categories", "leaf"],
    queryFn: fetchLeafCategories,
  });
}

// =====================================================
// Types
// =====================================================

export type CategoryLevel = "main" | "sub" | "sub_sub";

// Must match the backend CategoryType enum
export type CategoryType =
  | "asset"
  | "liability"
  | "equity"
  | "revenue"
  | "expense"
  | "cost_of_sales";

export const CATEGORY_TYPES: { value: CategoryType; label: string }[] = [
  { value: "asset", label: "Asset" },
  { value: "liability", label: "Liability" },
  { value: "equity", label: "Equity" },
  { value: "revenue", label: "Revenue" },
  { value: "expense", label: "Expense" },
  { value: "cost_of_sales", label: "Cost of sales" },
];

export interface Category {
  id: number;
  code: string | null;
  name: string;
  description: string | null;
  level: CategoryLevel;
  categoryType: CategoryType | null;
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

export interface CreateMainCategoryDto {
  code: string;
  name: string;
  description?: string;
  categoryType: CategoryType;
  sortOrder?: number;
}

export interface CreateSubCategoryDto {
  mainCategoryId: number;
  code?: string; // omit to auto-generate
  name: string;
  description?: string;
  sortOrder?: number;
}

export interface CreateSubSubCategoryDto {
  subCategoryId: number;
  code?: string; // omit to auto-generate
  name: string;
  description?: string;
  sortOrder?: number;
}

export interface UpdateCategoryDto {
  name?: string;
  description?: string;
  code?: string;
  categoryType?: CategoryType; // main categories only; cascades down
  isActive?: boolean;
  sortOrder?: number;
}

// =====================================================
// API calls
// =====================================================

const withInactive = (path: string, includeInactive: boolean) =>
  includeInactive ? `${path}?includeInactive=true` : path;

async function fetchMainCategories(includeInactive: boolean) {
  return apiFetch<Category[]>(withInactive("categories/main", includeInactive));
}

async function fetchSubCategories(
  mainCategoryId: number,
  includeInactive = false,
) {
  return apiFetch<Category[]>(
    withInactive(`categories/main/${mainCategoryId}/sub`, includeInactive),
  );
}

async function fetchSubSubCategories(
  subCategoryId: number,
  includeInactive = false,
) {
  return apiFetch<Category[]>(
    withInactive(`categories/sub/${subCategoryId}/sub-sub`, includeInactive),
  );
}

async function fetchCategoryTree(): Promise<Category[]> {
  return apiFetch<Category[]>("categories/tree");
}

async function fetchCategoryById(id: number): Promise<Category> {
  return apiFetch<Category>(`categories/${id}`);
}

function post<T>(path: string, body: unknown) {
  return apiFetch<T>(path, { method: "POST", body: JSON.stringify(body) });
}

async function updateCategory(id: number, data: UpdateCategoryDto) {
  return apiFetch<Category>(`categories/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

async function deleteCategory(id: number): Promise<{ message: string }> {
  return apiFetch<{ message: string }>(`categories/${id}`, {
    method: "DELETE",
  });
}

async function restoreCategory(id: number): Promise<Category> {
  return apiFetch<Category>(`categories/${id}/restore`, { method: "PATCH" });
}

async function validateCategoryCode(
  code: string,
): Promise<{ available: boolean }> {
  return apiFetch<{ available: boolean }>(
    `categories/validate/code?code=${encodeURIComponent(code)}`,
  );
}

async function getNextCategoryCode(
  parentId: number,
): Promise<{ nextCode: string }> {
  return apiFetch<{ nextCode: string }>(
    `categories/parent/${parentId}/next-code`,
  );
}

async function getNextMainCode(
  categoryType: CategoryType,
): Promise<{ nextCode: string }> {
  return apiFetch<{ nextCode: string }>(
    `categories/next-main-code?categoryType=${encodeURIComponent(categoryType)}`,
  );
}

// Kept for any imperative callers
export async function fetchSubCategoriesDirect(
  mainCategoryId: number,
  includeInactive = false,
): Promise<Category[]> {
  return fetchSubCategories(mainCategoryId, includeInactive);
}

export async function fetchSubSubCategoriesDirect(
  subCategoryId: number,
  includeInactive = false,
): Promise<Category[]> {
  return fetchSubSubCategories(subCategoryId, includeInactive);
}

// =====================================================
// Hooks
// =====================================================

const CATEGORIES_KEY = ["categories"] as const;

export function useMainCategories(includeInactive = false) {
  return useQuery({
    queryKey: [...CATEGORIES_KEY, "main", includeInactive],
    queryFn: () => fetchMainCategories(includeInactive),
  });
}

export function useSubCategories(
  mainCategoryId: number | null,
  enabled = true,
  includeInactive = false,
) {
  return useQuery({
    queryKey: [...CATEGORIES_KEY, "sub", mainCategoryId, includeInactive],
    queryFn: () => fetchSubCategories(mainCategoryId as number, includeInactive),
    enabled: !!mainCategoryId && enabled,
  });
}

export function useSubSubCategories(
  subCategoryId: number | null,
  enabled = true,
  includeInactive = false,
) {
  return useQuery({
    queryKey: [...CATEGORIES_KEY, "sub-sub", subCategoryId, includeInactive],
    queryFn: () =>
      fetchSubSubCategories(subCategoryId as number, includeInactive),
    enabled: !!subCategoryId && enabled,
  });
}

export function useCategoryTree() {
  return useQuery({
    queryKey: [...CATEGORIES_KEY, "tree"],
    queryFn: fetchCategoryTree,
  });
}

export function useCategory(id: number) {
  return useQuery({
    queryKey: [...CATEGORIES_KEY, id],
    queryFn: () => fetchCategoryById(id),
    enabled: !!id,
  });
}

// Every mutation invalidates the whole ["categories"] prefix, which also
// refreshes the leaf list used by transaction forms.
// Note: braces / no return, so the mutation doesn't wait for the refetch.
function useCategoryMutation<TVars, TData>(
  fn: (vars: TVars) => Promise<TData>,
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: fn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CATEGORIES_KEY });
    },
  });
}

export function useCreateMainCategory() {
  return useCategoryMutation((data: CreateMainCategoryDto) =>
    post<Category>("categories/main", data),
  );
}

export function useCreateSubCategory() {
  return useCategoryMutation((data: CreateSubCategoryDto) =>
    post<Category>("categories/sub", data),
  );
}

export function useCreateSubSubCategory() {
  return useCategoryMutation((data: CreateSubSubCategoryDto) =>
    post<Category>("categories/sub-sub", data),
  );
}

export function useUpdateCategory() {
  return useCategoryMutation(
    ({ id, data }: { id: number; data: UpdateCategoryDto }) =>
      updateCategory(id, data),
  );
}

export function useDeleteCategory() {
  return useCategoryMutation((id: number) => deleteCategory(id));
}

export function useRestoreCategory() {
  return useCategoryMutation((id: number) => restoreCategory(id));
}

export function useValidateCategoryCode() {
  return useMutation({
    mutationFn: (code: string) => validateCategoryCode(code),
  });
}

// Next code for a sub / sub-sub under the given parent
export function useNextCategoryCode(parentId: number | null) {
  return useQuery({
    queryKey: [...CATEGORIES_KEY, "next-code", parentId],
    queryFn: () => getNextCategoryCode(parentId as number),
    enabled: !!parentId,
    staleTime: 0,
    refetchOnMount: "always",
    retry: false,
  });
}

// Next code for a new main category of the given type
export function useNextMainCode(categoryType: CategoryType | null) {
  return useQuery({
    queryKey: [...CATEGORIES_KEY, "next-main-code", categoryType],
    queryFn: () => getNextMainCode(categoryType as CategoryType),
    enabled: !!categoryType,
    staleTime: 0,
    refetchOnMount: "always",
    retry: false,
  });
}
