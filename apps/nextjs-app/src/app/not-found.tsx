import Link from "next/link";

export default function NotFound() {
  return (
    <main className="page-shell narrow-shell">
      <section className="panel">
        <p className="eyebrow">404</p>
        <h1>Página não encontrada</h1>
        <p className="muted">A rota pedida não existe nesta aplicação do laboratório.</p>
        <Link className="button" href="/users">
          Voltar aos utilizadores
        </Link>
      </section>
    </main>
  );
}
