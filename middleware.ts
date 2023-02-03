import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest, res: NextResponse) {
  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [],
};
