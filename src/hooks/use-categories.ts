import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import { LeafCategory } from "@/types/transaction-management-types";
import type { CompanyCreator } from "@/hooks/use-companies";

// =====================================================
// EXISTING: Leaf categories (used by transaction management)
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
// TYPES (for category management)
// =====================================================

export type CategoryLevel = "main" | "sub" | "sub_sub";
export type CategoryType = "asset" | "liability" | "equity" | "income" | "expense" | null;

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

// =====================================================
// API CALLS (for category management)
// =====================================================

async function fetchMainCategories(): Promise<Category[]> {
  return apiFetch<Category[]>("categories/main");
}

async function fetchSubCategories(mainCategoryId: number): Promise<Category[]> {
  return apiFetch<Category[]>(`categories/main/${mainCategoryId}/sub`);
}

async function fetchSubSubCategories(subCategoryId: number): Promise<Category[]> {
  return apiFetch<Category[]>(`categories/sub/${subCategoryId}/sub-sub`);
}

async function fetchCategoryTree(): Promise<Category[]> {
  return apiFetch<Category[]>("categories/tree");
}

async function fetchCategoryById(id: number): Promise<Category> {
  return apiFetch<Category>(`categories/${id}`);
}

async function createCategory(data: CreateCategoryDto): Promise<Category> {
  return apiFetch<Category>("categories", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

async function createSubSubCategory(data: CreateSubSubCategoryDto): Promise<Category> {
  return apiFetch<Category>("categories/sub-sub", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

async function deleteCategory(id: number): Promise<{ message: string }> {
  return apiFetch<{ message: string }>(`categories/${id}`, { method: "DELETE" });
}

async function restoreCategory(id: number): Promise<Category> {
  return apiFetch<Category>(`categories/${id}/restore`, { method: "PATCH" });
}

async function validateCategoryCode(code: string): Promise<{ available: boolean }> {
  return apiFetch<{ available: boolean }>(`categories/validate/code?code=${encodeURIComponent(code)}`);
}

async function getNextCategoryCode(parentId: number): Promise<{ nextCode: string }> {
  return apiFetch<{ nextCode: string }>(`categories/parent/${parentId}/next-code`);
}

// Exported directly (not via useQuery) for imperative/lazy use, e.g. expand-on-click in a tree row
export async function fetchSubCategoriesDirect(mainCategoryId: number): Promise<Category[]> {
  return fetchSubCategories(mainCategoryId);
}

export async function fetchSubSubCategoriesDirect(subCategoryId: number): Promise<Category[]> {
  return fetchSubSubCategories(subCategoryId);
}

// =====================================================
// HOOKS (for category management)
// =====================================================

const CATEGORIES_KEY = ["categories"] as const;

export function useMainCategories() {
  return useQuery({
    queryKey: [...CATEGORIES_KEY, "main"],
    queryFn: fetchMainCategories,
  });
}

export function useSubCategories(mainCategoryId: number | null, enabled = true) {
  return useQuery({
    queryKey: [...CATEGORIES_KEY, "sub", mainCategoryId],
    queryFn: () => fetchSubCategories(mainCategoryId as number),
    enabled: !!mainCategoryId && enabled,
  });
}

export function useSubSubCategories(subCategoryId: number | null, enabled = true) {
  return useQuery({
    queryKey: [...CATEGORIES_KEY, "sub-sub", subCategoryId],
    queryFn: () => fetchSubSubCategories(subCategoryId as number),
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

export function useCreateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateCategoryDto) => createCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CATEGORIES_KEY });
    },
  });
}

export function useCreateSubSubCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateSubSubCategoryDto) => createSubSubCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CATEGORIES_KEY });
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CATEGORIES_KEY });
    },
  });
}

export function useRestoreCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => restoreCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CATEGORIES_KEY });
    },
  });
}

export function useValidateCategoryCode() {
  return useMutation({
    mutationFn: (code: string) => validateCategoryCode(code),
  });
}

export function useNextCategoryCode(parentId: number | null) {
  return useQuery({
    queryKey: [...CATEGORIES_KEY, "next-code", parentId],
    queryFn: () => getNextCategoryCode(parentId as number),
    enabled: !!parentId,
  });
}
