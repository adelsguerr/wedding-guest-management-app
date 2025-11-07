import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Rutas públicas que no requieren autenticación
  const publicPaths = ["/login", "/api/auth", "/rsvp"];
  
  // Verificar si la ruta es pública
  const isPublicPath = publicPaths.some(path => pathname.startsWith(path));
  
  if (isPublicPath) {
    return NextResponse.next();
  }
  
  // Verificar si hay sesión
  const session = request.cookies.get("better-auth.session_token");
  
  if (!session) {
    // Redirigir al login si no hay sesión
    return NextResponse.redirect(new URL("/login", request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - api/auth (auth endpoints)
     * - api/rsvp (public RSVP endpoints)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\..*|api/auth|api/rsvp).*)",
  ],
};
