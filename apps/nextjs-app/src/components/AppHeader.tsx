import Link from "next/link";
import { getMe } from "@/lib/api/spring-api";
import { getAccessToken } from "@/lib/auth/session";
import { LogoutButton } from "@/components/LogoutButton";

export async function AppHeader() {
  const token = await getAccessToken();
  const user = token ? await getMe(token).catch(() => null) : null;

  return (
    <header className="app-header">
      <div>
        <Link className="brand" href="/users">
          frontend-microservices-lab
        </Link>
        <p className="caption">Next.js App Router + BFF</p>
      </div>

      <div className="header-actions">
        {user ? (
          <span className="user-chip">{user.name}</span>
        ) : (
          <span className="user-chip">Sessão não validada</span>
        )}
        <LogoutButton />
      </div>
    </header>
  );
}
