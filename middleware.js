export default function middleware(request) {
  const url = new URL(request.url);

  // 1. السماح بصفحة الكابتشا وطلبات API والملفات ذات الامتدادات (.css, .js, .ico, إلخ)
  if (
    url.pathname === '/captcha.html' || 
    url.pathname.startsWith('/api/') ||
    url.pathname.includes('.')
  ) {
    return;
  }

  // 2. قراءة كوكي التحقق
  const cookieHeader = request.headers.get('cookie') || '';
  const isVerified = cookieHeader.includes('cf_clearance=verified');

  // 3. إذا لم يكتمل التحقق، توجيه الزائر إلى /captcha.html
  if (!isVerified) {
    const captchaUrl = new URL('/captcha.html', request.url);
    return Response.redirect(captchaUrl.toString(), 307);
  }
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
