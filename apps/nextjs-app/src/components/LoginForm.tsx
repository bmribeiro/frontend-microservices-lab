"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

type LoginFormState = {
  email: string;
  password: string;
};

export function LoginForm() {
  const router = useRouter();
  const [form, setForm] = useState<LoginFormState>({
    email: "admin@lab.com",
    password: "admin123"
  });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as {
          message?: string;
        } | null;

        setError(payload?.message ?? "Login failed.");
        return;
      }

      router.replace("/users");
      router.refresh();
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="form-card" onSubmit={handleSubmit}>
      <label>
        Email
        <input
          autoComplete="email"
          name="email"
          onChange={(event) =>
            setForm((current) => ({ ...current, email: event.target.value }))
          }
          type="email"
          value={form.email}
        />
      </label>

      <label>
        Password
        <input
          autoComplete="current-password"
          name="password"
          onChange={(event) =>
            setForm((current) => ({ ...current, password: event.target.value }))
          }
          type="password"
          value={form.password}
        />
      </label>

      {error ? <p className="error-message">{error}</p> : null}

      <button className="button" disabled={isSubmitting} type="submit">
        {isSubmitting ? "A autenticar..." : "Entrar"}
      </button>
    </form>
  );
}
