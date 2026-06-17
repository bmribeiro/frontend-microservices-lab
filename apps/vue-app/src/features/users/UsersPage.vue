<script setup lang="ts">
import { onMounted, ref } from "vue";
import { getUsers } from "../../services/users.service";
import type { User } from "../../types/domain";

const users = ref<User[]>([]);
const loading = ref(true);
const errorMessage = ref("");

async function loadUsers(): Promise<void> {
  loading.value = true;
  errorMessage.value = "";

  try {
    users.value = await getUsers();
  } catch {
    errorMessage.value = "Erro ao carregar utilizadores.";
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  void loadUsers();
});
</script>

<template>
  <section class="page">
    <div class="page-header">
      <p class="eyebrow">Rota protegida</p>
      <h2>Users</h2>
      <p>
        Esta página chama o endpoint /users da spring-api através do cliente
        Axios configurado com interceptor de autenticação.
      </p>
    </div>

    <p v-if="loading">A carregar utilizadores...</p>

    <p v-else-if="errorMessage" class="error">
      {{ errorMessage }}
    </p>

    <div v-else class="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Nome</th>
            <th>Email</th>
            <th>Role</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="user in users" :key="user.id">
            <td>{{ user.id }}</td>
            <td>{{ user.username }}</td>
            <td>{{ user.name ?? "-" }}</td>
            <td>{{ user.email ?? "-" }}</td>
            <td>{{ user.role ?? "-" }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>
