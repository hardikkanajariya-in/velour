export { auth as middleware } from '@/lib/auth';

export const config = {
  matcher: [
    '/account/:path*',
    '/checkout/:path*',
    '/admin/:path*',
    '/api/orders/:path*',
    '/api/user/:path*',
    '/api/cart/:path*',
    '/api/wishlist/:path*',
    '/api/admin/:path*',
  ],
};
