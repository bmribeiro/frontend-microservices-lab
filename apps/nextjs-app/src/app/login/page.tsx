import { redirect } from "next/navigation";
import { LoginForm } from "@/components/LoginForm";
import { getAccessToken } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  const token = await getAccessToken();

  if (token) {
    redirect("/users");
  }

  return (
    <main className="page-shell login-shell">
      <section className="hero-panel">
        <p className="eyebrow">nextjs-app</p>
        <h1>Autenticação com BFF</h1>
        <p className="muted">
          O browser autentica-se contra a própria aplicação Next.js. A route
          handler chama a spring-api e guarda o JWT numa cookie httpOnly.
        </p>
      </section>

      <section className="panel">
        <h2>Login</h2>
        <p className="muted small">
          Credenciais de teste: admin@lab.com / admin123 ou user@lab.com / user123.
        </p>
        <LoginForm />
      </section>
    </main>
  );
}
