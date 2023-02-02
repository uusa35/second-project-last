import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest, res: NextResponse) {
  const isLocal = process.env.NODE_ENV !== 'production';
  const host = req.headers.get('Host');
  req.headers.set('url', host);
  const { cookies } = req;
  const token: string | null | undefined = cookies.has('access_token')
    ? cookies.get('access_token')?.value
    : null;
  const defaultCountry = {
    id: isLocal ? '1' : '2',
    name: isLocal ? `egypt` : 'kuwait',
    name_ar: isLocal ? `مصر` : 'الكويت',
    name_en: isLocal ? `egypt` : 'kuwait',
    code: isLocal ? `+20` : `+965`,
    currency: isLocal ? `EGY` : `KWT`,
  };
  const countryText: any | null = cookies.has('country')
    ? cookies.get('country')?.value
    : JSON.stringify(defaultCountry);
  const country: any = JSON.parse(countryText);
  let user: any = {};
  if (token && token !== null && country !== null && country?.id) {
    user = await fetch(`https://form.testbedbynd.com/api/customer`, {
      method: 'GET',
      headers: {
        country: country.id,
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers':
          'X-Requested-With,Accept,Authentication,Content-Type',
        'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
      },
    })
      .then((r: any) => r.json())
      .catch((e) => e);
  }
  const withQuery =
    country !== null
      ? `?country_id=${country.id}&country_name=${country.name}&country_name_ar=${country.name_ar}&country_currency=${country.currency}`
      : ``;

  // console.log('token ====>', token);
  if (
    req.nextUrl.pathname.includes('/order/history')
    // req.nextUrl.pathname.includes('/login/verification/mobile') ||
    // req.nextUrl.pathname.includes('/login/verification/otp')
  ) {
    try {
      if (token !== null && user && user?.data?.user?.id) {
        // if authenticated
        return NextResponse.next();
      } else {
        return NextResponse.redirect(new URL(`/${withQuery}`, req.url));
      }
    } catch (e) {
      return NextResponse.redirect(new URL(`/${withQuery}`, req.url));
    }
  }
  if (
    req.nextUrl.pathname.includes('/login') ||
    req.nextUrl.pathname.includes('/guest') ||
    req.nextUrl.pathname.includes('/register')
  ) {
    try {
      if (token !== null && user && user?.data?.user?.id) {
        // if authenticated
        return NextResponse.redirect(new URL(`/${withQuery}`, req.url));
      } else {
        return NextResponse.next();
      }
    } catch (e) {
      return NextResponse.redirect(new URL(`/${withQuery}`, req.url));
    }
  }
  if (req.nextUrl.pathname.includes('/account')) {
    try {
      if (token !== null && user && user?.data?.user?.id) {
        // if authenticated
        return NextResponse.next();
      } else {
        return NextResponse.redirect(new URL('/login', req.url));
      }
    } catch (e) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }
  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    '/account/:path*',
    '/login',
    // '/login/verification/mobile',
    // '/login/verification/otp',
    '/order/history',
    '/guest',
    '/register',
  ],
};
