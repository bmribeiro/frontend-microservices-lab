import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getMe, SpringApiError } from "@/lib/api/spring-api";
import { ACCESS_TOKEN_COOKIE } from "@/lib/config";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;

  if (!token) {
    return NextResponse.json({ message: "Unauthenticated." }, { status: 401 });
  }

  try {
    const user = await getMe(token);
    return NextResponse.json(user);
  } catch (error) {
    if (error instanceof SpringApiError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }

    return NextResponse.json(
      { message: "Unable to contact the user session service." },
      { status: 502 }
    );
  }
}
