"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function LogoutButton() {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  async function handleLogout() {
    setIsPending(true);

    try {
      await fetch("/api/auth/logout", {
        method: "POST"
      });
    } finally {
      router.replace("/login");
      router.refresh();
    }
  }

  return (
    <button
      className="button button-secondary"
      disabled={isPending}
      onClick={handleLogout}
      type="button"
    >
      {isPending ? "A terminar sessão..." : "Logout"}
    </button>
  );
}
