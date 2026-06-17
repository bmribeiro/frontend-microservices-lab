import { SpringApiError } from "@/lib/api/spring-api";

export function isUnauthorized(error: unknown): boolean {
  return error instanceof SpringApiError && error.status === 401;
}

export function toErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return "Unexpected error";
}
