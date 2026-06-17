import { computed, ref } from "vue";
import { defineStore } from "pinia";
import { getCurrentUser, loginRequest } from "../services/auth.service";
import type { AuthUser, LoginRequest } from "../types/domain";

const TOKEN_STORAGE_KEY = "access_token";

export const useAuthStore = defineStore("auth", () => {
  const token = ref<string | null>(localStorage.getItem(TOKEN_STORAGE_KEY));
  const user = ref<AuthUser | null>(null);

  const isAuthenticated = computed(() => Boolean(token.value));

  function setToken(nextToken: string | null): void {
    token.value = nextToken;

    if (nextToken) {
      localStorage.setItem(TOKEN_STORAGE_KEY, nextToken);
      return;
    }

    localStorage.removeItem(TOKEN_STORAGE_KEY);
  }

  async function login(credentials: LoginRequest): Promise<void> {
    const response = await loginRequest(credentials);
    const receivedToken = response.token ?? response.accessToken;

    if (!receivedToken) {
      throw new Error("A resposta de login não contém token.");
    }

    setToken(receivedToken);
    await refreshMe();
  }

  async function refreshMe(): Promise<void> {
    if (!token.value) {
      user.value = null;
      return;
    }

    try {
      user.value = await getCurrentUser();
    } catch {
      logout();
    }
  }

  function logout(): void {
    setToken(null);
    user.value = null;
  }

  return {
    token,
    user,
    isAuthenticated,
    login,
    refreshMe,
    logout,
  };
});
