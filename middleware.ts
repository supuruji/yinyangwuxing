import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const locales = ['ko', 'en', 'zh', 'ja'];
const defaultLocale = 'en';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasLocale = locales.some(
    (l) => pathname.startsWith(`/${l}/`) || pathname === `/${l}`
  );
  if (!hasLocale && pathname === '/') {
    return NextResponse.redirect(new URL(`/${defaultLocale}`, request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next|favicon.ico|.*\\..*).*)'],
};
