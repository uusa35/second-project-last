import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_FILE = /\.(.*)$/;

export async function middleware(req: NextRequest, res: NextResponse) {
  if (
    req.nextUrl.pathname.startsWith('/_next') ||
    req.nextUrl.pathname.includes('/api/') ||
    PUBLIC_FILE.test(req.nextUrl.pathname)
  ) {
    return;
  }

  // if (req.nextUrl.locale !== req.cookies.get('NEXT_LOCALE')?.value) {
  //   const locale = req.cookies.get('NEXT_LOCALE')?.value || 'en';
  //   return NextResponse.redirect(
  //     new URL(`/${locale}${req.nextUrl.pathname}${req.nextUrl.search}`, req.url)
  //   );
  // }
  // if (
  //   req.url.includes('ar') &&
  //   req.cookies.get('NEXT_LOCALE')?.value === 'en'
  // ) {
  //   return NextResponse.redirect(
  //     new URL(`/en/${req.nextUrl.pathname}${req.nextUrl.search}`, req.url)
  //   );
  // } else if (
  //   !req.url.includes('ar') &&
  //   req.cookies.get('NEXT_LOCALE')?.value === 'ar'
  // ) {
  //   return NextResponse.redirect(
  //     new URL(`/ar/${req.nextUrl.pathname}${req.nextUrl.search}`, req.url)
  //   );
  // }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [],
};
