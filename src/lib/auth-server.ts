import { cookies } from 'next/headers';
import { verifyToken, TokenPayload } from '@/lib/jwt';

/**
 * Extracts and verifies the authenticated admin session from the request.
 * Checks both the Authorization: Bearer <token> header and the auth_token cookie.
 */
export async function getAuthenticatedAdmin(req: Request): Promise<TokenPayload | null> {
  try {
    let token: string | undefined;

    // 1. Authorization header (Bearer token)
    const authHeader = req.headers.get('authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7).trim();
    }

    // 2. HTTP Cookie fallback
    if (!token) {
      const cookieStore = await cookies();
      token = cookieStore.get('auth_token')?.value;
    }

    if (!token) {
      return null;
    }

    const decoded = verifyToken<TokenPayload>(token);
    if (!decoded || !decoded.name) {
      return null;
    }

    return decoded;
  } catch {
    return null;
  }
}
