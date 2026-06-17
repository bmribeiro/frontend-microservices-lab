import { NextResponse } from "next/server";
import {
  ACCESS_TOKEN_COOKIE,
  SESSION_COOKIE_MAX_AGE_SECONDS
} from "@/lib/config";
import { login, SpringApiError } from "@/lib/api/spring-api";
import type { LoginRequest } from "@/lib/api/types";

function isLoginRequest(value: unknown): value is LoginRequest {
  if (!value || typeof value !== "object") return false;

  const candidate = value as Partial<LoginRequest>;
  return (
    typeof candidate.email === "string" &&
    candidate.email.trim().length > 0 &&
    typeof candidate.password === "string" &&
    candidate.password.length > 0
  );
}

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { message: "Request body must be valid JSON." },
      { status: 400 }
    );
  }

  if (!isLoginRequest(body)) {
    return NextResponse.json(
      { message: "Email and password are required." },
      { status: 400 }
    );
  }

  try {
    const data = await login({
      email: body.email.trim(),
      password: body.password
    });

    const response = NextResponse.json({ ok: true });

    response.cookies.set(ACCESS_TOKEN_COOKIE, data.accessToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: data.expiresIn ?? SESSION_COOKIE_MAX_AGE_SECONDS
    });

    return response;
  } catch (error) {
    if (error instanceof SpringApiError) {
      return NextResponse.json(
        { message: error.status === 401 ? "Invalid credentials." : error.message },
        { status: error.status }
      );
    }

    return NextResponse.json(
      { message: "Unable to contact the authentication service." },
      { status: 502 }
    );
  }
}
