import { NextResponse } from 'next/server';
import { auth } from './app/auth';

export default auth(() => {
  return NextResponse.next();
});

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
