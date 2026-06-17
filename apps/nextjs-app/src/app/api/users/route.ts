import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getUsers, SpringApiError } from "@/lib/api/spring-api";
import { ACCESS_TOKEN_COOKIE } from "@/lib/config";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;

  if (!token) {
    return NextResponse.json({ message: "Unauthenticated." }, { status: 401 });
  }

  try {
    const users = await getUsers(token);
    return NextResponse.json(users);
  } catch (error) {
    if (error instanceof SpringApiError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }

    return NextResponse.json(
      { message: "Unable to contact the users service." },
      { status: 502 }
    );
  }
}
