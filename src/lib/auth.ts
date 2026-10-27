// src/lib/auth.ts
import { NextRequest } from 'next/server';

const ADMIN_SECRET_TOKEN = process.env.ADMIN_SECRET_TOKEN || 'legacy-keepers-admin-signed-token-2026';
export const AUTH_COOKIE_NAME = 'lk_session_role';

export async function verifyAdminRequest(req: NextRequest): Promise<boolean> {
  // Cho phép xác thực qua Cookie HttpOnly hoặc qua Authorization Bearer Token
  const cookieToken = req.cookies.get(AUTH_COOKIE_NAME)?.value;
  if (cookieToken === ADMIN_SECRET_TOKEN) {
    return true;
  }

  const authHeader = req.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const bearerToken = authHeader.substring(7).trim();
    if (bearerToken === ADMIN_SECRET_TOKEN) {
      return true;
    }
  }

  return false;
}

export function getAdminTokenValue(): string {
  return ADMIN_SECRET_TOKEN;
}
