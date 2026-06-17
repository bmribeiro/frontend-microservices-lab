import { redirect } from "next/navigation";
import { AppHeader } from "@/components/AppHeader";
import { UsersTable } from "@/components/UsersTable";
import { getUsers } from "@/lib/api/spring-api";
import { isUnauthorized, toErrorMessage } from "@/lib/api/errors";
import { requireAccessToken } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export default async function UsersPage() {
  const token = await requireAccessToken();

  try {
    const users = await getUsers(token);

    return (
      <main className="page-shell">
        <AppHeader />

        <section className="panel stack">
          <div>
            <p className="eyebrow">Área protegida</p>
            <h1>Utilizadores</h1>
            <p className="muted">
              Dados carregados no servidor Next.js através da spring-api.
            </p>
          </div>

          <UsersTable users={users} />
        </section>
      </main>
    );
  } catch (error) {
    if (isUnauthorized(error)) {
      redirect("/login");
    }

    return (
      <main className="page-shell">
        <AppHeader />

        <section className="panel error-panel">
          <p className="eyebrow">Erro</p>
          <h1>Não foi possível carregar os utilizadores</h1>
          <p className="muted">{toErrorMessage(error)}</p>
        </section>
      </main>
    );
  }
}
