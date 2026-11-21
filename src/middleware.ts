import { NextResponse, type NextRequest } from "next/server";

/**
 * A cookie-presence gate only. The real check happens in the admin layout,
 * which verifies the token with Supabase and reads the staff profile. This
 * prevents unauthenticated visitors from ever reaching admin server actions.
 */
const ACCESS_COOKIE = "bbvf_admin_access";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname === "/admin/login") return NextResponse.next();

  const token = request.cookies.get(ACCESS_COOKIE)?.value;
  if (!token) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    url.search = `?next=${encodeURIComponent(pathname)}`;
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
