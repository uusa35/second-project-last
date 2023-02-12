import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest, res: NextResponse) {
  // if (req.nextUrl.locale === 'default') {
  const locale = req.cookies.get('NEXT_LOCALE')?.value || 'en';
  //
  return NextResponse.redirect(
    new URL(`/${locale}${req.nextUrl.pathname}${req.nextUrl.search}`, req.url)
  );
  // }
  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [],
};
