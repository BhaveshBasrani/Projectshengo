import { NextRequest } from 'next/server';

export const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@projectshe.org';
export const ADMIN_SECRET = process.env.ADMIN_SECRET_KEY || 'she_admin_secret_2026_goated';

/**
 * Validates whether the incoming server-side API request is authorized as the designated Single Administrator.
 * Checks against the explicit ADMIN_SECRET or admin authorization header / email.
 */
export function isAuthorizedAdmin(req: NextRequest | Request): boolean {
  const adminSecretHeader = req.headers.get('x-admin-secret');
  const authHeader = req.headers.get('authorization');

  // Check direct secret header
  if (adminSecretHeader && adminSecretHeader === ADMIN_SECRET) {
    return true;
  }

  // Check Bearer secret
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    if (token === ADMIN_SECRET) {
      return true;
    }
  }

  return false;
}
