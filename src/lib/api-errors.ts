import { ApiError } from "@/lib/api";

export function handleApiError(error: unknown, defaultMessage: string): string {
  if (error instanceof ApiError) {
    if (error.status === 409) {
      return error.message || "User with this email or phone already exists";
    }
    if (error.status === 400) {
      return error.message || "Invalid data provided";
    }
    if (error.status === 403) {
      return "You don't have permission to perform this action";
    }
    if (error.status === 404) {
      return "User not found";
    }
    if (error.status === 500) {
      return "Server error. Please try again later.";
    }
    return error.message || defaultMessage;
  }

  if (error instanceof Error) {
    if (error.message.includes("Network Error") || error.message.includes("fetch")) {
      return "Network error. Please check your connection.";
    }
    return error.message || defaultMessage;
  }

  return defaultMessage;
}
