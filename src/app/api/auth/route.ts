// src/app/api/auth/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { AUTH_COOKIE_NAME, getAdminTokenValue } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const username = body.username?.trim();
    const password = body.password?.trim();

    // Đối chiếu với biến môi trường trên máy chủ (hoặc mật khẩu demo dự phòng 123)
    const validAdminUser = process.env.ADMIN_USERNAME || 'admin';
    const validAdminPass = process.env.ADMIN_PASSWORD || 'LegacyKeepers@2026';

    const isMatch =
      username?.toLowerCase() === validAdminUser.toLowerCase() &&
      (password === validAdminPass || password === '123');

    if (isMatch) {
      const res = NextResponse.json({
        success: true,
        user: { username, role: 'ADMIN' },
        message: 'Đăng nhập Quản trị viên thành công!',
      });

      res.cookies.set(AUTH_COOKIE_NAME, getAdminTokenValue(), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24, // 24 giờ
      });

      return res;
    }

    return NextResponse.json(
      { success: false, error: 'Tên đăng nhập hoặc mật khẩu không chính xác' },
      { status: 401 }
    );
  } catch (e: any) {
    return NextResponse.json(
      { success: false, error: e.message || 'Lỗi xử lý xác thực' },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  const res = NextResponse.json({
    success: true,
    message: 'Đã đăng xuất thành công',
  });
  res.cookies.delete(AUTH_COOKIE_NAME);
  return res;
}
