import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  // Kök route "/" → token durumuna göre yönlendir
  if (pathname === "/") {
    if (token) {
      return NextResponse.redirect(new URL("/home", request.url));
    } else {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }
  }

  // Auth sayfası → eğer token varsa direkt home'a
  if (pathname.startsWith("/auth") && token) {
    return NextResponse.redirect(new URL("/home", request.url));
  }

  // Dashboard (ör. /home, /dashboard, /profile vs.) → token yoksa auth'a
  if (pathname.startsWith("/home") && !token) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"], 
  // tüm rotalarda çalışır, static dosyaları hariç tutuyoruz
};
