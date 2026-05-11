import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

const AUTH_ROUTES = ["/login", "/signup"];
const PROTECTED_PREFIX = "/dashboard";

export async function middleware(request: NextRequest) {
  /* updateSession refreshes the session cookie and returns a response.
     We read the user from a second call to decide on redirects. */
  const response = await updateSession(request);
  const pathname = request.nextUrl.pathname;

  /* We need the user to gate auth-page access — re-use the refreshed cookie
     that updateSession already set on the response. */
  const { createServerClient } = await import("@supabase/ssr");
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll() {
          /* read-only here — updateSession already handled writes */
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  /* Authenticated users should not see /login or /signup */
  if (user && AUTH_ROUTES.includes(pathname)) {
    return NextResponse.redirect(new URL(PROTECTED_PREFIX, request.url));
  }

  /* Unauthenticated users cannot access /dashboard (handled by updateSession,
     but kept here for clarity and to cover sub-paths). */
  if (!user && pathname.startsWith(PROTECTED_PREFIX)) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
