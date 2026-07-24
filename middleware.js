export default function middleware(request) {
  const url = new URL(request.url);

  // 1. السماح المباشر لصفحة الكابتشا والـ API والملفات الأساسية
  if (
    url.pathname === '/captcha.html' || 
    url.pathname.startsWith('/api/') ||
    url.pathname.endsWith('.ico') ||
    url.pathname.endsWith('.css') ||
    url.pathname.endsWith('.js')
  ) {
    return;
  }

  // 2. التحقق من وجود الكوكي
  const cookieHeader = request.headers.get('cookie') || '';
  const isVerified = cookieHeader.includes('cf_clearance=verified');

  // 3. إذا كان المقتحم غير موثق ولم يكن بالأسصل في صفحة الكابتشا، حوّله إليها
  if (!isVerified) {
    url.pathname = '/captcha.html';
    return Response.redirect(url, 307);
  }
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
