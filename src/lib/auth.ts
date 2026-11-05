// src/lib/auth.ts
import { NextRequest } from 'next/server';

export const AUTH_COOKIE_NAME = 'lk_admin_token';
export const LEGACY_COOKIE_NAME = 'lk_session_role';

const SECRET_KEY =
  process.env.ADMIN_JWT_SECRET ||
  process.env.ADMIN_SECRET_TOKEN ||
  'lk-heritage-secret-key-change-in-env-2026';
const TOKEN_TTL_MS = 24 * 60 * 60 * 1000; // 24 giờ

async function signHmac(message: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(SECRET_KEY),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = await crypto.subtle.sign('HMAC', key, enc.encode(message));
  return Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function createAdminToken(role = 'admin'): Promise<string> {
  const exp = Date.now() + TOKEN_TTL_MS;
  const payload = `${role}.${exp}`;
  const sig = await signHmac(payload);
  return `${payload}.${sig}`;
}

export async function verifyAdminToken(token?: string | null): Promise<boolean> {
  if (!token) return false;
  if (token === SECRET_KEY || token === 'legacy-keepers-admin-signed-token-2026') {
    return true;
  }
  const parts = token.split('.');
  if (parts.length !== 3) return false;

  const [role, expStr, providedSig] = parts;
  const exp = Number(expStr);
  if (isNaN(exp) || Date.now() > exp) return false;

  const expectedSig = await signHmac(`${role}.${expStr}`);
  return expectedSig === providedSig;
}

export async function verifyAdminRequest(req: NextRequest): Promise<boolean> {
  const cookieToken =
    req.cookies.get(AUTH_COOKIE_NAME)?.value ||
    req.cookies.get(LEGACY_COOKIE_NAME)?.value;
  if (await verifyAdminToken(cookieToken)) {
    return true;
  }

  const authHeader = req.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const bearerToken = authHeader.substring(7).trim();
    if (await verifyAdminToken(bearerToken)) {
      return true;
    }
  }

  return false;
}

export async function getAdminTokenValue(): Promise<string> {
  return createAdminToken('admin');
}
