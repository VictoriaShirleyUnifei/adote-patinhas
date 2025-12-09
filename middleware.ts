import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  console.log("Middleware rodando em:", request.nextUrl.pathname)

  const token = request.cookies.get("session")?.value;
  const { pathname } = request.nextUrl;

  const publicRoutes = ["/login"];
  const isPublic = publicRoutes.some(route => pathname.startsWith(route));

  // Usuário DESLOGADO tentando acessar rota privada → 404 Not Found
  if (!isPublic && !token) {
  return NextResponse.redirect(new URL("/register", request.url));
}


  // Usuário LOGADO tentando acessar página pública → envia pro home
  if (isPublic && token) {
    return NextResponse.redirect(new URL("/home", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/:path*"],
};
