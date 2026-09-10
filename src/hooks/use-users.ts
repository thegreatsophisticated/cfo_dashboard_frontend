import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";

// =====================================================
// TYPES
// =====================================================

export interface UserProfile {
  id: number;
  gender: string | null;
  maritalStatus: string | null;
  position: string | null;
  dateOfBirth: string | null;
  profileImage: string | null;
}

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: "admin" | "cfo" | "accountant" | "user" | "viewer";
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  profile: UserProfile | null;
}

export interface UserFilters {
  page: number;
  limit: number;
  name: string;
}

interface UsersApiResponse {
  data: User[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface CreateUserDto {
  name: string;
  email: string;
  phone: string;
  role: User["role"];
  password: string;
  profile?: Partial<Omit<UserProfile, "id" | "profileImage">>;
}

export type UpdateUserDto = Partial<Omit<CreateUserDto, "password">>;

// =====================================================
// API CALLS
// =====================================================

async function fetchUsers(filters: UserFilters): Promise<UsersApiResponse> {
  return apiFetch<UsersApiResponse>(
    `users?page=${filters.page}&limit=${filters.limit}&name=${encodeURIComponent(filters.name)}`
  );
}

async function createUser(data: CreateUserDto): Promise<User> {
  return apiFetch<User>("users/create", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

async function updateUser(id: number, data: UpdateUserDto): Promise<User> {
  return apiFetch<User>(`users/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

async function deleteUser(id: number): Promise<void> {
  await apiFetch<void>(`users/${id}`, { method: "DELETE" });
}

// =====================================================
// HOOKS
// =====================================================

const USERS_KEY = ["users"] as const;

export function useUsers(filters: UserFilters) {
  return useQuery({
    queryKey: [...USERS_KEY, filters],
    queryFn: () => fetchUsers(filters),
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateUserDto) => createUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USERS_KEY });
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateUserDto }) => updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USERS_KEY });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USERS_KEY });
    },
  });
}
