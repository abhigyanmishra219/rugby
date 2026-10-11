import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'rugby_uttarakhand_jwt_secret_key_2026_secure_token';

export interface TokenPayload {
  id?: string;
  name: string;
  email: string;
  role?: string;
  [key: string]: any;
}

/**
 * Creates a signed JWT token for user authentication
 * @param payload - Data to encode inside the token (e.g., id, name, email)
 * @param expiresIn - Token expiration time (defaults to '7d')
 */
export function createToken(payload: TokenPayload, expiresIn: string | number = '7d'): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn } as jwt.SignOptions);
}

/**
 * Verifies a JWT token and returns the decoded payload, or null if invalid or expired
 * @param token - The JWT string to verify
 */
export function verifyToken<T = TokenPayload>(token: string): T | null {
  try {
    return jwt.verify(token, JWT_SECRET) as T;
  } catch {
    return null;
  }
}
