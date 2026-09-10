

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";

// =====================================================
// COMPANY TYPES & API — ported from the Next.js project
// =====================================================

export interface CompanyCreator {
  id: number;
  name: string;
  email: string;
}

// export interface Company {
//   id: number;
//   name: string;
//   description: string | null;
//   employeeCount: number;
//   establishedDate: string | null;
//   companyType: string;
//   industry: string;
//   email: string;
//   phoneNumber: string | null;
//   website: string | null;
//   taxId: string | null;
//   registrationNumber: string | null;
//   isActive: boolean;
//   annualRevenue: number | null;
//   ceo: string | null;
//   notes: string | null;
//   createdAt: string;
//   updatedAt: string;
//   deletedAt: string | null;
//   createdBy: CompanyCreator | null;
// }

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

export interface CreateCompanyDto {
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
}

export type UpdateCompanyDto = Partial<CreateCompanyDto>;

async function fetchCompanies(): Promise<Company[]> {
  const data = await apiFetch<CompaniesApiResponse>("company");
  return data?.data || data?.companies || [];
}

async function fetchCompanyById(id: number): Promise<Company> {
  return apiFetch<Company>(`company/${id}`);
}

async function createCompany(data: CreateCompanyDto): Promise<Company> {
  const result = await apiFetch<{ company: Company }>("company/create", {
    method: "POST",
    body: JSON.stringify(data),
  });
  return result.company;
}

async function updateCompany(id: number, data: UpdateCompanyDto): Promise<Company> {
  const result = await apiFetch<{ company: Company }>(`company/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
  return result.company;
}

async function deleteCompany(id: number): Promise<void> {
  await apiFetch<void>(`company/${id}`, { method: "DELETE" });
}

// =====================================================
// HOOKS
// =====================================================

const COMPANIES_KEY = ["companies"] as const;

export function useCompanies() {
  return useQuery({
    queryKey: COMPANIES_KEY,
    queryFn: fetchCompanies,
  });
}

export function useCompany(id: number) {
  return useQuery({
    queryKey: [...COMPANIES_KEY, id],
    queryFn: () => fetchCompanyById(id),
    enabled: !!id,
  });
}

export function useCreateCompany() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateCompanyDto) => createCompany(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: COMPANIES_KEY });
    },
  });
}

export function useUpdateCompany() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateCompanyDto }) => updateCompany(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: COMPANIES_KEY });
    },
  });
}

export function useDeleteCompany() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteCompany(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: COMPANIES_KEY });
    },
  });
}
