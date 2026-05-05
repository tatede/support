import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const auth = request.cookies.get("support_auth")?.value;
  const isLoginPage = request.nextUrl.pathname === "/login";
  const isApi = request.nextUrl.pathname.startsWith("/api");

  if (!auth && !isLoginPage && !isApi) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
