// src/middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminRequest } from '@/lib/auth';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 1. Bảo vệ toàn bộ trang quản trị /admin/*
  if (pathname.startsWith('/admin')) {
    const isAdmin = await verifyAdminRequest(req);
    if (!isAdmin) {
      const loginUrl = new URL('/', req.url);
      loginUrl.searchParams.set('authRequired', 'admin');
      return NextResponse.redirect(loginUrl);
    }
  }

  // 2. Bảo vệ các thao tác ghi/xóa trên /api/locations
  if (pathname.startsWith('/api/locations') && req.method !== 'GET') {
    const isAdmin = await verifyAdminRequest(req);
    if (!isAdmin) {
      return NextResponse.json(
        { success: false, error: 'Forbidden: Bạn không có quyền thực hiện thao tác này' },
        { status: 403 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/locations/:path*'],
};
