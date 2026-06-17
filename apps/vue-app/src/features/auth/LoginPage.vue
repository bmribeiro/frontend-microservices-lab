<script setup lang="ts">
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "../../stores/auth.store";

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const username = ref("");
const password = ref("");
const loading = ref(false);
const errorMessage = ref("");

async function onSubmit(): Promise<void> {
  loading.value = true;
  errorMessage.value = "";

  try {
    await authStore.login({
      username: username.value,
      password: password.value,
    });

    const redirect =
      typeof route.query.redirect === "string" ? route.query.redirect : "/users";

    await router.push(redirect);
  } catch {
    errorMessage.value = "Credenciais inválidas ou erro ao autenticar.";
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <section class="page">
    <div class="page-header">
      <p class="eyebrow">Autenticação</p>
      <h2>Login</h2>
      <p>
        Esta página autentica contra a spring-api e guarda o token no
        localStorage para fins didáticos.
      </p>
    </div>

    <form class="form" @submit.prevent="onSubmit">
      <label>
        Username
        <input v-model="username" type="text" autocomplete="username" />
      </label>

      <label>
        Password
        <input
          v-model="password"
          type="password"
          autocomplete="current-password"
        />
      </label>

      <p v-if="errorMessage" class="error">
        {{ errorMessage }}
      </p>

      <button type="submit" :disabled="loading">
        {{ loading ? "A autenticar..." : "Entrar" }}
      </button>
    </form>
  </section>
</template>
