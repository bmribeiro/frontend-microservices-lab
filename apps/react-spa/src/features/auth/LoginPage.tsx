import { type FormEvent, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "./useAuth";

export function LoginPage() {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  const [email, setEmail] = useState("admin@lab.com");
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/users" replace />;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setError(null);
      setIsSubmitting(true);

      await login(email, password);

      navigate("/users");
    } catch {
      setError("Credenciais inválidas ou backend indisponível.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main style={{ maxWidth: 420, margin: "80px auto", fontFamily: "Arial" }}>
      <h1>Login</h1>

      <p>Usa as credenciais de laboratório:</p>

      <pre>
        admin@lab.com / admin123{"\n"}
        user@lab.com / user123
      </pre>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 12 }}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            style={{ display: "block", width: "100%", padding: 8 }}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>

        <div style={{ marginBottom: 12 }}>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            style={{ display: "block", width: "100%", padding: 8 }}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>

        {error && <p style={{ color: "crimson" }}>{error}</p>}

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "A entrar..." : "Entrar"}
        </button>
      </form>
    </main>
  );
}
