<script setup lang="ts">
import { useRouter } from "vue-router";
import { useAuthStore } from "./stores/auth.store";

const router = useRouter();
const authStore = useAuthStore();

function logout(): void {
  authStore.logout();
  void router.push("/login");
}
</script>

<template>
  <div class="app-shell">
    <header class="app-header">
      <div>
        <p class="eyebrow">frontend-microservices-lab</p>
        <h1>Vue App</h1>
      </div>

      <nav>
        <RouterLink to="/users">Users</RouterLink>

        <button
          v-if="authStore.isAuthenticated"
          type="button"
          @click="logout"
        >
          Logout
        </button>
      </nav>
    </header>

    <main class="app-main">
      <RouterView />
    </main>
  </div>
</template>
