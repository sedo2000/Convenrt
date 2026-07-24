export default function middleware(request) {
  const url = new URL(request.url);

  // السماح بصفحة الكابتشا وطلب التحقق بـ API دون حظر
  if (url.pathname === '/captcha.html' || url.pathname === '/api/verify') {
    return;
  }

  // قراءة الكوكي التأكيدي
  const cookieHeader = request.headers.get('cookie') || '';
  const isVerified = cookieHeader.includes('cf_clearance=verified');

  // إذا لم يمر من الكابتشا، حوّله لصفحة التحقق فوراً
  if (!isVerified) {
    url.pathname = '/captcha.html';
    return Response.redirect(url.toString(), 307);
  }
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
