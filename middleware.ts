import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Protect /admin routes, but allow /admin/login
  if (path.startsWith("/admin")) {
    const sessionCookie = request.cookies.get("admin_session")?.value;
    const jwtSecret = process.env.JWT_SECRET || "fallback-secret-key-1234567890";
    
    let isValid = false;
    if (sessionCookie) {
      const payload = await verifyToken(sessionCookie, jwtSecret);
      if (payload && payload.username === "admin") {
        isValid = true;
      }
    }

    if (path === "/admin/login") {
      if (isValid) {
        return NextResponse.redirect(new URL("/admin", request.url));
      }
      return NextResponse.next();
    }

    if (!isValid) {
      // Redirect to login page
      const loginUrl = new URL("/admin/login", request.url);
      // Keep track of the original page to redirect back if needed
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
