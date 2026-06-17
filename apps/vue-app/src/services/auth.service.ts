import { api } from "./api";
import type { AuthUser, LoginRequest, LoginResponse } from "../types/domain";

export async function loginRequest(
  credentials: LoginRequest,
): Promise<LoginResponse> {
  const response = await api.post<LoginResponse>("/auth/login", credentials);
  return response.data;
}

export async function getCurrentUser(): Promise<AuthUser> {
  const response = await api.get<AuthUser>("/auth/me");
  return response.data;
}
