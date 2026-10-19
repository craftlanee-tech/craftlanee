// Uses only Web Crypto so it runs in both proxy.ts and server actions.

export const ADMIN_COOKIE = 'craftlanee_admin';
export const SESSION_TTL_SECONDS = 60 * 60 * 12;

const encoder = new TextEncoder();

function getSecret() {
  return process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || '';
}

export function isAdminConfigured() {
  return Boolean(process.env.ADMIN_PASSWORD);
}

async function hmac(secret: string, value: string) {
  const key = await crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(value));
  return Array.from(new Uint8Array(signature), (byte) => byte.toString(16).padStart(2, '0')).join('');
}

function safeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export async function checkPassword(candidate: string) {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return false;
  // Compare digests so the comparison time doesn't depend on the password length.
  const [expected, actual] = await Promise.all([hmac('craftlanee-admin', password), hmac('craftlanee-admin', candidate)]);
  return safeEqual(expected, actual);
}

export async function createSessionToken() {
  const expiresAt = Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS;
  const payload = `admin.${expiresAt}`;
  return `${payload}.${await hmac(getSecret(), payload)}`;
}

export async function verifySessionToken(token: string | undefined) {
  const secret = getSecret();
  if (!token || !secret) return false;

  const parts = token.split('.');
  if (parts.length !== 3 || parts[0] !== 'admin') return false;

  const expiresAt = Number(parts[1]);
  if (!Number.isFinite(expiresAt) || expiresAt < Date.now() / 1000) return false;

  return safeEqual(parts[2], await hmac(secret, `${parts[0]}.${parts[1]}`));
}
