import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const ADMIN_PUBLIC = ['/admin/login', '/admin/otp', '/admin/setup-otp'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith('/admin')) {
    return NextResponse.next();
  }

  if (ADMIN_PUBLIC.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  const session = request.cookies.get('comam_session')?.value;
  if (!session) {
    const login = new URL('/admin/login', request.url);
    login.searchParams.set('next', pathname);
    return NextResponse.redirect(login);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
