import Link from "next/link";
import { redirect } from "next/navigation";
import { AppHeader } from "@/components/AppHeader";
import { getUser } from "@/lib/api/spring-api";
import { isUnauthorized, toErrorMessage } from "@/lib/api/errors";
import { requireAccessToken } from "@/lib/auth/session";

type UserDetailsPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export const dynamic = "force-dynamic";

export default async function UserDetailsPage({ params }: UserDetailsPageProps) {
  const [{ id }, token] = await Promise.all([params, requireAccessToken()]);

  try {
    const user = await getUser(token, id);

    return (
      <main className="page-shell">
        <AppHeader />

        <section className="panel stack">
          <div>
            <p className="eyebrow">Detalhe de utilizador</p>
            <h1>{user.name}</h1>
            <p className="muted">{user.email}</p>
          </div>

          <dl className="details-grid">
            <div>
              <dt>ID</dt>
              <dd>{user.id}</dd>
            </div>
            <div>
              <dt>Email</dt>
              <dd>{user.email}</dd>
            </div>
            <div>
              <dt>Role</dt>
              <dd>{user.roles?.join(", ") ?? user.role ?? "—"}</dd>
            </div>
          </dl>

          <Link className="button button-secondary inline-button" href="/users">
            Voltar à lista
          </Link>
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
          <h1>Não foi possível carregar o utilizador</h1>
          <p className="muted">{toErrorMessage(error)}</p>
          <Link className="button button-secondary inline-button" href="/users">
            Voltar à lista
          </Link>
        </section>
      </main>
    );
  }
}
