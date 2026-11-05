import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";

const LANGS = ["ur", "en", "ar"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Admin area: must have a valid session (each page/action re-checks roles on the server too).
  if (pathname.startsWith("/admin")) {
    if (pathname === "/admin/login" || pathname.startsWith("/admin/auth/")) return NextResponse.next();
    const token = req.cookies.get("nui_session")?.value;
    const secret = process.env.SESSION_SECRET;
    if (token && secret) {
      try {
        await jwtVerify(token, new TextEncoder().encode(secret));
        return NextResponse.next();
      } catch {}
    }
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }

  // Public site: every page lives under /ur, /en or /ar.
  const first = pathname.split("/")[1];
  if (LANGS.includes(first)) return NextResponse.next();
  const pref = req.cookies.get("lang")?.value;
  const lang = pref && LANGS.includes(pref) ? pref : "ur";
  return NextResponse.redirect(new URL(`/${lang}${pathname === "/" ? "" : pathname}`, req.url));
}

export const config = {
  matcher: ["/((?!_next|api|favicon.ico|icon.svg|sitemap.xml|robots.txt|.*\\..*).*)"],
};
