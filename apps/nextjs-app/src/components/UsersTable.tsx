import Link from "next/link";
import type { User } from "@/lib/api/types";

function renderRoles(user: User): string {
  if (user.roles?.length) return user.roles.join(", ");
  if (user.role) return user.role;
  return "—";
}

export function UsersTable({ users }: { users: User[] }) {
  if (users.length === 0) {
    return (
      <section className="empty-state">
        <h2>Sem utilizadores</h2>
        <p>A API respondeu com uma lista vazia.</p>
      </section>
    );
  }

  return (
    <div className="table-card">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Email</th>
            <th>Roles</th>
            <th aria-label="Ações" />
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{renderRoles(user)}</td>
              <td className="align-right">
                <Link className="table-link" href={`/users/${user.id}`}>
                  Ver detalhe
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
