/**
 * Custom fetch wrapper that handles 401 errors globally
 * Import this and use it instead of the native fetch in your API calls
 */

// Store the unauthorized handler globally
let globalUnauthorizedHandler: (() => void) | null = null

export function setUnauthorizedHandler(handler: () => void) {
  globalUnauthorizedHandler = handler
}

interface FetchWithAuthOptions extends RequestInit {
  skipAuthRedirect?: boolean
}

/**
 * Enhanced fetch that automatically handles 401 responses
 */
export async function fetchWithAuth(
  url: string,
  options?: FetchWithAuthOptions
): Promise<Response> {
  const response = await fetch(url, options)

  // Handle 401 Unauthorized
  if (response.status === 401 && !options?.skipAuthRedirect) {
    console.error("Unauthorized request detected - session expired")
    
    // Clear tokens from localStorage
    if (typeof window !== "undefined") {
      localStorage.removeItem("irebe_user")
      localStorage.removeItem("irebe_tokens")
      localStorage.removeItem("irebe_active_tab")
    }

    // Call the global handler if available
    if (globalUnauthorizedHandler) {
      globalUnauthorizedHandler()
    }

    // Throw error to stop further processing
    throw new Error("Session expired. Please login again.")
  }

  return response
}

/**
 * Hook to set up the unauthorized handler
 * Call this in your root component
 */
export function useAuthErrorHandler(handler: () => void) {
  if (typeof window !== "undefined") {
    setUnauthorizedHandler(handler)
  }
}