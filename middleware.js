import { NextResponse } from 'next/server';

export function middleware(request) {
  const url = request.nextUrl.clone();

  // 1. استثناء طلبات الكابتشا والـ API والملفات الثابتة
  if (
    url.pathname === '/captcha.html' || 
    url.pathname.startsWith('/api/') ||
    url.pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // 2. فحص وجود كوكي التحقق
  const cookieHeader = request.headers.get('cookie') || '';
  const isVerified = cookieHeader.includes('cf_clearance=verified');

  // 3. إذا لم يكتمل التحقق، اعرض صفحة الكابتشا من داخل public
  if (!isVerified) {
    url.pathname = '/captcha.html';
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
