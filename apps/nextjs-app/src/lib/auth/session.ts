import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ACCESS_TOKEN_COOKIE } from "@/lib/config";

export async function getAccessToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(ACCESS_TOKEN_COOKIE)?.value ?? null;
}

export async function requireAccessToken(): Promise<string> {
  const token = await getAccessToken();

  if (!token) {
    redirect("/login");
  }

  return token;
}
