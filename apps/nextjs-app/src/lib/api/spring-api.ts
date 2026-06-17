import { SPRING_API_BASE_URL } from "@/lib/config";
import type {
  ApiProblem,
  AuthenticatedUser,
  LoginRequest,
  LoginResponse,
  User
} from "@/lib/api/types";

export class SpringApiError extends Error {
  readonly status: number;
  readonly payload: unknown;

  constructor(status: number, message: string, payload?: unknown) {
    super(message);
    this.name = "SpringApiError";
    this.status = status;
    this.payload = payload;
  }
}

type SpringApiFetchOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  token?: string;
  body?: unknown;
  headers?: HeadersInit;
  cache?: RequestCache;
  next?: NextFetchRequestConfig;
};

function buildUrl(path: string): string {
  if (!path.startsWith("/")) {
    throw new Error(`API path must start with /. Received: ${path}`);
  }

  return `${SPRING_API_BASE_URL}${path}`;
}

function getProblemMessage(status: number, payload: unknown): string {
  if (payload && typeof payload === "object") {
    const problem = payload as ApiProblem;

    if (problem.message) return problem.message;
    if (problem.error) return problem.error;
  }

  return `Spring API request failed with status ${status}`;
}

export async function springApiFetch<T>(
  path: string,
  options: SpringApiFetchOptions = {}
): Promise<T> {
  const headers = new Headers(options.headers);
  headers.set("Accept", "application/json");

  if (options.body !== undefined && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (options.token) {
    headers.set("Authorization", `Bearer ${options.token}`);
  }

  const response = await fetch(buildUrl(path), {
    method: options.method ?? "GET",
    headers,
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
    cache: options.cache ?? "no-store",
    next: options.next
  });

  const contentType = response.headers.get("content-type") ?? "";
  const payload = contentType.includes("application/json")
    ? await response.json().catch(() => null)
    : await response.text().catch(() => null);

  if (!response.ok) {
    throw new SpringApiError(
      response.status,
      getProblemMessage(response.status, payload),
      payload
    );
  }

  return payload as T;
}

export function login(credentials: LoginRequest): Promise<LoginResponse> {
  return springApiFetch<LoginResponse>("/api/auth/login", {
    method: "POST",
    body: credentials
  });
}

export function getMe(token: string): Promise<AuthenticatedUser> {
  return springApiFetch<AuthenticatedUser>("/api/auth/me", {
    token
  });
}

export function getUsers(token: string): Promise<User[]> {
  return springApiFetch<User[]>("/api/users", {
    token
  });
}

export function getUser(token: string, id: string): Promise<User> {
  return springApiFetch<User>(`/api/users/${encodeURIComponent(id)}`, {
    token
  });
}
