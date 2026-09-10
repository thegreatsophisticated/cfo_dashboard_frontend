// const API_BASE_URL = import.meta.env.VITE_PUBLIC_API_BASE_URL || "";
// const TOKENS_STORAGE_KEY = "irebe_tokens"; // must match AuthContext.tsx

// export class ApiError extends Error {
//   status: number;
//   constructor(message: string, status: number) {
//     super(message);
//     this.status = status;
//   }
// }

// function getAuthHeaders(): HeadersInit {
//   try {
//     const stored = localStorage.getItem(TOKENS_STORAGE_KEY);
//     const tokens = stored ? JSON.parse(stored) : null;
//     return {
//       "Content-Type": "application/json",
//       ...(tokens?.accessToken ? { Authorization: `Bearer ${tokens.accessToken}` } : {}),
//     };
//   } catch {
//     return { "Content-Type": "application/json" };
//   }
// }

// export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
//   const response = await fetch(`${API_BASE_URL}${path}`, {
//     ...options,
//     headers: {
//       ...getAuthHeaders(),
//       ...options.headers,
//     },
//   });

//   if (!response.ok) {
//     const errorData = await response.json().catch(() => ({}));
//     throw new ApiError(errorData.message || "Request failed", response.status);
//   }

//   return response.json();
// }


const API_BASE_URL = import.meta.env.VITE_PUBLIC_API_BASE_URL || "";
const TOKENS_STORAGE_KEY = "irebe_tokens"; // must match AuthContext.tsx

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

// Shape of a typical NestJS/class-validator error body. `message` can be a
// single string or an array of per-field validation messages.
interface ApiErrorResponse {
  message?: string | string[];
  statusCode?: number;
  error?: string;
}

function getAuthHeaders(): HeadersInit {
  try {
    const stored = localStorage.getItem(TOKENS_STORAGE_KEY);
    const tokens = stored ? JSON.parse(stored) : null;
    return {
      "Content-Type": "application/json",
      ...(tokens?.accessToken ? { Authorization: `Bearer ${tokens.accessToken}` } : {}),
    };
  } catch {
    return { "Content-Type": "application/json" };
  }
}

export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorData: ApiErrorResponse = await response.json().catch(() => ({}));
    const message = Array.isArray(errorData.message) ? errorData.message.join(", ") : errorData.message;
    throw new ApiError(message || "Request failed", response.status);
  }

  return response.json();
}
