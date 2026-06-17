import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getUser, SpringApiError } from "@/lib/api/spring-api";
import { ACCESS_TOKEN_COOKIE } from "@/lib/config";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const [{ id }, cookieStore] = await Promise.all([context.params, cookies()]);
  const token = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;

  if (!token) {
    return NextResponse.json({ message: "Unauthenticated." }, { status: 401 });
  }

  try {
    const user = await getUser(token, id);
    return NextResponse.json(user);
  } catch (error) {
    if (error instanceof SpringApiError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }

    return NextResponse.json(
      { message: "Unable to contact the user details service." },
      { status: 502 }
    );
  }
}
