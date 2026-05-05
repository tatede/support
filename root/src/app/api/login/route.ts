import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { password } = await req.json();
  if (password !== process.env.SUPPORT_PASSWORD) {
    return NextResponse.json({ message: "Invalid" }, { status: 401 });
  }
  const response = NextResponse.json({ ok: true });
  response.cookies.set("support_auth", "true", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });
  return response;
}
