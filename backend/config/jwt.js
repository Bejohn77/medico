export function getJwtSecret() {
  const secret = String(process.env.JWT_SECRET || '').trim();
  const adminPassword = String(process.env.ADMIN_PASSWORD || '');

  if (Buffer.byteLength(secret, 'utf8') < 32 || secret === adminPassword) {
    throw Object.assign(new Error('JWT_SECRET is missing or invalid.'), { code: 'JWT_CONFIG' });
  }

  return secret;
}