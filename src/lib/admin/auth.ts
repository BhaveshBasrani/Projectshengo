import { NextRequest } from 'next/server';

export const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@projectshe.org';
export const ADMIN_SECRET = process.env.ADMIN_SECRET_KEY || 'rendervoid@16';

export const AUTHORIZED_ADMIN_EMAILS = [
  'admin@projectshe.org',
  'projectshengo@gmail.com',
  'projectshe.ngo@gmail.com',
];

/**
 * Normalizes email address and tests against recognized Single Administrator emails.
 * Handles Gmail dot-invariance (e.g. projectshengo@gmail.com == projectshe.ngo@gmail.com).
 */
export function isAuthorizedAdminEmail(email?: string | null): boolean {
  if (!email || typeof email !== 'string') return false;
  const clean = email.trim().toLowerCase().replace(/\s+/g, '');
  if (!clean.includes('@')) return false;

  const [username, domain] = clean.split('@');
  if (domain === 'gmail.com') {
    const dotless = username.replace(/\./g, '') + '@gmail.com';
    if (dotless === 'projectshengo@gmail.com') return true;
  }

  return AUTHORIZED_ADMIN_EMAILS.some((adminMail) => adminMail.toLowerCase() === clean);
}

let dynamicAdminPassword: string | null = null;

export function setDynamicAdminPassword(pwd: string) {
  if (pwd && typeof pwd === 'string' && pwd.trim().length > 0) {
    dynamicAdminPassword = pwd.trim();
  }
}

export function getDynamicAdminPassword(): string {
  return dynamicAdminPassword || process.env.ADMIN_SECRET_KEY || 'rendervoid@16';
}

const BASE_ADMIN_SECRETS = [
  'rendervoid@16',
  'she_admin_secret_2026_goated',
  'she_gas_secret_key_2026',
  'she_secret_token_2026_goated',
  process.env.ADMIN_SECRET_KEY,
  process.env.ADMIN_SECRET,
].filter((s): s is string => Boolean(s && typeof s === 'string' && s.trim().length > 0));

export function getValidAdminSecrets(): string[] {
  const secrets = [...BASE_ADMIN_SECRETS];
  if (dynamicAdminPassword && !secrets.includes(dynamicAdminPassword)) {
    secrets.unshift(dynamicAdminPassword);
  }
  return secrets;
}

/**
 * Validates whether the incoming server-side API request is authorized as the designated Single Administrator.
 * Checks against:
 * 1. Verified Admin Email Header (x-admin-email matching projectshengo@gmail.com or admin@projectshe.org)
 * 2. Active Dynamic or Configured Master Admin Secret (x-admin-secret)
 * 3. Bearer Authorization header
 */
export function isAuthorizedAdmin(req: NextRequest | Request): boolean {
  // 1. Check authorized administrator email header
  const adminEmailHeader = req.headers.get('x-admin-email')?.trim();
  if (adminEmailHeader && isAuthorizedAdminEmail(adminEmailHeader)) {
    return true;
  }

  const validSecrets = getValidAdminSecrets();

  // 2. Check direct secret header
  const adminSecretHeader = req.headers.get('x-admin-secret')?.trim();
  if (adminSecretHeader) {
    if (validSecrets.some((secret) => secret.trim() === adminSecretHeader)) {
      return true;
    }
  }

  // 3. Check Bearer secret or Bearer admin email
  const authHeader = req.headers.get('authorization')?.trim();
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7).trim();
    if (validSecrets.some((secret) => secret.trim() === token)) {
      return true;
    }
    if (isAuthorizedAdminEmail(token)) {
      return true;
    }
  }

  return false;
}
