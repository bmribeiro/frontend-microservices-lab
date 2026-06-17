import { useEffect, useState } from "react";
import { useAuth } from "../auth/useAuth";
import { httpClient } from "../../shared/api/httpClient";

type User = {
  id: number;
  name: string;
  email: string;
  roles: string[];
};

export function UsersPage() {
  const { user, logout } = useAuth();

  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadUsers() {
      try {
        setError(null);
        setIsLoading(true);

        const response = await httpClient.get<User[]>("/api/users");

        setUsers(response.data);
      } catch {
        setError("Não foi possível carregar os utilizadores.");
      } finally {
        setIsLoading(false);
      }
    }

    void loadUsers();
  }, []);

  return (
    <main style={{ maxWidth: 800, margin: "40px auto", fontFamily: "Arial" }}>
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 24,
        }}
      >
        <div>
          <h1>Users</h1>
          <p>
            Sessão ativa: <strong>{user?.name}</strong> ({user?.email})
          </p>
        </div>

        <button type="button" onClick={logout}>
          Sair
        </button>
      </header>

      {isLoading && <p>A carregar utilizadores...</p>}

      {error && <p style={{ color: "crimson" }}>{error}</p>}

      {!isLoading && !error && (
        <table width="100%" cellPadding="8" border={1}>
          <thead>
            <tr>
              <th align="left">ID</th>
              <th align="left">Nome</th>
              <th align="left">Email</th>
              <th align="left">Roles</th>
            </tr>
          </thead>

          <tbody>
            {users.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.name}</td>
                <td>{item.email}</td>
                <td>{item.roles.join(", ")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}
