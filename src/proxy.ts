import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const { auth } = NextAuth(authConfig);

const locales = ["en", "ru", "hy"];
const defaultLocale = "hy";

export default auth((req: NextRequest & { auth: any }) => {
  const { nextUrl } = req;
  const pathname = nextUrl.pathname;

  // Check if pathname has a locale
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (!pathnameHasLocale) {
    return NextResponse.redirect(
      new URL(`/${defaultLocale}${pathname}`, nextUrl)
    );
  }

  // Admin protection
  if (pathname.includes("/admin")) {
    const role = req.auth?.user?.role;
    if (role !== "ADMIN" && role !== "SUPERADMIN") {
      return NextResponse.redirect(new URL("/", nextUrl));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
