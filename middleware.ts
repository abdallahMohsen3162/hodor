import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value
  const isLoginPage = request.nextUrl.pathname === "/login"
  const isDashboardPage = request.nextUrl.pathname.startsWith("/dashboard")

  if (!token && isDashboardPage) {
    console.log("No token found, redirecting to login")
    return NextResponse.redirect(new URL("/login", request.url))
  }

  if (token && isLoginPage) {
    console.log("Token found on login page, redirecting to dashboard")
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/login", "/dashboard/:path*"],
}

