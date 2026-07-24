export default function middleware(request) {
  const url = new URL(request.url);

  // السماح بصفحة الكابتشا وطلب التحقق بـ API
  if (url.pathname === '/captcha.html' || url.pathname === '/api/verify') {
    return;
  }

  // قراءة الكوكي من الـ Headers مباشرة
  const cookieHeader = request.headers.get('cookie') || '';
  const isVerified = cookieHeader.includes('cf_clearance=verified');

  // إذا لم يكن متحققاً، إعادة التوجيه لصفحة الكابتشا
  if (!isVerified) {
    url.pathname = '/captcha.html';
    return Response.redirect(url.toString(), 307);
  }
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
