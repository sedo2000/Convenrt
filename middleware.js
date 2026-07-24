import { NextResponse } from 'next/server'; // أو استخدام Web Standard Response

export function middleware(request) {
  const url = request.nextUrl.clone();
  const token = request.cookies.get('cf_clearance');

  // الاستثناءات: السماح بصفحة الكابتشا وطلب التحقق
  if (url.pathname === '/captcha.html' || url.pathname === '/api/verify') {
    return NextResponse.next();
  }

  // إذا لم يكن لديه الكوكي المناسب، حوّله فوراً لصفحة الكابتشا
  if (!token || token.value !== 'verified') {
    url.pathname = '/captcha.html';
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  // تطبيق Middleware على كل الصفحات باستثناء أصول الصور والـ Assets الفتية
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
