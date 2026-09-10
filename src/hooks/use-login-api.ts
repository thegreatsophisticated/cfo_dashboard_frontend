import { apiFetch } from "@/lib/api";

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface LoginResponse {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
}

export function useLoginApi() {
  const login = (email: string, password: string) =>
    apiFetch<LoginResponse>("auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

  return { login };
}
